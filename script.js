let currentNavDate = new Date();
let editId = null;
const namaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
let currentHistoryTab = 'Tugas Kuliah';
let currentDrawerTab = 'Rutinitas';
let editSemesterId = null;
let pendingBackupPayload = null;
const fetchingHolidayYears = new Set();

let activeSalatAudio = null;
let activeSalatAudioUrl = null;
let activeSalatOscCtx = null;

// Data dasar libur nasional (cadangan offline instan)
const defaultLiburNasional = {
    "2026-01-01": "Tahun Baru Masehi",
    "2026-01-16": "Isra Mikraj Nabi Muhammad SAW",
    "2026-02-17": "Tahun Baru Imlek 2577",
    "2026-03-19": "Hari Suci Nyepi",
    "2026-03-20": "Hari Raya Idul Fitri 1447 H",
    "2026-03-21": "Hari Raya Idul Fitri 1447 H",
    "2026-04-03": "Wafat Yesus Kristus",
    "2026-04-05": "Kebangkitan Yesus Kristus (Paskah)",
    "2026-05-01": "Hari Buruh Internasional",
    "2026-05-14": "Kenaikan Yesus Kristus",
    "2026-05-27": "Hari Raya Idul Adha 1447 H",
    "2026-05-31": "Hari Raya Waisak 2570 BE",
    "2026-06-01": "Hari Lahir Pancasila",
    "2026-06-16": "1 Muharam Tahun Baru Islam 1448 H",
    "2026-08-17": "Proklamasi Kemerdekaan RI",
    "2026-08-25": "Maulid Nabi Muhammad SAW",
    "2026-12-25": "Kelahiran Yesus Kristus (Natal)",
    "2027-01-01": "Tahun Baru Masehi",
    "2027-01-05": "Isra Mikraj Nabi Muhammad SAW",
    "2027-02-06": "Tahun Baru Imlek 2578",
    "2027-03-09": "Hari Suci Nyepi",
    "2027-03-10": "Hari Raya Idul Fitri 1448 H",
    "2027-03-11": "Hari Raya Idul Fitri 1448 H",
    "2027-03-26": "Wafat Yesus Kristus",
    "2027-03-28": "Kebangkitan Yesus Kristus (Paskah)",
    "2027-05-01": "Hari Buruh Internasional",
    "2027-05-06": "Kenaikan Yesus Kristus",
    "2027-05-17": "Hari Raya Idul Adha 1448 H",
    "2027-05-20": "Hari Raya Waisak 2571 BE",
    "2027-06-01": "Hari Lahir Pancasila",
    "2027-06-06": "1 Muharam Tahun Baru Islam 1449 H",
    "2027-08-15": "Maulid Nabi Muhammad SAW",
    "2027-08-17": "Proklamasi Kemerdekaan RI",
    "2027-12-25": "Kelahiran Yesus Kristus (Natal)"
};

const strk = "var(--text-muted)";
const fll = "var(--bg-main)";
const iClk = `<svg class="svg-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="${fll}" stroke="${strk}" stroke-width="2"></circle><polyline points="12 6 12 12 16 14" fill="none" stroke="${strk}" stroke-width="2"></polyline></svg>`;
const iDat = `<svg class="svg-icon" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" fill="${fll}" stroke="${strk}" stroke-width="2"></rect><line x1="16" y1="2" x2="16" y2="6" stroke="${strk}" stroke-width="2"></line><line x1="8" y1="2" x2="8" y2="6" stroke="${strk}" stroke-width="2"></line><line x1="3" y1="10" x2="21" y2="10" stroke="${strk}" stroke-width="2"></line></svg>`;
const iCir = `<svg class="svg-icon" style="width:22px;height:22px;margin:0;" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="${fll}" stroke="${strk}" stroke-width="2"></circle></svg>`;
const iChkCir = `<svg class="svg-icon" style="width:22px;height:22px;margin:0;" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="${fll}" stroke="${strk}" stroke-width="2"></circle><path d="M8 12.5L10.5 15L16 9" fill="none" stroke="${strk}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;

const iEdt = `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="${strk}" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;
const iUsr = `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="${strk}" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
const iRom = `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="${strk}" stroke-width="2"><path d="M3 21h18"></path><path d="M7 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16"></path><path d="M15 12h.01"></path></svg>`;
const iPls = `<svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
const iDel = `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="${strk}" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
const iPin = `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="${strk}" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
const iRef = `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="${strk}" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>`;
const iBkp = `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="var(--btn-primary)" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`;
const iVol = `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="${strk}" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>`;

// --- SUARA KHUSUS PENGINGAT JADWAL SALAT ---
function getSalatSoundConfig() {
    try {
        const cfg = JSON.parse(localStorage.getItem('nalaSalatSoundConfig'));
        if (cfg && cfg.type && cfg.name) return cfg;
    } catch (e) {}
    return { type: 'preset_adzan', name: 'Nada Adzan Lembut' };
}

function saveSalatSoundConfig(cfg) {
    localStorage.setItem('nalaSalatSoundConfig', JSON.stringify(cfg));
    document.querySelectorAll('.salat-sound-label-text').forEach((el) => {
        el.innerText = cfg.name;
    });
    if (typeof syncAndroidAlarms === 'function') syncAndroidAlarms();
}

function openSalatAudioDB() {
    return new Promise((resolve, reject) => {
        if (!window.indexedDB) {
            reject(new Error('IndexedDB tidak didukung'));
            return;
        }
        const req = indexedDB.open('nalaAudioDB', 1);
        req.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('sounds')) {
                db.createObjectStore('sounds');
            }
        };
        req.onsuccess = (e) => resolve(e.target.result);
        req.onerror = (e) => reject(e.target.error);
    });
}

async function storeCustomSalatAudioBlob(blob) {
    const db = await openSalatAudioDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('sounds', 'readwrite');
        tx.objectStore('sounds').put(blob, 'salat_custom_audio');
        tx.oncomplete = () => resolve(true);
        tx.onerror = (e) => reject(e.target.error);
    });
}

async function getCustomSalatAudioBlob() {
    try {
        const db = await openSalatAudioDB();
        return new Promise((resolve) => {
            const tx = db.transaction('sounds', 'readonly');
            const req = tx.objectStore('sounds').get('salat_custom_audio');
            req.onsuccess = () => resolve(req.result || null);
            req.onerror = () => resolve(null);
        });
    } catch (e) {
        return null;
    }
}

function stopSalatReminderSound() {
    if (activeSalatAudio) {
        try {
            activeSalatAudio.pause();
            activeSalatAudio.currentTime = 0;
        } catch (e) {}
        activeSalatAudio = null;
    }
    if (activeSalatAudioUrl) {
        try {
            URL.revokeObjectURL(activeSalatAudioUrl);
        } catch (e) {}
        activeSalatAudioUrl = null;
    }
    if (activeSalatOscCtx) {
        try {
            activeSalatOscCtx.close();
        } catch (e) {}
        activeSalatOscCtx = null;
    }
    document.querySelectorAll('.btn-test-salat-sound').forEach((btn) => {
        btn.innerHTML = `${iVol} Tes`;
    });
}

function playSynthesizedSalatTone(variant = 'preset_adzan', onEnded = null) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    activeSalatOscCtx = ctx;

    // Pola nada lembut bernuansa adzan (Hijaz) atau gema masjid
    const notes = variant === 'preset_gema'
        ? [
            { freq: 392.00, start: 0.0, dur: 0.55 }, // G4
            { freq: 493.88, start: 0.45, dur: 0.55 }, // B4
            { freq: 587.33, start: 0.90, dur: 0.85 }, // D5
            { freq: 493.88, start: 1.70, dur: 0.55 }, // B4
            { freq: 392.00, start: 2.20, dur: 1.00 }  // G4
        ]
        : [
            { freq: 293.66, start: 0.0, dur: 0.55 }, // D4
            { freq: 311.13, start: 0.50, dur: 0.45 }, // Eb4
            { freq: 369.99, start: 0.90, dur: 0.65 }, // F#4
            { freq: 392.00, start: 1.50, dur: 0.75 }, // G4
            { freq: 369.99, start: 2.20, dur: 0.45 }, // F#4
            { freq: 311.13, start: 2.60, dur: 0.45 }, // Eb4
            { freq: 293.66, start: 3.00, dur: 1.05 }  // D4
        ];

    const now = ctx.currentTime + 0.05;
    let maxEnd = 0;

    notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.freq, now + n.start);

        gain.gain.setValueAtTime(0.0001, now + n.start);
        gain.gain.exponentialRampToValueAtTime(0.24, now + n.start + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + n.start + n.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + n.start);
        osc.stop(now + n.start + n.dur + 0.05);

        if (n.start + n.dur > maxEnd) maxEnd = n.start + n.dur;
    });

    setTimeout(() => {
        if (activeSalatOscCtx === ctx) {
            stopSalatReminderSound();
            if (typeof onEnded === 'function') onEnded();
        }
    }, Math.ceil((maxEnd + 0.2) * 1000));
}

async function playSalatReminderSound(toggleMode = false) {
    const isPlaying = Boolean(activeSalatAudio || activeSalatOscCtx);
    stopSalatReminderSound();
    if (toggleMode && isPlaying) return;

    document.querySelectorAll('.btn-test-salat-sound').forEach((btn) => {
        btn.innerText = 'Stop';
    });

    const cfg = getSalatSoundConfig();

    if (cfg.type === 'custom') {
        const blob = await getCustomSalatAudioBlob();
        if (blob) {
            const url = URL.createObjectURL(blob);
            activeSalatAudioUrl = url;
            const audio = new Audio(url);
            activeSalatAudio = audio;
            audio.onended = () => stopSalatReminderSound();
            audio.onerror = () => {
                stopSalatReminderSound();
                playSynthesizedSalatTone('preset_adzan');
            };
            try {
                await audio.play();
                return;
            } catch (e) {
                stopSalatReminderSound();
            }
        }
    }

    if (cfg.type === 'default') {
        playSynthesizedSalatTone('preset_gema');
        return;
    }

    playSynthesizedSalatTone(cfg.type === 'preset_gema' ? 'preset_gema' : 'preset_adzan');
}

window.playSalatReminderSound = playSalatReminderSound;
window.stopSalatReminderSound = stopSalatReminderSound;

function openSalatSoundModal() {
    stopSalatReminderSound();
    ensureSalatSoundModalExists();
    renderSalatSoundOptions();
    hideFabForModal();
    document.getElementById('salat-sound-modal').style.display = 'flex';
}

function ensureSalatSoundModalExists() {
    if (document.getElementById('salat-sound-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'salat-sound-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <h2>Suara Pengingat Salat</h2>
            <p style="font-size:12px; color:var(--text-muted); margin-bottom:14px; line-height:1.45;">
                Pilih nada pengingat bawaan atau unggah file audio sendiri (adzan / murottal / nada lembut) untuk jadwal salat.
            </p>
            <div id="salat-sound-options-list"></div>
            <input type="file" id="salat-custom-audio-input" accept="audio/*" style="display:none;" onchange="handleSalatAudioFileSelected(event)">
            <div class="backup-btn-grid" style="margin-top:12px;">
                <button type="button" class="backup-action-btn primary" onclick="document.getElementById('salat-custom-audio-input').click()">Upload File Audio</button>
                <button type="button" class="backup-action-btn btn-test-salat-sound" onclick="playSalatReminderSound(true)">${iVol} Tes</button>
            </div>
            <small class="field-hint">Mendukung format .mp3, .m4a, .wav, dan .ogg (tersimpan otomatis untuk mode offline).</small>
            <div class="modal-btns">
                <button type="button" class="btn-save" onclick="stopSalatReminderSound(); closeModal('salat-sound-modal');">Selesai</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

async function renderSalatSoundOptions() {
    const container = document.getElementById('salat-sound-options-list');
    if (!container) return;

    const current = getSalatSoundConfig();
    const customBlob = await getCustomSalatAudioBlob();
    const savedCustomName = localStorage.getItem('nalaSalatCustomFileName') || '';

    const options = [
        { type: 'preset_adzan', name: 'Nada Adzan Lembut', desc: 'Melodi instrumen bernuansa adzan (bawaan)' },
        { type: 'preset_gema', name: 'Gema Masjid', desc: 'Dentang nada tenang 3 ketukan (bawaan)' },
        { type: 'default', name: 'Default Sistem', desc: 'Mengikuti nada notifikasi standar perangkat' }
    ];

    if (customBlob && savedCustomName) {
        options.unshift({
            type: 'custom',
            name: savedCustomName,
            desc: 'File audio kustom pilihanmu'
        });
    }

    container.innerHTML = options.map((opt) => {
        const isSelected = current.type === opt.type && current.name === opt.name;
        const safeName = opt.name.replace(/'/g, "\\'");
        return `
            <div class="sound-option-card ${isSelected ? 'selected' : ''}" onclick="selectSalatSoundOption('${opt.type}', '${safeName}')">
                <div>
                    <div class="sound-option-title">${opt.name}</div>
                    <div class="sound-option-sub">${opt.desc}</div>
                </div>
                <strong style="font-size:11px; color:${isSelected ? 'var(--btn-primary)' : 'var(--text-muted)'};">
                    ${isSelected ? 'Aktif' : 'Pilih'}
                </strong>
            </div>
        `;
    }).join('');
}

function selectSalatSoundOption(type, name) {
    saveSalatSoundConfig({ type, name });
    renderSalatSoundOptions();
}

async function handleSalatAudioFileSelected(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
        await polaAlert('Ukuran file audio terlalu besar (maksimal 15 MB).');
        return;
    }

    try {
        await storeCustomSalatAudioBlob(file);
        localStorage.setItem('nalaSalatCustomFileName', file.name);
        saveSalatSoundConfig({ type: 'custom', name: file.name });
        await renderSalatSoundOptions();
        await playSalatReminderSound(false);
    } catch (e) {
        await polaAlert('Gagal menyimpan file audio ke penyimpanan aplikasi.');
    }
}

// --- PEMBERSIH CACHE LAMA OTOMATIS ---
function cleanupOldCache() {
    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth() + 1;
    const minYm = curYear * 12 + curMonth - 1;

    Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('nalaSalat_')) {
            localStorage.removeItem(key);
        }
        if (key.startsWith('nalaSalatMonth_')) {
            const parts = key.split('_');
            const y = parseInt(parts[1], 10);
            const m = parseInt(parts[2], 10);
            if (!isNaN(y) && !isNaN(m) && (y * 12 + m) < minYm) {
                localStorage.removeItem(key);
            }
        }
        if (key.startsWith('nalaAutoLibur_')) {
            const y = parseInt(key.split('_')[1], 10);
            if (!isNaN(y) && y < curYear - 1) {
                localStorage.removeItem(key);
            }
        }
    });
}

// --- CUSTOM DIALOG BERTEMA POLA ---
function ensurePolaDialogExists() {
    if (document.getElementById('pola-dialog-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'pola-dialog-overlay';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
        <div class="modal pola-dialog-box">
            <h3 class="pola-dialog-title" id="pola-dialog-title">Pola.</h3>
            <p class="pola-dialog-msg" id="pola-dialog-msg"></p>
            <div class="modal-btns" id="pola-dialog-btns"></div>
        </div>
    `;
    document.body.appendChild(overlay);
}

function polaAlert(message, title = 'Perhatian') {
    ensurePolaDialogExists();
    return new Promise((resolve) => {
        const overlay = document.getElementById('pola-dialog-overlay');
        document.getElementById('pola-dialog-title').innerText = title;
        document.getElementById('pola-dialog-msg').innerText = message;
        const btns = document.getElementById('pola-dialog-btns');
        btns.innerHTML = `<button class="btn-save" id="pola-dialog-ok">Mengerti</button>`;
        overlay.style.display = 'flex';
        document.getElementById('pola-dialog-ok').onclick = () => {
            overlay.style.display = 'none';
            resolve(true);
        };
    });
}

function polaConfirm(message, title = 'Konfirmasi', confirmLabel = 'Ya, Lanjutkan') {
    ensurePolaDialogExists();
    return new Promise((resolve) => {
        const overlay = document.getElementById('pola-dialog-overlay');
        document.getElementById('pola-dialog-title').innerText = title;
        document.getElementById('pola-dialog-msg').innerText = message;
        const btns = document.getElementById('pola-dialog-btns');
        btns.innerHTML = `
            <button class="btn-cancel" id="pola-dialog-cancel">Batal</button>
            <button class="btn-save" id="pola-dialog-confirm">${confirmLabel}</button>
        `;
        overlay.style.display = 'flex';
        document.getElementById('pola-dialog-cancel').onclick = () => {
            overlay.style.display = 'none';
            resolve(false);
        };
        document.getElementById('pola-dialog-confirm').onclick = () => {
            overlay.style.display = 'none';
            resolve(true);
        };
    });
}

// --- JADWAL LIBUR NASIONAL OTOMATIS ---
function getAutoHolidaysMapForYear(year) {
    const result = {};
    const prefix = `${year}-`;
    Object.keys(defaultLiburNasional).forEach((d) => {
        if (d.startsWith(prefix)) result[d] = defaultLiburNasional[d];
    });
    try {
        const cached = JSON.parse(localStorage.getItem(`nalaAutoLibur_${year}`));
        if (cached && cached.holidays && typeof cached.holidays === 'object') {
            Object.assign(result, cached.holidays);
        }
    } catch (e) {}
    return result;
}

function getAutoHolidayName(dateStr) {
    if (!dateStr) return null;
    const year = parseInt(dateStr.slice(0, 4), 10);
    if (isNaN(year)) return null;
    const map = getAutoHolidaysMapForYear(year);
    return map[dateStr] || null;
}

function isUserHoliday(dateStr) {
    let savedLibur = JSON.parse(localStorage.getItem('nalaLibur')) || [];
    let tDate = new Date(dateStr); tDate.setHours(0, 0, 0, 0);
    for (let l of savedLibur) {
        let sDate = new Date(l.startDate); sDate.setHours(0, 0, 0, 0);
        let eDate = new Date(l.endDate || l.startDate); eDate.setHours(0, 0, 0, 0);
        if (tDate >= sDate && tDate <= eDate) return l.name;
    }
    return null;
}

function getHolidayInfo(dateStr) {
    const userHol = isUserHoliday(dateStr);
    const autoHol = getAutoHolidayName(dateStr);
    if (userHol && autoHol && userHol.toLowerCase() !== autoHol.toLowerCase()) {
        return `${autoHol} • ${userHol}`;
    }
    return userHol || autoHol || null;
}

async function ensureAutoHolidaysForYear(year) {
    if (!year || fetchingHolidayYears.has(year)) return;
    const cacheKey = `nalaAutoLibur_${year}`;
    try {
        const cached = JSON.parse(localStorage.getItem(cacheKey));
        if (cached && cached.updatedAt && (Date.now() - cached.updatedAt) < 30 * 24 * 60 * 60 * 1000) {
            return;
        }
    } catch (e) {}

    fetchingHolidayYears.add(year);
    const parsedMap = {};

    try {
        let loaded = false;
        try {
            const res = await fetch(`https://api-harilibur.vercel.app/api?year=${year}`);
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    data.forEach((item) => {
                        if (item.is_national_holiday && item.holiday_date && item.holiday_name) {
                            const parts = item.holiday_date.split('-');
                            if (parts.length === 3) {
                                const normDate = `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
                                parsedMap[normDate] = item.holiday_name;
                            }
                        }
                    });
                    loaded = Object.keys(parsedMap).length > 0;
                }
            }
        } catch (e) {}

        if (!loaded) {
            try {
                const res2 = await fetch(`https://dayoffapi.vercel.app/api?year=${year}`);
                if (res2.ok) {
                    const data2 = await res2.json();
                    if (Array.isArray(data2) && data2.length > 0) {
                        data2.forEach((item) => {
                            if (!item.is_cuti && item.tanggal && item.keterangan) {
                                const parts = item.tanggal.split('-');
                                if (parts.length === 3) {
                                    const normDate = `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
                                    parsedMap[normDate] = item.keterangan;
                                }
                            }
                        });
                        loaded = Object.keys(parsedMap).length > 0;
                    }
                }
            } catch (e) {}
        }

        if (!loaded) {
            try {
                const res3 = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/ID`);
                if (res3.ok) {
                    const data3 = await res3.json();
                    if (Array.isArray(data3) && data3.length > 0) {
                        data3.forEach((item) => {
                            if (item.date && (item.localName || item.name)) {
                                parsedMap[item.date] = item.localName || item.name;
                            }
                        });
                        loaded = Object.keys(parsedMap).length > 0;
                    }
                }
            } catch (e) {}
        }

        if (loaded) {
            localStorage.setItem(cacheKey, JSON.stringify({ updatedAt: Date.now(), holidays: parsedMap }));
            refreshAllViews();
        }
    } finally {
        fetchingHolidayYears.delete(year);
    }
}

// --- LOKASI USER & JADWAL SALAT OTOMATIS (BULANAN + OFFLINE) ---
function getSavedCoordinates() {
    try {
        const saved = JSON.parse(localStorage.getItem('nalaUserLocation'));
        if (saved && typeof saved.lat === 'number' && typeof saved.lng === 'number') {
            return saved;
        }
    } catch (e) {}
    return { lat: -7.7956, lng: 110.3695, city: 'Yogyakarta', isFallback: true };
}

function updateLocationPillUI(statusText = null, spinning = false) {
    const locEl = document.getElementById('beranda-loc-text');
    const iconEl = document.getElementById('beranda-loc-icon');
    if (iconEl) {
        iconEl.innerHTML = spinning ? iRef : iPin;
        const svg = iconEl.querySelector('svg');
        if (svg) svg.classList.toggle('spin-icon', spinning);
    }
    if (!locEl) return;
    if (statusText) {
        locEl.innerText = statusText;
        return;
    }
    const loc = getSavedCoordinates();
    if (loc.city) {
        locEl.innerText = loc.city;
    } else {
        locEl.innerText = `${loc.lat.toFixed(2)}, ${loc.lng.toFixed(2)}`;
    }
}

async function resolveCityName(lat, lng) {
    try {
        const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=id`
        );
        if (res.ok) {
            const data = await res.json();
            const city = data.city || data.locality || data.principalSubdivision || '';
            if (city) return city.replace(/^Kota\s+|^Kabupaten\s+/i, '').trim();
        }
    } catch (e) {}
    return '';
}

function refreshUserCoordinates(manual = false) {
    return new Promise((resolve) => {
        const current = getSavedCoordinates();
        if (!navigator.geolocation) {
            if (manual) polaAlert('Perangkat atau browser ini tidak mendukung deteksi lokasi otomatis.');
            resolve(current);
            return;
        }

        if (manual) updateLocationPillUI('Mencari lokasi...', true);

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = Number(pos.coords.latitude.toFixed(4));
                const lng = Number(pos.coords.longitude.toFixed(4));
                const movedFar =
                    current.isFallback ||
                    Math.abs(lat - current.lat) > 0.12 ||
                    Math.abs(lng - current.lng) > 0.12;

                let cityName = (!movedFar && current.city) ? current.city : '';
                if (!cityName || manual) {
                    const resolved = await resolveCityName(lat, lng);
                    if (resolved) cityName = resolved;
                }

                const updated = {
                    lat,
                    lng,
                    city: cityName || current.city || 'Lokasi Terdeteksi',
                    isFallback: false,
                    updatedAt: Date.now()
                };
                localStorage.setItem('nalaUserLocation', JSON.stringify(updated));
                updateLocationPillUI(null, false);

                if (movedFar || manual) {
                    Object.keys(localStorage).forEach((k) => {
                        if (k.startsWith('nalaSalatMonth_') || k.startsWith('nalaSalat_')) {
                            localStorage.removeItem(k);
                        }
                    });
                    if (document.getElementById('schedule-list')) await loadTodaySchedule();
                    if (typeof syncAndroidAlarms === 'function') syncAndroidAlarms();
                }
                resolve(updated);
            },
            async () => {
                if (!current.city) {
                    const resolved = await resolveCityName(current.lat, current.lng);
                    if (resolved) {
                        current.city = resolved;
                        localStorage.setItem('nalaUserLocation', JSON.stringify(current));
                    }
                }
                updateLocationPillUI(null, false);
                if (manual) {
                    await polaAlert('Gagal mendeteksi lokasi baru. Pastikan GPS dan izin lokasi untuk aplikasi Pola. sudah aktif.');
                }
                resolve(current);
            },
            {
                enableHighAccuracy: manual,
                timeout: manual ? 10000 : 6000,
                maximumAge: manual ? 0 : 30 * 60 * 1000
            }
        );
    });
}

async function fetchSalatTimingsForDate(dateObj, dateStr) {
    const loc = getSavedCoordinates();
    const locKey = `${loc.lat.toFixed(2)}_${loc.lng.toFixed(2)}`;
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');

    const monthCacheKey = `nalaSalatMonth_${yyyy}_${mm}_${locKey}`;
    try {
        const cachedMonth = JSON.parse(localStorage.getItem(monthCacheKey));
        if (cachedMonth && Array.isArray(cachedMonth[dateStr]) && cachedMonth[dateStr].length === 5) {
            return cachedMonth[dateStr];
        }
    } catch (e) {}

    try {
        const res = await fetch(
            `https://api.aladhan.com/v1/calendar/${yyyy}/${Number(mm)}?latitude=${loc.lat}&longitude=${loc.lng}&method=20`
        );
        if (res.ok) {
            const json = await res.json();
            if (json && Array.isArray(json.data)) {
                const monthMap = {};
                json.data.forEach((dayItem) => {
                    const gDate = dayItem?.date?.gregorian?.date;
                    const t = dayItem?.timings;
                    if (gDate && t) {
                        const p = gDate.split('-');
                        if (p.length === 3) {
                            const isoKey = `${p[2]}-${p[1].padStart(2, '0')}-${p[0].padStart(2, '0')}`;
                            monthMap[isoKey] = [
                                { name: 'Subuh', time: t.Fajr.slice(0, 5) },
                                { name: 'Zuhur', time: t.Dhuhr.slice(0, 5) },
                                { name: 'Asar', time: t.Asr.slice(0, 5) },
                                { name: 'Maghrib', time: t.Maghrib.slice(0, 5) },
                                { name: 'Isya', time: t.Isha.slice(0, 5) }
                            ];
                        }
                    }
                });
                if (monthMap[dateStr]) {
                    localStorage.setItem(monthCacheKey, JSON.stringify(monthMap));
                    cleanupOldCache();
                    return monthMap[dateStr];
                }
            }
        }
    } catch (e) {}

    try {
        const resSingle = await fetch(
            `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${loc.lat}&longitude=${loc.lng}&method=20`
        );
        if (resSingle.ok) {
            const t = (await resSingle.json()).data.timings;
            return [
                { name: 'Subuh', time: t.Fajr.slice(0, 5) },
                { name: 'Zuhur', time: t.Dhuhr.slice(0, 5) },
                { name: 'Asar', time: t.Asr.slice(0, 5) },
                { name: 'Maghrib', time: t.Maghrib.slice(0, 5) },
                { name: 'Isya', time: t.Isha.slice(0, 5) }
            ];
        }
    } catch (e) {}

    return [
        { name: 'Subuh', time: '04:15' },
        { name: 'Zuhur', time: '11:40' },
        { name: 'Asar', time: '15:00' },
        { name: 'Maghrib', time: '17:45' },
        { name: 'Isya', time: '18:55' }
    ];
}

// --- MANAJEMEN SEMESTER KULIAH ---
function ensureSemesterInitialized() {
    let semesters = JSON.parse(localStorage.getItem('nalaSemesters'));
    let activeId = localStorage.getItem('nalaActiveSemesterId');

    if (!Array.isArray(semesters) || semesters.length === 0) {
        semesters = [{ id: 'sem_1', name: 'Semester 1', createdAt: Date.now() }];
        activeId = 'sem_1';
        localStorage.setItem('nalaSemesters', JSON.stringify(semesters));
        localStorage.setItem('nalaActiveSemesterId', activeId);
    }

    if (!activeId || !semesters.some((s) => s.id === activeId)) {
        activeId = semesters[0].id;
        localStorage.setItem('nalaActiveSemesterId', activeId);
    }

    let savedMatkul = JSON.parse(localStorage.getItem('nalaMatkul')) || [];
    let migrated = false;
    savedMatkul.forEach((m) => {
        if (!m.semesterId) {
            m.semesterId = activeId;
            migrated = true;
        }
    });
    if (migrated) {
        localStorage.setItem('nalaMatkul', JSON.stringify(savedMatkul));
    }

    return { semesters, activeId };
}

function getActiveSemesterId() {
    return ensureSemesterInitialized().activeId;
}

function getActiveSemesterObj() {
    const { semesters, activeId } = ensureSemesterInitialized();
    return semesters.find((s) => s.id === activeId) || semesters[0];
}

function getActiveMatkulList() {
    const activeId = getActiveSemesterId();
    const savedMatkul = JSON.parse(localStorage.getItem('nalaMatkul')) || [];
    return savedMatkul.filter((m) => m.semesterId === activeId);
}

function setActiveSemester(semId) {
    localStorage.setItem('nalaActiveSemesterId', semId);
    refreshAllViews();
}

// --- EKSPOR & IMPOR JSON ANTI-GAGAL ---
function buildBackupObject() {
    const { semesters, activeId } = ensureSemesterInitialized();
    const matkul = JSON.parse(localStorage.getItem('nalaMatkul')) || [];
    const overrides = JSON.parse(localStorage.getItem('nalaOverrides')) || [];
    const tasks = JSON.parse(localStorage.getItem('nalaTasks')) || [];
    const routines = JSON.parse(localStorage.getItem('nalaRoutines')) || [];
    const libur = JSON.parse(localStorage.getItem('nalaLibur')) || [];
    const dismissed = JSON.parse(localStorage.getItem('nalaDismissed')) || [];
    const userLocation = JSON.parse(localStorage.getItem('nalaUserLocation')) || null;
    const salatSoundConfig = getSalatSoundConfig();

    return {
        app: 'Pola.',
        schemaVersion: 2,
        exportedAt: new Date().toISOString(),
        summary: {
            semesters: semesters.length,
            matkul: matkul.length,
            tasks: tasks.length,
            routines: routines.length,
            libur: libur.length,
            overrides: overrides.length
        },
        data: {
            nalaSemesters: semesters,
            nalaActiveSemesterId: activeId,
            nalaMatkul: matkul,
            nalaOverrides: overrides,
            nalaTasks: tasks,
            nalaRoutines: routines,
            nalaLibur: libur,
            nalaDismissed: dismissed,
            nalaUserLocation: userLocation,
            nalaSalatSoundConfig: salatSoundConfig
        }
    };
}

function validateAndNormalizeBackup(rawInput) {
    let parsed = rawInput;
    if (typeof rawInput === 'string') {
        const trimmed = rawInput.trim();
        if (!trimmed) return { ok: false, error: 'Teks cadangan masih kosong.' };
        try {
            parsed = JSON.parse(trimmed);
        } catch (e) {
            return { ok: false, error: 'Format file/kode bukan JSON yang valid.' };
        }
    }

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return { ok: false, error: 'Struktur data cadangan tidak dikenali.' };
    }

    const src = (parsed.data && typeof parsed.data === 'object') ? parsed.data : parsed;
    const knownKeys = ['nalaSemesters', 'nalaMatkul', 'nalaOverrides', 'nalaTasks', 'nalaRoutines', 'nalaLibur', 'nalaDismissed'];
    const hasKnownKey = knownKeys.some((k) => Array.isArray(src[k]));

    if (!hasKnownKey) {
        return { ok: false, error: 'File ini bukan cadangan data aplikasi Pola.' };
    }

    let semesters = Array.isArray(src.nalaSemesters)
        ? src.nalaSemesters
            .filter((s) => s && typeof s === 'object' && s.name)
            .map((s, idx) => ({
                id: String(s.id || `sem_${Date.now()}_${idx}`),
                name: String(s.name),
                createdAt: s.createdAt || Date.now()
            }))
        : [];

    if (semesters.length === 0) {
        semesters = [{ id: 'sem_1', name: 'Semester 1', createdAt: Date.now() }];
    }
    const validSemIds = new Set(semesters.map((s) => s.id));
    const defaultSemId = validSemIds.has(src.nalaActiveSemesterId) ? src.nalaActiveSemesterId : semesters[0].id;

    const matkul = Array.isArray(src.nalaMatkul)
        ? src.nalaMatkul
            .filter((m) => m && typeof m === 'object' && m.name && m.hari && m.jamMulai)
            .map((m, idx) => ({
                id: m.id || (Date.now() + idx),
                semesterId: validSemIds.has(m.semesterId) ? m.semesterId : defaultSemId,
                name: String(m.name),
                hari: String(m.hari),
                jamMulai: String(m.jamMulai),
                jamSelesai: m.jamSelesai ? String(m.jamSelesai) : '',
                dosen: m.dosen ? String(m.dosen) : '',
                ruangan: m.ruangan ? String(m.ruangan) : '',
                remindVal: (typeof m.remindVal === 'number' && m.remindVal > 0) ? m.remindVal : null,
                remindUnit: m.remindUnit === 'hours' ? 'hours' : 'minutes'
            }))
        : [];

    const tasks = Array.isArray(src.nalaTasks)
        ? src.nalaTasks
            .filter((t) => t && typeof t === 'object' && t.name && t.date && t.time)
            .map((t, idx) => {
                const cat = t.category ? String(t.category) : 'Tugas';
                const item = {
                    id: t.id || (Date.now() + 1000 + idx),
                    name: String(t.name),
                    date: String(t.date),
                    time: String(t.time),
                    category: cat,
                    status: t.status === 'done' ? 'done' : 'pending',
                    deskripsi: t.deskripsi ? String(t.deskripsi) : '',
                    color: t.color ? String(t.color) : (cat === 'Acara' ? 'var(--color-acara)' : 'var(--color-tugas)'),
                    remindVal: (typeof t.remindVal === 'number' && t.remindVal > 0) ? t.remindVal : null,
                    remindUnit: t.remindUnit === 'hours' ? 'hours' : 'minutes'
                };
                if (t.matkulId) item.matkulId = String(t.matkulId);
                if (t.pengumpulan) item.pengumpulan = String(t.pengumpulan);
                if (t.endDate) item.endDate = String(t.endDate);
                else if (cat === 'Acara') item.endDate = String(t.date);
                if (t.endTime) item.endTime = String(t.endTime);
                if (t.ruang) item.ruang = String(t.ruang);
                return item;
            })
        : [];

    const routines = Array.isArray(src.nalaRoutines)
        ? src.nalaRoutines
            .filter((r) => r && typeof r === 'object' && r.name && r.time && Array.isArray(r.days))
            .map((r, idx) => ({
                id: r.id || (Date.now() + 2000 + idx),
                name: String(r.name),
                time: String(r.time),
                days: r.days.map(String),
                color: r.color ? String(r.color) : 'var(--color-rutin)',
                desc: r.desc ? String(r.desc) : '',
                remindVal: (typeof r.remindVal === 'number' && r.remindVal > 0) ? r.remindVal : null,
                remindUnit: r.remindUnit === 'hours' ? 'hours' : 'minutes'
            }))
        : [];

    const libur = Array.isArray(src.nalaLibur)
        ? src.nalaLibur
            .filter((l) => l && typeof l === 'object' && l.name && l.startDate)
            .map((l, idx) => ({
                id: l.id || (Date.now() + 3000 + idx),
                name: String(l.name),
                startDate: String(l.startDate),
                endDate: l.endDate ? String(l.endDate) : String(l.startDate)
            }))
        : [];

    const overrides = Array.isArray(src.nalaOverrides)
        ? src.nalaOverrides
            .filter((o) => o && typeof o === 'object' && o.matkulId && o.newDate && o.newTime)
            .map((o) => ({
                matkulId: o.matkulId,
                originalDate: o.originalDate ? String(o.originalDate) : '',
                newDate: String(o.newDate),
                newTime: String(o.newTime),
                newEndTime: o.newEndTime !== undefined ? String(o.newEndTime) : '',
                newRuangan: o.newRuangan ? String(o.newRuangan) : '',
                newDosen: o.newDosen ? String(o.newDosen) : '',
                remindVal: (typeof o.remindVal === 'number' && o.remindVal > 0) ? o.remindVal : null,
                remindUnit: o.remindUnit === 'hours' ? 'hours' : 'minutes'
            }))
        : [];

    const dismissed = Array.isArray(src.nalaDismissed) ? src.nalaDismissed.map(String) : [];
    const userLocation = (src.nalaUserLocation && typeof src.nalaUserLocation.lat === 'number' && typeof src.nalaUserLocation.lng === 'number')
        ? src.nalaUserLocation
        : null;
    const salatSoundConfig = (src.nalaSalatSoundConfig && src.nalaSalatSoundConfig.type)
        ? src.nalaSalatSoundConfig
        : null;

    return {
        ok: true,
        normalized: {
            nalaSemesters: semesters,
            nalaActiveSemesterId: defaultSemId,
            nalaMatkul: matkul,
            nalaOverrides: overrides,
            nalaTasks: tasks,
            nalaRoutines: routines,
            nalaLibur: libur,
            nalaDismissed: dismissed,
            nalaUserLocation: userLocation,
            nalaSalatSoundConfig: salatSoundConfig
        }
    };
}

function openBackupModal() {
    closeSideDrawer();
    ensureBackupModalExists();
    pendingBackupPayload = null;

    const current = buildBackupObject().summary;
    const statsEl = document.getElementById('backup-current-stats');
    if (statsEl) {
        statsEl.innerHTML = `Data aktif saat ini: <strong>${current.semesters}</strong> Semester, <strong>${current.matkul}</strong> Matkul, <strong>${current.tasks}</strong> Tugas/Acara, <strong>${current.routines}</strong> Rutinitas, <strong>${current.libur}</strong> Libur.`;
    }

    const fileInput = document.getElementById('backup-file-input');
    const textInput = document.getElementById('backup-paste-input');
    const previewBox = document.getElementById('backup-preview-box');
    if (fileInput) fileInput.value = '';
    if (textInput) textInput.value = '';
    if (previewBox) previewBox.style.display = 'none';

    hideFabForModal();
    document.getElementById('backup-modal').style.display = 'flex';
}

function ensureBackupModalExists() {
    if (document.getElementById('backup-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'backup-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <h2>Ekspor & Impor JSON</h2>
            <div class="backup-stats-box" id="backup-current-stats"></div>

            <label style="margin-top:4px;">1. Ekspor Data (Sebelum Update / Hapus Aplikasi)</label>
            <div class="backup-btn-grid">
                <button type="button" class="backup-action-btn primary" onclick="exportBackupFile()">Unduh File .json</button>
                <button type="button" class="backup-action-btn" onclick="copyBackupToClipboard()">Salin Kode</button>
            </div>
            <small class="field-hint">Jika tombol unduh diblokir oleh HP, gunakan <strong>Salin Kode</strong> lalu simpan di catatan atau Google Keep.</small>

            <hr class="backup-divider">

            <label style="margin-top:0;">2. Impor Data dari Cadangan</label>
            <input type="file" id="backup-file-input" accept=".json,application/json,text/plain" style="display:none;" onchange="handleBackupFileSelected(event)">
            <div class="backup-btn-grid">
                <button type="button" class="backup-action-btn" onclick="document.getElementById('backup-file-input').click()">Pilih File .json</button>
                <button type="button" class="backup-action-btn" onclick="previewPastedBackup()">Cek Kode Tempel</button>
            </div>
            <textarea id="backup-paste-input" class="backup-textarea" placeholder="Atau tempel (paste) kode cadangan JSON di sini..."></textarea>

            <div class="backup-preview-box" id="backup-preview-box">
                <div id="backup-preview-summary" style="font-weight:700; line-height:1.45;"></div>
                <div class="backup-mode-group">
                    <label class="backup-mode-option">
                        <input type="radio" name="backup-import-mode" value="replace" checked>
                        <div>
                            <strong>Timpa Semua Data</strong>
                            <small>Cocok saat baru install ulang atau pindah HP.</small>
                        </div>
                    </label>
                    <label class="backup-mode-option">
                        <input type="radio" name="backup-import-mode" value="merge">
                        <div>
                            <strong>Gabungkan dengan Data Sekarang</strong>
                            <small>Menambahkan isi cadangan tanpa menghapus jadwal aktif.</small>
                        </div>
                    </label>
                </div>
                <button type="button" class="backup-action-btn primary" style="width:100%; margin-top:10px;" onclick="executeBackupImport()">Pulihkan Data Sekarang</button>
            </div>

            <div class="modal-btns">
                <button type="button" class="btn-cancel" onclick="closeModal('backup-modal')">Tutup</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

async function exportBackupFile() {
    const payload = buildBackupObject();
    const jsonString = JSON.stringify(payload, null, 2);
    const today = new Date();
    const dateStamp = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const filename = `pola-backup-${dateStamp}.json`;

    try {
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1500);
        await polaAlert(`File "${filename}" mulai diunduh. Jika tidak muncul di folder Download HP, gunakan tombol "Salin Kode" sebagai cadangan teks.`, 'Ekspor Berhasil');
    } catch (e) {
        await polaAlert('Unduhan langsung tidak didukung di tampilan ini. Gunakan tombol "Salin Kode" di sebelahnya.', 'Gunakan Salin Kode');
    }
}

async function copyBackupToClipboard() {
    const jsonString = JSON.stringify(buildBackupObject());
    let copied = false;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
            await navigator.clipboard.writeText(jsonString);
            copied = true;
        } catch (e) {}
    }

    if (!copied) {
        const ta = document.createElement('textarea');
        ta.value = jsonString;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        try {
            copied = document.execCommand('copy');
        } catch (e) {}
        document.body.removeChild(ta);
    }

    if (copied) {
        await polaAlert('Kode cadangan berhasil disalin ke clipboard! Simpan kode tersebut di aplikasi catatan sebelum menghapus aplikasi lama.', 'Tersalin');
    } else {
        await polaAlert('Gagal menyalin otomatis. Silakan gunakan tombol Unduh File .json.', 'Gagal Menyalin');
    }
}

async function handleBackupFileSelected(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
        const content = e.target.result;
        const textInput = document.getElementById('backup-paste-input');
        if (textInput) textInput.value = content;
        await showBackupValidationPreview(content);
    };
    reader.onerror = async () => {
        await polaAlert('Gagal membaca file yang dipilih.');
    };
    reader.readAsText(file);
}

async function previewPastedBackup() {
    const textInput = document.getElementById('backup-paste-input');
    const raw = textInput ? textInput.value : '';
    await showBackupValidationPreview(raw);
}

async function showBackupValidationPreview(rawText) {
    const res = validateAndNormalizeBackup(rawText);
    const previewBox = document.getElementById('backup-preview-box');
    if (!res.ok) {
        pendingBackupPayload = null;
        if (previewBox) previewBox.style.display = 'none';
        await polaAlert(res.error, 'Cadangan Tidak Valid');
        return;
    }

    pendingBackupPayload = res.normalized;
    const d = res.normalized;
    const summaryEl = document.getElementById('backup-preview-summary');
    if (summaryEl) {
        summaryEl.innerHTML = `Cadangan valid ditemukan:<br>${d.nalaSemesters.length} Semester • ${d.nalaMatkul.length} Matkul • ${d.nalaTasks.length} Tugas/Acara • ${d.nalaRoutines.length} Rutinitas • ${d.nalaLibur.length} Libur`;
    }
    if (previewBox) previewBox.style.display = 'block';
}

async function executeBackupImport() {
    if (!pendingBackupPayload) {
        await polaAlert('Pilih file .json atau tempel kode cadangan yang valid terlebih dahulu.');
        return;
    }

    const modeEl = document.querySelector('input[name="backup-import-mode"]:checked');
    const mode = modeEl ? modeEl.value : 'replace';
    const incoming = pendingBackupPayload;

    if (mode === 'replace') {
        const ok = await polaConfirm('Seluruh data saat ini akan diganti dengan isi cadangan. Lanjutkan?', 'Timpa Data', 'Ya, Pulihkan');
        if (!ok) return;

        localStorage.setItem('nalaSemesters', JSON.stringify(incoming.nalaSemesters));
        localStorage.setItem('nalaActiveSemesterId', incoming.nalaActiveSemesterId);
        localStorage.setItem('nalaMatkul', JSON.stringify(incoming.nalaMatkul));
        localStorage.setItem('nalaOverrides', JSON.stringify(incoming.nalaOverrides));
        localStorage.setItem('nalaTasks', JSON.stringify(incoming.nalaTasks));
        localStorage.setItem('nalaRoutines', JSON.stringify(incoming.nalaRoutines));
        localStorage.setItem('nalaLibur', JSON.stringify(incoming.nalaLibur));
        localStorage.setItem('nalaDismissed', JSON.stringify(incoming.nalaDismissed));
        if (incoming.nalaUserLocation) {
            localStorage.setItem('nalaUserLocation', JSON.stringify(incoming.nalaUserLocation));
        }
        if (incoming.nalaSalatSoundConfig) {
            localStorage.setItem('nalaSalatSoundConfig', JSON.stringify(incoming.nalaSalatSoundConfig));
        }
    } else {
        const curSem = ensureSemesterInitialized().semesters;
        const semIdMap = {};
        incoming.nalaSemesters.forEach((s, idx) => {
            const sameName = curSem.find((cs) => cs.name.trim().toLowerCase() === s.name.trim().toLowerCase());
            if (sameName) {
                semIdMap[s.id] = sameName.id;
            } else {
                const newSemId = curSem.some((cs) => cs.id === s.id) ? `sem_${Date.now()}_${idx}` : s.id;
                semIdMap[s.id] = newSemId;
                curSem.push({ ...s, id: newSemId });
            }
        });
        localStorage.setItem('nalaSemesters', JSON.stringify(curSem));

        const mergeById = (existingArr, incomingArr, mapper = (x) => x) => {
            const seen = new Set(existingArr.map((item) => String(item.id)));
            const merged = [...existingArr];
            incomingArr.forEach((rawItem, idx) => {
                const item = mapper(rawItem);
                if (!seen.has(String(item.id))) {
                    seen.add(String(item.id));
                    merged.push(item);
                } else {
                    const newId = Date.now() + idx + Math.floor(Math.random() * 1000);
                    seen.add(String(newId));
                    merged.push({ ...item, id: newId });
                }
            });
            return merged;
        };

        const curMatkul = JSON.parse(localStorage.getItem('nalaMatkul')) || [];
        const mergedMatkul = mergeById(curMatkul, incoming.nalaMatkul, (m) => ({
            ...m,
            semesterId: semIdMap[m.semesterId] || getActiveSemesterId()
        }));
        localStorage.setItem('nalaMatkul', JSON.stringify(mergedMatkul));

        const curTasks = JSON.parse(localStorage.getItem('nalaTasks')) || [];
        localStorage.setItem('nalaTasks', JSON.stringify(mergeById(curTasks, incoming.nalaTasks)));

        const curRoutines = JSON.parse(localStorage.getItem('nalaRoutines')) || [];
        localStorage.setItem('nalaRoutines', JSON.stringify(mergeById(curRoutines, incoming.nalaRoutines)));

        const curLibur = JSON.parse(localStorage.getItem('nalaLibur')) || [];
        localStorage.setItem('nalaLibur', JSON.stringify(mergeById(curLibur, incoming.nalaLibur)));

        const curOverrides = JSON.parse(localStorage.getItem('nalaOverrides')) || [];
        localStorage.setItem('nalaOverrides', JSON.stringify([...curOverrides, ...incoming.nalaOverrides]));

        const curDismissed = JSON.parse(localStorage.getItem('nalaDismissed')) || [];
        localStorage.setItem('nalaDismissed', JSON.stringify([...new Set([...curDismissed, ...incoming.nalaDismissed])]));
    }

    pendingBackupPayload = null;
    closeModal('backup-modal');
    updateLocationPillUI(null, false);
    refreshAllViews();
    if (typeof syncAndroidAlarms === 'function') syncAndroidAlarms();

    await polaAlert('Seluruh jadwal dan pengaturan berhasil dipulihkan!', 'Pemulihan Selesai');
}

function getFabContainer() {
    const fab = document.querySelector('.fab');
    return document.querySelector('.fab-container') || fab;
}

function hideFabForModal() {
    closeFabMenu();
    const target = getFabContainer();
    if (target) target.classList.add('fab-modal-hidden');
}

function showFabAfterModal() {
    const leftDrawer = document.getElementById('side-drawer');
    const rightDrawer = document.getElementById('right-semester-drawer');
    if (leftDrawer && leftDrawer.classList.contains('open')) return;
    if (rightDrawer && rightDrawer.classList.contains('open')) return;
    const target = getFabContainer();
    if (target) {
        target.classList.remove('fab-modal-hidden');
        target.classList.remove('fab-scroll-hidden');
    }
}

// --- EFEK BLUR PROGRESIF SAAT GESER ---
function getOrCreateDrawerBlurBackdrop() {
    let backdrop = document.getElementById('drawer-blur-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'drawer-blur-backdrop';
        backdrop.className = 'drawer-blur-backdrop';
        document.body.appendChild(backdrop);
    }
    return backdrop;
}

function setDrawerBlurProgress(progress) {
    const backdrop = getOrCreateDrawerBlurBackdrop();
    const clamped = Math.max(0, Math.min(1, progress));
    if (clamped <= 0) {
        backdrop.style.transition = '';
        backdrop.style.visibility = '';
        backdrop.style.backgroundColor = '';
        backdrop.style.backdropFilter = '';
        backdrop.style.webkitBackdropFilter = '';
        backdrop.classList.remove('show');
    } else {
        backdrop.style.visibility = 'visible';
        const blurPx = (clamped * 12).toFixed(1);
        const alpha = (clamped * 0.28).toFixed(3);
        backdrop.style.backgroundColor = `rgba(45, 42, 38, ${alpha})`;
        backdrop.style.backdropFilter = `blur(${blurPx}px)`;
        backdrop.style.webkitBackdropFilter = `blur(${blurPx}px)`;
    }
}

function finalizeDrawerBlur(isOpen) {
    const backdrop = getOrCreateDrawerBlurBackdrop();
    backdrop.style.transition = '';
    backdrop.style.visibility = '';
    backdrop.style.backgroundColor = '';
    backdrop.style.backdropFilter = '';
    backdrop.style.webkitBackdropFilter = '';
    backdrop.classList.toggle('show', isOpen);
}

// --- HALAMAN GESER KIRI FULL-SCREEN (BERANDA) ---
function openSideDrawer() {
    const drawer = document.getElementById('side-drawer');
    if (!drawer) return;
    drawer.style.transition = '';
    drawer.style.transform = '';
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    finalizeDrawerBlur(true);
    hideFabForModal();
    renderSideDrawerContent();
}

function closeSideDrawer() {
    const drawer = document.getElementById('side-drawer');
    if (!drawer) return;
    drawer.style.transition = '';
    drawer.style.transform = '';
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    finalizeDrawerBlur(false);
    const insertModal = document.getElementById('insert-modal');
    const backupModal = document.getElementById('backup-modal');
    const soundModal = document.getElementById('salat-sound-modal');
    if (
        (!insertModal || insertModal.style.display !== 'flex') &&
        (!backupModal || backupModal.style.display !== 'flex') &&
        (!soundModal || soundModal.style.display !== 'flex')
    ) {
        showFabAfterModal();
    }
}

function switchDrawerTab(tabName) {
    currentDrawerTab = tabName;
    ['Rutinitas', 'Acara', 'Libur'].forEach((t) => {
        const btn = document.getElementById(`dopt-${t.toLowerCase()}`);
        if (btn) btn.classList.toggle('active', t === tabName);
    });
    renderSideDrawerContent();
    const scrollArea = document.getElementById('drawer-scroll-area');
    if (scrollArea) scrollArea.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateDrawerOptionCounts() {
    const routines = JSON.parse(localStorage.getItem('nalaRoutines')) || [];
    const acaras = (JSON.parse(localStorage.getItem('nalaTasks')) || []).filter((t) => t.category === 'Acara');
    const libur = JSON.parse(localStorage.getItem('nalaLibur')) || [];

    if (document.getElementById('dcount-rutinitas')) document.getElementById('dcount-rutinitas').innerText = routines.length;
    if (document.getElementById('dcount-acara')) document.getElementById('dcount-acara').innerText = acaras.length;
    if (document.getElementById('dcount-libur')) document.getElementById('dcount-libur').innerText = libur.length;
}

function buildDrawerBackupFooterHtml() {
    return `
        <div class="drawer-bottom-menu">
            <span class="drawer-menu-heading">Cadangan Data</span>
            <button type="button" class="drawer-option-btn primary-action" onclick="openBackupModal()">${iBkp} Ekspor / Impor JSON</button>
        </div>
    `;
}

function renderSideDrawerContent() {
    const container = document.getElementById('drawer-content-list');
    const labelEl = document.getElementById('drawer-section-label');
    if (!container) return;

    updateDrawerOptionCounts();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (currentDrawerTab === 'Rutinitas') {
        if (labelEl) labelEl.innerText = 'Rutinitas';
        const routines = JSON.parse(localStorage.getItem('nalaRoutines')) || [];
        if (routines.length === 0) {
            container.innerHTML = '<p style="color:var(--text-muted); font-size:14px; text-align:center; margin:28px 0;">Belum ada rutinitas.</p>' + buildDrawerBackupFooterHtml();
            return;
        }
        let html = '<div class="drawer-sub-heading">Jadwal Rutin Aktif</div>';
        routines.forEach((r) => {
            html += `
                <div class="card" onclick="toggleDetail(this)">
                    <div class="card-header" style="background-color: ${r.color || 'var(--color-rutin)'};">
                        <div class="card-header-top">
                            <div class="card-title-group">
                                <div>
                                    <h3>${r.name}</h3>
                                    <small class="time-badge">${iClk} ${r.time} • ${r.days.length === 7 ? 'Setiap Hari' : r.days.join(', ')}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-detail">
                        <p>${r.desc || 'Rutinitas Mingguan'}</p>
                        <div class="card-actions three-btns">
                            <button class="icon-btn delete" onclick="event.stopPropagation(); deleteRoutine(${r.id})">${iDel} Hapus</button>
                            <div><button class="icon-btn" onclick="event.stopPropagation(); closeSideDrawer(); openEditRoutine(${r.id})">${iEdt} Edit</button></div>
                        </div>
                    </div>
                </div>`;
        });
        container.innerHTML = html + buildDrawerBackupFooterHtml();
    } else if (currentDrawerTab === 'Acara') {
        if (labelEl) labelEl.innerText = 'Acara';
        const tasks = JSON.parse(localStorage.getItem('nalaTasks')) || [];
        const acaras = tasks.filter((t) => t.category === 'Acara');

        const upcomingAcaras = [];
        const pastAcaras = [];

        acaras.forEach((t) => {
            const endStr = t.endDate || t.date;
            const endDateObj = new Date(endStr);
            endDateObj.setHours(0, 0, 0, 0);
            if (endDateObj < today) pastAcaras.push(t);
            else upcomingAcaras.push(t);
        });

        upcomingAcaras.sort((a, b) => a.date.localeCompare(b.date));
        pastAcaras.sort((a, b) => b.date.localeCompare(a.date));

        if (acaras.length === 0) {
            container.innerHTML = '<p style="color:var(--text-muted); font-size:14px; text-align:center; margin:28px 0;">Belum ada acara.</p>' + buildDrawerBackupFooterHtml();
            return;
        }

        const buildAcaraCard = (t, isPast) => {
            const dateText = t.endDate && t.endDate !== t.date ? `${formatShortDate(t.date)} s/d ${formatShortDate(t.endDate)}` : formatShortDate(t.date);
            const opacityStyle = isPast ? 'opacity: 0.72;' : '';
            const badgeHtml = isPast ? '<span class="tag-pill">Terlewat</span>' : '';
            return `
                <div class="card" onclick="toggleDetail(this)" style="${opacityStyle}">
                    <div class="card-header" style="background-color: ${t.color || 'var(--color-acara)'};">
                        <div class="card-header-top">
                            <div class="card-title-group">
                                <div>
                                    <h3>${t.name}</h3>
                                    <small class="time-badge">${iDat} ${dateText}   ${iClk} ${t.time}${t.endTime ? ' - ' + t.endTime : ''}</small>
                                </div>
                            </div>
                            ${badgeHtml}
                        </div>
                    </div>
                    <div class="card-detail">
                        <p>${t.deskripsi || 'Tidak ada deskripsi.'}</p>
                        ${t.ruang ? `<div style="margin-top:10px; padding-top:10px; border-top:1px dashed var(--border-line); font-size:12px;"><span>Tempat:</span> <strong>${t.ruang}</strong></div>` : ''}
                        <div class="card-actions three-btns">
                            <button class="icon-btn delete" onclick="event.stopPropagation(); deleteTask(${t.id})">${iDel} Hapus</button>
                            <div><button class="icon-btn" onclick="event.stopPropagation(); closeSideDrawer(); openEditTask(${t.id}, 'Acara')">${iEdt} Edit</button></div>
                        </div>
                    </div>
                </div>`;
        };

        let html = '<div class="drawer-sub-heading">Akan Datang & Berlangsung</div>';
        if (upcomingAcaras.length === 0) {
            html += '<p style="color:var(--text-muted); font-size:13px; margin-bottom:14px;">Tidak ada acara mendatang.</p>';
        } else {
            upcomingAcaras.forEach((t) => { html += buildAcaraCard(t, false); });
        }

        html += '<div class="drawer-sub-heading">Sudah Terlewat</div>';
        if (pastAcaras.length === 0) {
            html += '<p style="color:var(--text-muted); font-size:13px;">Belum ada acara yang terlewat.</p>';
        } else {
            pastAcaras.forEach((t) => { html += buildAcaraCard(t, true); });
        }

        container.innerHTML = html + buildDrawerBackupFooterHtml();
    } else if (currentDrawerTab === 'Libur') {
        if (labelEl) labelEl.innerText = 'Hari Libur';
        const libur = JSON.parse(localStorage.getItem('nalaLibur')) || [];

        if (libur.length === 0) {
            container.innerHTML = '<p style="color:var(--text-muted); font-size:14px; text-align:center; margin:28px 0;">Belum ada jadwal hari libur pribadi.</p>' + buildDrawerBackupFooterHtml();
            return;
        }

        const upcomingLibur = [];
        const pastLibur = [];

        libur.forEach((l) => {
            const endStr = l.endDate || l.startDate;
            const endDateObj = new Date(endStr);
            endDateObj.setHours(0, 0, 0, 0);
            if (endDateObj < today) pastLibur.push(l);
            else upcomingLibur.push(l);
        });

        upcomingLibur.sort((a, b) => a.startDate.localeCompare(b.startDate));
        pastLibur.sort((a, b) => b.startDate.localeCompare(a.startDate));

        const buildLiburCard = (l, isPast) => {
            const dateText = l.startDate === l.endDate ? formatShortDate(l.startDate) : `${formatShortDate(l.startDate)} s/d ${formatShortDate(l.endDate)}`;
            const opacityStyle = isPast ? 'opacity: 0.72;' : '';
            const badgeHtml = isPast ? '<span class="tag-pill">Terlewat</span>' : '';
            return `
                <div class="card" onclick="toggleDetail(this)" style="${opacityStyle}">
                    <div class="card-header" style="background-color: var(--color-minggu);">
                        <div class="card-header-top">
                            <div class="card-title-group">
                                <div>
                                    <h3>${l.name}</h3>
                                    <small class="time-badge">${iDat} ${dateText}</small>
                                </div>
                            </div>
                            ${badgeHtml}
                        </div>
                    </div>
                    <div class="card-detail">
                        <p>Libur Kampus / Pribadi</p>
                        <div class="card-actions three-btns">
                            <button class="icon-btn delete" onclick="event.stopPropagation(); deleteLibur(${l.id})">${iDel} Hapus</button>
                            <div><button class="icon-btn" onclick="event.stopPropagation(); closeSideDrawer(); openEditLibur(${l.id})">${iEdt} Edit</button></div>
                        </div>
                    </div>
                </div>`;
        };

        let html = '<div class="drawer-sub-heading">Akan Datang & Berlangsung</div>';
        if (upcomingLibur.length === 0) {
            html += '<p style="color:var(--text-muted); font-size:13px; margin-bottom:14px;">Tidak ada jadwal hari libur mendatang.</p>';
        } else {
            upcomingLibur.forEach((l) => { html += buildLiburCard(l, false); });
        }

        html += '<div class="drawer-sub-heading">Sudah Terlewat</div>';
        if (pastLibur.length === 0) {
            html += '<p style="color:var(--text-muted); font-size:13px;">Belum ada jadwal hari libur yang terlewat.</p>';
        } else {
            pastLibur.forEach((l) => { html += buildLiburCard(l, true); });
        }

        container.innerHTML = html + buildDrawerBackupFooterHtml();
    }
}

function initSideDrawerGestures() {
    const drawer = document.getElementById('side-drawer');
    if (!drawer) return;

    const backdrop = getOrCreateDrawerBlurBackdrop();
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let gestureDecided = false;
    let isDragging = false;
    let startedOpen = false;

    document.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        const insertModal = document.getElementById('insert-modal');
        const backupModal = document.getElementById('backup-modal');
        const soundModal = document.getElementById('salat-sound-modal');
        if (
            (insertModal && insertModal.style.display === 'flex') ||
            (backupModal && backupModal.style.display === 'flex') ||
            (soundModal && soundModal.style.display === 'flex')
        ) return;

        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        currentX = startX;
        gestureDecided = false;
        isDragging = false;
        startedOpen = drawer.classList.contains('open');
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (e.touches.length !== 1) return;
        const insertModal = document.getElementById('insert-modal');
        const backupModal = document.getElementById('backup-modal');
        const soundModal = document.getElementById('salat-sound-modal');
        if (
            (insertModal && insertModal.style.display === 'flex') ||
            (backupModal && backupModal.style.display === 'flex') ||
            (soundModal && soundModal.style.display === 'flex')
        ) return;

        currentX = e.touches[0].clientX;
        const dx = currentX - startX;
        const dy = e.touches[0].clientY - startY;

        if (!gestureDecided) {
            if (Math.abs(dx) < 14 && Math.abs(dy) < 14) return;
            gestureDecided = true;
            if (Math.abs(dx) > Math.abs(dy) * 1.35) {
                if (!startedOpen && dx > 0) isDragging = true;
                if (startedOpen && dx < 0) isDragging = true;
            }
            if (isDragging) {
                drawer.style.transition = 'none';
                drawer.style.visibility = 'visible';
                backdrop.style.transition = 'none';
                if (!startedOpen) renderSideDrawerContent();
            }
        }

        if (!isDragging) return;
        const drawerWidth = drawer.offsetWidth || window.innerWidth;
        let progress = startedOpen ? 1 + dx / drawerWidth : dx / drawerWidth;
        progress = Math.max(0, Math.min(1, progress));

        drawer.style.transform = `translate(${-150 + progress * 100}%, 0)`;
        setDrawerBlurProgress(progress);
    }, { passive: true });

    document.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        const dx = currentX - startX;
        const drawerWidth = drawer.offsetWidth || window.innerWidth;
        const threshold = drawerWidth * 0.25;

        if (!startedOpen) {
            if (dx > threshold) openSideDrawer();
            else closeSideDrawer();
        } else {
            if (dx < -threshold) closeSideDrawer();
            else openSideDrawer();
        }
    });
}

// --- HALAMAN GESER KANAN FULL-SCREEN (SEMESTER MATKUL) ---
function setupMatkulSemesterUI() {
    const matkulListEl = document.getElementById('matkul-list');
    if (!matkulListEl) return;

    ensureSemesterInitialized();
    getOrCreateDrawerBlurBackdrop();

    const headerEl = document.querySelector('header');
    if (headerEl) {
        const pEl = headerEl.querySelector('p');
        if (pEl) pEl.id = 'active-semester-subtitle';
    }

    if (!document.getElementById('right-semester-drawer')) {
        const aside = document.createElement('aside');
        aside.id = 'right-semester-drawer';
        aside.className = 'right-drawer';
        aside.setAttribute('aria-hidden', 'true');
        aside.innerHTML = `
            <div class="drawer-header">
                <h2 class="brand-title">Pola<span class="brand-dot">.</span></h2>
                <p class="drawer-subtitle">Jadwal Semester</p>
            </div>
            <div class="drawer-scroll-area">
                <div class="drawer-sub-heading">Daftar Semester</div>
                <div id="semester-list-container"></div>
                <div class="drawer-bottom-menu">
                    <span class="drawer-menu-heading">Tambah</span>
                    <button class="drawer-option-btn primary-action" onclick="openNewSemesterModal()">+ Tambah Semester Baru</button>
                </div>
            </div>
        `;
        document.body.appendChild(aside);
    }

    if (!document.getElementById('semester-form-modal')) {
        const modal = document.createElement('div');
        modal.id = 'semester-form-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal">
                <h2 id="sem-modal-title">Semester Baru</h2>
                <form id="semester-form" onsubmit="event.preventDefault(); saveSemesterForm();">
                    <label>Nama Semester *</label>
                    <input type="text" id="sem-name-input" placeholder="Contoh: Semester 4">
                    <div id="sem-copy-wrapper">
                        <label>Isi Awal Jadwal</label>
                        <select id="sem-copy-select">
                            <option value="empty">Mulai kosong</option>
                            <option value="copy">Salin dari semester aktif saat ini</option>
                        </select>
                    </div>
                </form>
                <div class="modal-btns">
                    <button class="btn-cancel" onclick="closeModal('semester-form-modal')">Batal</button>
                    <button class="btn-save" onclick="saveSemesterForm()">Simpan</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    initRightDrawerGestures();
}

function openRightSemesterDrawer() {
    const drawer = document.getElementById('right-semester-drawer');
    if (!drawer) return;
    drawer.style.transition = '';
    drawer.style.transform = '';
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    finalizeDrawerBlur(true);
    hideFabForModal();
    renderSemesterDrawerList();
}

function closeRightSemesterDrawer() {
    const drawer = document.getElementById('right-semester-drawer');
    if (!drawer) return;
    drawer.style.transition = '';
    drawer.style.transform = '';
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    finalizeDrawerBlur(false);
    const matkulModal = document.getElementById('matkul-modal');
    if (!matkulModal || matkulModal.style.display !== 'flex') {
        showFabAfterModal();
    }
}

function renderSemesterDrawerList() {
    const container = document.getElementById('semester-list-container');
    if (!container) return;

    const { semesters, activeId } = ensureSemesterInitialized();
    const allMatkul = JSON.parse(localStorage.getItem('nalaMatkul')) || [];

    let html = '';
    semesters.forEach((sem) => {
        const isActive = sem.id === activeId;
        const count = allMatkul.filter((m) => m.semesterId === sem.id).length;
        html += `
            <div class="semester-card ${isActive ? 'active-sem' : ''}" onclick="selectSemesterFromDrawer('${sem.id}')">
                <div class="semester-card-top">
                    <div>
                        <div class="semester-card-title">${sem.name}</div>
                        <div class="semester-card-meta">${count} Mata Kuliah</div>
                    </div>
                    ${isActive ? '<span class="semester-badge-active">Aktif</span>' : ''}
                </div>
                <div class="semester-card-actions">
                    ${semesters.length > 1 ? `<button class="icon-btn delete" onclick="event.stopPropagation(); deleteSemesterItem('${sem.id}')">${iDel} Hapus</button>` : ''}
                    <button class="icon-btn" onclick="event.stopPropagation(); openEditSemesterModal('${sem.id}')">${iEdt} Ubah Nama</button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function selectSemesterFromDrawer(semId) {
    setActiveSemester(semId);
    renderSemesterDrawerList();
    closeRightSemesterDrawer();
}

function openNewSemesterModal() {
    editSemesterId = null;
    document.getElementById('sem-modal-title').innerText = 'Semester Baru';
    document.getElementById('sem-name-input').value = '';
    document.getElementById('sem-copy-wrapper').style.display = 'block';
    document.getElementById('sem-copy-select').value = 'empty';
    document.getElementById('semester-form-modal').style.display = 'flex';
}

function openEditSemesterModal(semId) {
    const { semesters } = ensureSemesterInitialized();
    const target = semesters.find((s) => s.id === semId);
    if (!target) return;
    editSemesterId = semId;
    document.getElementById('sem-modal-title').innerText = 'Ubah Nama Semester';
    document.getElementById('sem-name-input').value = target.name;
    document.getElementById('sem-copy-wrapper').style.display = 'none';
    document.getElementById('semester-form-modal').style.display = 'flex';
}

async function saveSemesterForm() {
    const nameInput = document.getElementById('sem-name-input');
    const name = nameInput ? nameInput.value.trim() : '';
    if (!name) {
        await polaAlert('Nama semester wajib diisi.');
        return;
    }

    const { semesters, activeId } = ensureSemesterInitialized();

    if (editSemesterId) {
        const idx = semesters.findIndex((s) => s.id === editSemesterId);
        if (idx !== -1) semesters[idx].name = name;
        localStorage.setItem('nalaSemesters', JSON.stringify(semesters));
    } else {
        const newId = 'sem_' + Date.now();
        semesters.push({ id: newId, name, createdAt: Date.now() });
        localStorage.setItem('nalaSemesters', JSON.stringify(semesters));

        const copyMode = document.getElementById('sem-copy-select').value;
        if (copyMode === 'copy') {
            const allMatkul = JSON.parse(localStorage.getItem('nalaMatkul')) || [];
            const activeCourses = allMatkul.filter((m) => m.semesterId === activeId);
            activeCourses.forEach((m, index) => {
                allMatkul.push({ ...m, id: Date.now() + index + 1, semesterId: newId });
            });
            localStorage.setItem('nalaMatkul', JSON.stringify(allMatkul));
        }

        localStorage.setItem('nalaActiveSemesterId', newId);
    }

    closeModal('semester-form-modal');
    renderSemesterDrawerList();
    refreshAllViews();
}

async function deleteSemesterItem(semId) {
    const { semesters, activeId } = ensureSemesterInitialized();
    if (semesters.length <= 1) {
        await polaAlert('Minimal harus ada satu semester.');
        return;
    }

    const ok = await polaConfirm('Hapus semester ini beserta seluruh mata kuliah di dalamnya?', 'Hapus Semester', 'Hapus');
    if (!ok) return;

    const remaining = semesters.filter((s) => s.id !== semId);
    localStorage.setItem('nalaSemesters', JSON.stringify(remaining));

    let allMatkul = JSON.parse(localStorage.getItem('nalaMatkul')) || [];
    allMatkul = allMatkul.filter((m) => m.semesterId !== semId);
    localStorage.setItem('nalaMatkul', JSON.stringify(allMatkul));

    if (activeId === semId) {
        localStorage.setItem('nalaActiveSemesterId', remaining[0].id);
    }

    renderSemesterDrawerList();
    refreshAllViews();
}

function initRightDrawerGestures() {
    const drawer = document.getElementById('right-semester-drawer');
    if (!drawer) return;

    const backdrop = getOrCreateDrawerBlurBackdrop();
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let gestureDecided = false;
    let isDragging = false;
    let startedOpen = false;

    document.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        const matkulModal = document.getElementById('matkul-modal');
        const semModal = document.getElementById('semester-form-modal');
        if ((matkulModal && matkulModal.style.display === 'flex') || (semModal && semModal.style.display === 'flex')) return;

        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        currentX = startX;
        gestureDecided = false;
        isDragging = false;
        startedOpen = drawer.classList.contains('open');
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (e.touches.length !== 1) return;
        const matkulModal = document.getElementById('matkul-modal');
        const semModal = document.getElementById('semester-form-modal');
        if ((matkulModal && matkulModal.style.display === 'flex') || (semModal && semModal.style.display === 'flex')) return;

        currentX = e.touches[0].clientX;
        const dx = currentX - startX;
        const dy = e.touches[0].clientY - startY;

        if (!gestureDecided) {
            if (Math.abs(dx) < 14 && Math.abs(dy) < 14) return;
            gestureDecided = true;
            if (Math.abs(dx) > Math.abs(dy) * 1.35) {
                if (!startedOpen && dx < 0) isDragging = true;
                if (startedOpen && dx > 0) isDragging = true;
            }
            if (isDragging) {
                drawer.style.transition = 'none';
                drawer.style.visibility = 'visible';
                backdrop.style.transition = 'none';
                if (!startedOpen) renderSemesterDrawerList();
            }
        }

        if (!isDragging) return;
        const drawerWidth = drawer.offsetWidth || window.innerWidth;
        let progress = startedOpen ? 1 - dx / drawerWidth : -dx / drawerWidth;
        progress = Math.max(0, Math.min(1, progress));

        drawer.style.transform = `translate(${50 - progress * 100}%, 0)`;
        setDrawerBlurProgress(progress);
    }, { passive: true });

    document.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        const dx = currentX - startX;
        const drawerWidth = drawer.offsetWidth || window.innerWidth;
        const threshold = drawerWidth * 0.25;

        if (!startedOpen) {
            if (dx < -threshold) openRightSemesterDrawer();
            else closeRightSemesterDrawer();
        } else {
            if (dx > threshold) closeRightSemesterDrawer();
            else openRightSemesterDrawer();
        }
    });
}

function getOrCreateFabBackdrop() {
    let backdrop = document.getElementById('fab-backdrop');
    const fabContainer = document.querySelector('.fab-container');
    if (!backdrop && fabContainer) {
        backdrop = document.createElement('div');
        backdrop.id = 'fab-backdrop';
        backdrop.className = 'fab-backdrop';
        backdrop.onclick = closeFabMenu;
        fabContainer.parentNode.insertBefore(backdrop, fabContainer);
    }
    return backdrop;
}

function toggleFabMenu() {
    const menu = document.getElementById('fab-menu');
    const fab = document.querySelector('.fab-container .fab');
    const backdrop = getOrCreateFabBackdrop();
    if (!menu) return;

    const isOpen = menu.classList.toggle('show');
    if (fab) fab.classList.toggle('active', isOpen);
    if (backdrop) backdrop.classList.toggle('show', isOpen);
}

function closeFabMenu() {
    const menu = document.getElementById('fab-menu');
    const fab = document.querySelector('.fab-container .fab');
    const backdrop = document.getElementById('fab-backdrop');
    if (menu) menu.classList.remove('show');
    if (fab) fab.classList.remove('active');
    if (backdrop) backdrop.classList.remove('show');
}

function initFabScrollBehavior() {
    let lastScrollY = window.scrollY || 0;
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY || 0;
        const target = getFabContainer();
        const menu = document.getElementById('fab-menu');
        if (!target) return;

        if ((menu && menu.classList.contains('show')) || target.classList.contains('fab-modal-hidden')) {
            lastScrollY = currentScrollY;
            return;
        }

        const diff = currentScrollY - lastScrollY;
        if (diff > 6 && currentScrollY > 40) {
            target.classList.add('fab-scroll-hidden');
        } else if (diff < -6 || currentScrollY <= 20) {
            target.classList.remove('fab-scroll-hidden');
        }
        lastScrollY = currentScrollY;
    }, { passive: true });
}

function ensureReminderFieldsInjected() {
    const insertForm = document.getElementById('insert-form');
    if (insertForm && !document.getElementById('field-reminder')) {
        const div = document.createElement('div');
        div.id = 'field-reminder';
        div.innerHTML = `
            <label>Pengingat Tambahan (Opsional)</label>
            <div class="reminder-row">
                <input type="number" id="custom-remind-val" min="1" placeholder="Contoh: 30">
                <select id="custom-remind-unit">
                    <option value="minutes">Menit sebelum</option>
                    <option value="hours">Jam sebelum</option>
                </select>
            </div>
            <small class="field-hint">Alarm 5 menit sebelum & tepat waktu tetap aktif otomatis.</small>
        `;
        const descField = document.getElementById('field-desc');
        if (descField) insertForm.insertBefore(div, descField);
        else insertForm.appendChild(div);
    }

    const matkulForm = document.getElementById('matkul-form');
    if (matkulForm && !document.getElementById('field-matkul-reminder')) {
        const div = document.createElement('div');
        div.id = 'field-matkul-reminder';
        div.innerHTML = `
            <label>Pengingat Tambahan (Opsional)</label>
            <div class="reminder-row">
                <input type="number" id="m-remind-val" min="1" placeholder="Contoh: 30">
                <select id="m-remind-unit">
                    <option value="minutes">Menit sebelum</option>
                    <option value="hours">Jam sebelum</option>
                </select>
            </div>
            <small class="field-hint">Alarm 5 menit sebelum & tepat waktu tetap aktif otomatis.</small>
        `;
        matkulForm.appendChild(div);
    }
}

function syncRoutineSelectAllState() {
    const allCb = document.getElementById('routine-days-all');
    const dayCbs = Array.from(document.querySelectorAll('input[name="routine-days"]'));
    if (allCb && dayCbs.length > 0) {
        allCb.checked = dayCbs.every(cb => cb.checked);
    }
}

function initRoutineSelectAll() {
    const group = document.querySelector('#field-rutinitas-hari .checkbox-group');
    if (!group) return;

    let allCb = document.getElementById('routine-days-all');
    if (!allCb) {
        const label = document.createElement('label');
        label.className = 'check-all-label';
        label.innerHTML = '<input type="checkbox" id="routine-days-all">Semua';
        group.insertBefore(label, group.firstChild);
        allCb = document.getElementById('routine-days-all');
    }

    const dayCbs = document.querySelectorAll('input[name="routine-days"]');
    allCb.addEventListener('change', function () {
        dayCbs.forEach(cb => { cb.checked = this.checked; });
    });

    dayCbs.forEach(cb => {
        cb.addEventListener('change', syncRoutineSelectAllState);
    });
}

function closeModal(id) {
    if (id === 'salat-sound-modal') stopSalatReminderSound();
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
    if (id !== 'semester-form-modal' && id !== 'backup-modal' && id !== 'salat-sound-modal') editId = null;
    showFabAfterModal();
}

function toggleDetail(element) { const detail = element.querySelector('.card-detail'); if(detail) detail.classList.toggle('show'); }
function formatShortDate(dateStr) {
    if(!dateStr) return ''; const parts = dateStr.split('-');
    if(parts.length !== 3) return dateStr; return `${parts[2]}-${parts[1]}-${parts[0].substring(2)}`;
}

// LOGIKA RENTANG TANGGAL UNTUK ACARA
function isDateInAcaraRange(dateStr, acara) {
    if (!acara.endDate || acara.date === acara.endDate) return dateStr === acara.date;
    let tDate = new Date(dateStr); tDate.setHours(0,0,0,0);
    let sDate = new Date(acara.date); sDate.setHours(0,0,0,0);
    let eDate = new Date(acara.endDate); eDate.setHours(0,0,0,0);
    return (tDate >= sDate && tDate <= eDate);
}

function updateSwatchSelection(colorVal) {
    if(!document.getElementById('new-task-color')) return;
    document.getElementById('new-task-color').value = colorVal;
    document.querySelectorAll('.swatch').forEach(s => { s.classList.toggle('selected', s.dataset.color.toUpperCase() === colorVal.toUpperCase()); });
}

function toggleTaskDone(id) {
    let tasks = JSON.parse(localStorage.getItem('nalaTasks')) || []; let idx = tasks.findIndex(t => t.id == id);
    if(idx !== -1) { tasks[idx].status = tasks[idx].status === 'done' ? 'pending' : 'done'; localStorage.setItem('nalaTasks', JSON.stringify(tasks)); refreshAllViews(); }
}
function toggleDismiss(type, id, dateStr) {
    if(type === 'tugas' || type === 'acara') { toggleTaskDone(id); return; }
    let dismissed = JSON.parse(localStorage.getItem('nalaDismissed')) || []; const key = `${type}_${id}_${dateStr}`;
    if(dismissed.includes(key)) dismissed = dismissed.filter(k => k !== key); else dismissed.push(key);
    localStorage.setItem('nalaDismissed', JSON.stringify(dismissed)); refreshAllViews();
}
function isDismissed(type, id, dateStr) { return (JSON.parse(localStorage.getItem('nalaDismissed')) || []).includes(`${type}_${id}_${dateStr}`); }

async function deleteTask(id) {
    const ok = await polaConfirm('Hapus jadwal ini dari daftar?', 'Hapus Jadwal', 'Hapus');
    if(!ok) return;
    let tasks = JSON.parse(localStorage.getItem('nalaTasks')) || []; tasks = tasks.filter(t => t.id != id);
    localStorage.setItem('nalaTasks', JSON.stringify(tasks)); refreshAllViews();
}
async function deleteRoutine(id) {
    const ok = await polaConfirm('Hapus rutinitas ini secara permanen?', 'Hapus Rutinitas', 'Hapus');
    if(!ok) return;
    let routines = JSON.parse(localStorage.getItem('nalaRoutines')) || []; routines = routines.filter(r => r.id != id);
    localStorage.setItem('nalaRoutines', JSON.stringify(routines)); refreshAllViews();
}
async function deleteLibur(id) {
    const ok = await polaConfirm('Hapus jadwal libur ini?', 'Hapus Libur', 'Hapus');
    if(!ok) return;
    let libur = JSON.parse(localStorage.getItem('nalaLibur')) || []; libur = libur.filter(l => l.id != id);
    localStorage.setItem('nalaLibur', JSON.stringify(libur)); refreshAllViews();
}

function refreshAllViews() {
    if(document.getElementById('schedule-list')) loadTodaySchedule();
    if(document.getElementById('side-drawer')) renderSideDrawerContent();
    if(document.getElementById('calendar-grid')) { renderMonthCalendar(); renderUpcomingTasks(); renderHistory(currentHistoryTab); }
    if(document.getElementById('matkul-list')) renderMatkulList();
}

// --- BERANDA ---
function setupBerandaUtilityBar() {
    const scheduleListEl = document.getElementById('schedule-list');
    if (!scheduleListEl || document.getElementById('beranda-utility-bar')) return;

    const headerEl = document.querySelector('header');
    if (!headerEl) return;

    const bar = document.createElement('div');
    bar.id = 'beranda-utility-bar';
    bar.className = 'beranda-utility-bar';
    bar.innerHTML = `
        <button type="button" class="utility-pill" onclick="refreshUserCoordinates(true)" title="Perbarui lokasi jadwal salat">
            <span id="beranda-loc-icon">${iPin}</span>
            <span class="loc-text" id="beranda-loc-text">Memuat lokasi...</span>
        </button>
    `;
    headerEl.insertAdjacentElement('afterend', bar);
    updateLocationPillUI(null, false);
}

ensureSemesterInitialized();
cleanupOldCache();

if(document.getElementById('schedule-list')) {
    setupBerandaUtilityBar();
    ensureAutoHolidaysForYear(new Date().getFullYear());
    loadTodaySchedule();
    refreshUserCoordinates(false);
}

async function loadTodaySchedule() {
    const list = document.getElementById('schedule-list'); const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const todayDayName = namaHari[today.getDay()]; let combinedSchedule = [];
    
    let savedMatkul = getActiveMatkulList(); let overrides = JSON.parse(localStorage.getItem('nalaOverrides')) || [];
    let savedTasks = JSON.parse(localStorage.getItem('nalaTasks')) || []; let savedRoutines = JSON.parse(localStorage.getItem('nalaRoutines')) || [];

    let isHoliday = getHolidayInfo(todayStr);
    let todaysMatkul = savedMatkul.filter(m => m.hari === todayDayName);
    if(todayDayName === 'Minggu' || isHoliday) todaysMatkul = []; 
    
    todaysMatkul = todaysMatkul.filter(m => !overrides.some(o => o.matkulId === m.id && o.originalDate === todayStr));
    let movedIn = overrides.filter(o => o.newDate === todayStr).map(o => { let orig = savedMatkul.find(m => m.id === o.matkulId); return orig ? { ...orig, ...o, isOverride: true } : null; }).filter(x => x);
    [...todaysMatkul, ...movedIn].forEach(m => {
        let eTime = m.isOverride && m.newEndTime !== undefined ? m.newEndTime : (m.jamSelesai || '');
        combinedSchedule.push({ type: 'kuliah', id: m.id, name: `${m.name}`, badge: 'Kuliah', time: m.isOverride ? m.newTime : m.jamMulai, endTime: eTime, color: 'var(--color-kuliah)', ruang: m.isOverride ? m.newRuangan : m.ruangan, dosen: m.isOverride ? m.newDosen : m.dosen });
    });

    savedTasks.forEach(t => {
        let isToday = (t.category === 'Acara') ? isDateInAcaraRange(todayStr, t) : (t.date === todayStr);
        if(isToday) {
            let tCat = t.category.toLowerCase().includes('tugas') ? 'Tugas' : 'Acara';
            combinedSchedule.push({ type: tCat.toLowerCase(), id: t.id, name: t.name, badge: tCat, time: t.time, endTime: t.endTime || '', color: t.color || 'var(--color-acara)', desc: t.deskripsi || 'Tidak ada catatan.', via: t.pengumpulan, ruang: t.ruang || '', cat: t.category, status: t.status });
        }
    });

    savedRoutines.filter(r => r.days.includes(todayDayName)).forEach(r => {
        combinedSchedule.push({ type: 'rutin', id: r.id, name: r.name, badge: 'Rutinitas', time: r.time, endTime: '', color: r.color || 'var(--color-rutin)', desc: r.desc || 'Jadwal Rutinitas Mingguan' });
    });

    const salatList = await fetchSalatTimingsForDate(today, todayStr);
    salatList.forEach((s) => {
        combinedSchedule.push({ type: 'salat', id: s.name, name: s.name, badge: '', time: s.time, endTime: '', color: 'var(--color-salat)', desc: 'Waktu Salat' });
    });

    combinedSchedule.sort((a, b) => a.time.localeCompare(b.time));
    list.innerHTML = combinedSchedule.length ? '' : '<p style="text-align:center; color:var(--text-muted);">Semua jadwal hari ini sudah beres!</p>';
    
    const currentSound = getSalatSoundConfig();

    combinedSchedule.forEach(item => {
        let completed = (item.type === 'tugas' || item.type === 'acara') ? (item.status === 'done') : isDismissed(item.type, item.id, todayStr);
        let titleStyle = completed ? 'text-decoration: line-through; color: var(--state-dimmed);' : '';
        let btnIcon = completed ? iChkCir : iCir; let cardOpacity = completed ? 'opacity: 0.65;' : '';

        let detailHtml = '';
        if(item.type === 'kuliah') { 
            detailHtml = `<div class="detail-grid"><div class="detail-item">${iRom} <div><span>Ruangan</span>${item.ruang}</div></div><div class="detail-item">${iUsr} <div><span>Dosen</span>${item.dosen}</div></div></div>`; 
        } else if(item.type === 'tugas' || item.type === 'acara') { 
            let extraInfo = '';
            if(item.via) extraInfo += `<span>Via/Kumpul:</span> <strong>${item.via}</strong><br>`;
            if(item.ruang) extraInfo += `<span>Tempat:</span> <strong>${item.ruang}</strong><br>`;
            
            detailHtml = `<p style="line-height:1.5;">${item.desc}</p> ${extraInfo ? `<div style="margin-top:12px; padding-top:12px; border-top:1px dashed var(--border-line);">${extraInfo}</div>` : ''} 
            <div class="card-actions three-btns">
                <button class="icon-btn delete" onclick="event.stopPropagation(); deleteTask(${item.id})">${iDel} Hapus</button>
                <div><button class="icon-btn" onclick="event.stopPropagation(); openEditTask(${item.id}, '${item.cat}')">${iEdt} Edit</button></div>
            </div>`; 
        } else if(item.type === 'rutin') {
            detailHtml = `<p>${item.desc}</p>
            <div class="card-actions three-btns">
                <button class="icon-btn delete" onclick="event.stopPropagation(); deleteRoutine(${item.id})">${iDel} Hapus</button>
                <div><button class="icon-btn" onclick="event.stopPropagation(); openEditRoutine(${item.id})">${iEdt} Edit</button></div>
            </div>`;
        } else {
            detailHtml = `
                <p>${item.desc}</p>
                <div class="salat-sound-bar">
                    <div class="salat-sound-info">
                        <span>Suara Pengingat</span>
                        <strong class="salat-sound-label-text">${currentSound.name}</strong>
                    </div>
                    <div class="salat-sound-btns">
                        <button type="button" class="icon-btn btn-test-salat-sound" onclick="event.stopPropagation(); playSalatReminderSound(true)">${iVol} Tes</button>
                        <button type="button" class="icon-btn" onclick="event.stopPropagation(); openSalatSoundModal()">${iEdt} Suara</button>
                    </div>
                </div>
            `;
        }

        let badgeHtml = item.badge ? `<span class="tag-pill" style="${titleStyle}">${item.badge}</span>` : '';

        list.innerHTML += `
            <div class="card" onclick="toggleDetail(this)" style="${cardOpacity}">
                <div class="card-header" style="background-color: ${item.color};">
                    <div class="card-header-top">
                        <div class="card-title-group">
                            <button class="check-btn" onclick="event.stopPropagation(); toggleDismiss('${item.type}', '${item.id}', '${todayStr}')">${btnIcon}</button>
                            <div>
                                <h3 style="${titleStyle}">${item.name}</h3>
                                <small class="time-badge" style="${titleStyle}">${iClk} ${item.time} ${item.endTime ? '- '+item.endTime : ''}</small>
                            </div>
                        </div>
                        ${badgeHtml}
                    </div>
                </div>
                <div class="card-detail">${detailHtml}</div>
            </div>`;
    });
}

// --- KALENDER ---
function getOverdueTasks() {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return (JSON.parse(localStorage.getItem('nalaTasks')) || []).filter(t => {
        if (t.status === 'done') return false;
        if (t.category !== 'Tugas Kuliah' && t.category !== 'Tugas') return false;
        const taskDate = new Date(t.date); taskDate.setHours(0, 0, 0, 0);
        return taskDate < today;
    });
}

function updateOverdueTabLabel() {
    const tabTerlewat = document.getElementById('tab-terlewat');
    if (!tabTerlewat) return;
    const count = getOverdueTasks().length;
    tabTerlewat.innerText = count > 0 ? `Tugas Terlewat (${count})` : 'Tugas Terlewat';
}

function jumpToTodayMonth() {
    currentNavDate = new Date();
    renderMonthCalendar();
}

if(document.getElementById('calendar-grid')) {
    const historyHeading = document.querySelector('.history-container h2, .history-container h3');
    if (historyHeading && historyHeading.innerText.trim() === 'Riwayat Selesai') {
        historyHeading.innerText = 'Riwayat & Terlewat';
    }

    let tabsContainer = document.querySelector('.history-tabs');
    if (tabsContainer) {
        const oldSemua = document.getElementById('tab-semua');
        if (oldSemua) oldSemua.remove();
        if (!document.getElementById('tab-terlewat')) {
            const btnTerlewat = document.createElement('button');
            btnTerlewat.type = 'button';
            btnTerlewat.className = 'tab-btn';
            btnTerlewat.id = 'tab-terlewat';
            btnTerlewat.innerText = 'Tugas Terlewat';
            btnTerlewat.addEventListener('click', (e) => {
                e.stopPropagation();
                renderHistory('Terlewat');
            });
            tabsContainer.appendChild(btnTerlewat);
        }
    }

    renderMonthCalendar(); renderHistory('Tugas Kuliah'); renderUpcomingTasks();
    if(document.getElementById('native-month-picker')) {
        document.getElementById('native-month-picker').addEventListener('change', function(e) {
            if(e.target.value) { const p = e.target.value.split('-'); currentNavDate.setFullYear(parseInt(p[0]), parseInt(p[1]) - 1); renderMonthCalendar(); }
        });
    }
}

function renderMonthCalendar() {
    const grid = document.getElementById('calendar-grid'); if(!grid) return; grid.innerHTML = '';
    const year = currentNavDate.getFullYear(); const month = currentNavDate.getMonth();
    ensureAutoHolidaysForYear(year);
    
    const realToday = new Date();
    const realTodayStr = `${realToday.getFullYear()}-${String(realToday.getMonth()+1).padStart(2, '0')}-${String(realToday.getDate()).padStart(2, '0')}`;
    
    const monthDisplayEl = document.getElementById('month-display-text');
    const nativePickerEl = document.getElementById('native-month-picker');
    if(monthDisplayEl) {
        monthDisplayEl.innerText = currentNavDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
        if (nativePickerEl) {
            nativePickerEl.style.height = (monthDisplayEl.offsetHeight || 22) + 'px';
            nativePickerEl.style.bottom = 'auto';
        }
        const isDifferentMonth = year !== realToday.getFullYear() || month !== realToday.getMonth();
        let jumpBtn = document.getElementById('today-jump-pill');
        if (isDifferentMonth) {
            if (!jumpBtn) {
                jumpBtn = document.createElement('button');
                jumpBtn.id = 'today-jump-pill';
                jumpBtn.type = 'button';
                jumpBtn.className = 'today-jump-pill';
                jumpBtn.innerText = 'Hari Ini';
                jumpBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    jumpToTodayMonth();
                });
                monthDisplayEl.parentNode.appendChild(jumpBtn);
            }
            jumpBtn.style.display = 'inline-block';
        } else if (jumpBtn) {
            jumpBtn.style.display = 'none';
        }
    }
    if(nativePickerEl) nativePickerEl.value = `${year}-${String(month+1).padStart(2, '0')}`;
    
    ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].forEach(d => { grid.innerHTML += `<div class="day-name">${d}</div>`; });
    const firstDay = new Date(year, month, 1).getDay(); const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDays = new Date(year, month, 0).getDate();
    
    let savedTasks = JSON.parse(localStorage.getItem('nalaTasks')) || []; let savedMatkul = getActiveMatkulList(); let overrides = JSON.parse(localStorage.getItem('nalaOverrides')) || [];
    
    for(let i = firstDay - 1; i >= 0; i--) { grid.innerHTML += `<div class="day-cell dimmed" onclick="changeMonth(-1)"><span class="day-number">${prevDays - i}</span></div>`; }
    for(let i = 1; i <= daysInMonth; i++) {
        let currentLoopDate = `${year}-${String(month+1).padStart(2, '0')}-${String(i).padStart(2, '0')}`; let loopDayName = namaHari[new Date(year, month, i).getDay()];
        
        let dayColors = []; 
        let isHoliday = getHolidayInfo(currentLoopDate);
        let isOffDay = (loopDayName === 'Minggu') || isHoliday;
        
        let matkulsToday = savedMatkul.filter(m => m.hari === loopDayName); 
        if(isOffDay) matkulsToday = []; 
        
        matkulsToday = matkulsToday.filter(m => !overrides.some(o => o.matkulId === m.id && o.originalDate === currentLoopDate));
        let movedIn = overrides.filter(o => o.newDate === currentLoopDate && savedMatkul.some(m => m.id === o.matkulId));
        if(matkulsToday.length > 0 || movedIn.length > 0) dayColors.push('var(--color-kuliah)');
        
        savedTasks.forEach(t => {
            let isActive = (t.category === 'Acara') ? isDateInAcaraRange(currentLoopDate, t) : (t.date === currentLoopDate);
            if(isActive && t.status !== 'done') dayColors.push(t.color || 'var(--color-tugas)');
        });
        
        let uColors = [...new Set(dayColors)]; let pillStyle = '';
        if (uColors.length === 1) pillStyle = `background: ${uColors[0]};`;
        else if (uColors.length > 1) {
            let gradient = 'linear-gradient(to right, '; let step = 100 / uColors.length;
            uColors.forEach((c, idx) => { gradient += `${c} ${idx * step}%, ${c} ${(idx + 1) * step}%${idx < uColors.length - 1 ? ', ' : ''}`; });
            pillStyle = `background: ${gradient});`;
        }
        let pillHtml = uColors.length > 0 ? `<div class="event-pill-container"><div class="event-pill" style="${pillStyle}"></div></div>` : '';
        let numClass = isOffDay ? 'day-number sunday-red' : 'day-number';
        
        let todayClass = (currentLoopDate === realTodayStr) ? ' today-highlight' : '';
        
        grid.innerHTML += `<div class="day-cell${todayClass}" onclick="showDayDetails('${currentLoopDate}', '${loopDayName}')"><span class="${numClass}">${i}</span>${pillHtml}</div>`;
    }
    const totalCells = firstDay + daysInMonth; const nextDays = (totalCells % 7 === 0) ? 0 : 7 - (totalCells % 7);
    for(let i = 1; i <= nextDays; i++) { grid.innerHTML += `<div class="day-cell dimmed" onclick="changeMonth(1)"><span class="day-number">${i}</span></div>`; }
}

function renderUpcomingTasks() {
    const list = document.getElementById('upcoming-list'); if(!list) return; list.innerHTML = '';
    const today = new Date(); today.setHours(0,0,0,0);

    let pendingTasks = (JSON.parse(localStorage.getItem('nalaTasks')) || []).filter(t => {
        if (t.status === 'done' || (t.category !== 'Tugas Kuliah' && t.category !== 'Tugas')) return false;
        let taskDate = new Date(t.date); taskDate.setHours(0,0,0,0);
        return taskDate >= today;
    });

    if(pendingTasks.length === 0) { list.innerHTML = '<p style="color:var(--text-muted); font-size:14px;">Semua tugas aktif sudah beres.</p>'; return; }

    pendingTasks.sort((a,b) => new Date(a.date) - new Date(b.date)).forEach(t => {
        let taskDate = new Date(t.date); taskDate.setHours(0,0,0,0);
        let diffDays = Math.ceil((taskDate - today) / (1000 * 60 * 60 * 24));
        let badgeClass = 'countdown-badge'; let badgeText = diffDays === 0 ? 'Hari Ini!' : diffDays === 1 ? 'Besok!' : `H-${diffDays}`;
        if(diffDays <= 1) badgeClass += ' countdown-alert';

        list.innerHTML += `
            <div class="card" onclick="toggleDetail(this)">
                <div class="card-header" style="background-color: ${t.color || 'var(--color-tugas)'};">
                    <div class="card-header-top">
                        <div class="card-title-group">
                            <button class="check-btn" onclick="event.stopPropagation(); toggleTaskDone('${t.id}')">${iCir}</button>
                            <div>
                                <h3>${t.name}</h3>
                                <small>${iDat} ${formatShortDate(t.date)}   ${iClk} ${t.time}</small>
                            </div>
                        </div>
                        <span class="${badgeClass}">${badgeText}</span>
                    </div>
                </div>
                <div class="card-detail">
                    <p style="margin-bottom:12px; line-height:1.5;">${t.deskripsi || 'Tidak ada deskripsi.'}</p>
                    ${t.pengumpulan ? `<div style="margin-bottom:12px; padding-bottom:12px; border-bottom:1px dashed var(--border-line); font-size:13px;"><strong>Via:</strong> ${t.pengumpulan}</div>` : ''}
                    <div class="card-actions three-btns">
                        <button class="icon-btn delete" onclick="event.stopPropagation(); deleteTask(${t.id})">${iDel} Hapus</button>
                        <div><button class="icon-btn" onclick="event.stopPropagation(); openEditTask(${t.id}, '${t.category}')">${iEdt} Edit</button></div>
                    </div>
                </div>
            </div>`;
    });
}

function renderHistory(tabName) {
    currentHistoryTab = tabName; 
    if(document.getElementById('tab-tk')) document.getElementById('tab-tk').classList.toggle('active', tabName === 'Tugas Kuliah'); 
    if(document.getElementById('tab-tb')) document.getElementById('tab-tb').classList.toggle('active', tabName === 'Tugas');
    if(document.getElementById('tab-terlewat')) document.getElementById('tab-terlewat').classList.toggle('active', tabName === 'Terlewat');
    updateOverdueTabLabel();
    
    let list = document.getElementById('history-list'); if(!list) return; list.innerHTML = '';

    if (tabName === 'Terlewat') {
        const overdueTasks = getOverdueTasks().sort((a, b) => a.date.localeCompare(b.date));
        if (overdueTasks.length === 0) {
            list.innerHTML = '<p style="color:var(--text-muted); font-size:14px; text-align:center;">Tidak ada tugas yang terlewat.</p>';
            return;
        }
        overdueTasks.forEach(t => {
            list.innerHTML += `
                <div class="card" onclick="toggleDetail(this)">
                    <div class="card-header" style="background-color: ${t.color || 'var(--color-tugas)'};">
                        <div class="card-header-top">
                            <div class="card-title-group">
                                <button class="check-btn" onclick="event.stopPropagation(); toggleTaskDone('${t.id}')">${iCir}</button>
                                <div>
                                    <h3>${t.name}</h3>
                                    <small>${iDat} ${formatShortDate(t.date)}   ${iClk} ${t.time}</small>
                                </div>
                            </div>
                            <span class="countdown-badge countdown-alert">Terlewat!</span>
                        </div>
                    </div>
                    <div class="card-detail">
                        <p style="margin-bottom:12px; line-height:1.5;">${t.deskripsi || t.category}</p>
                        ${t.pengumpulan ? `<div style="margin-bottom:12px; padding-bottom:12px; border-bottom:1px dashed var(--border-line); font-size:13px;"><strong>Via:</strong> ${t.pengumpulan}</div>` : ''}
                        <div class="card-actions three-btns">
                            <button class="icon-btn delete" onclick="event.stopPropagation(); deleteTask(${t.id})">${iDel} Hapus</button>
                            <div><button class="icon-btn" onclick="event.stopPropagation(); openEditTask(${t.id}, '${t.category}')">${iEdt} Edit</button></div>
                        </div>
                    </div>
                </div>`;
        });
        return;
    }

    let doneTasks = (JSON.parse(localStorage.getItem('nalaTasks')) || []).filter(t => t.status === 'done' && t.category === tabName); 
    if(doneTasks.length === 0) { list.innerHTML = '<p style="color:var(--text-muted); font-size:14px; text-align:center;">Belum ada riwayat selesai.</p>'; return; }
    
    doneTasks.sort((a,b) => b.date.localeCompare(a.date)).forEach(t => { 
        list.innerHTML += `
            <div class="card history-card" onclick="toggleDetail(this)">
                <div class="card-header" style="background-color: ${t.color || 'var(--color-tugas)'}; opacity:0.8;">
                    <div class="card-header-top">
                        <div class="card-title-group">
                            <button class="check-btn" onclick="event.stopPropagation(); toggleTaskDone('${t.id}')">${iChkCir}</button>
                            <div>
                                <h3 class="dimmed-text">${t.name}</h3>
                                <small class="dimmed-text">${iDat} ${formatShortDate(t.date)}</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-detail">
                    <p style="color:var(--text-muted); line-height:1.5;">${t.deskripsi || t.category} ${t.pengumpulan ? `<br>Via: ${t.pengumpulan}` : ''}</p>
                    <div class="card-actions three-btns">
                        <button class="icon-btn delete" onclick="event.stopPropagation(); deleteTask(${t.id})">${iDel} Hapus</button>
                        <div><button class="icon-btn" onclick="event.stopPropagation(); openEditTask(${t.id}, '${t.category}')">${iEdt} Edit</button></div>
                    </div>
                </div>
            </div>`; 
    });
}

function changeMonth(offset) { currentNavDate.setMonth(currentNavDate.getMonth() + offset); renderMonthCalendar(); }

function showDayDetails(dateStr, dayName) {
    let savedMatkul = getActiveMatkulList(); 
    let overrides = JSON.parse(localStorage.getItem('nalaOverrides')) || [];
    let savedTasks = JSON.parse(localStorage.getItem('nalaTasks')) || [];
    
    let isHoliday = getHolidayInfo(dateStr); 
    let isOffDay = (dayName === 'Minggu') || isHoliday;
    
    let popUpItems = [];

    let matkulsToday = savedMatkul.filter(m => m.hari === dayName); 
    if(isOffDay) matkulsToday = []; 
    matkulsToday = matkulsToday.filter(m => !overrides.some(o => o.matkulId === m.id && o.originalDate === dateStr));
    let movedIn = overrides.filter(o => o.newDate === dateStr).map(o => { let orig = savedMatkul.find(m => m.id === o.matkulId); return orig ? { ...orig, ...o, isOverride: true } : null; }).filter(x => x);
    
    [...matkulsToday, ...movedIn].forEach(m => {
        let time = m.isOverride ? m.newTime : m.jamMulai; 
        let end = m.isOverride && m.newEndTime !== undefined ? m.newEndTime : (m.jamSelesai || ''); 
        let ruang = m.isOverride ? m.newRuangan : m.ruangan; 
        let dosen = m.isOverride ? m.newDosen : m.dosen; 
        let origDate = m.isOverride ? m.originalDate : dateStr;
        popUpItems.push({ type: 'kuliah', id: m.id, name: m.name, badge: 'Kuliah', time: time, endTime: end, color: 'var(--color-kuliah)', ruang: ruang, dosen: dosen, origDate: origDate });
    });

    savedTasks.forEach(t => {
        let isToday = (t.category === 'Acara') ? isDateInAcaraRange(dateStr, t) : (t.date === dateStr);
        if(isToday) {
            let tCat = t.category.toLowerCase().includes('tugas') ? 'Tugas' : 'Acara';
            popUpItems.push({ type: 'tugasAcara', id: t.id, name: t.name, badge: tCat, time: t.time, endTime: t.endTime || '', color: t.color || 'var(--color-tugas)', desc: t.deskripsi, via: t.pengumpulan, ruang: t.ruang || '' });
        }
    });

    popUpItems.sort((a, b) => a.time.localeCompare(b.time));

    let listHtml = '';
    popUpItems.forEach(item => {
        let detailHtml = '';
        if (item.type === 'kuliah') {
            detailHtml = `
                <div class="detail-grid"><div class="detail-item">${iRom} <div><span>Ruangan</span>${item.ruang}</div></div><div class="detail-item">${iUsr} <div><span>Dosen</span>${item.dosen}</div></div></div>
                <div class="card-actions"><button class="icon-btn" onclick="event.stopPropagation(); openRescheduleModal(${item.id}, '${item.origDate}', '${dateStr}')">${iEdt} Pindah Jadwal</button></div>`;
        } else if (item.type === 'tugasAcara') {
            let extraInfo = '';
            if(item.via) extraInfo += `<span>Via/Kumpul:</span> <strong>${item.via}</strong><br>`;
            if(item.ruang) extraInfo += `<span>Tempat:</span> <strong>${item.ruang}</strong><br>`;
            
            detailHtml = `<p style="line-height:1.5;">${item.desc || 'Tidak ada deskripsi'}</p>${extraInfo ? `<div style="margin-top:12px; padding-top:12px; border-top:1px dashed var(--border-line);">${extraInfo}</div>` : ''}`;
        }

        listHtml += `
            <div class="card" onclick="toggleDetail(this)" style="margin-bottom:10px;">
                <div class="card-header" style="background-color: ${item.color}; padding:12px 16px;">
                    <div class="card-header-top">
                        <div class="card-title-group">
                            <div>
                                <h3 style="font-size:14px;">${item.name}</h3>
                                <small class="time-badge">${item.time} ${item.endTime ? '- '+item.endTime : ''}</small>
                            </div>
                        </div>
                        <span class="tag-pill">${item.badge}</span>
                    </div>
                </div>
                <div class="card-detail" style="padding:12px 16px;">${detailHtml}</div>
            </div>`;
    });
    
    if(!listHtml) listHtml = '<p style="color:var(--text-muted); font-size:14px; text-align:center;">Tidak ada jadwal.</p>';
    
    let holidayText = isHoliday ? ` • ${isHoliday}` : '';
    document.getElementById('detail-date-title').innerText = `${formatShortDate(dateStr)}${holidayText}`; 
    document.getElementById('detail-list').innerHTML = listHtml;
    hideFabForModal();
    document.getElementById('day-detail-modal').style.display = 'flex';
}

function openRescheduleModal(matkulId, origDate, activeDate) {
    closeModal('day-detail-modal'); let savedMatkul = getActiveMatkulList(); let overrides = JSON.parse(localStorage.getItem('nalaOverrides')) || [];
    let original = savedMatkul.find(m => m.id === matkulId); let existing = overrides.find(o => o.matkulId === matkulId && o.originalDate === origDate);
    document.getElementById('res-matkulId').value = matkulId; document.getElementById('res-originalDate').value = origDate; 
    document.getElementById('res-date').value = existing ? existing.newDate : activeDate; document.getElementById('res-time').value = existing ? existing.newTime : original.jamMulai;
    if(document.getElementById('res-time-end')) document.getElementById('res-time-end').value = existing && existing.newEndTime !== undefined ? existing.newEndTime : original.jamSelesai;
    document.getElementById('res-ruang').value = existing ? existing.newRuangan : original.ruangan; document.getElementById('res-dosen').value = existing ? existing.newDosen : original.dosen;
    hideFabForModal();
    document.getElementById('reschedule-modal').style.display = 'flex';
}

function saveReschedule() {
    const mId = parseInt(document.getElementById('res-matkulId').value); const origDate = document.getElementById('res-originalDate').value;
    const timeEndInput = document.getElementById('res-time-end'); const newEndTime = timeEndInput ? timeEndInput.value : '';
    let overrides = JSON.parse(localStorage.getItem('nalaOverrides')) || []; overrides = overrides.filter(o => !(o.matkulId === mId && o.originalDate === origDate));
    overrides.push({ matkulId: mId, originalDate: origDate, newDate: document.getElementById('res-date').value, newTime: document.getElementById('res-time').value, newEndTime: newEndTime, newRuangan: document.getElementById('res-ruang').value, newDosen: document.getElementById('res-dosen').value });
    localStorage.setItem('nalaOverrides', JSON.stringify(overrides)); closeModal('reschedule-modal'); renderMonthCalendar();
}

function openModal(category) {
    ensureReminderFieldsInjected();
    editId = null; document.getElementById('modal-title').innerText = `Tambah ${category}`; document.getElementById('insert-form').reset();
    syncRoutineSelectAllState();

    if (document.getElementById('custom-remind-val')) document.getElementById('custom-remind-val').value = '';
    if (document.getElementById('custom-remind-unit')) document.getElementById('custom-remind-unit').value = 'minutes';
    
    document.getElementById('field-nama-kegiatan').style.display = (category === 'Kuliah') ? 'none' : 'block';
    if(document.getElementById('field-matkul-dropdown')) document.getElementById('field-matkul-dropdown').style.display = (category === 'Tugas Kuliah' || category === 'Kuliah') ? 'block' : 'none';
    if(document.getElementById('field-pengumpulan')) document.getElementById('field-pengumpulan').style.display = (category === 'Tugas Kuliah') ? 'block' : 'none';
    
    if(document.getElementById('field-ruangan')) {
        document.getElementById('field-ruangan').style.display = (category === 'Kuliah' || category === 'Acara') ? 'block' : 'none';
        let labelRuang = document.getElementById('field-ruangan').querySelector('label');
        if(labelRuang) labelRuang.innerText = (category === 'Acara') ? 'Ruangan/Tempat (Opsional)' : 'Ruangan';
    }
    
    if(document.getElementById('field-rutinitas-hari')) document.getElementById('field-rutinitas-hari').style.display = (category === 'Rutinitas') ? 'block' : 'none';
    if(document.getElementById('field-warna')) { document.getElementById('field-warna').style.display = (category === 'Acara' || category === 'Rutinitas') ? 'block' : 'none'; }
    if(document.getElementById('field-tanggal')) document.getElementById('field-tanggal').style.display = (category === 'Rutinitas') ? 'none' : 'block';
    
    if(document.getElementById('field-tanggal-selesai')) { 
        document.getElementById('field-tanggal-selesai').style.display = (category === 'Libur' || category === 'Acara') ? 'block' : 'none'; 
    }
    
    if(document.getElementById('field-jam')) document.getElementById('field-jam').style.display = (category === 'Libur') ? 'none' : 'block';
    if(document.getElementById('field-reminder')) document.getElementById('field-reminder').style.display = (category === 'Libur') ? 'none' : 'block';
    
    if(document.getElementById('field-jam-selesai')) {
        document.getElementById('field-jam-selesai').style.display = (category === 'Kuliah' || category === 'Acara') ? 'block' : 'none';
    }
    
    if(document.getElementById('field-desc')) document.getElementById('field-desc').style.display = (category === 'Libur' || category === 'Kuliah') ? 'none' : 'block';
    
    document.getElementById('current-category').value = category;
    if(document.getElementById('new-task-color')) updateSwatchSelection(category === 'Rutinitas' ? '#8C6239' : '#3E5A47');
    
    if(category === 'Tugas Kuliah' || category === 'Kuliah') {
        const sel = document.getElementById('task-matkul-select'); sel.innerHTML = '<option value="">-- Pilih Kuliah --</option>';
        let savedMatkul = getActiveMatkulList(); 
        let uniqueMatkul = [];
        savedMatkul.forEach(m => {
            if(!uniqueMatkul.includes(m.name)) { uniqueMatkul.push(m.name); sel.innerHTML += `<option value="${m.name}">${m.name}</option>`; }
        });
    }
    hideFabForModal();
    document.getElementById('insert-modal').style.display = 'flex';
}

function openEditTask(id, category) {
    openModal(category); editId = id; document.getElementById('modal-title').innerText = `Edit ${category}`;
    let savedTasks = JSON.parse(localStorage.getItem('nalaTasks')) || []; let task = savedTasks.find(t => t.id == id);
    if(task) {
        document.getElementById('new-task-name').value = task.name; document.getElementById('new-task-date').value = task.date;
        document.getElementById('new-task-time').value = task.time; document.getElementById('new-task-desc').value = task.deskripsi || '';
        if (document.getElementById('custom-remind-val')) document.getElementById('custom-remind-val').value = task.remindVal || '';
        if (document.getElementById('custom-remind-unit')) document.getElementById('custom-remind-unit').value = task.remindUnit || 'minutes';
        
        if(category === 'Acara') {
            if(document.getElementById('new-task-date-end')) document.getElementById('new-task-date-end').value = task.endDate || '';
            if(document.getElementById('new-task-time-end')) document.getElementById('new-task-time-end').value = task.endTime || '';
            if(document.getElementById('new-task-ruang')) document.getElementById('new-task-ruang').value = task.ruang || '';
            if(document.getElementById('new-task-color')) updateSwatchSelection(task.color);
        }
        
        if(category === 'Tugas Kuliah') { document.getElementById('task-matkul-select').value = task.matkulId; document.getElementById('task-via').value = task.pengumpulan; }
    }
}

function openEditRoutine(id) {
    openModal('Rutinitas'); editId = id; document.getElementById('modal-title').innerText = `Edit Rutinitas`;
    let savedRoutines = JSON.parse(localStorage.getItem('nalaRoutines')) || []; let routine = savedRoutines.find(r => r.id == id);
    if(routine) {
        document.getElementById('new-task-name').value = routine.name; document.getElementById('new-task-time').value = routine.time;
        if(document.getElementById('new-task-desc')) document.getElementById('new-task-desc').value = routine.desc || '';
        if (document.getElementById('custom-remind-val')) document.getElementById('custom-remind-val').value = routine.remindVal || '';
        if (document.getElementById('custom-remind-unit')) document.getElementById('custom-remind-unit').value = routine.remindUnit || 'minutes';
        if(document.getElementById('new-task-color')) updateSwatchSelection(routine.color);
        document.querySelectorAll('input[name="routine-days"]').forEach(cb => { cb.checked = routine.days.includes(cb.value); });
        syncRoutineSelectAllState();
    }
}

function openEditLibur(id) {
    openModal('Libur'); editId = id; document.getElementById('modal-title').innerText = `Edit Libur`;
    let savedLibur = JSON.parse(localStorage.getItem('nalaLibur')) || []; let libur = savedLibur.find(l => l.id == id);
    if(libur) {
        document.getElementById('new-task-name').value = libur.name; 
        document.getElementById('new-task-date').value = libur.startDate;
        if(document.getElementById('new-task-date-end')) document.getElementById('new-task-date-end').value = libur.endDate;
    }
}

function readCustomReminderFromInsert() {
    const valEl = document.getElementById('custom-remind-val');
    const unitEl = document.getElementById('custom-remind-unit');
    const rawVal = valEl ? parseInt(valEl.value, 10) : NaN;
    if (!isNaN(rawVal) && rawVal > 0) {
        return { remindVal: rawVal, remindUnit: unitEl ? unitEl.value : 'minutes' };
    }
    return { remindVal: null, remindUnit: 'minutes' };
}

async function saveNewTask() {
    const category = document.getElementById('current-category').value; const name = document.getElementById('new-task-name').value;
    const reminderData = readCustomReminderFromInsert();
    
    if(category === 'Libur') {
        const date = document.getElementById('new-task-date').value; const endDateInput = document.getElementById('new-task-date-end'); const endDate = (endDateInput && endDateInput.value) ? endDateInput.value : date;
        if(!name || !date) { await polaAlert("Nama dan Tanggal Mulai wajib diisi!"); return; }
        let liburData = { id: editId ? editId : Date.now(), name: name, startDate: date, endDate: endDate };
        let savedLibur = JSON.parse(localStorage.getItem('nalaLibur')) || [];
        if(editId) { const idx = savedLibur.findIndex(l => l.id == editId); if(idx !== -1) savedLibur[idx] = liburData; } else { savedLibur.push(liburData); }
        localStorage.setItem('nalaLibur', JSON.stringify(savedLibur));
    } 
    else if(category === 'Rutinitas') {
        const time = document.getElementById('new-task-time').value;
        const descInput = document.getElementById('new-task-desc'); const desc = descInput ? descInput.value : '';
        let selectedDays = []; document.querySelectorAll('input[name="routine-days"]:checked').forEach(cb => selectedDays.push(cb.value));
        if(!name || !time || selectedDays.length === 0) { await polaAlert("Nama, jam, dan hari wajib diisi!"); return; }
        let routineData = { id: editId ? editId : Date.now(), name: name, time: time, days: selectedDays, color: document.getElementById('new-task-color').value, desc: desc, ...reminderData };
        let savedRoutines = JSON.parse(localStorage.getItem('nalaRoutines')) || [];
        if(editId) { const idx = savedRoutines.findIndex(r => r.id == editId); if(idx !== -1) savedRoutines[idx] = routineData; } else { savedRoutines.push(routineData); }
        localStorage.setItem('nalaRoutines', JSON.stringify(savedRoutines));
    }
    else if(category === 'Kuliah') {
        const matkulName = document.getElementById('task-matkul-select').value; const date = document.getElementById('new-task-date').value; const time = document.getElementById('new-task-time').value;
        const endTime = document.getElementById('new-task-time-end').value; const ruang = document.getElementById('new-task-ruang').value;
        if(!matkulName || !date || !time) { await polaAlert("Pilih Kuliah, Tanggal, dan Jam Mulai!"); return; }
        
        let savedMatkul = getActiveMatkulList(); 
        let orig = savedMatkul.find(m => m.name === matkulName);
        if(!orig) { await polaAlert("Data kuliah tidak ditemukan pada semester aktif!"); return; }

        let overrides = JSON.parse(localStorage.getItem('nalaOverrides')) || [];
        overrides.push({ matkulId: orig.id, originalDate: 'EXTRA_'+Date.now(), newDate: date, newTime: time, newEndTime: endTime, newRuangan: ruang || orig.ruangan, newDosen: orig.dosen, ...reminderData });
        localStorage.setItem('nalaOverrides', JSON.stringify(overrides));
    }
    else {
        const time = document.getElementById('new-task-time').value; const date = document.getElementById('new-task-date').value; 
        if(!name || !date || !time) { await polaAlert("Nama kegiatan, tanggal, dan jam wajib diisi!"); return; } 
        
        let taskData = { id: editId ? editId : Date.now(), name: name, date: date, time: time, category: category, status: 'pending', deskripsi: document.getElementById('new-task-desc').value, ...reminderData };
        
        if(category === 'Tugas Kuliah') { 
            taskData.color = 'var(--color-tugas)'; 
            taskData.matkulId = document.getElementById('task-matkul-select').value; 
            taskData.pengumpulan = document.getElementById('task-via').value; 
        } 
        else if (category === 'Acara') { 
            taskData.color = document.getElementById('new-task-color') ? document.getElementById('new-task-color').value : 'var(--color-acara)'; 
            
            const tEndInput = document.getElementById('new-task-time-end');
            if(tEndInput && tEndInput.value) taskData.endTime = tEndInput.value;
            
            const dEndInput = document.getElementById('new-task-date-end');
            if(dEndInput && dEndInput.value) taskData.endDate = dEndInput.value;
            else taskData.endDate = date;
            
            const ruangInput = document.getElementById('new-task-ruang');
            if(ruangInput && ruangInput.value) taskData.ruang = ruangInput.value;
        } 
        else { taskData.color = 'var(--color-tugas)'; }
        
        let savedTasks = JSON.parse(localStorage.getItem('nalaTasks')) || [];
        if(editId) { const idx = savedTasks.findIndex(t => t.id == editId); if(idx !== -1) savedTasks[idx] = taskData; } else { savedTasks.push(taskData); }
        localStorage.setItem('nalaTasks', JSON.stringify(savedTasks));
    }
    closeModal('insert-modal'); refreshAllViews();
}

// --- MATKUL ---
if(document.getElementById('matkul-list')) {
    setupMatkulSemesterUI();
    renderMatkulList();
}

function openMatkulModal() {
    ensureReminderFieldsInjected();
    editId = null;
    document.getElementById('matkul-form').reset();
    if (document.getElementById('m-remind-val')) document.getElementById('m-remind-val').value = '';
    if (document.getElementById('m-remind-unit')) document.getElementById('m-remind-unit').value = 'minutes';
    hideFabForModal();
    document.getElementById('matkul-modal').style.display = 'flex';
}

async function saveMatkul() {
    const name = document.getElementById('m-name').value; const hari = document.getElementById('m-hari').value; const jamM = document.getElementById('m-jamMulai').value;
    if(!name || !hari || !jamM) { await polaAlert("Nama mata kuliah, hari, dan jam mulai wajib diisi!"); return; }

    const activeSemId = getActiveSemesterId();
    const mRemindValEl = document.getElementById('m-remind-val');
    const mRemindUnitEl = document.getElementById('m-remind-unit');
    const parsedMRemind = mRemindValEl ? parseInt(mRemindValEl.value, 10) : NaN;
    const remindVal = (!isNaN(parsedMRemind) && parsedMRemind > 0) ? parsedMRemind : null;
    const remindUnit = mRemindUnitEl ? mRemindUnitEl.value : 'minutes';

    let savedMatkul = JSON.parse(localStorage.getItem('nalaMatkul')) || [];
    let matkulData = {
        id: editId ? editId : Date.now(),
        semesterId: activeSemId,
        name: name,
        hari: hari,
        jamMulai: jamM,
        jamSelesai: document.getElementById('m-jamSelesai').value,
        dosen: document.getElementById('m-dosen').value,
        ruangan: document.getElementById('m-ruangan').value,
        remindVal: remindVal,
        remindUnit: remindUnit
    };
    if(editId) { const idx = savedMatkul.findIndex(m => m.id == editId); if(idx !== -1) savedMatkul[idx] = matkulData; } else { savedMatkul.push(matkulData); }
    localStorage.setItem('nalaMatkul', JSON.stringify(savedMatkul));
    closeModal('matkul-modal');
    refreshAllViews();
}

function renderMatkulList() {
    const list = document.getElementById('matkul-list'); if(!list) return;
    const activeSem = getActiveSemesterObj();
    const subEl = document.getElementById('active-semester-subtitle');
    if (subEl && activeSem) subEl.innerText = activeSem.name;

    list.innerHTML = ''; let savedMatkul = getActiveMatkulList();
    if(savedMatkul.length === 0) { list.innerHTML = `<p style="text-align:center; color:var(--text-muted);">Belum ada jadwal kuliah di ${activeSem ? activeSem.name : 'semester ini'}.</p>`; return; }
    
    const namaHariUrut = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    savedMatkul.sort((a, b) => {
        let indexA = namaHariUrut.indexOf(a.hari);
        let indexB = namaHariUrut.indexOf(b.hari);
        if (indexA !== indexB) {
            return indexA - indexB;
        }
        return a.jamMulai.localeCompare(b.jamMulai);
    });
    
    savedMatkul.forEach(m => { 
        list.innerHTML += `
            <div class="card" onclick="toggleDetail(this)">
                <div class="card-header" style="background-color: var(--color-kuliah);">
                    <div class="card-header-top">
                        <div class="card-title-group">
                            <div>
                                <h3 style="font-size:15px;">${m.name}</h3>
                                <small class="time-badge">${m.hari}</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-detail">
                    <div class="detail-grid">
                        <div class="detail-item">${iClk} <div><span>Waktu</span>${m.jamMulai} - ${m.jamSelesai}</div></div>
                        <div class="detail-item">${iRom} <div><span>Ruangan</span>${m.ruangan}</div></div>
                        <div class="detail-item" style="grid-column: span 2;">${iUsr} <div><span>Dosen Pengampu</span>${m.dosen}</div></div>
                    </div>
                    <div class="card-actions three-btns">
                        <button class="icon-btn delete" onclick="event.stopPropagation(); deleteMatkul(${m.id})">${iDel} Hapus</button>
                        <div><button class="icon-btn" onclick="event.stopPropagation(); editMatkul(${m.id})">${iEdt} Edit</button></div>
                    </div>
                </div>
            </div>`; 
    });
}

function editMatkul(id) {
    ensureReminderFieldsInjected();
    let savedMatkul = JSON.parse(localStorage.getItem('nalaMatkul')) || []; let m = savedMatkul.find(x => x.id == id);
    if(m) {
        editId = m.id;
        document.getElementById('m-name').value = m.name;
        document.getElementById('m-hari').value = m.hari;
        document.getElementById('m-jamMulai').value = m.jamMulai;
        document.getElementById('m-jamSelesai').value = m.jamSelesai;
        document.getElementById('m-dosen').value = m.dosen;
        document.getElementById('m-ruangan').value = m.ruangan;
        if (document.getElementById('m-remind-val')) document.getElementById('m-remind-val').value = m.remindVal || '';
        if (document.getElementById('m-remind-unit')) document.getElementById('m-remind-unit').value = m.remindUnit || 'minutes';
        hideFabForModal();
        document.getElementById('matkul-modal').style.display = 'flex';
    }
}

async function deleteMatkul(id) {
    const ok = await polaConfirm('Hapus jadwal mata kuliah ini?', 'Hapus Mata Kuliah', 'Hapus');
    if(!ok) return;
    let savedMatkul = JSON.parse(localStorage.getItem('nalaMatkul')) || []; savedMatkul = savedMatkul.filter(m => m.id != id);
    localStorage.setItem('nalaMatkul', JSON.stringify(savedMatkul));
    refreshAllViews();
}

document.addEventListener("DOMContentLoaded", () => { 
    ensurePolaDialogExists();
    document.querySelectorAll('.fab').forEach(f => f.innerHTML = iPls);
    getOrCreateFabBackdrop();
    initRoutineSelectAll();
    initFabScrollBehavior();
    ensureReminderFieldsInjected();
    initSideDrawerGestures();

    document.querySelectorAll('.swatch').forEach(sw => { 
        sw.addEventListener('click', function(e) { 
            e.stopPropagation(); updateSwatchSelection(this.dataset.color); 
        }); 
    });

    // --- FITUR TUTUP MODAL DENGAN KLIK DI LUAR ---
    window.addEventListener('click', function(e) {
        const dismissibleModals = ['day-detail-modal', 'backup-modal', 'salat-sound-modal']; 
        
        dismissibleModals.forEach(modalId => {
            const overlay = document.getElementById(modalId);
            if (overlay && e.target === overlay) {
                closeModal(modalId);
            }
        });
    });

    // --- LOGIKA ANIMASI INTRO ANTI-STUCK (AMAN) ---
    const introScreen = document.getElementById('intro-screen');
    if (introScreen) {
        if (!sessionStorage.getItem('introPlayed')) {
            const introVid = document.getElementById('intro-video');
            let isHidden = false; 
            
            const hideIntro = () => { 
                if (isHidden) return; 
                isHidden = true;
                introScreen.classList.add('intro-hidden'); 
                sessionStorage.setItem('introPlayed', 'true'); 
                setTimeout(() => { introScreen.style.display = 'none'; }, 500);
            };
            
            if (introVid) {
                introVid.onended = hideIntro;
                introVid.onerror = hideIntro; 
            }
            
            setTimeout(hideIntro, 2000); 
            
        } else {
            introScreen.style.display = 'none';
        }
    }
});