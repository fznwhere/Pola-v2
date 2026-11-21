// notif.js - Penjadwal Alarm Native Android untuk Pola. v2

const POLA_CHANNEL_ID = 'pola_jadwal_v2';
const POLA_SOUND_NAME = 'pola_notif'; // Nama file di assets/sounds/ tanpa ekstensi .mp3

function stringToInt32(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) || 1;
}

function getLocalNotificationsPlugin() {
  return window.Capacitor &&
    window.Capacitor.Plugins &&
    window.Capacitor.Plugins.LocalNotifications
    ? window.Capacitor.Plugins.LocalNotifications
    : null;
}

async function ensurePolaNotificationChannel(LocalNotifications) {
  try {
    // Hapus channel versi lama agar tidak menumpuk di pengaturan aplikasi HP
    await LocalNotifications.deleteChannel({ id: 'pola_jadwal_v1' }).catch(() => {});

    await LocalNotifications.createChannel({
      id: POLA_CHANNEL_ID,
      name: 'Pengingat Jadwal Pola',
      description: 'Notifikasi jadwal salat, kuliah, rutinitas, dan tugas',
      sound: POLA_SOUND_NAME,
      importance: 5,
      visibility: 1,
      vibration: true
    });
  } catch (e) {
    // Abaikan jika dijalankan di browser web biasa
  }
}

// Ambil jadwal salat per tanggal (dengan cache agar hemat kuota & jalan offline)
async function getSalatForDate(targetDateObj, dateStr) {
  const cacheKey = `nalaSalat_${dateStr}`;
  let cached = JSON.parse(localStorage.getItem(cacheKey));
  if (cached) return cached;

  const dd = String(targetDateObj.getDate()).padStart(2, '0');
  const mm = String(targetDateObj.getMonth() + 1).padStart(2, '0');
  const yyyy = targetDateObj.getFullYear();

  try {
    const res = await fetch(
      `https://api.aladhan.com/v1/timingsByCity/${dd}-${mm}-${yyyy}?city=Yogyakarta&country=Indonesia&method=11`
    );
    const t = (await res.json()).data.timings;
    cached = [
      { name: 'Subuh', time: t.Fajr.slice(0, 5) },
      { name: 'Zuhur', time: t.Dhuhr.slice(0, 5) },
      { name: 'Asar', time: t.Asr.slice(0, 5) },
      { name: 'Maghrib', time: t.Maghrib.slice(0, 5) },
      { name: 'Isya', time: t.Isha.slice(0, 5) }
    ];
    localStorage.setItem(cacheKey, JSON.stringify(cached));
    return cached;
  } catch (e) {
    return [
      { name: 'Subuh', time: '04:30' },
      { name: 'Zuhur', time: '11:45' },
      { name: 'Asar', time: '15:00' },
      { name: 'Maghrib', time: '17:45' },
      { name: 'Isya', time: '19:00' }
    ];
  }
}

async function getSchedulesForDate(targetDateObj) {
  const dateStr = `${targetDateObj.getFullYear()}-${String(targetDateObj.getMonth() + 1).padStart(2, '0')}-${String(targetDateObj.getDate()).padStart(2, '0')}`;
  const dayName = namaHari[targetDateObj.getDay()];
  let items = [];

  const savedMatkul = JSON.parse(localStorage.getItem('nalaMatkul')) || [];
  const overrides = JSON.parse(localStorage.getItem('nalaOverrides')) || [];
  const savedTasks = JSON.parse(localStorage.getItem('nalaTasks')) || [];
  const savedRoutines = JSON.parse(localStorage.getItem('nalaRoutines')) || [];
  const isHoliday = liburNasional[dateStr] || isUserHoliday(dateStr);

  // 1. Kuliah
  let matkuls = savedMatkul.filter((m) => m.hari === dayName);
  if (dayName === 'Minggu' || isHoliday) matkuls = [];
  matkuls = matkuls.filter(
    (m) => !overrides.some((o) => o.matkulId === m.id && o.originalDate === dateStr)
  );
  const movedIn = overrides
    .filter((o) => o.newDate === dateStr)
    .map((o) => {
      const orig = savedMatkul.find((m) => m.id === o.matkulId);
      return orig ? { ...orig, ...o, isOverride: true } : null;
    })
    .filter(Boolean);

  [...matkuls, ...movedIn].forEach((m) => {
    if (!isDismissed('kuliah', m.id, dateStr)) {
      const ruang = m.isOverride ? m.newRuangan : m.ruangan;
      items.push({
        uid: `kuliah_${m.id}`,
        name: m.name,
        category: 'Kuliah',
        time: m.isOverride ? m.newTime : m.jamMulai,
        extra: ruang ? `Ruang ${ruang}` : ''
      });
    }
  });

  // 2. Tugas & Acara
  savedTasks.forEach((t) => {
    if (t.status === 'done') return;
    const isMatch = t.category === 'Acara' ? isDateInAcaraRange(dateStr, t) : t.date === dateStr;
    if (isMatch) {
      items.push({
        uid: `task_${t.id}`,
        name: t.name,
        category: t.category,
        time: t.time,
        extra: t.ruang || t.pengumpulan || ''
      });
    }
  });

  // 3. Rutinitas
  savedRoutines
    .filter((r) => r.days.includes(dayName))
    .forEach((r) => {
      if (!isDismissed('rutin', r.id, dateStr)) {
        items.push({
          uid: `rutin_${r.id}`,
          name: r.name,
          category: 'Rutinitas',
          time: r.time,
          extra: r.desc || ''
        });
      }
    });

  // 4. Waktu Salat
  const salatList = await getSalatForDate(targetDateObj, dateStr);
  salatList.forEach((s) => {
    if (!isDismissed('salat', s.name, dateStr)) {
      items.push({
        uid: `salat_${s.name}`,
        name: `Salat ${s.name}`,
        category: 'Salat',
        time: s.time,
        extra: 'Wilayah Yogyakarta'
      });
    }
  });

  return { dateStr, items };
}

async function syncAndroidAlarms() {
  const LocalNotifications = getLocalNotificationsPlugin();
  if (!LocalNotifications) return;

  const perm = await LocalNotifications.checkPermissions();
  if (perm.display !== 'granted') return;

  await ensurePolaNotificationChannel(LocalNotifications);

  const pending = await LocalNotifications.getPending();
  if (pending.notifications && pending.notifications.length > 0) {
    await LocalNotifications.cancel({ notifications: pending.notifications });
  }

  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const daysToSchedule = [now, tomorrow];
  let notificationsToSchedule = [];

  for (const dayObj of daysToSchedule) {
    const { dateStr, items } = await getSchedulesForDate(dayObj);

    items.forEach((item) => {
      if (!item.time || !item.time.includes(':')) return;
      const [hh, mm] = item.time.slice(0, 5).split(':').map(Number);

      const exactDate = new Date(
        dayObj.getFullYear(),
        dayObj.getMonth(),
        dayObj.getDate(),
        hh,
        mm,
        0,
        0
      );
      const pre5Date = new Date(exactDate.getTime() - 5 * 60 * 1000);
      const detail = item.extra ? ` (${item.extra})` : '';

      // Alarm 1: 5 Menit Sebelum
      if (pre5Date.getTime() > Date.now()) {
        notificationsToSchedule.push({
          id: stringToInt32(`${dateStr}_${item.uid}_pre5`),
          title: `⏳ 5 Menit Lagi: ${item.name}`,
          body: `Mulai pukul ${item.time}${detail} • ${item.category}`,
          channelId: POLA_CHANNEL_ID,
          sound: POLA_SOUND_NAME,
          smallIcon: 'ic_stat_pola',
          iconColor: '#C85A32',
          schedule: { at: pre5Date, allowWhileIdle: true }
        });
      }

      // Alarm 2: Tepat Waktu
      if (exactDate.getTime() > Date.now()) {
        notificationsToSchedule.push({
          id: stringToInt32(`${dateStr}_${item.uid}_now`),
          title: `🔔 Sekarang: ${item.name}`,
          body: `Jadwal pukul ${item.time}${detail}`,
          channelId: POLA_CHANNEL_ID,
          sound: POLA_SOUND_NAME,
          smallIcon: 'ic_stat_pola',
          iconColor: '#C85A32',
          schedule: { at: exactDate, allowWhileIdle: true }
        });
      }
    });
  }

  if (notificationsToSchedule.length > 0) {
    await LocalNotifications.schedule({ notifications: notificationsToSchedule });
  }
}

if (typeof refreshAllViews === 'function') {
  const originalRefresh = refreshAllViews;
  refreshAllViews = function () {
    originalRefresh();
    syncAndroidAlarms();
  };
}

document.addEventListener('DOMContentLoaded', async () => {
  const LocalNotifications = getLocalNotificationsPlugin();
  if (!LocalNotifications) return;

  const perm = await LocalNotifications.requestPermissions();
  if (perm.display === 'granted') {
    await ensurePolaNotificationChannel(LocalNotifications);
    await syncAndroidAlarms();
  }
});