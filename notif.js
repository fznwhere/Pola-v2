// notif.js - Penjadwal Alarm Native Android untuk Pola. v3

const POLA_CHANNEL_ID = 'pola_jadwal_v2';
const POLA_SALAT_CUSTOM_CHANNEL_ID = 'pola_salat_custom_v1';

const POLA_SOUND_NAME = 'pola_notif'; // File: res/raw/pola_notif.mp3
const POLA_SALAT_SOUND_NAME = 'pola_salat'; // File: res/raw/pola_salat.mp3

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
    await LocalNotifications.deleteChannel({ id: 'pola_jadwal_v1' }).catch(() => {});

    // Channel jadwal umum (kuliah, tugas, acara, rutinitas)
    await LocalNotifications.createChannel({
      id: POLA_CHANNEL_ID,
      name: 'Pengingat Jadwal Pola',
      description: 'Notifikasi jadwal kuliah, rutinitas, acara, dan tugas',
      sound: POLA_SOUND_NAME,
      importance: 5,
      visibility: 1,
      vibration: true
    });

    // Channel khusus jadwal salat
    await LocalNotifications.createChannel({
      id: POLA_SALAT_CUSTOM_CHANNEL_ID,
      name: 'Pengingat Waktu Salat',
      description: 'Notifikasi waktu salat dengan nada pengingat khusus',
      sound: POLA_SALAT_SOUND_NAME,
      importance: 5,
      visibility: 1,
      vibration: true
    });
  } catch (e) {
    // Abaikan jika dijalankan di browser web biasa
  }
}

function getExtraReminderMinutes(item) {
  if (!item || !item.remindVal) return 0;
  const val = parseInt(item.remindVal, 10);
  if (isNaN(val) || val <= 0) return 0;
  return item.remindUnit === 'hours' ? val * 60 : val;
}

function formatReminderLabel(item) {
  const val = parseInt(item.remindVal, 10);
  return item.remindUnit === 'hours' ? `${val} Jam Lagi` : `${val} Menit Lagi`;
}

// Ambil jadwal salat sesuai lokasi GPS user (terhubung dengan cache bulanan script.js)
async function getSalatForDate(targetDateObj, dateStr) {
  if (typeof fetchSalatTimingsForDate === 'function') {
    return await fetchSalatTimingsForDate(targetDateObj, dateStr);
  }

  return [
    { name: 'Subuh', time: '04:15' },
    { name: 'Zuhur', time: '11:40' },
    { name: 'Asar', time: '15:00' },
    { name: 'Maghrib', time: '17:45' },
    { name: 'Isya', time: '18:55' }
  ];
}

async function getSchedulesForDate(targetDateObj) {
  const dateStr = `${targetDateObj.getFullYear()}-${String(targetDateObj.getMonth() + 1).padStart(2, '0')}-${String(targetDateObj.getDate()).padStart(2, '0')}`;
  const dayName = namaHari[targetDateObj.getDay()];
  let items = [];

  const savedMatkul =
    typeof getActiveMatkulList === 'function'
      ? getActiveMatkulList()
      : JSON.parse(localStorage.getItem('polaMatkul')) || [];
  const overrides = JSON.parse(localStorage.getItem('polaOverrides')) || [];
  const savedTasks = JSON.parse(localStorage.getItem('polaTasks')) || [];
  const savedRoutines = JSON.parse(localStorage.getItem('polaRoutines')) || [];
  const isHoliday =
    typeof getHolidayInfo === 'function'
      ? getHolidayInfo(dateStr)
      : isUserHoliday(dateStr);

  // 1. Kuliah (hanya semester aktif)
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
        extra: ruang ? `Ruang ${ruang}` : '',
        remindVal: m.remindVal || null,
        remindUnit: m.remindUnit || 'minutes'
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
        extra: t.ruang || t.pengumpulan || '',
        remindVal: t.remindVal || null,
        remindUnit: t.remindUnit || 'minutes'
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
          extra: r.desc || '',
          remindVal: r.remindVal || null,
          remindUnit: r.remindUnit || 'minutes'
        });
      }
    });

  // 4. Waktu Salat (mengikuti lokasi terkini)
  const loc =
    typeof getSavedCoordinates === 'function'
      ? getSavedCoordinates()
      : { city: 'Yogyakarta' };
  const cityLabel = loc && loc.city ? `Wilayah ${loc.city}` : '';
  const salatList = await getSalatForDate(targetDateObj, dateStr);

  salatList.forEach((s) => {
    if (!isDismissed('salat', s.name, dateStr)) {
      items.push({
        uid: `salat_${s.name}`,
        name: `Salat ${s.name}`,
        category: 'Salat',
        time: s.time,
        extra: cityLabel,
        remindVal: null,
        remindUnit: 'minutes'
      });
    }
  });

  return { dateStr, items };
}

function buildPendingTaskCountdownNotifications(now) {
  const savedTasks = JSON.parse(localStorage.getItem('polaTasks')) || [];
  const pendingTasks = savedTasks.filter(
    (t) => t.status !== 'done' && (t.category === 'Tugas Kuliah' || t.category === 'Tugas') && t.date
  );

  let results = [];
  if (pendingTasks.length === 0) return results;

  for (let offset = 0; offset <= 7; offset++) {
    const checkDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset, 8, 0, 0, 0);
    if (checkDate.getTime() <= Date.now()) continue;

    const checkDayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
    checkDayStart.setHours(0, 0, 0, 0);
    const checkDateStr = `${checkDayStart.getFullYear()}-${String(checkDayStart.getMonth() + 1).padStart(2, '0')}-${String(checkDayStart.getDate()).padStart(2, '0')}`;

    pendingTasks.forEach((t) => {
      const parts = t.date.split('-').map(Number);
      if (parts.length !== 3) return;
      const deadlineDayStart = new Date(parts[0], parts[1] - 1, parts[2]);
      deadlineDayStart.setHours(0, 0, 0, 0);

      const diffDays = Math.round((deadlineDayStart - checkDayStart) / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays <= 7) {
        if (diffDays === 0 && t.time) {
          const [dHour] = t.time.split(':').map(Number);
          if (!isNaN(dHour) && dHour < 10) return;
        }

        const label =
          diffDays === 0
            ? '🚨 Hari Ini Deadline'
            : diffDays === 1
            ? '⚠️ Besok Deadline'
            : `📌 H-${diffDays} Deadline`;

        const viaText = t.pengumpulan ? ` • Via ${t.pengumpulan}` : '';
        results.push({
          id: stringToInt32(`task_countdown_${t.id}_${checkDateStr}`),
          title: `${label}: ${t.name}`,
          body: `Batas kumpul ${formatShortDate(t.date)} pukul ${t.time || '-'}${viaText}`,
          channelId: POLA_CHANNEL_ID,
          sound: POLA_SOUND_NAME,
          smallIcon: 'ic_stat_pola',
          iconColor: '#C85A32',
          extra: { type: 'task_countdown' },
          schedule: { at: checkDate, allowWhileIdle: true }
        });
      }
    });
  }

  return results;
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
      const isSalat = item.category === 'Salat';

      const targetChannel = isSalat ? POLA_SALAT_CUSTOM_CHANNEL_ID : POLA_CHANNEL_ID;
      const targetSound = isSalat ? POLA_SALAT_SOUND_NAME : POLA_SOUND_NAME;
      const extraMeta = { type: isSalat ? 'salat' : 'schedule', uid: item.uid };

      // Alarm Opsional Pengguna
      const extraMins = getExtraReminderMinutes(item);
      if (extraMins > 0 && extraMins !== 5) {
        const customDate = new Date(exactDate.getTime() - extraMins * 60 * 1000);
        if (customDate.getTime() > Date.now()) {
          notificationsToSchedule.push({
            id: stringToInt32(`${dateStr}_${item.uid}_custom_${extraMins}`),
            title: `⏰ ${formatReminderLabel(item)}: ${item.name}`,
            body: `Mulai pukul ${item.time}${detail} • ${item.category}`,
            channelId: targetChannel,
            sound: targetSound,
            smallIcon: 'ic_stat_pola',
            iconColor: '#C85A32',
            extra: extraMeta,
            schedule: { at: customDate, allowWhileIdle: true }
          });
        }
      }

      // Alarm Wajib 1: 5 Menit Sebelum
      if (pre5Date.getTime() > Date.now()) {
        notificationsToSchedule.push({
          id: stringToInt32(`${dateStr}_${item.uid}_pre5`),
          title: `⏳ 5 Menit Lagi: ${item.name}`,
          body: `Mulai pukul ${item.time}${detail} • ${item.category}`,
          channelId: targetChannel,
          sound: targetSound,
          smallIcon: 'ic_stat_pola',
          iconColor: '#C85A32',
          extra: extraMeta,
          schedule: { at: pre5Date, allowWhileIdle: true }
        });
      }

      // Alarm Wajib 2: Tepat Waktu
      if (exactDate.getTime() > Date.now()) {
        notificationsToSchedule.push({
          id: stringToInt32(`${dateStr}_${item.uid}_now`),
          title: `🔔 Sekarang: ${item.name}`,
          body: `Jadwal pukul ${item.time}${detail}`,
          channelId: targetChannel,
          sound: targetSound,
          smallIcon: 'ic_stat_pola',
          iconColor: '#C85A32',
          extra: extraMeta,
          schedule: { at: exactDate, allowWhileIdle: true }
        });
      }
    });
  }

  const taskCountdownNotifs = buildPendingTaskCountdownNotifications(now);
  notificationsToSchedule.push(...taskCountdownNotifs);

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