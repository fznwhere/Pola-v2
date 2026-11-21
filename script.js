let currentNavDate = new Date();
let editId = null;
const namaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const PAGE_ORDER = ['beranda', 'kalender', 'matkul'];
const PAGE_GAP_PX = 24;
const FORM_MODAL_IDS = ['insert-modal', 'matkul-modal', 'reschedule-modal', 'semester-form-modal'];
const ALL_MODAL_IDS = ['semester-form-modal', 'insert-modal', 'matkul-modal', 'reschedule-modal', 'day-detail-modal', 'backup-modal', 'city-manual-modal'];

let currentHistoryTab = 'Tugas Kuliah';
let currentDrawerTab = 'Rutinitas';
let currentMainPage = 'beranda';
let editSemesterId = null;
let pendingBackupPayload = null;
let scheduleRenderToken = 0;
let pageTransitionTimer = null;
const fetchingHolidayYears = new Set();

// Snapshot form untuk deteksi ketikan yang belum disimpan
const modalFormSnapshots = {};
let isPromptingUnsavedModal = false;

// Manajemen tombol Back HP Android
let overlayHistoryDepth = 0;
let ignorePopstateCount = 0;

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

// --- STYLE INJECTION UNTUK CAROUSEL ANTAR HALAMAN (SMOOTH & BERJARAK) ---
function injectEnhancedStyles() {
    if (document.getElementById('pola-enhanced-styles')) return;
    const style = document.createElement('style');
    style.id = 'pola-enhanced-styles';
    style.textContent = `
        .pages-viewport {
            width: 100%;
            overflow-x: hidden;
            position: relative;
            touch-action: pan-y;
            -webkit-overflow-scrolling: touch;
        }
        .pages-track {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            gap: ${PAGE_GAP_PX}px;
            will-change: transform;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            transform: translate3d(0, 0, 0);
        }
        .page-view {
            flex-shrink: 0;
            box-sizing: border-box;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
        }
        .pages-track:not(.swiping) .page-view.inactive-page {
            max-height: 100vh;
            overflow: hidden;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);
}

// --- MIGRASI OTOMATIS DATA LAMA (nala* -> pola*) ---
function migrateLegacyStorageKeys() {
    const keyMap = [
        ['nalaSemesters', 'polaSemesters'],
        ['nalaActiveSemesterId', 'polaActiveSemesterId'],
        ['nalaMatkul', 'polaMatkul'],
        ['nalaOverrides', 'polaOverrides'],
        ['nalaTasks', 'polaTasks'],
        ['nalaRoutines', 'polaRoutines'],
        ['nalaLibur', 'polaLibur'],
        ['nalaDismissed', 'polaDismissed'],
        ['nalaUserLocation', 'polaUserLocation']
    ];
    keyMap.forEach(([oldKey, newKey]) => {
        const oldVal = localStorage.getItem(oldKey);
        if (oldVal !== null) {
            if (localStorage.getItem(newKey) === null) {
                localStorage.setItem(newKey, oldVal);
            }
            localStorage.removeItem(oldKey);
        }
    });
}

// --- HELPER KETAHANAN KODE (SANITASI, TANGGAL LOKAL, FETCH TIMEOUT) ---
function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '\x26amp;')
        .replace(/</g, '\x26lt;')
        .replace(/>/g, '\x26gt;')
        .replace(/"/g, '\x26quot;')
        .replace(/'/g, '\x27');
}

function parseLocalDate(dateStr) {
    if (!dateStr) return new Date(NaN);
    const parts = String(dateStr).split('-');
    if (parts.length !== 3) return new Date(dateStr);
    return new Date(
        parseInt(parts[0], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[2], 10),
        0, 0, 0, 0
    );
}

function parseLocalDateTime(dateStr, timeStr = '23:59') {
    const base = parseLocalDate(dateStr);
    if (isNaN(base.getTime())) return base;
    if (timeStr && String(timeStr).includes(':')) {
        const tParts = String(timeStr).split(':');
        const hh = parseInt(tParts[0], 10);
        const mm = parseInt(tParts[1], 10);
        if (!isNaN(hh) && !isNaN(mm)) {
            base.setHours(hh, mm, 0, 0);
        }
    }
    return base;
}

async function fetchWithTimeout(url, timeoutMs = 4000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        return await fetch(url, { signal: controller.signal });
    } finally {
        clearTimeout(timer);
    }
}

// --- DETEKSI PERUBAHAN FORM & KONFIRMASI SEBELUM KELUAR MODAL ---
function serializeModalInputs(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return '';
    const elements = modal.querySelectorAll('input, select, textarea');
    const state = [];
    elements.forEach((el, idx) => {
        if (el.type === 'file') return;
        const key = el.id || el.name || `idx_${idx}`;
        if (el.type === 'checkbox' || el.type === 'radio') {
            state.push(`${key}:${el.value}=${el.checked}`);
        } else {
            state.push(`${key}=${el.value}`);
        }
    });
    return state.join('|');
}

function captureModalSnapshot(modalId) {
    if (!FORM_MODAL_IDS.includes(modalId)) return;
    modalFormSnapshots[modalId] = serializeModalInputs(modalId);
}

function hasUnsavedModalChanges(modalId) {
    if (!FORM_MODAL_IDS.includes(modalId)) return false;
    if (!(modalId in modalFormSnapshots)) return false;
    return serializeModalInputs(modalId) !== modalFormSnapshots[modalId];
}

async function requestCloseModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal || modal.style.display !== 'flex') return true;

    if (FORM_MODAL_IDS.includes(modalId) && hasUnsavedModalChanges(modalId)) {
        if (isPromptingUnsavedModal) return false;
        isPromptingUnsavedModal = true;
        const confirmDiscard = await polaConfirm(
            'Data yang sudah kamu ketik belum disimpan. Yakin ingin keluar dan membuang perubahan?',
            'Belum Disimpan',
            'Ya, Keluar',
            'Lanjut Isi'
        );
        isPromptingUnsavedModal = false;
        if (!confirmDiscard) return false;
    }

    closeModal(modalId);
    return true;
}

// --- MANAJEMEN TOMBOL BACK HP ANDROID ---
function hasCapacitorAppPlugin() {
    return !!(
        window.Capacitor &&
        window.Capacitor.Plugins &&
        window.Capacitor.Plugins.App &&
        typeof window.Capacitor.Plugins.App.addListener === 'function'
    );
}

function isElementFlexVisible(id) {
    const el = document.getElementById(id);
    return !!(el && el.style.display === 'flex');
}

function hasAnyOpenOverlay() {
    if (isElementFlexVisible('pola-dialog-overlay')) return true;
    for (const mId of ALL_MODAL_IDS) {
        if (isElementFlexVisible(mId)) return true;
    }
    const fabMenu = document.getElementById('fab-menu');
    if (fabMenu && fabMenu.classList.contains('show')) return true;
    const leftDrawer = document.getElementById('side-drawer');
    if (leftDrawer && leftDrawer.classList.contains('open')) return true;
    const rightDrawer = document.getElementById('right-semester-drawer');
    if (rightDrawer && rightDrawer.classList.contains('open')) return true;
    return false;
}

function pushOverlayHistoryState() {
    if (hasCapacitorAppPlugin()) return;
    overlayHistoryDepth++;
    try {
        window.history.pushState({ polaOverlayDepth: overlayHistoryDepth }, '');
    } catch (e) {}
}

function popOverlayHistoryState() {
    if (hasCapacitorAppPlugin()) return;
    if (overlayHistoryDepth > 0) {
        overlayHistoryDepth--;
        ignorePopstateCount++;
        try {
            window.history.back();
        } catch (e) {
            ignorePopstateCount = Math.max(0, ignorePopstateCount - 1);
        }
    }
}

async function handleHardwareBackAction(fromPopstate = false) {
    const dialogOverlay = document.getElementById('pola-dialog-overlay');
    if (dialogOverlay && dialogOverlay.style.display === 'flex') {
        const cancelBtn = document.getElementById('pola-dialog-cancel');
        const okBtn = document.getElementById('pola-dialog-ok');
        if (cancelBtn) cancelBtn.click();
        else if (okBtn) okBtn.click();
        return false;
    }

    for (const mId of ALL_MODAL_IDS) {
        if (isElementFlexVisible(mId)) {
            if (FORM_MODAL_IDS.includes(mId)) {
                await requestCloseModal(mId);
            } else {
                closeModal(mId, fromPopstate);
            }
            return false;
        }
    }

    const fabMenu = document.getElementById('fab-menu');
    if (fabMenu && fabMenu.classList.contains('show')) {
        closeFabMenu(fromPopstate);
        return false;
    }

    const leftDrawer = document.getElementById('side-drawer');
    if (leftDrawer && leftDrawer.classList.contains('open')) {
        closeSideDrawer(fromPopstate);
        return false;
    }

    const rightDrawer = document.getElementById('right-semester-drawer');
    if (rightDrawer && rightDrawer.classList.contains('open')) {
        closeRightSemesterDrawer(fromPopstate);
        return false;
    }

    return true;
}

function initAndroidBackButtonHandler() {
    if (hasCapacitorAppPlugin()) {
        window.Capacitor.Plugins.App.addListener('backButton', async () => {
            const canExit = await handleHardwareBackAction(false);
            if (canExit && typeof window.Capacitor.Plugins.App.exitApp === 'function') {
                window.Capacitor.Plugins.App.exitApp();
            }
        });
    } else {
        window.addEventListener('popstate', async () => {
            if (ignorePopstateCount > 0) {
                ignorePopstateCount--;
                return;
            }
            if (overlayHistoryDepth > 0) {
                overlayHistoryDepth--;
            }
            await handleHardwareBackAction(true);
            if (hasAnyOpenOverlay() && overlayHistoryDepth === 0) {
                pushOverlayHistoryState();
            }
        });
    }
}

// --- NAVIGASI ANTAR-HALAMAN SPA (SMOOTH & BERJARAK) ---
function syncPagesCarouselLayout(reposition = false) {
    const appContainer = document.querySelector('.app-container');
    const viewport = document.getElementById('pages-viewport');
    const track = document.getElementById('pages-track');
    if (!appContainer || !viewport || !track) return 360;

    const cs = window.getComputedStyle(appContainer);
    const padL = parseFloat(cs.paddingLeft) || 0;
    const padR = parseFloat(cs.paddingRight) || 0;

    if (padL > 0 || padR > 0) {
        viewport.style.marginLeft = `-${padL}px`;
        viewport.style.marginRight = `-${padR}px`;
        viewport.style.width = `calc(100% + ${padL + padR}px)`;
    } else {
        viewport.style.marginLeft = '0px';
        viewport.style.marginRight = '0px';
        viewport.style.width = '100%';
    }

    const slideWidth = viewport.offsetWidth || appContainer.offsetWidth || window.innerWidth;
    const sidePad = Math.max(padL, padR, 18);

    track.style.width = `${slideWidth * PAGE_ORDER.length + PAGE_GAP_PX * (PAGE_ORDER.length - 1)}px`;
    PAGE_ORDER.forEach((p) => {
        const sec = document.getElementById(`page-${p}`);
        if (sec) {
            sec.style.width = `${slideWidth}px`;
            sec.style.flex = `0 0 ${slideWidth}px`;
            sec.style.paddingLeft = `${sidePad}px`;
            sec.style.paddingRight = `${sidePad}px`;
        }
    });

    if (reposition) {
        const curIdx = PAGE_ORDER.indexOf(currentMainPage);
        const stepPx = slideWidth + PAGE_GAP_PX;
        track.style.transition = 'none';
        track.style.transform = `translate3d(${-curIdx * stepPx}px, 0, 0)`;
    }

    return slideWidth;
}

function ensurePagesCarouselStructure() {
    injectEnhancedStyles();
    const appContainer = document.querySelector('.app-container');
    if (!appContainer) return;

    let viewport = document.getElementById('pages-viewport');
    let track = document.getElementById('pages-track');
    if (!viewport) {
        viewport = document.createElement('div');
        viewport.id = 'pages-viewport';
        viewport.className = 'pages-viewport';

        track = document.createElement('div');
        track.id = 'pages-track';
        track.className = 'pages-track';

        PAGE_ORDER.forEach((p) => {
            const sec = document.getElementById(`page-${p}`);
            if (sec) track.appendChild(sec);
        });

        viewport.appendChild(track);
        appContainer.insertBefore(viewport, appContainer.firstChild);
    }

    PAGE_ORDER.forEach((p) => {
        const sec = document.getElementById(`page-${p}`);
        if (sec) {
            sec.style.display = 'block';
            sec.classList.toggle('inactive-page', p !== currentMainPage);
        }
    });

    syncPagesCarouselLayout(false);
}

function updateFabForCurrentPage() {
    const menu = document.getElementById('fab-menu');
    if (!menu) return;
    if (currentMainPage === 'beranda') {
        menu.innerHTML = `
            <button onclick="openModal('Rutinitas')">Rutinitas</button>
            <button onclick="openModal('Acara')">Acara</button>
        `;
    } else if (currentMainPage === 'kalender') {
        menu.innerHTML = `
            <button onclick="openModal('Tugas')">Tugas</button>
            <button onclick="openModal('Libur')">Libur</button>
            <button onclick="openModal('Kuliah')">Kuliah</button>
            <button onclick="openModal('Tugas Kuliah')">Tugas Kuliah</button>
        `;
    } else {
        menu.innerHTML = '';
    }
}

function handleMainFabClick() {
    if (currentMainPage === 'matkul') {
        openMatkulModal();
    } else {
        toggleFabMenu();
    }
}

function switchMainPage(pageName, animate = true, customDurationMs = 260, fromSwipe = false) {
    if (!PAGE_ORDER.includes(pageName)) pageName = 'beranda';
    const prevPage = currentMainPage;
    const isPageChanged = prevPage !== pageName;
    currentMainPage = pageName;

    closeFabMenu();
    closeSideDrawer();
    closeRightSemesterDrawer();

    ensurePagesCarouselStructure();
    const track = document.getElementById('pages-track');
    const slideWidth = syncPagesCarouselLayout(false);
    const stepPx = slideWidth + PAGE_GAP_PX;
    const targetIndex = PAGE_ORDER.indexOf(pageName);
    const currentScrollY = window.scrollY || 0;

    PAGE_ORDER.forEach((p) => {
        const navBtn = document.getElementById(`nav-${p}`);
        if (navBtn) navBtn.classList.toggle('active', p === pageName);
        const sec = document.getElementById(`page-${p}`);
        if (sec) {
            if (p === pageName) {
                sec.classList.remove('inactive-page');
                if (animate && isPageChanged && currentScrollY > 0 && !sec.style.marginTop) {
                    sec.style.marginTop = `${currentScrollY}px`;
                }
            } else if (p === prevPage && animate && isPageChanged) {
                sec.classList.remove('inactive-page');
            }
        }
    });

    if (pageTransitionTimer) {
        clearTimeout(pageTransitionTimer);
        pageTransitionTimer = null;
    }

    const finalizeSlide = () => {
        if (track) {
            track.classList.remove('swiping');
            track.style.transition = 'none';
        }
        let hadScrollOffset = false;
        PAGE_ORDER.forEach((p) => {
            const sec = document.getElementById(`page-${p}`);
            if (sec) {
                if (sec.style.marginTop) hadScrollOffset = true;
                sec.style.marginTop = '';
                sec.classList.toggle('inactive-page', p !== currentMainPage);
            }
        });
        if (isPageChanged && (hadScrollOffset || (window.scrollY || 0) > 0)) {
            window.scrollTo({ top: 0, behavior: 'instant' });
        }

        // Refresh data setelah animasi selesai agar transisi geser tetap 60fps tanpa patah
        if (!fromSwipe || isPageChanged) {
            if (pageName === 'beranda') {
                loadTodaySchedule();
            } else if (pageName === 'kalender') {
                renderMonthCalendar();
                renderUpcomingTasks();
                renderHistory(currentHistoryTab);
            } else if (pageName === 'matkul') {
                renderMatkulList();
            }
        }
    };

    if (track) {
        if (animate) {
            // Paksa reflow ringan hanya saat memulai animasi CSS dari posisi saat ini
            void track.offsetWidth;
            track.classList.add('swiping');
            track.style.transition = `transform ${customDurationMs}ms cubic-bezier(0.22, 1, 0.36, 1)`;
            track.style.transform = `translate3d(${-targetIndex * stepPx}px, 0, 0)`;
            pageTransitionTimer = window.setTimeout(finalizeSlide, customDurationMs + 20);
        } else {
            track.style.transition = 'none';
            track.style.transform = `translate3d(${-targetIndex * stepPx}px, 0, 0)`;
            finalizeSlide();
        }
    }

    updateFabForCurrentPage();
    showFabAfterModal();
}

// --- PEMBERSIH CACHE LAMA OTOMATIS ---
function cleanupOldCache() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const curYear = now.getFullYear();
    const curMonth = now.getMonth() + 1;
    const minYm = curYear * 12 + curMonth - 1;

    localStorage.removeItem('nalaSalatSound');
    localStorage.removeItem('polaSalatSound');

    Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('nalaSalat_') || key.startsWith('polaSalat_') || key.startsWith('nalaSalatMonth_') || key.startsWith('nalaAutoLibur_')) {
            localStorage.removeItem(key);
        }
        if (key.startsWith('polaSalatMonth_')) {
            const parts = key.split('_');
            const y = parseInt(parts[1], 10);
            const m = parseInt(parts[2], 10);
            if (!isNaN(y) && !isNaN(m) && (y * 12 + m) < minYm) {
                localStorage.removeItem(key);
            }
        }
        if (key.startsWith('polaAutoLibur_')) {
            const y = parseInt(key.split('_')[1], 10);
            if (!isNaN(y) && y < curYear - 1) {
                localStorage.removeItem(key);
            }
        }
    });

    try {
        const dismissed = JSON.parse(localStorage.getItem('polaDismissed'));
        if (Array.isArray(dismissed) && dismissed.length > 0) {
            const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
            const filtered = dismissed.filter((entry) => {
                const match = String(entry).match(/_(\d{4}-\d{2}-\d{2})$/);
                if (!match) return false;
                const entryDate = parseLocalDate(match[1]);
                if (isNaN(entryDate.getTime())) return false;
                return (todayStart - entryDate) <= sevenDaysMs;
            });
            if (filtered.length !== dismissed.length) {
                localStorage.setItem('polaDismissed', JSON.stringify(filtered));
            }
        }
    } catch (e) {}
}

// --- CUSTOM DIALOG BERTEMA POLA ---
function ensurePolaDialogExists() {
    if (document.getElementById('pola-dialog-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'pola-dialog-overlay';
    overlay.className = 'modal-overlay';
    overlay.style.zIndex = '9999';
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
        const wasOpen = overlay.style.display === 'flex';
        document.getElementById('pola-dialog-title').innerText = title;
        document.getElementById('pola-dialog-msg').innerText = message;
        const btns = document.getElementById('pola-dialog-btns');
        btns.innerHTML = `<button class="btn-save" id="pola-dialog-ok">Mengerti</button>`;
        overlay.style.display = 'flex';
        if (!wasOpen) pushOverlayHistoryState();

        document.getElementById('pola-dialog-ok').onclick = () => {
            overlay.style.display = 'none';
            popOverlayHistoryState();
            resolve(true);
        };
    });
}

function polaConfirm(message, title = 'Konfirmasi', confirmLabel = 'Ya, Lanjutkan', cancelLabel = 'Batal') {
    ensurePolaDialogExists();
    return new Promise((resolve) => {
        const overlay = document.getElementById('pola-dialog-overlay');
        const wasOpen = overlay.style.display === 'flex';
        document.getElementById('pola-dialog-title').innerText = title;
        document.getElementById('pola-dialog-msg').innerText = message;
        const btns = document.getElementById('pola-dialog-btns');
        btns.innerHTML = `
            <button class="btn-cancel" id="pola-dialog-cancel">${escapeHtml(cancelLabel)}</button>
            <button class="btn-save" id="pola-dialog-confirm">${escapeHtml(confirmLabel)}</button>
        `;
        overlay.style.display = 'flex';
        if (!wasOpen) pushOverlayHistoryState();

        document.getElementById('pola-dialog-cancel').onclick = () => {
            overlay.style.display = 'none';
            popOverlayHistoryState();
            resolve(false);
        };
        document.getElementById('pola-dialog-confirm').onclick = () => {
            overlay.style.display = 'none';
            popOverlayHistoryState();
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
        const cached = JSON.parse(localStorage.getItem(`polaAutoLibur_${year}`));
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
    let savedLibur = JSON.parse(localStorage.getItem('polaLibur')) || [];
    let tDate = parseLocalDate(dateStr);
    for (let l of savedLibur) {
        let sDate = parseLocalDate(l.startDate);
        let eDate = parseLocalDate(l.endDate || l.startDate);
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
    const cacheKey = `polaAutoLibur_${year}`;
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
            const res = await fetchWithTimeout(`https://api-harilibur.vercel.app/api?year=${year}`, 4000);
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
                const res2 = await fetchWithTimeout(`https://dayoffapi.vercel.app/api?year=${year}`, 4000);
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
                const res3 = await fetchWithTimeout(`https://date.nager.at/api/v3/PublicHolidays/${year}/ID`, 4000);
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

// --- LOKASI USER & JADWAL SALAT OTOMATIS (CAPACITOR + WEB + KOTA MANUAL) ---
function getSavedCoordinates() {
    try {
        const saved = JSON.parse(localStorage.getItem('polaUserLocation'));
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
        const res = await fetchWithTimeout(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=id`,
            4000
        );
        if (res.ok) {
            const data = await res.json();
            const city = data.city || data.locality || data.principalSubdivision || '';
            if (city) return city.replace(/^Kota\s+|^Kabupaten\s+/i, '').trim();
        }
    } catch (e) {}
    return '';
}

function applyNewCoordinates(lat, lng, cityName, isManualCity = false) {
    const current = getSavedCoordinates();
    const updated = {
        lat: Number(lat.toFixed(4)),
        lng: Number(lng.toFixed(4)),
        city: cityName || current.city || 'Lokasi Terdeteksi',
        isFallback: false,
        isManualCity: isManualCity,
        updatedAt: Date.now()
    };
    localStorage.setItem('polaUserLocation', JSON.stringify(updated));
    updateLocationPillUI(null, false);

    Object.keys(localStorage).forEach((k) => {
        if (k.startsWith('polaSalatMonth_') || k.startsWith('polaSalat_')) {
            localStorage.removeItem(k);
        }
    });
    if (document.getElementById('schedule-list')) loadTodaySchedule();
    if (typeof syncAndroidAlarms === 'function') syncAndroidAlarms();
    return updated;
}

function openManualCityModal() {
    let modal = document.getElementById('city-manual-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'city-manual-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal">
                <h2>Atur Kota Jadwal Salat</h2>
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:12px; line-height:1.45;">
                    Masukkan nama kota atau kabupatenmu jika izin GPS belum aktif di perangkat.
                </p>
                <form onsubmit="event.preventDefault(); saveManualCityLocation();">
                    <label>Nama Kota / Kabupaten *</label>
                    <input type="text" id="manual-city-input" placeholder="Contoh: Yogyakarta, Bandung, Surabaya">
                </form>
                <div class="modal-btns">
                    <button type="button" class="btn-cancel" onclick="closeModal('city-manual-modal')">Batal</button>
                    <button type="button" class="btn-save" onclick="saveManualCityLocation()">Simpan Kota</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const input = document.getElementById('manual-city-input');
    const cur = getSavedCoordinates();
    if (input) input.value = cur.city || '';
    hideFabForModal();
    const wasOpen = modal.style.display === 'flex';
    modal.style.display = 'flex';
    if (!wasOpen) pushOverlayHistoryState();
}

async function saveManualCityLocation() {
    const input = document.getElementById('manual-city-input');
    const query = input ? input.value.trim() : '';
    if (!query) {
        await polaAlert('Masukkan nama kota terlebih dahulu.');
        return;
    }

    updateLocationPillUI('Mencari kota...', true);
    try {
        const res = await fetchWithTimeout(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=id&format=json`,
            5000
        );
        if (res.ok) {
            const data = await res.json();
            if (data && Array.isArray(data.results) && data.results.length > 0) {
                const hit = data.results[0];
                const cleanCity = (hit.name || query).replace(/^Kota\s+|^Kabupaten\s+/i, '').trim();
                applyNewCoordinates(hit.latitude, hit.longitude, cleanCity, true);
                closeModal('city-manual-modal');
                await polaAlert(`Jadwal salat berhasil disesuaikan ke wilayah ${cleanCity}.`, 'Kota Tersimpan');
                return;
            }
        }
    } catch (e) {}

    updateLocationPillUI(null, false);
    await polaAlert('Kota tidak ditemukan atau internet sedang offline. Coba ejaan nama kota lain.');
}

async function getRawDevicePosition(manual) {
    const CapGeo = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Geolocation;
    if (CapGeo && typeof CapGeo.getCurrentPosition === 'function') {
        try {
            if (typeof CapGeo.requestPermissions === 'function') {
                const perm = await CapGeo.requestPermissions();
                if (perm && perm.location === 'denied' && perm.coarseLocation === 'denied') {
                    return null;
                }
            }
            const pos = await CapGeo.getCurrentPosition({
                enableHighAccuracy: false,
                timeout: manual ? 10000 : 6000,
                maximumAge: manual ? 0 : 15 * 60 * 1000
            });
            if (pos && pos.coords) {
                return { lat: pos.coords.latitude, lng: pos.coords.longitude };
            }
        } catch (e) {}
    }

    if (!navigator.geolocation) return null;

    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => resolve(null),
            {
                enableHighAccuracy: false,
                timeout: manual ? 10000 : 6000,
                maximumAge: manual ? 0 : 15 * 60 * 1000
            }
        );
    });
}

async function refreshUserCoordinates(manual = false) {
    const current = getSavedCoordinates();
    if (!manual && current.isManualCity) {
        updateLocationPillUI(null, false);
        return current;
    }

    if (manual) updateLocationPillUI('Mencari lokasi...', true);

    const coords = await getRawDevicePosition(manual);
    if (coords) {
        const lat = Number(coords.lat.toFixed(4));
        const lng = Number(coords.lng.toFixed(4));
        const movedFar =
            current.isFallback ||
            current.isManualCity ||
            Math.abs(lat - current.lat) > 0.06 ||
            Math.abs(lng - current.lng) > 0.06;

        let cityName = (!movedFar && current.city) ? current.city : '';
        if (!cityName || manual || movedFar) {
            const resolved = await resolveCityName(lat, lng);
            if (resolved) cityName = resolved;
        }

        if (movedFar || manual) {
            return applyNewCoordinates(lat, lng, cityName, false);
        } else {
            const updated = { ...current, city: cityName || current.city, isFallback: false, updatedAt: Date.now() };
            localStorage.setItem('polaUserLocation', JSON.stringify(updated));
            updateLocationPillUI(null, false);
            return updated;
        }
    }

    if (!current.city) {
        const resolved = await resolveCityName(current.lat, current.lng);
        if (resolved) {
            current.city = resolved;
            localStorage.setItem('polaUserLocation', JSON.stringify(current));
        }
    }
    updateLocationPillUI(null, false);

    if (manual) {
        const wantManualCity = await polaConfirm(
            'GPS tidak merespons atau izin lokasi belum diberikan di pengaturan HP. Ingin atur nama kota secara manual agar jadwal salat tetap akurat?',
            'Lokasi Tidak Terdeteksi',
            'Isi Nama Kota',
            'Tutup'
        );
        if (wantManualCity) {
            openManualCityModal();
        }
    }
    return current;
}

function getCachedSalatTimingsSync(dateObj, dateStr) {
    const loc = getSavedCoordinates();
    const locKey = `${loc.lat.toFixed(2)}_${loc.lng.toFixed(2)}`;
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const monthCacheKey = `polaSalatMonth_${yyyy}_${mm}_${locKey}`;
    try {
        const cachedMonth = JSON.parse(localStorage.getItem(monthCacheKey));
        if (cachedMonth && Array.isArray(cachedMonth[dateStr]) && cachedMonth[dateStr].length === 5) {
            return cachedMonth[dateStr];
        }
    } catch (e) {}
    return null;
}

async function fetchSalatTimingsForDate(dateObj, dateStr) {
    const syncHit = getCachedSalatTimingsSync(dateObj, dateStr);
    if (syncHit) return syncHit;

    const loc = getSavedCoordinates();
    const locKey = `${loc.lat.toFixed(2)}_${loc.lng.toFixed(2)}`;
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const monthCacheKey = `polaSalatMonth_${yyyy}_${mm}_${locKey}`;

    try {
        const res = await fetchWithTimeout(
            `https://api.aladhan.com/v1/calendar/${yyyy}/${Number(mm)}?latitude=${loc.lat}&longitude=${loc.lng}&method=20`,
            4000
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
        const resSingle = await fetchWithTimeout(
            `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${loc.lat}&longitude=${loc.lng}&method=20`,
            4000
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
    let semesters = JSON.parse(localStorage.getItem('polaSemesters'));
    let activeId = localStorage.getItem('polaActiveSemesterId');

    if (!Array.isArray(semesters) || semesters.length === 0) {
        semesters = [{ id: 'sem_1', name: 'Semester 1', createdAt: Date.now() }];
        activeId = 'sem_1';
        localStorage.setItem('polaSemesters', JSON.stringify(semesters));
        localStorage.setItem('polaActiveSemesterId', activeId);
    }

    if (!activeId || !semesters.some((s) => s.id === activeId)) {
        activeId = semesters[0].id;
        localStorage.setItem('polaActiveSemesterId', activeId);
    }

    let savedMatkul = JSON.parse(localStorage.getItem('polaMatkul')) || [];
    let migrated = false;
    savedMatkul.forEach((m) => {
        if (!m.semesterId) {
            m.semesterId = activeId;
            migrated = true;
        }
    });
    if (migrated) {
        localStorage.setItem('polaMatkul', JSON.stringify(savedMatkul));
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
    const savedMatkul = JSON.parse(localStorage.getItem('polaMatkul')) || [];
    return savedMatkul.filter((m) => m.semesterId === activeId);
}

function setActiveSemester(semId) {
    localStorage.setItem('polaActiveSemesterId', semId);
    refreshAllViews();
}

// --- EKSPOR & IMPOR JSON ANTI-GAGAL ---
function buildBackupObject() {
    const { semesters, activeId } = ensureSemesterInitialized();
    const matkul = JSON.parse(localStorage.getItem('polaMatkul')) || [];
    const overrides = JSON.parse(localStorage.getItem('polaOverrides')) || [];
    const tasks = JSON.parse(localStorage.getItem('polaTasks')) || [];
    const routines = JSON.parse(localStorage.getItem('polaRoutines')) || [];
    const libur = JSON.parse(localStorage.getItem('polaLibur')) || [];
    const dismissed = JSON.parse(localStorage.getItem('polaDismissed')) || [];
    const userLocation = JSON.parse(localStorage.getItem('polaUserLocation')) || null;

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
            polaSemesters: semesters,
            polaActiveSemesterId: activeId,
            polaMatkul: matkul,
            polaOverrides: overrides,
            polaTasks: tasks,
            polaRoutines: routines,
            polaLibur: libur,
            polaDismissed: dismissed,
            polaUserLocation: userLocation
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
    const rawSemesters = src.polaSemesters || src.nalaSemesters;
    const rawActiveSemId = src.polaActiveSemesterId || src.nalaActiveSemesterId;
    const rawMatkul = src.polaMatkul || src.nalaMatkul;
    const rawOverrides = src.polaOverrides || src.nalaOverrides;
    const rawTasks = src.polaTasks || src.nalaTasks;
    const rawRoutines = src.polaRoutines || src.nalaRoutines;
    const rawLibur = src.polaLibur || src.nalaLibur;
    const rawDismissed = src.polaDismissed || src.nalaDismissed;
    const rawUserLocation = src.polaUserLocation || src.nalaUserLocation;

    const hasKnownKey = [rawSemesters, rawMatkul, rawOverrides, rawTasks, rawRoutines, rawLibur, rawDismissed].some(Array.isArray);
    if (!hasKnownKey) {
        return { ok: false, error: 'File ini bukan cadangan data aplikasi Pola.' };
    }

    let semesters = Array.isArray(rawSemesters)
        ? rawSemesters
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
    const defaultSemId = validSemIds.has(rawActiveSemId) ? rawActiveSemId : semesters[0].id;

    const matkul = Array.isArray(rawMatkul)
        ? rawMatkul
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

    const tasks = Array.isArray(rawTasks)
        ? rawTasks
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

    const routines = Array.isArray(rawRoutines)
        ? rawRoutines
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

    const libur = Array.isArray(rawLibur)
        ? rawLibur
            .filter((l) => l && typeof l === 'object' && l.name && l.startDate)
            .map((l, idx) => ({
                id: l.id || (Date.now() + 3000 + idx),
                name: String(l.name),
                startDate: String(l.startDate),
                endDate: l.endDate ? String(l.endDate) : String(l.startDate)
            }))
        : [];

    const overrides = Array.isArray(rawOverrides)
        ? rawOverrides
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

    const dismissed = Array.isArray(rawDismissed) ? rawDismissed.map(String) : [];
    const userLocation = (rawUserLocation && typeof rawUserLocation.lat === 'number' && typeof rawUserLocation.lng === 'number')
        ? rawUserLocation
        : null;

    return {
        ok: true,
        normalized: {
            polaSemesters: semesters,
            polaActiveSemesterId: defaultSemId,
            polaMatkul: matkul,
            polaOverrides: overrides,
            polaTasks: tasks,
            polaRoutines: routines,
            polaLibur: libur,
            polaDismissed: dismissed,
            polaUserLocation: userLocation
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
    const modal = document.getElementById('backup-modal');
    const wasOpen = modal.style.display === 'flex';
    modal.style.display = 'flex';
    if (!wasOpen) pushOverlayHistoryState();
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
        summaryEl.innerHTML = `Cadangan valid ditemukan:<br>${d.polaSemesters.length} Semester • ${d.polaMatkul.length} Matkul • ${d.polaTasks.length} Tugas/Acara • ${d.polaRoutines.length} Rutinitas • ${d.polaLibur.length} Libur`;
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

        localStorage.setItem('polaSemesters', JSON.stringify(incoming.polaSemesters));
        localStorage.setItem('polaActiveSemesterId', incoming.polaActiveSemesterId);
        localStorage.setItem('polaMatkul', JSON.stringify(incoming.polaMatkul));
        localStorage.setItem('polaOverrides', JSON.stringify(incoming.polaOverrides));
        localStorage.setItem('polaTasks', JSON.stringify(incoming.polaTasks));
        localStorage.setItem('polaRoutines', JSON.stringify(incoming.polaRoutines));
        localStorage.setItem('polaLibur', JSON.stringify(incoming.polaLibur));
        localStorage.setItem('polaDismissed', JSON.stringify(incoming.polaDismissed));
        if (incoming.polaUserLocation) {
            localStorage.setItem('polaUserLocation', JSON.stringify(incoming.polaUserLocation));
        }
    } else {
        const curSem = ensureSemesterInitialized().semesters;
        const semIdMap = {};
        incoming.polaSemesters.forEach((s, idx) => {
            const sameName = curSem.find((cs) => cs.name.trim().toLowerCase() === s.name.trim().toLowerCase());
            if (sameName) {
                semIdMap[s.id] = sameName.id;
            } else {
                const newSemId = curSem.some((cs) => cs.id === s.id) ? `sem_${Date.now()}_${idx}` : s.id;
                semIdMap[s.id] = newSemId;
                curSem.push({ ...s, id: newSemId });
            }
        });
        localStorage.setItem('polaSemesters', JSON.stringify(curSem));

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

        const curMatkul = JSON.parse(localStorage.getItem('polaMatkul')) || [];
        const mergedMatkul = mergeById(curMatkul, incoming.polaMatkul, (m) => ({
            ...m,
            semesterId: semIdMap[m.semesterId] || getActiveSemesterId()
        }));
        localStorage.setItem('polaMatkul', JSON.stringify(mergedMatkul));

        const curTasks = JSON.parse(localStorage.getItem('polaTasks')) || [];
        localStorage.setItem('polaTasks', JSON.stringify(mergeById(curTasks, incoming.polaTasks)));

        const curRoutines = JSON.parse(localStorage.getItem('polaRoutines')) || [];
        localStorage.setItem('polaRoutines', JSON.stringify(mergeById(curRoutines, incoming.polaRoutines)));

        const curLibur = JSON.parse(localStorage.getItem('polaLibur')) || [];
        localStorage.setItem('polaLibur', JSON.stringify(mergeById(curLibur, incoming.polaLibur)));

        const curOverrides = JSON.parse(localStorage.getItem('polaOverrides')) || [];
        localStorage.setItem('polaOverrides', JSON.stringify([...curOverrides, ...incoming.polaOverrides]));

        const curDismissed = JSON.parse(localStorage.getItem('polaDismissed')) || [];
        localStorage.setItem('polaDismissed', JSON.stringify([...new Set([...curDismissed, ...incoming.polaDismissed])]));
    }

    pendingBackupPayload = null;
    closeModal('backup-modal');
    updateLocationPillUI(null, false);
    refreshAllViews();

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

// --- EFEK BLUR PROGRESIF SAAT GESER DRAWER ---
function getOrCreateDrawerBlurBackdrop() {
    let backdrop = document.getElementById('drawer-blur-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'drawer-blur-backdrop';
        backdrop.className = 'drawer-blur-backdrop';
        backdrop.onclick = closeAllDrawers;
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

function closeAllDrawers() {
    closeSideDrawer();
    closeRightSemesterDrawer();
}

// --- HALAMAN GESER KIRI FULL-SCREEN (BERANDA) ---
function ensureSideDrawerStickyFooter() {
    const drawer = document.getElementById('side-drawer');
    if (!drawer || document.getElementById('drawer-sticky-footer')) return;

    const footer = document.createElement('div');
    footer.id = 'drawer-sticky-footer';
    footer.className = 'drawer-sticky-footer';
    footer.innerHTML = `
        <span class="drawer-menu-heading">Cadangan Data</span>
        <button type="button" class="drawer-option-btn primary-action" onclick="openBackupModal()">${iBkp} Ekspor / Impor JSON</button>
    `;
    drawer.appendChild(footer);
}

function openSideDrawer() {
    const drawer = document.getElementById('side-drawer');
    if (!drawer) return;
    const wasOpen = drawer.classList.contains('open');
    ensureSideDrawerStickyFooter();
    drawer.style.transition = '';
    drawer.style.transform = '';
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    finalizeDrawerBlur(true);
    hideFabForModal();
    renderSideDrawerContent();
    if (!wasOpen) pushOverlayHistoryState();
}

function closeSideDrawer(skipHistoryPop = false) {
    const drawer = document.getElementById('side-drawer');
    if (!drawer) return;
    const wasOpen = drawer.classList.contains('open');
    drawer.style.transition = '';
    drawer.style.transform = '';
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    finalizeDrawerBlur(false);
    if (wasOpen && !skipHistoryPop) popOverlayHistoryState();

    if (!hasAnyOpenOverlay()) {
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
    const routines = JSON.parse(localStorage.getItem('polaRoutines')) || [];
    const acaras = (JSON.parse(localStorage.getItem('polaTasks')) || []).filter((t) => t.category === 'Acara');
    const libur = JSON.parse(localStorage.getItem('polaLibur')) || [];

    if (document.getElementById('dcount-rutinitas')) document.getElementById('dcount-rutinitas').innerText = routines.length;
    if (document.getElementById('dcount-acara')) document.getElementById('dcount-acara').innerText = acaras.length;
    if (document.getElementById('dcount-libur')) document.getElementById('dcount-libur').innerText = libur.length;
}

function renderSideDrawerContent() {
    const container = document.getElementById('drawer-content-list');
    const labelEl = document.getElementById('drawer-section-label');
    if (!container) return;

    ensureSideDrawerStickyFooter();
    updateDrawerOptionCounts();

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (currentDrawerTab === 'Rutinitas') {
        if (labelEl) labelEl.innerText = 'Rutinitas';
        const routines = JSON.parse(localStorage.getItem('polaRoutines')) || [];
        if (routines.length === 0) {
            container.innerHTML = '<div class="drawer-empty-state"><p>Belum ada rutinitas.</p></div>';
            return;
        }
        let html = '<div class="drawer-sub-heading">Jadwal Rutin Aktif</div>';
        routines.forEach((r) => {
            const daysText = r.days.length === 7 ? 'Setiap Hari' : escapeHtml(r.days.join(', '));
            html += `
                <div class="card" onclick="toggleDetail(this)">
                    <div class="card-header" style="background-color: ${escapeHtml(r.color || 'var(--color-rutin)')};">
                        <div class="card-header-top">
                            <div class="card-title-group">
                                <div>
                                    <h3>${escapeHtml(r.name)}</h3>
                                    <small class="time-badge">${iClk} ${escapeHtml(r.time)} • ${daysText}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-detail">
                        <p>${escapeHtml(r.desc || 'Rutinitas Mingguan')}</p>
                        <div class="card-actions three-btns">
                            <button class="icon-btn delete" onclick="event.stopPropagation(); deleteRoutine(${Number(r.id)})">${iDel} Hapus</button>
                            <div><button class="icon-btn" onclick="event.stopPropagation(); closeSideDrawer(); openEditRoutine(${Number(r.id)})">${iEdt} Edit</button></div>
                        </div>
                    </div>
                </div>`;
        });
        container.innerHTML = html;
    } else if (currentDrawerTab === 'Acara') {
        if (labelEl) labelEl.innerText = 'Acara';
        const tasks = JSON.parse(localStorage.getItem('polaTasks')) || [];
        const acaras = tasks.filter((t) => t.category === 'Acara');

        if (acaras.length === 0) {
            container.innerHTML = '<div class="drawer-empty-state"><p>Belum ada acara.</p></div>';
            return;
        }

        const upcomingAcaras = [];
        const pastAcaras = [];

        acaras.forEach((t) => {
            const endStr = t.endDate || t.date;
            const endDateObj = parseLocalDate(endStr);
            if (endDateObj < today) pastAcaras.push(t);
            else upcomingAcaras.push(t);
        });

        upcomingAcaras.sort((a, b) => a.date.localeCompare(b.date));
        pastAcaras.sort((a, b) => b.date.localeCompare(a.date));

        const buildAcaraCard = (t, isPast) => {
            const dateText = t.endDate && t.endDate !== t.date ? `${formatShortDate(t.date)} s/d ${formatShortDate(t.endDate)}` : formatShortDate(t.date);
            const opacityStyle = isPast ? 'opacity: 0.72;' : '';
            const badgeHtml = isPast ? '<span class="tag-pill">Terlewat</span>' : '';
            return `
                <div class="card" onclick="toggleDetail(this)" style="${opacityStyle}">
                    <div class="card-header" style="background-color: ${escapeHtml(t.color || 'var(--color-acara)')};">
                        <div class="card-header-top">
                            <div class="card-title-group">
                                <div>
                                    <h3>${escapeHtml(t.name)}</h3>
                                    <small class="time-badge">${iDat} ${escapeHtml(dateText)}   ${iClk} ${escapeHtml(t.time)}${t.endTime ? ' - ' + escapeHtml(t.endTime) : ''}</small>
                                </div>
                            </div>
                            ${badgeHtml}
                        </div>
                    </div>
                    <div class="card-detail">
                        <p>${escapeHtml(t.deskripsi || 'Tidak ada deskripsi.')}</p>
                        ${t.ruang ? `<div style="margin-top:10px; padding-top:10px; border-top:1px dashed var(--border-line); font-size:12px;"><span>Tempat:</span> <strong>${escapeHtml(t.ruang)}</strong></div>` : ''}
                        <div class="card-actions three-btns">
                            <button class="icon-btn delete" onclick="event.stopPropagation(); deleteTask(${Number(t.id)})">${iDel} Hapus</button>
                            <div><button class="icon-btn" onclick="event.stopPropagation(); closeSideDrawer(); openEditTask(${Number(t.id)}, 'Acara')">${iEdt} Edit</button></div>
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

        container.innerHTML = html;
    } else if (currentDrawerTab === 'Libur') {
        if (labelEl) labelEl.innerText = 'Hari Libur';
        const libur = JSON.parse(localStorage.getItem('polaLibur')) || [];

        if (libur.length === 0) {
            container.innerHTML = '<div class="drawer-empty-state"><p>Belum ada jadwal hari libur pribadi.</p></div>';
            return;
        }

        const upcomingLibur = [];
        const pastLibur = [];

        libur.forEach((l) => {
            const endStr = l.endDate || l.startDate;
            const endDateObj = parseLocalDate(endStr);
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
                                    <h3>${escapeHtml(l.name)}</h3>
                                    <small class="time-badge">${iDat} ${escapeHtml(dateText)}</small>
                                </div>
                            </div>
                            ${badgeHtml}
                        </div>
                    </div>
                    <div class="card-detail">
                        <p>Libur Kampus / Pribadi</p>
                        <div class="card-actions three-btns">
                            <button class="icon-btn delete" onclick="event.stopPropagation(); deleteLibur(${Number(l.id)})">${iDel} Hapus</button>
                            <div><button class="icon-btn" onclick="event.stopPropagation(); closeSideDrawer(); openEditLibur(${Number(l.id)})">${iEdt} Edit</button></div>
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

        container.innerHTML = html;
    }
}

// --- HALAMAN GESER KANAN FULL-SCREEN (SEMESTER MATKUL) ---
function setupMatkulSemesterUI() {
    const matkulListEl = document.getElementById('matkul-list');
    if (!matkulListEl) return;

    ensureSemesterInitialized();
    getOrCreateDrawerBlurBackdrop();

    const headerEl = document.querySelector('#page-matkul header') || document.querySelector('header');
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
            </div>
            <div class="drawer-sticky-footer">
                <span class="drawer-menu-heading">Tambah</span>
                <button type="button" class="drawer-option-btn primary-action" onclick="openNewSemesterModal()">+ Tambah Semester Baru</button>
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
}

function openRightSemesterDrawer() {
    const drawer = document.getElementById('right-semester-drawer');
    if (!drawer) return;
    const wasOpen = drawer.classList.contains('open');
    drawer.style.transition = '';
    drawer.style.transform = '';
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    finalizeDrawerBlur(true);
    hideFabForModal();
    renderSemesterDrawerList();
    if (!wasOpen) pushOverlayHistoryState();
}

function closeRightSemesterDrawer(skipHistoryPop = false) {
    const drawer = document.getElementById('right-semester-drawer');
    if (!drawer) return;
    const wasOpen = drawer.classList.contains('open');
    drawer.style.transition = '';
    drawer.style.transform = '';
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    finalizeDrawerBlur(false);
    if (wasOpen && !skipHistoryPop) popOverlayHistoryState();

    if (!hasAnyOpenOverlay()) {
        showFabAfterModal();
    }
}

function renderSemesterDrawerList() {
    const container = document.getElementById('semester-list-container');
    if (!container) return;

    const { semesters, activeId } = ensureSemesterInitialized();
    const allMatkul = JSON.parse(localStorage.getItem('polaMatkul')) || [];

    let html = '';
    semesters.forEach((sem) => {
        const isActive = sem.id === activeId;
        const count = allMatkul.filter((m) => m.semesterId === sem.id).length;
        const safeSemId = escapeHtml(sem.id);
        html += `
            <div class="semester-card ${isActive ? 'active-sem' : ''}" onclick="selectSemesterFromDrawer('${safeSemId}')">
                <div class="semester-card-top">
                    <div>
                        <div class="semester-card-title">${escapeHtml(sem.name)}</div>
                        <div class="semester-card-meta">${count} Mata Kuliah</div>
                    </div>
                    ${isActive ? '<span class="semester-badge-active">Aktif</span>' : ''}
                </div>
                <div class="semester-card-actions">
                    ${semesters.length > 1 ? `<button class="icon-btn delete" onclick="event.stopPropagation(); deleteSemesterItem('${safeSemId}')">${iDel} Hapus</button>` : ''}
                    <button class="icon-btn" onclick="event.stopPropagation(); openEditSemesterModal('${safeSemId}')">${iEdt} Ubah Nama</button>
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
    const modal = document.getElementById('semester-form-modal');
    const wasOpen = modal.style.display === 'flex';
    modal.style.display = 'flex';
    captureModalSnapshot('semester-form-modal');
    if (!wasOpen) pushOverlayHistoryState();
}

function openEditSemesterModal(semId) {
    const { semesters } = ensureSemesterInitialized();
    const target = semesters.find((s) => s.id === semId);
    if (!target) return;
    editSemesterId = semId;
    document.getElementById('sem-modal-title').innerText = 'Ubah Nama Semester';
    document.getElementById('sem-name-input').value = target.name;
    document.getElementById('sem-copy-wrapper').style.display = 'none';
    const modal = document.getElementById('semester-form-modal');
    const wasOpen = modal.style.display === 'flex';
    modal.style.display = 'flex';
    captureModalSnapshot('semester-form-modal');
    if (!wasOpen) pushOverlayHistoryState();
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
        localStorage.setItem('polaSemesters', JSON.stringify(semesters));
    } else {
        const newId = 'sem_' + Date.now();
        semesters.push({ id: newId, name, createdAt: Date.now() });
        localStorage.setItem('polaSemesters', JSON.stringify(semesters));

        const copyMode = document.getElementById('sem-copy-select').value;
        if (copyMode === 'copy') {
            const allMatkul = JSON.parse(localStorage.getItem('polaMatkul')) || [];
            const activeCourses = allMatkul.filter((m) => m.semesterId === activeId);
            activeCourses.forEach((m, index) => {
                allMatkul.push({ ...m, id: Date.now() + index + 1, semesterId: newId });
            });
            localStorage.setItem('polaMatkul', JSON.stringify(allMatkul));
        }

        localStorage.setItem('polaActiveSemesterId', newId);
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
    localStorage.setItem('polaSemesters', JSON.stringify(remaining));

    let allMatkul = JSON.parse(localStorage.getItem('polaMatkul')) || [];
    const deletedMatkulIds = new Set(
        allMatkul.filter((m) => m.semesterId === semId).map((m) => String(m.id))
    );
    allMatkul = allMatkul.filter((m) => m.semesterId !== semId);
    localStorage.setItem('polaMatkul', JSON.stringify(allMatkul));

    if (deletedMatkulIds.size > 0) {
        let overrides = JSON.parse(localStorage.getItem('polaOverrides')) || [];
        overrides = overrides.filter((o) => !deletedMatkulIds.has(String(o.matkulId)));
        localStorage.setItem('polaOverrides', JSON.stringify(overrides));
    }

    if (activeId === semId) {
        localStorage.setItem('polaActiveSemesterId', remaining[0].id);
    }

    renderSemesterDrawerList();
    refreshAllViews();
}

// --- PENGENDALI GESER TERPADU: ANTAR HALAMAN (60FPS & BERJARAK) & DRAWER (BLUR) ---
function initUnifiedSwipeGestures() {
    ensurePagesCarouselStructure();
    ensureSideDrawerStickyFooter();

    const leftDrawer = document.getElementById('side-drawer');
    const rightDrawer = document.getElementById('right-semester-drawer');
    const backdrop = getOrCreateDrawerBlurBackdrop();
    const track = document.getElementById('pages-track');

    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let lastX = 0;
    let lastTime = 0;
    let velocityX = 0;
    let cachedSlideWidth = 360;
    let cachedLeftDrawerW = 360;
    let cachedRightDrawerW = 360;
    let gestureDecided = false;
    let swipeMode = null; // 'left-drawer' | 'right-drawer' | 'page-carousel'
    let startedDrawerOpen = false;
    let rafId = null;

    const cancelPendingFrame = () => {
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    };

    const renderSwipeFrame = () => {
        rafId = null;
        if (!swipeMode) return;
        const dx = currentX - startX;

        if (swipeMode === 'left-drawer' && leftDrawer) {
            let progress = startedDrawerOpen ? 1 + dx / cachedLeftDrawerW : dx / cachedLeftDrawerW;
            progress = Math.max(0, Math.min(1, progress));
            leftDrawer.style.transform = `translate3d(${-150 + progress * 100}%, 0, 0)`;
            setDrawerBlurProgress(progress);
        } else if (swipeMode === 'right-drawer' && rightDrawer) {
            let progress = startedDrawerOpen ? 1 - dx / cachedRightDrawerW : -dx / cachedRightDrawerW;
            progress = Math.max(0, Math.min(1, progress));
            rightDrawer.style.transform = `translate3d(${50 - progress * 100}%, 0, 0)`;
            setDrawerBlurProgress(progress);
        } else if (swipeMode === 'page-carousel' && track) {
            const curIdx = PAGE_ORDER.indexOf(currentMainPage);
            const stepPx = cachedSlideWidth + PAGE_GAP_PX;
            const clampedDx = Math.max(-stepPx, Math.min(stepPx, dx));
            const basePx = -curIdx * stepPx;
            track.style.transform = `translate3d(${basePx + clampedDx}px, 0, 0)`;
        }
    };

    document.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        if (isPromptingUnsavedModal || isElementFlexVisible('pola-dialog-overlay')) return;
        for (const mId of ALL_MODAL_IDS) {
            if (isElementFlexVisible(mId)) return;
        }
        const fabMenu = document.getElementById('fab-menu');
        if (fabMenu && fabMenu.classList.contains('show')) return;
        if (e.target && e.target.closest('input, textarea, select')) return;

        cancelPendingFrame();
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        currentX = startX;
        lastX = startX;
        lastTime = performance.now();
        velocityX = 0;
        gestureDecided = false;
        swipeMode = null;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (e.touches.length !== 1) return;
        if (isPromptingUnsavedModal || isElementFlexVisible('pola-dialog-overlay')) return;
        for (const mId of ALL_MODAL_IDS) {
            if (isElementFlexVisible(mId)) return;
        }

        const now = performance.now();
        currentX = e.touches[0].clientX;
        const dt = now - lastTime;
        if (dt > 0) {
            const instVx = (currentX - lastX) / dt;
            velocityX = velocityX * 0.35 + instVx * 0.65;
            lastX = currentX;
            lastTime = now;
        }

        const dx = currentX - startX;
        const dy = e.touches[0].clientY - startY;

        if (!gestureDecided) {
            if (Math.abs(dx) < 9 && Math.abs(dy) < 9) return;
            gestureDecided = true;

            if (Math.abs(dx) <= Math.abs(dy) * 1.15) {
                swipeMode = null;
                return;
            }

            const isLeftOpen = !!(leftDrawer && leftDrawer.classList.contains('open'));
            const isRightOpen = !!(rightDrawer && rightDrawer.classList.contains('open'));

            if (isLeftOpen) {
                if (dx < 0 && leftDrawer) {
                    swipeMode = 'left-drawer';
                    startedDrawerOpen = true;
                    cachedLeftDrawerW = leftDrawer.offsetWidth || window.innerWidth;
                    leftDrawer.style.transition = 'none';
                    leftDrawer.style.visibility = 'visible';
                    backdrop.style.transition = 'none';
                }
            } else if (isRightOpen) {
                if (dx > 0 && rightDrawer) {
                    swipeMode = 'right-drawer';
                    startedDrawerOpen = true;
                    cachedRightDrawerW = rightDrawer.offsetWidth || window.innerWidth;
                    rightDrawer.style.transition = 'none';
                    rightDrawer.style.visibility = 'visible';
                    backdrop.style.transition = 'none';
                }
            } else if (currentMainPage === 'beranda' && dx > 0 && leftDrawer) {
                swipeMode = 'left-drawer';
                startedDrawerOpen = false;
                cachedLeftDrawerW = leftDrawer.offsetWidth || window.innerWidth;
                leftDrawer.style.transition = 'none';
                leftDrawer.style.visibility = 'visible';
                backdrop.style.transition = 'none';
                renderSideDrawerContent();
            } else if (currentMainPage === 'matkul' && dx < 0 && rightDrawer) {
                swipeMode = 'right-drawer';
                startedDrawerOpen = false;
                cachedRightDrawerW = rightDrawer.offsetWidth || window.innerWidth;
                rightDrawer.style.transition = 'none';
                rightDrawer.style.visibility = 'visible';
                backdrop.style.transition = 'none';
                renderSemesterDrawerList();
            } else if (track) {
                const curIdx = PAGE_ORDER.indexOf(currentMainPage);
                if ((dx < 0 && curIdx < PAGE_ORDER.length - 1) || (dx > 0 && curIdx > 0)) {
                    swipeMode = 'page-carousel';
                    if (pageTransitionTimer) {
                        clearTimeout(pageTransitionTimer);
                        pageTransitionTimer = null;
                    }
                    setDrawerBlurProgress(0);
                    cachedSlideWidth = syncPagesCarouselLayout(false);
                    track.classList.add('swiping');
                    track.style.transition = 'none';

                    const currentScrollY = window.scrollY || 0;
                    const adjIdx = dx < 0 ? curIdx + 1 : curIdx - 1;
                    PAGE_ORDER.forEach((p, idx) => {
                        const sec = document.getElementById(`page-${p}`);
                        if (!sec) return;
                        if (idx === curIdx) {
                            sec.classList.remove('inactive-page');
                            sec.style.marginTop = '';
                        } else if (idx === adjIdx) {
                            sec.classList.remove('inactive-page');
                            sec.style.marginTop = currentScrollY > 0 ? `${currentScrollY}px` : '';
                        } else {
                            sec.classList.add('inactive-page');
                            sec.style.marginTop = '';
                        }
                    });
                }
            }
        }

        if (swipeMode && rafId === null) {
            rafId = requestAnimationFrame(renderSwipeFrame);
        }
    }, { passive: true });

    const finishSwipeGesture = () => {
        cancelPendingFrame();
        if (!swipeMode) return;
        const mode = swipeMode;
        swipeMode = null;
        const dx = currentX - startX;

        if (mode === 'left-drawer' && leftDrawer) {
            const threshold = cachedLeftDrawerW * 0.24;
            if (!startedDrawerOpen) {
                if (dx > threshold || velocityX > 0.4) openSideDrawer();
                else closeSideDrawer(true);
            } else {
                if (dx < -threshold || velocityX < -0.4) closeSideDrawer();
                else openSideDrawer();
            }
        } else if (mode === 'right-drawer' && rightDrawer) {
            const threshold = cachedRightDrawerW * 0.24;
            if (!startedDrawerOpen) {
                if (dx < -threshold || velocityX < -0.4) openRightSemesterDrawer();
                else closeRightSemesterDrawer(true);
            } else {
                if (dx > threshold || velocityX > 0.4) closeRightSemesterDrawer();
                else openRightSemesterDrawer();
            }
        } else if (mode === 'page-carousel') {
            const curIdx = PAGE_ORDER.indexOf(currentMainPage);
            const stepPx = cachedSlideWidth + PAGE_GAP_PX;
            const threshold = cachedSlideWidth * 0.24;
            const isFastFlickLeft = velocityX < -0.35 && dx < -24;
            const isFastFlickRight = velocityX > 0.35 && dx > 24;

            let targetIdx = curIdx;
            if ((dx < -threshold || isFastFlickLeft) && curIdx < PAGE_ORDER.length - 1) {
                targetIdx = curIdx + 1;
            } else if ((dx > threshold || isFastFlickRight) && curIdx > 0) {
                targetIdx = curIdx - 1;
            }

            const remainingPx = Math.abs((targetIdx - curIdx) * stepPx + dx);
            const speedPxPerMs = Math.max(Math.abs(velocityX), 1.35);
            const durationMs = Math.max(180, Math.min(280, Math.round(remainingPx / speedPxPerMs)));

            switchMainPage(PAGE_ORDER[targetIdx], true, durationMs, true);
        }
    };

    document.addEventListener('touchend', finishSwipeGesture);
    document.addEventListener('touchcancel', finishSwipeGesture);

    window.addEventListener('resize', () => {
        syncPagesCarouselLayout(true);
    }, { passive: true });
}

function getOrCreateFabBackdrop() {
    let backdrop = document.getElementById('fab-backdrop');
    const fabContainer = document.querySelector('.fab-container');
    if (!backdrop && fabContainer) {
        backdrop = document.createElement('div');
        backdrop.id = 'fab-backdrop';
        backdrop.className = 'fab-backdrop';
        backdrop.onclick = () => closeFabMenu();
        fabContainer.parentNode.insertBefore(backdrop, fabContainer);
    }
    return backdrop;
}

function toggleFabMenu() {
    const menu = document.getElementById('fab-menu');
    const fab = document.querySelector('.fab-container .fab');
    const backdrop = getOrCreateFabBackdrop();
    if (!menu) return;

    const wasOpen = menu.classList.contains('show');
    const isOpen = menu.classList.toggle('show');
    if (fab) fab.classList.toggle('active', isOpen);
    if (backdrop) backdrop.classList.toggle('show', isOpen);

    if (isOpen && !wasOpen) pushOverlayHistoryState();
    else if (!isOpen && wasOpen) popOverlayHistoryState();
}

function closeFabMenu(skipHistoryPop = false) {
    const menu = document.getElementById('fab-menu');
    const fab = document.querySelector('.fab-container .fab');
    const backdrop = document.getElementById('fab-backdrop');
    const wasOpen = !!(menu && menu.classList.contains('show'));
    if (menu) menu.classList.remove('show');
    if (fab) fab.classList.remove('active');
    if (backdrop) backdrop.classList.remove('show');
    if (wasOpen && !skipHistoryPop) popOverlayHistoryState();
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

function closeModal(id, skipHistoryPop = false) {
    const el = document.getElementById(id);
    const wasOpen = !!(el && el.style.display === 'flex');
    if (el) el.style.display = 'none';
    delete modalFormSnapshots[id];
    if (id !== 'semester-form-modal' && id !== 'backup-modal' && id !== 'city-manual-modal') editId = null;
    if (wasOpen && !skipHistoryPop) popOverlayHistoryState();
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
    let tDate = parseLocalDate(dateStr);
    let sDate = parseLocalDate(acara.date);
    let eDate = parseLocalDate(acara.endDate);
    return (tDate >= sDate && tDate <= eDate);
}

function updateSwatchSelection(colorVal) {
    if(!document.getElementById('new-task-color')) return;
    document.getElementById('new-task-color').value = colorVal;
    document.querySelectorAll('.swatch').forEach(s => { s.classList.toggle('selected', s.dataset.color.toUpperCase() === colorVal.toUpperCase()); });
}

function toggleTaskDone(id) {
    let tasks = JSON.parse(localStorage.getItem('polaTasks')) || []; let idx = tasks.findIndex(t => t.id == id);
    if(idx !== -1) { tasks[idx].status = tasks[idx].status === 'done' ? 'pending' : 'done'; localStorage.setItem('polaTasks', JSON.stringify(tasks)); refreshAllViews(); }
}
function toggleDismiss(type, id, dateStr) {
    if(type === 'tugas' || type === 'acara') { toggleTaskDone(id); return; }
    let dismissed = JSON.parse(localStorage.getItem('polaDismissed')) || []; const key = `${type}_${id}_${dateStr}`;
    if(dismissed.includes(key)) dismissed = dismissed.filter(k => k !== key); else dismissed.push(key);
    localStorage.setItem('polaDismissed', JSON.stringify(dismissed)); refreshAllViews();
}
function isDismissed(type, id, dateStr) { return (JSON.parse(localStorage.getItem('polaDismissed')) || []).includes(`${type}_${id}_${dateStr}`); }

async function deleteTask(id) {
    const ok = await polaConfirm('Hapus jadwal ini dari daftar?', 'Hapus Jadwal', 'Hapus');
    if(!ok) return;
    let tasks = JSON.parse(localStorage.getItem('polaTasks')) || []; tasks = tasks.filter(t => t.id != id);
    localStorage.setItem('polaTasks', JSON.stringify(tasks)); refreshAllViews();
}
async function deleteRoutine(id) {
    const ok = await polaConfirm('Hapus rutinitas ini secara permanen?', 'Hapus Rutinitas', 'Hapus');
    if(!ok) return;
    let routines = JSON.parse(localStorage.getItem('polaRoutines')) || []; routines = routines.filter(r => r.id != id);
    localStorage.setItem('polaRoutines', JSON.stringify(routines)); refreshAllViews();
}
async function deleteLibur(id) {
    const ok = await polaConfirm('Hapus jadwal libur ini?', 'Hapus Libur', 'Hapus');
    if(!ok) return;
    let libur = JSON.parse(localStorage.getItem('polaLibur')) || []; libur = libur.filter(l => l.id != id);
    localStorage.setItem('polaLibur', JSON.stringify(libur)); refreshAllViews();
}
async function deleteOverride(matkulId, originalDate) {
    const ok = await polaConfirm('Hapus jadwal kuliah pengganti/pindahan ini?', 'Hapus Jadwal Kuliah', 'Hapus');
    if(!ok) return;
    let overrides = JSON.parse(localStorage.getItem('polaOverrides')) || [];
    overrides = overrides.filter(o => !(String(o.matkulId) === String(matkulId) && String(o.originalDate) === String(originalDate)));
    localStorage.setItem('polaOverrides', JSON.stringify(overrides));
    const detailModal = document.getElementById('day-detail-modal');
    if (detailModal && detailModal.style.display === 'flex') {
        closeModal('day-detail-modal');
    }
    refreshAllViews();
}

function refreshAllViews() {
    if(document.getElementById('schedule-list')) loadTodaySchedule();
    if(document.getElementById('side-drawer')) renderSideDrawerContent();
    if(document.getElementById('calendar-grid')) { renderMonthCalendar(); renderUpcomingTasks(); renderHistory(currentHistoryTab); }
    if(document.getElementById('matkul-list')) renderMatkulList();
    if(typeof syncAndroidAlarms === 'function') syncAndroidAlarms();
}

// --- BERANDA ---
function setupBerandaUtilityBar() {
    const scheduleListEl = document.getElementById('schedule-list');
    if (!scheduleListEl || document.getElementById('beranda-utility-bar')) return;

    const headerEl = document.querySelector('#page-beranda header') || document.querySelector('header');
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

migrateLegacyStorageKeys();
ensureSemesterInitialized();
cleanupOldCache();

if(document.getElementById('schedule-list')) {
    setupBerandaUtilityBar();
    ensureAutoHolidaysForYear(new Date().getFullYear());
    loadTodaySchedule();
    refreshUserCoordinates(false);
}

function renderScheduleCardsToDOM(list, combinedSchedule, todayStr) {
    if (!combinedSchedule.length) {
        list.innerHTML = '<div class="empty-state-center"><p>Semua jadwal hari ini sudah beres!</p></div>';
        return;
    }

    let html = '';
    combinedSchedule.forEach(item => {
        let completed = (item.type === 'tugas' || item.type === 'acara') ? (item.status === 'done') : isDismissed(item.type, item.id, todayStr);
        let titleStyle = completed ? 'text-decoration: line-through; color: var(--state-dimmed);' : '';
        let btnIcon = completed ? iChkCir : iCir;
        let cardOpacity = completed ? 'opacity: 0.65;' : '';

        let detailHtml = '';
        if(item.type === 'kuliah') {
            const overrideAction = item.isOverride
                ? `<div class="card-actions"><button class="icon-btn delete" onclick="event.stopPropagation(); deleteOverride(${Number(item.id)}, '${escapeHtml(item.originalDate)}')">${iDel} Hapus Jadwal Ini</button></div>`
                : '';
            detailHtml = `<div class="detail-grid"><div class="detail-item">${iRom} <div><span>Ruangan</span>${escapeHtml(item.ruang)}</div></div><div class="detail-item">${iUsr} <div><span>Dosen</span>${escapeHtml(item.dosen)}</div></div></div>${overrideAction}`;
        } else if(item.type === 'tugas' || item.type === 'acara') {
            let extraInfo = '';
            if(item.via) extraInfo += `<span>Via/Kumpul:</span> <strong>${escapeHtml(item.via)}</strong><br>`;
            if(item.ruang) extraInfo += `<span>Tempat:</span> <strong>${escapeHtml(item.ruang)}</strong><br>`;

            detailHtml = `<p style="line-height:1.5;">${escapeHtml(item.desc)}</p> ${extraInfo ? `<div style="margin-top:12px; padding-top:12px; border-top:1px dashed var(--border-line);">${extraInfo}</div>` : ''} 
            <div class="card-actions three-btns">
                <button class="icon-btn delete" onclick="event.stopPropagation(); deleteTask(${Number(item.id)})">${iDel} Hapus</button>
                <div><button class="icon-btn" onclick="event.stopPropagation(); openEditTask(${Number(item.id)}, '${escapeHtml(item.cat)}')">${iEdt} Edit</button></div>
            </div>`;
        } else if(item.type === 'rutin') {
            detailHtml = `<p>${escapeHtml(item.desc)}</p>
            <div class="card-actions three-btns">
                <button class="icon-btn delete" onclick="event.stopPropagation(); deleteRoutine(${Number(item.id)})">${iDel} Hapus</button>
                <div><button class="icon-btn" onclick="event.stopPropagation(); openEditRoutine(${Number(item.id)})">${iEdt} Edit</button></div>
            </div>`;
        } else {
            detailHtml = `<p>${escapeHtml(item.desc)}</p>`;
        }

        let badgeHtml = item.badge ? `<span class="tag-pill" style="${titleStyle}">${escapeHtml(item.badge)}</span>` : '';

        html += `
            <div class="card" onclick="toggleDetail(this)" style="${cardOpacity}">
                <div class="card-header" style="background-color: ${escapeHtml(item.color)};">
                    <div class="card-header-top">
                        <div class="card-title-group">
                            <button class="check-btn" onclick="event.stopPropagation(); toggleDismiss('${escapeHtml(item.type)}', '${escapeHtml(String(item.id))}', '${escapeHtml(todayStr)}')">${btnIcon}</button>
                            <div>
                                <h3 style="${titleStyle}">${escapeHtml(item.name)}</h3>
                                <small class="time-badge" style="${titleStyle}">${iClk} ${escapeHtml(item.time)} ${item.endTime ? '- ' + escapeHtml(item.endTime) : ''}</small>
                            </div>
                        </div>
                        ${badgeHtml}
                    </div>
                </div>
                <div class="card-detail">${detailHtml}</div>
            </div>`;
    });

    list.innerHTML = html;
}

async function loadTodaySchedule() {
    const list = document.getElementById('schedule-list');
    if (!list) return;
    const renderToken = ++scheduleRenderToken;

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const todayDayName = namaHari[today.getDay()];
    let baseSchedule = [];

    let savedMatkul = getActiveMatkulList();
    let overrides = JSON.parse(localStorage.getItem('polaOverrides')) || [];
    let savedTasks = JSON.parse(localStorage.getItem('polaTasks')) || [];
    let savedRoutines = JSON.parse(localStorage.getItem('polaRoutines')) || [];

    let isHoliday = getHolidayInfo(todayStr);
    let todaysMatkul = savedMatkul.filter(m => m.hari === todayDayName);
    if(todayDayName === 'Minggu' || isHoliday) todaysMatkul = [];

    todaysMatkul = todaysMatkul.filter(m => !overrides.some(o => o.matkulId === m.id && o.originalDate === todayStr));
    let movedIn = overrides
        .filter(o => o.newDate === todayStr)
        .map(o => {
            let orig = savedMatkul.find(m => m.id === o.matkulId);
            return orig ? { ...orig, ...o, isOverride: true } : null;
        })
        .filter(x => x);

    [...todaysMatkul, ...movedIn].forEach(m => {
        let eTime = m.isOverride && m.newEndTime !== undefined ? m.newEndTime : (m.jamSelesai || '');
        baseSchedule.push({
            type: 'kuliah',
            id: m.id,
            name: m.name,
            badge: 'Kuliah',
            time: m.isOverride ? m.newTime : m.jamMulai,
            endTime: eTime,
            color: 'var(--color-kuliah)',
            ruang: m.isOverride ? m.newRuangan : m.ruangan,
            dosen: m.isOverride ? m.newDosen : m.dosen,
            isOverride: !!m.isOverride,
            originalDate: m.originalDate || todayStr
        });
    });

    savedTasks.forEach(t => {
        let isToday = (t.category === 'Acara') ? isDateInAcaraRange(todayStr, t) : (t.date === todayStr);
        if(isToday) {
            let tCat = t.category.toLowerCase().includes('tugas') ? 'Tugas' : 'Acara';
            baseSchedule.push({
                type: tCat.toLowerCase(),
                id: t.id,
                name: t.name,
                badge: tCat,
                time: t.time,
                endTime: t.endTime || '',
                color: t.color || 'var(--color-acara)',
                desc: t.deskripsi || 'Tidak ada catatan.',
                via: t.pengumpulan,
                ruang: t.ruang || '',
                cat: t.category,
                status: t.status
            });
        }
    });

    savedRoutines.filter(r => r.days.includes(todayDayName)).forEach(r => {
        baseSchedule.push({
            type: 'rutin',
            id: r.id,
            name: r.name,
            badge: 'Rutinitas',
            time: r.time,
            endTime: '',
            color: r.color || 'var(--color-rutin)',
            desc: r.desc || 'Jadwal Rutinitas Mingguan'
        });
    });

    const cachedSalat = getCachedSalatTimingsSync(today, todayStr);
    if (cachedSalat) {
        const fullSchedule = [
            ...baseSchedule,
            ...cachedSalat.map(s => ({ type: 'salat', id: s.name, name: s.name, badge: '', time: s.time, endTime: '', color: 'var(--color-salat)', desc: 'Waktu Salat' }))
        ];
        fullSchedule.sort((a, b) => a.time.localeCompare(b.time));
        renderScheduleCardsToDOM(list, fullSchedule, todayStr);
        return;
    }

    if (baseSchedule.length > 0) {
        const sortedLocal = [...baseSchedule].sort((a, b) => a.time.localeCompare(b.time));
        renderScheduleCardsToDOM(list, sortedLocal, todayStr);
    } else {
        list.innerHTML = '<div class="empty-state-center"><p>Memuat jadwal salat...</p></div>';
    }

    const salatList = await fetchSalatTimingsForDate(today, todayStr);
    if (renderToken !== scheduleRenderToken) return;

    const fullSchedule = [
        ...baseSchedule,
        ...salatList.map(s => ({ type: 'salat', id: s.name, name: s.name, badge: '', time: s.time, endTime: '', color: 'var(--color-salat)', desc: 'Waktu Salat' }))
    ];
    fullSchedule.sort((a, b) => a.time.localeCompare(b.time));
    renderScheduleCardsToDOM(list, fullSchedule, todayStr);
}

// --- KALENDER ---
function getOverdueTasks() {
    const now = new Date();
    return (JSON.parse(localStorage.getItem('polaTasks')) || []).filter(t => {
        if (t.status === 'done') return false;
        if (t.category !== 'Tugas Kuliah' && t.category !== 'Tugas') return false;
        const taskDateTime = parseLocalDateTime(t.date, t.time);
        return taskDateTime < now;
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
    renderMonthCalendar();
    renderHistory('Tugas Kuliah');
    renderUpcomingTasks();
    if(document.getElementById('native-month-picker')) {
        document.getElementById('native-month-picker').addEventListener('change', function(e) {
            if(e.target.value) { const p = e.target.value.split('-'); currentNavDate.setFullYear(parseInt(p[0], 10), parseInt(p[1], 10) - 1); renderMonthCalendar(); }
        });
    }
}

function renderMonthCalendar() {
    const grid = document.getElementById('calendar-grid'); if(!grid) return;
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
    
    let gridHtml = '';
    ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].forEach(d => { gridHtml += `<div class="day-name">${d}</div>`; });
    const firstDay = new Date(year, month, 1).getDay(); const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDays = new Date(year, month, 0).getDate();
    
    let savedTasks = JSON.parse(localStorage.getItem('polaTasks')) || []; let savedMatkul = getActiveMatkulList(); let overrides = JSON.parse(localStorage.getItem('polaOverrides')) || [];
    
    for(let i = firstDay - 1; i >= 0; i--) { gridHtml += `<div class="day-cell dimmed" onclick="changeMonth(-1)"><span class="day-number">${prevDays - i}</span></div>`; }
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
        if (uColors.length === 1) pillStyle = `background: ${escapeHtml(uColors[0])};`;
        else if (uColors.length > 1) {
            let gradient = 'linear-gradient(to right, '; let step = 100 / uColors.length;
            uColors.forEach((c, idx) => { gradient += `${escapeHtml(c)} ${idx * step}%, ${escapeHtml(c)} ${(idx + 1) * step}%${idx < uColors.length - 1 ? ', ' : ''}`; });
            pillStyle = `background: ${gradient});`;
        }
        let pillHtml = uColors.length > 0 ? `<div class="event-pill-container"><div class="event-pill" style="${pillStyle}"></div></div>` : '';
        let numClass = isOffDay ? 'day-number sunday-red' : 'day-number';
        let todayClass = (currentLoopDate === realTodayStr) ? ' today-highlight' : '';
        
        gridHtml += `<div class="day-cell${todayClass}" onclick="showDayDetails('${currentLoopDate}', '${loopDayName}')"><span class="${numClass}">${i}</span>${pillHtml}</div>`;
    }
    const totalCells = firstDay + daysInMonth; const nextDays = (totalCells % 7 === 0) ? 0 : 7 - (totalCells % 7);
    for(let i = 1; i <= nextDays; i++) { gridHtml += `<div class="day-cell dimmed" onclick="changeMonth(1)"><span class="day-number">${i}</span></div>`; }
    grid.innerHTML = gridHtml;
}

function renderUpcomingTasks() {
    const list = document.getElementById('upcoming-list'); if(!list) return;
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let pendingTasks = (JSON.parse(localStorage.getItem('polaTasks')) || []).filter(t => {
        if (t.status === 'done' || (t.category !== 'Tugas Kuliah' && t.category !== 'Tugas')) return false;
        let taskDateTime = parseLocalDateTime(t.date, t.time);
        return taskDateTime >= now;
    });

    if(pendingTasks.length === 0) { list.innerHTML = '<p style="color:var(--text-muted); font-size:14px;">Semua tugas aktif sudah beres.</p>'; return; }

    let html = '';
    pendingTasks
        .sort((a, b) => parseLocalDateTime(a.date, a.time) - parseLocalDateTime(b.date, b.time))
        .forEach(t => {
            let taskDayStart = parseLocalDate(t.date);
            let diffDays = Math.round((taskDayStart - todayStart) / (1000 * 60 * 60 * 24));
            let badgeClass = 'countdown-badge';
            let badgeText = diffDays === 0 ? 'Hari Ini!' : diffDays === 1 ? 'Besok!' : `H-${diffDays}`;
            if(diffDays <= 1) badgeClass += ' countdown-alert';

            html += `
                <div class="card" onclick="toggleDetail(this)">
                    <div class="card-header" style="background-color: ${escapeHtml(t.color || 'var(--color-tugas)')};">
                        <div class="card-header-top">
                            <div class="card-title-group">
                                <button class="check-btn" onclick="event.stopPropagation(); toggleTaskDone('${escapeHtml(String(t.id))}')">${iCir}</button>
                                <div>
                                    <h3>${escapeHtml(t.name)}</h3>
                                    <small>${iDat} ${formatShortDate(t.date)}   ${iClk} ${escapeHtml(t.time)}</small>
                                </div>
                            </div>
                            <span class="${badgeClass}">${badgeText}</span>
                        </div>
                    </div>
                    <div class="card-detail">
                        <p style="margin-bottom:12px; line-height:1.5;">${escapeHtml(t.deskripsi || 'Tidak ada deskripsi.')}</p>
                        ${t.pengumpulan ? `<div style="margin-bottom:12px; padding-bottom:12px; border-bottom:1px dashed var(--border-line); font-size:13px;"><strong>Via:</strong> ${escapeHtml(t.pengumpulan)}</div>` : ''}
                        <div class="card-actions three-btns">
                            <button class="icon-btn delete" onclick="event.stopPropagation(); deleteTask(${Number(t.id)})">${iDel} Hapus</button>
                            <div><button class="icon-btn" onclick="event.stopPropagation(); openEditTask(${Number(t.id)}, '${escapeHtml(t.category)}')">${iEdt} Edit</button></div>
                        </div>
                    </div>
                </div>`;
        });
    list.innerHTML = html;
}

function renderHistory(tabName) {
    currentHistoryTab = tabName; 
    if(document.getElementById('tab-tk')) document.getElementById('tab-tk').classList.toggle('active', tabName === 'Tugas Kuliah'); 
    if(document.getElementById('tab-tb')) document.getElementById('tab-tb').classList.toggle('active', tabName === 'Tugas');
    if(document.getElementById('tab-terlewat')) document.getElementById('tab-terlewat').classList.toggle('active', tabName === 'Terlewat');
    updateOverdueTabLabel();
    
    let list = document.getElementById('history-list'); if(!list) return;

    if (tabName === 'Terlewat') {
        const overdueTasks = getOverdueTasks().sort((a, b) => parseLocalDateTime(a.date, a.time) - parseLocalDateTime(b.date, b.time));
        if (overdueTasks.length === 0) {
            list.innerHTML = '<p style="color:var(--text-muted); font-size:14px; text-align:center;">Tidak ada tugas yang terlewat.</p>';
            return;
        }
        let html = '';
        overdueTasks.forEach(t => {
            html += `
                <div class="card" onclick="toggleDetail(this)">
                    <div class="card-header" style="background-color: ${escapeHtml(t.color || 'var(--color-tugas)')};">
                        <div class="card-header-top">
                            <div class="card-title-group">
                                <button class="check-btn" onclick="event.stopPropagation(); toggleTaskDone('${escapeHtml(String(t.id))}')">${iCir}</button>
                                <div>
                                    <h3>${escapeHtml(t.name)}</h3>
                                    <small>${iDat} ${formatShortDate(t.date)}   ${iClk} ${escapeHtml(t.time)}</small>
                                </div>
                            </div>
                            <span class="countdown-badge countdown-alert">Terlewat!</span>
                        </div>
                    </div>
                    <div class="card-detail">
                        <p style="margin-bottom:12px; line-height:1.5;">${escapeHtml(t.deskripsi || t.category)}</p>
                        ${t.pengumpulan ? `<div style="margin-bottom:12px; padding-bottom:12px; border-bottom:1px dashed var(--border-line); font-size:13px;"><strong>Via:</strong> ${escapeHtml(t.pengumpulan)}</div>` : ''}
                        <div class="card-actions three-btns">
                            <button class="icon-btn delete" onclick="event.stopPropagation(); deleteTask(${Number(t.id)})">${iDel} Hapus</button>
                            <div><button class="icon-btn" onclick="event.stopPropagation(); openEditTask(${Number(t.id)}, '${escapeHtml(t.category)}')">${iEdt} Edit</button></div>
                        </div>
                    </div>
                </div>`;
        });
        list.innerHTML = html;
        return;
    }

    let doneTasks = (JSON.parse(localStorage.getItem('polaTasks')) || []).filter(t => t.status === 'done' && t.category === tabName); 
    if(doneTasks.length === 0) { list.innerHTML = '<p style="color:var(--text-muted); font-size:14px; text-align:center;">Belum ada riwayat selesai.</p>'; return; }
    
    let html = '';
    doneTasks.sort((a,b) => b.date.localeCompare(a.date)).forEach(t => { 
        html += `
            <div class="card history-card" onclick="toggleDetail(this)">
                <div class="card-header" style="background-color: ${escapeHtml(t.color || 'var(--color-tugas)')}; opacity:0.8;">
                    <div class="card-header-top">
                        <div class="card-title-group">
                            <button class="check-btn" onclick="event.stopPropagation(); toggleTaskDone('${escapeHtml(String(t.id))}')">${iChkCir}</button>
                            <div>
                                <h3 class="dimmed-text">${escapeHtml(t.name)}</h3>
                                <small class="dimmed-text">${iDat} ${formatShortDate(t.date)}</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-detail">
                    <p style="color:var(--text-muted); line-height:1.5;">${escapeHtml(t.deskripsi || t.category)} ${t.pengumpulan ? `<br>Via: ${escapeHtml(t.pengumpulan)}` : ''}</p>
                    <div class="card-actions three-btns">
                        <button class="icon-btn delete" onclick="event.stopPropagation(); deleteTask(${Number(t.id)})">${iDel} Hapus</button>
                        <div><button class="icon-btn" onclick="event.stopPropagation(); openEditTask(${Number(t.id)}, '${escapeHtml(t.category)}')">${iEdt} Edit</button></div>
                    </div>
                </div>
            </div>`; 
    });
    list.innerHTML = html;
}

function changeMonth(offset) { currentNavDate.setMonth(currentNavDate.getMonth() + offset); renderMonthCalendar(); }

function showDayDetails(dateStr, dayName) {
    let savedMatkul = getActiveMatkulList(); 
    let overrides = JSON.parse(localStorage.getItem('polaOverrides')) || [];
    let savedTasks = JSON.parse(localStorage.getItem('polaTasks')) || [];
    
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
        popUpItems.push({ type: 'kuliah', id: m.id, name: m.name, badge: 'Kuliah', time: time, endTime: end, color: 'var(--color-kuliah)', ruang: ruang, dosen: dosen, origDate: origDate, isOverride: !!m.isOverride });
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
            const actionButtons = item.isOverride
                ? `<div class="card-actions three-btns">
                       <button class="icon-btn delete" onclick="event.stopPropagation(); deleteOverride(${Number(item.id)}, '${escapeHtml(item.origDate)}')">${iDel} Hapus</button>
                       <div><button class="icon-btn" onclick="event.stopPropagation(); openRescheduleModal(${Number(item.id)}, '${escapeHtml(item.origDate)}', '${escapeHtml(dateStr)}')">${iEdt} Pindah Jadwal</button></div>
                   </div>`
                : `<div class="card-actions"><button class="icon-btn" onclick="event.stopPropagation(); openRescheduleModal(${Number(item.id)}, '${escapeHtml(item.origDate)}', '${escapeHtml(dateStr)}')">${iEdt} Pindah Jadwal</button></div>`;
            detailHtml = `
                <div class="detail-grid"><div class="detail-item">${iRom} <div><span>Ruangan</span>${escapeHtml(item.ruang)}</div></div><div class="detail-item">${iUsr} <div><span>Dosen</span>${escapeHtml(item.dosen)}</div></div></div>
                ${actionButtons}`;
        } else if (item.type === 'tugasAcara') {
            let extraInfo = '';
            if(item.via) extraInfo += `<span>Via/Kumpul:</span> <strong>${escapeHtml(item.via)}</strong><br>`;
            if(item.ruang) extraInfo += `<span>Tempat:</span> <strong>${escapeHtml(item.ruang)}</strong><br>`;
            
            detailHtml = `<p style="line-height:1.5;">${escapeHtml(item.desc || 'Tidak ada deskripsi')}</p>${extraInfo ? `<div style="margin-top:12px; padding-top:12px; border-top:1px dashed var(--border-line);">${extraInfo}</div>` : ''}`;
        }

        listHtml += `
            <div class="card" onclick="toggleDetail(this)" style="margin-bottom:10px;">
                <div class="card-header" style="background-color: ${escapeHtml(item.color)}; padding:12px 16px;">
                    <div class="card-header-top">
                        <div class="card-title-group">
                            <div>
                                <h3 style="font-size:14px;">${escapeHtml(item.name)}</h3>
                                <small class="time-badge">${escapeHtml(item.time)} ${item.endTime ? '- ' + escapeHtml(item.endTime) : ''}</small>
                            </div>
                        </div>
                        <span class="tag-pill">${escapeHtml(item.badge)}</span>
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
    const modal = document.getElementById('day-detail-modal');
    const wasOpen = modal.style.display === 'flex';
    modal.style.display = 'flex';
    if (!wasOpen) pushOverlayHistoryState();
}

function openRescheduleModal(matkulId, origDate, activeDate) {
    closeModal('day-detail-modal'); let savedMatkul = getActiveMatkulList(); let overrides = JSON.parse(localStorage.getItem('polaOverrides')) || [];
    let original = savedMatkul.find(m => m.id === matkulId); let existing = overrides.find(o => o.matkulId === matkulId && o.originalDate === origDate);
    document.getElementById('res-matkulId').value = matkulId; document.getElementById('res-originalDate').value = origDate; 
    document.getElementById('res-date').value = existing ? existing.newDate : activeDate; document.getElementById('res-time').value = existing ? existing.newTime : original.jamMulai;
    if(document.getElementById('res-time-end')) document.getElementById('res-time-end').value = existing && existing.newEndTime !== undefined ? existing.newEndTime : original.jamSelesai;
    document.getElementById('res-ruang').value = existing ? existing.newRuangan : original.ruangan; document.getElementById('res-dosen').value = existing ? existing.newDosen : original.dosen;
    hideFabForModal();
    const modal = document.getElementById('reschedule-modal');
    const wasOpen = modal.style.display === 'flex';
    modal.style.display = 'flex';
    captureModalSnapshot('reschedule-modal');
    if (!wasOpen) pushOverlayHistoryState();
}

function saveReschedule() {
    const mId = parseInt(document.getElementById('res-matkulId').value, 10); const origDate = document.getElementById('res-originalDate').value;
    const timeEndInput = document.getElementById('res-time-end'); const newEndTime = timeEndInput ? timeEndInput.value : '';
    let overrides = JSON.parse(localStorage.getItem('polaOverrides')) || []; overrides = overrides.filter(o => !(o.matkulId === mId && o.originalDate === origDate));
    overrides.push({ matkulId: mId, originalDate: origDate, newDate: document.getElementById('res-date').value, newTime: document.getElementById('res-time').value, newEndTime: newEndTime, newRuangan: document.getElementById('res-ruang').value, newDosen: document.getElementById('res-dosen').value });
    localStorage.setItem('polaOverrides', JSON.stringify(overrides));
    closeModal('reschedule-modal');
    refreshAllViews();
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
        const sel = document.getElementById('task-matkul-select');
        let optHtml = '<option value="">-- Pilih Kuliah --</option>';
        let savedMatkul = getActiveMatkulList(); 
        let uniqueMatkul = [];
        savedMatkul.forEach(m => {
            if(!uniqueMatkul.includes(m.name)) {
                uniqueMatkul.push(m.name);
                optHtml += `<option value="${escapeHtml(m.name)}">${escapeHtml(m.name)}</option>`;
            }
        });
        sel.innerHTML = optHtml;
    }
    hideFabForModal();
    const modal = document.getElementById('insert-modal');
    const wasOpen = modal.style.display === 'flex';
    modal.style.display = 'flex';
    captureModalSnapshot('insert-modal');
    if (!wasOpen) pushOverlayHistoryState();
}

function openEditTask(id, category) {
    openModal(category); editId = id; document.getElementById('modal-title').innerText = `Edit ${category}`;
    let savedTasks = JSON.parse(localStorage.getItem('polaTasks')) || []; let task = savedTasks.find(t => t.id == id);
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
    captureModalSnapshot('insert-modal');
}

function openEditRoutine(id) {
    openModal('Rutinitas'); editId = id; document.getElementById('modal-title').innerText = `Edit Rutinitas`;
    let savedRoutines = JSON.parse(localStorage.getItem('polaRoutines')) || []; let routine = savedRoutines.find(r => r.id == id);
    if(routine) {
        document.getElementById('new-task-name').value = routine.name; document.getElementById('new-task-time').value = routine.time;
        if(document.getElementById('new-task-desc')) document.getElementById('new-task-desc').value = routine.desc || '';
        if (document.getElementById('custom-remind-val')) document.getElementById('custom-remind-val').value = routine.remindVal || '';
        if (document.getElementById('custom-remind-unit')) document.getElementById('custom-remind-unit').value = routine.remindUnit || 'minutes';
        if(document.getElementById('new-task-color')) updateSwatchSelection(routine.color);
        document.querySelectorAll('input[name="routine-days"]').forEach(cb => { cb.checked = routine.days.includes(cb.value); });
        syncRoutineSelectAllState();
    }
    captureModalSnapshot('insert-modal');
}

function openEditLibur(id) {
    openModal('Libur'); editId = id; document.getElementById('modal-title').innerText = `Edit Libur`;
    let savedLibur = JSON.parse(localStorage.getItem('polaLibur')) || []; let libur = savedLibur.find(l => l.id == id);
    if(libur) {
        document.getElementById('new-task-name').value = libur.name; 
        document.getElementById('new-task-date').value = libur.startDate;
        if(document.getElementById('new-task-date-end')) document.getElementById('new-task-date-end').value = libur.endDate;
    }
    captureModalSnapshot('insert-modal');
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
        let savedLibur = JSON.parse(localStorage.getItem('polaLibur')) || [];
        if(editId) { const idx = savedLibur.findIndex(l => l.id == editId); if(idx !== -1) savedLibur[idx] = liburData; } else { savedLibur.push(liburData); }
        localStorage.setItem('polaLibur', JSON.stringify(savedLibur));
    } 
    else if(category === 'Rutinitas') {
        const time = document.getElementById('new-task-time').value;
        const descInput = document.getElementById('new-task-desc'); const desc = descInput ? descInput.value : '';
        let selectedDays = []; document.querySelectorAll('input[name="routine-days"]:checked').forEach(cb => selectedDays.push(cb.value));
        if(!name || !time || selectedDays.length === 0) { await polaAlert("Nama, jam, dan hari wajib diisi!"); return; }
        let routineData = { id: editId ? editId : Date.now(), name: name, time: time, days: selectedDays, color: document.getElementById('new-task-color').value, desc: desc, ...reminderData };
        let savedRoutines = JSON.parse(localStorage.getItem('polaRoutines')) || [];
        if(editId) { const idx = savedRoutines.findIndex(r => r.id == editId); if(idx !== -1) savedRoutines[idx] = routineData; } else { savedRoutines.push(routineData); }
        localStorage.setItem('polaRoutines', JSON.stringify(savedRoutines));
    }
    else if(category === 'Kuliah') {
        const matkulName = document.getElementById('task-matkul-select').value; const date = document.getElementById('new-task-date').value; const time = document.getElementById('new-task-time').value;
        const endTime = document.getElementById('new-task-time-end').value; const ruang = document.getElementById('new-task-ruang').value;
        if(!matkulName || !date || !time) { await polaAlert("Pilih Kuliah, Tanggal, dan Jam Mulai!"); return; }
        
        let savedMatkul = getActiveMatkulList(); 
        let orig = savedMatkul.find(m => m.name === matkulName);
        if(!orig) { await polaAlert("Data kuliah tidak ditemukan pada semester aktif!"); return; }

        let overrides = JSON.parse(localStorage.getItem('polaOverrides')) || [];
        overrides.push({ matkulId: orig.id, originalDate: 'EXTRA_'+Date.now(), newDate: date, newTime: time, newEndTime: endTime, newRuangan: ruang || orig.ruangan, newDosen: orig.dosen, ...reminderData });
        localStorage.setItem('polaOverrides', JSON.stringify(overrides));
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
        
        let savedTasks = JSON.parse(localStorage.getItem('polaTasks')) || [];
        if(editId) { const idx = savedTasks.findIndex(t => t.id == editId); if(idx !== -1) savedTasks[idx] = taskData; } else { savedTasks.push(taskData); }
        localStorage.setItem('polaTasks', JSON.stringify(savedTasks));
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
    const modal = document.getElementById('matkul-modal');
    const wasOpen = modal.style.display === 'flex';
    modal.style.display = 'flex';
    captureModalSnapshot('matkul-modal');
    if (!wasOpen) pushOverlayHistoryState();
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

    let savedMatkul = JSON.parse(localStorage.getItem('polaMatkul')) || [];
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
    localStorage.setItem('polaMatkul', JSON.stringify(savedMatkul));
    closeModal('matkul-modal');
    refreshAllViews();
}

function renderMatkulList() {
    const list = document.getElementById('matkul-list'); if(!list) return;
    const activeSem = getActiveSemesterObj();
    const subEl = document.getElementById('active-semester-subtitle');
    if (subEl && activeSem) subEl.innerText = activeSem.name;

    let savedMatkul = getActiveMatkulList();
    if(savedMatkul.length === 0) {
        const semName = activeSem ? escapeHtml(activeSem.name) : 'semester ini';
        list.innerHTML = `<div class="empty-state-center"><p>Belum ada jadwal kuliah di ${semName}.</p></div>`;
        return;
    }
    
    const namaHariUrut = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    savedMatkul.sort((a, b) => {
        let indexA = namaHariUrut.indexOf(a.hari);
        let indexB = namaHariUrut.indexOf(b.hari);
        if (indexA !== indexB) {
            return indexA - indexB;
        }
        return a.jamMulai.localeCompare(b.jamMulai);
    });
    
    let html = '';
    savedMatkul.forEach(m => { 
        html += `
            <div class="card" onclick="toggleDetail(this)">
                <div class="card-header" style="background-color: var(--color-kuliah);">
                    <div class="card-header-top">
                        <div class="card-title-group">
                            <div>
                                <h3 style="font-size:15px;">${escapeHtml(m.name)}</h3>
                                <small class="time-badge">${escapeHtml(m.hari)}</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-detail">
                    <div class="detail-grid">
                        <div class="detail-item">${iClk} <div><span>Waktu</span>${escapeHtml(m.jamMulai)} - ${escapeHtml(m.jamSelesai)}</div></div>
                        <div class="detail-item">${iRom} <div><span>Ruangan</span>${escapeHtml(m.ruangan)}</div></div>
                        <div class="detail-item" style="grid-column: span 2;">${iUsr} <div><span>Dosen Pengampu</span>${escapeHtml(m.dosen)}</div></div>
                    </div>
                    <div class="card-actions three-btns">
                        <button class="icon-btn delete" onclick="event.stopPropagation(); deleteMatkul(${Number(m.id)})">${iDel} Hapus</button>
                        <div><button class="icon-btn" onclick="event.stopPropagation(); editMatkul(${Number(m.id)})">${iEdt} Edit</button></div>
                    </div>
                </div>
            </div>`; 
    });
    list.innerHTML = html;
}

function editMatkul(id) {
    ensureReminderFieldsInjected();
    let savedMatkul = JSON.parse(localStorage.getItem('polaMatkul')) || []; let m = savedMatkul.find(x => x.id == id);
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
        const modal = document.getElementById('matkul-modal');
        const wasOpen = modal.style.display === 'flex';
        modal.style.display = 'flex';
        captureModalSnapshot('matkul-modal');
        if (!wasOpen) pushOverlayHistoryState();
    }
}

async function deleteMatkul(id) {
    const ok = await polaConfirm('Hapus jadwal mata kuliah ini?', 'Hapus Mata Kuliah', 'Hapus');
    if(!ok) return;
    let savedMatkul = JSON.parse(localStorage.getItem('polaMatkul')) || []; savedMatkul = savedMatkul.filter(m => m.id != id);
    localStorage.setItem('polaMatkul', JSON.stringify(savedMatkul));

    let overrides = JSON.parse(localStorage.getItem('polaOverrides')) || [];
    overrides = overrides.filter(o => String(o.matkulId) !== String(id));
    localStorage.setItem('polaOverrides', JSON.stringify(overrides));

    refreshAllViews();
}

document.addEventListener("DOMContentLoaded", () => { 
    ensurePolaDialogExists();
    ensurePagesCarouselStructure();
    ensureSideDrawerStickyFooter();
    document.querySelectorAll('.fab').forEach(f => f.innerHTML = iPls);
    updateFabForCurrentPage();
    getOrCreateFabBackdrop();
    initRoutineSelectAll();
    initFabScrollBehavior();
    ensureReminderFieldsInjected();
    initUnifiedSwipeGestures();
    initAndroidBackButtonHandler();

    // Render awal semua tab agar siap digeser seketika tanpa delay
    if (document.getElementById('calendar-grid')) {
        renderMonthCalendar();
        renderUpcomingTasks();
        renderHistory(currentHistoryTab);
    }
    if (document.getElementById('matkul-list')) {
        renderMatkulList();
    }

    document.querySelectorAll('.swatch').forEach(sw => { 
        sw.addEventListener('click', function(e) { 
            e.stopPropagation(); updateSwatchSelection(this.dataset.color); 
        }); 
    });

    // --- KLIK AREA BLUR DI LUAR KOTAK MODAL ---
    window.addEventListener('click', async function(e) {
        if (isPromptingUnsavedModal || isElementFlexVisible('pola-dialog-overlay')) return;

        const infoModals = ['day-detail-modal', 'backup-modal', 'city-manual-modal'];
        for (const modalId of infoModals) {
            const overlay = document.getElementById(modalId);
            if (overlay && overlay.style.display === 'flex' && e.target === overlay) {
                closeModal(modalId);
                return;
            }
        }

        for (const formModalId of FORM_MODAL_IDS) {
            const overlay = document.getElementById(formModalId);
            if (overlay && overlay.style.display === 'flex' && e.target === overlay) {
                await requestCloseModal(formModalId);
                return;
            }
        }
    });

    // --- LOGIKA ANIMASI INTRO ANTI-STUCK ---
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