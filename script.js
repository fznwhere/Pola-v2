let currentNavDate = new Date();
let editId = null;
const namaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
let currentHistoryTab = 'Tugas Kuliah';
let currentDrawerTab = 'Rutinitas';
let editSemesterId = null;

const liburNasional = {
    "2026-01-01": "Tahun Baru Masehi", "2026-02-18": "Isra Mikraj", "2026-02-19": "Tahun Baru Imlek", "2026-03-20": "Hari Raya Nyepi / Idul Fitri",
    "2026-03-21": "Idul Fitri", "2026-04-03": "Wafat Isa Al Masih", "2026-05-01": "Hari Buruh Nasional", "2026-05-14": "Kenaikan Isa Al Masih",
    "2026-05-27": "Idul Adha", "2026-05-31": "Hari Raya Waisak", "2026-06-01": "Hari Lahir Pancasila", "2026-08-17": "Hari Kemerdekaan RI",
    "2026-08-25": "Maulid Nabi Muhammad SAW", "2026-12-25": "Hari Raya Natal"
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

// --- LOKASI USER & JADWAL SALAT DINAMIS ---
function getSavedCoordinates() {
    const saved = JSON.parse(localStorage.getItem('nalaUserLocation'));
    if (saved && typeof saved.lat === 'number' && typeof saved.lng === 'number') {
        return saved;
    }
    return { lat: -7.7956, lng: 110.3695, isFallback: true };
}

function refreshUserCoordinates() {
    return new Promise((resolve) => {
        const current = getSavedCoordinates();
        if (!navigator.geolocation) {
            resolve(current);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = Number(pos.coords.latitude.toFixed(4));
                const lng = Number(pos.coords.longitude.toFixed(4));
                const movedFar =
                    current.isFallback ||
                    Math.abs(lat - current.lat) > 0.15 ||
                    Math.abs(lng - current.lng) > 0.15;

                const updated = { lat, lng, isFallback: false, updatedAt: Date.now() };
                localStorage.setItem('nalaUserLocation', JSON.stringify(updated));

                if (movedFar) {
                    Object.keys(localStorage).forEach((k) => {
                        if (k.startsWith('nalaSalat_')) localStorage.removeItem(k);
                    });
                    if (document.getElementById('schedule-list')) loadTodaySchedule();
                    if (typeof syncAndroidAlarms === 'function') syncAndroidAlarms();
                }
                resolve(updated);
            },
            () => resolve(current),
            { enableHighAccuracy: false, timeout: 6000, maximumAge: 30 * 60 * 1000 }
        );
    });
}

async function fetchSalatTimingsForDate(dateObj, dateStr) {
    const loc = getSavedCoordinates();
    const locKey = `${loc.lat.toFixed(2)}_${loc.lng.toFixed(2)}`;
    const cacheKey = `nalaSalat_${dateStr}_${locKey}`;
    const cached = JSON.parse(localStorage.getItem(cacheKey));
    if (cached && Array.isArray(cached) && cached.length === 5) {
        return cached;
    }

    const dd = String(dateObj.getDate()).padStart(2, '0');
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const yyyy = dateObj.getFullYear();

    try {
        const res = await fetch(
            `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${loc.lat}&longitude=${loc.lng}&method=11`
        );
        const t = (await res.json()).data.timings;
        const result = [
            { name: 'Subuh', time: t.Fajr.slice(0, 5) },
            { name: 'Zuhur', time: t.Dhuhr.slice(0, 5) },
            { name: 'Asar', time: t.Asr.slice(0, 5) },
            { name: 'Maghrib', time: t.Maghrib.slice(0, 5) },
            { name: 'Isya', time: t.Isha.slice(0, 5) }
        ];
        localStorage.setItem(cacheKey, JSON.stringify(result));
        return result;
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
    if (!insertModal || insertModal.style.display !== 'flex') {
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
            container.innerHTML = '<p style="color:var(--text-muted); font-size:14px; text-align:center; margin:28px 0;">Belum ada rutinitas.</p>';
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
        container.innerHTML = html;
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
            container.innerHTML = '<p style="color:var(--text-muted); font-size:14px; text-align:center; margin:28px 0;">Belum ada acara.</p>';
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

        container.innerHTML = html;
    } else if (currentDrawerTab === 'Libur') {
        if (labelEl) labelEl.innerText = 'Hari Libur';
        const libur = JSON.parse(localStorage.getItem('nalaLibur')) || [];

        if (libur.length === 0) {
            container.innerHTML = '<p style="color:var(--text-muted); font-size:14px; text-align:center; margin:28px 0;">Belum ada jadwal hari libur.</p>';
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

        container.innerHTML = html;
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
        if (insertModal && insertModal.style.display === 'flex') return;

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
        if (insertModal && insertModal.style.display === 'flex') return;

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
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
    if (id !== 'semester-form-modal') editId = null;
    showFabAfterModal();
}

function toggleDetail(element) { const detail = element.querySelector('.card-detail'); if(detail) detail.classList.toggle('show'); }
function formatShortDate(dateStr) {
    if(!dateStr) return ''; const parts = dateStr.split('-');
    if(parts.length !== 3) return dateStr; return `${parts[2]}-${parts[1]}-${parts[0].substring(2)}`;
}

function isUserHoliday(dateStr) {
    let savedLibur = JSON.parse(localStorage.getItem('nalaLibur')) || [];
    let tDate = new Date(dateStr); tDate.setHours(0,0,0,0);
    for(let l of savedLibur) {
        let sDate = new Date(l.startDate); sDate.setHours(0,0,0,0);
        let eDate = new Date(l.endDate); eDate.setHours(0,0,0,0);
        if(tDate >= sDate && tDate <= eDate) return l.name;
    }
    return null;
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
ensureSemesterInitialized();
if(document.getElementById('schedule-list')) {
    loadTodaySchedule();
    refreshUserCoordinates();
}

async function loadTodaySchedule() {
    const list = document.getElementById('schedule-list'); const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const todayDayName = namaHari[today.getDay()]; let combinedSchedule = [];
    
    let savedMatkul = getActiveMatkulList(); let overrides = JSON.parse(localStorage.getItem('nalaOverrides')) || [];
    let savedTasks = JSON.parse(localStorage.getItem('nalaTasks')) || []; let savedRoutines = JSON.parse(localStorage.getItem('nalaRoutines')) || [];

    let isHoliday = liburNasional[todayStr] || isUserHoliday(todayStr);
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
        } else { detailHtml = `<p>${item.desc}</p>`; }

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
            tabsContainer.innerHTML += `<button class="tab-btn" id="tab-terlewat" onclick="renderHistory('Terlewat')">Tugas Terlewat</button>`;
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
    
    const realToday = new Date();
    const realTodayStr = `${realToday.getFullYear()}-${String(realToday.getMonth()+1).padStart(2, '0')}-${String(realToday.getDate()).padStart(2, '0')}`;
    
    const monthDisplayEl = document.getElementById('month-display-text');
    if(monthDisplayEl) {
        monthDisplayEl.innerText = currentNavDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
        const isDifferentMonth = year !== realToday.getFullYear() || month !== realToday.getMonth();
        let jumpBtn = document.getElementById('today-jump-pill');
        if (isDifferentMonth) {
            if (!jumpBtn) {
                jumpBtn = document.createElement('button');
                jumpBtn.id = 'today-jump-pill';
                jumpBtn.type = 'button';
                jumpBtn.className = 'today-jump-pill';
                jumpBtn.innerText = 'Hari Ini';
                jumpBtn.onclick = jumpToTodayMonth;
                monthDisplayEl.parentNode.appendChild(jumpBtn);
            }
            jumpBtn.style.display = 'inline-block';
        } else if (jumpBtn) {
            jumpBtn.style.display = 'none';
        }
    }
    if(document.getElementById('native-month-picker')) document.getElementById('native-month-picker').value = `${year}-${String(month+1).padStart(2, '0')}`;
    
    ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].forEach(d => { grid.innerHTML += `<div class="day-name">${d}</div>`; });
    const firstDay = new Date(year, month, 1).getDay(); const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDays = new Date(year, month, 0).getDate();
    
    let savedTasks = JSON.parse(localStorage.getItem('nalaTasks')) || []; let savedMatkul = getActiveMatkulList(); let overrides = JSON.parse(localStorage.getItem('nalaOverrides')) || [];
    
    for(let i = firstDay - 1; i >= 0; i--) { grid.innerHTML += `<div class="day-cell dimmed" onclick="changeMonth(-1)"><span class="day-number">${prevDays - i}</span></div>`; }
    for(let i = 1; i <= daysInMonth; i++) {
        let currentLoopDate = `${year}-${String(month+1).padStart(2, '0')}-${String(i).padStart(2, '0')}`; let loopDayName = namaHari[new Date(year, month, i).getDay()];
        
        let dayColors = []; 
        let isHoliday = liburNasional[currentLoopDate] || isUserHoliday(currentLoopDate);
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
    
    let isHoliday = liburNasional[dateStr] || isUserHoliday(dateStr); 
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
    
    let holidayText = isHoliday ? ` ${isHoliday}` : '';
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
        const dismissibleModals = ['day-detail-modal']; 
        
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