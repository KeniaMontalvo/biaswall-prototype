// ============================================================
// STATE MAP
//   0 → Pending    (grey, dimmed)
//   1 → Have       (sage border, no leaf)
//   2 → Wishlist   (sky-blue leaf)
//   3 → On the Way (yellow leaf)
//   4 → Trade      (pink leaf — only shown in Trade section)
// ============================================================

let currentArtist   = 'bts';
let userProgress    = JSON.parse(localStorage.getItem('userProgress') || '{}');
let selectedMembers = new Set(['todos']);
let quantityFilter  = 'all';
let searchQuery     = '';

if (!window.userReps) {
    window.userReps = JSON.parse(localStorage.getItem('userReps') || '{}');
}

// Tracking info: { [memberId]: { carrierId, trackingNumber, notes } }
let trackingData = JSON.parse(localStorage.getItem('trackingData') || '{}');

// ============================================================
// CARRIERS — display name + tracking URL template
// {n} is replaced with the tracking number
// ============================================================
const CARRIERS = [
    { id: 'fedex',      label: 'FedEx',           url: 'https://www.fedex.com/fedextrack/?trknbr={n}' },
    { id: 'dhl',        label: 'DHL',              url: 'https://www.dhl.com/us-en/home/tracking/tracking-express.html?submit=1&tracking-id={n}' },
    { id: 'ups',        label: 'UPS',              url: 'https://www.ups.com/track?tracknum={n}' },
    { id: 'usps',       label: 'USPS',             url: 'https://tools.usps.com/go/TrackConfirmAction?tLabels={n}' },
    { id: 'correosmx',  label: 'Correos MX',       url: 'https://www.correosdemexico.gob.mx/SSLServicios/ConsultaCP/Rastreo.aspx?num={n}' },
    { id: 'estafeta',   label: 'Estafeta',         url: 'https://www.estafeta.com/Herramientas/Rastreo?wayBillType=1&wayBill={n}' },
    { id: 'paquetexpress', label: 'Paquete Express', url: 'https://www.paquetexpress.com.mx/rastreo/?guia={n}' },
    { id: 'redpack',    label: 'Redpack',           url: 'https://www.redpack.com.mx/es/rastreo/?guias={n}' },
    { id: 'gls',        label: 'GLS',              url: 'https://gls-group.com/track/{n}' },
    { id: 'shopee',     label: 'Shopee',           url: 'https://shopee.com.mx/order' },
    { id: 'weverse',    label: 'Weverse Shop',     url: 'https://shop.weverse.io/ko/orders' },
    { id: 'other',      label: 'Other / Manual',   url: '' },
];

// ============================================================
// LEAF SVG helper
// ============================================================
const LEAF_SVG_PATH = `M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z`;

// Colors per status (only statuses that show a leaf)
const LEAF_COLORS = {
    2: '#A8D4E6',   // Wishlist — sky blue
    3: '#F9E4A0',   // On the Way — soft yellow
    4: '#F7D1D1',   // Trade — pale rose
};

function makeLeafSVG(color) {
    return `<svg viewBox="0 0 24 24"><path d="${LEAF_SVG_PATH}" fill="${color}"/></svg>`;
}

// ============================================================
// ONBOARDING / NAVIGATION
// ============================================================
function selectInitialArtist(artistId) {
    currentArtist = artistId;
    document.getElementById('view-onboarding').style.display = 'none';
    document.getElementById('main-app').style.display = 'flex';

    const headerName = document.getElementById('header-artist-name');
    if (headerName) headerName.innerText = artistId.toUpperCase();

    const settingsArtist = document.getElementById('settings-artist-name');
    if (settingsArtist) settingsArtist.innerText = artistId.toUpperCase();

    selectedMembers = new Set(['todos']);
    quantityFilter  = 'all';
    searchQuery     = '';

    updateMemberFilters();
    renderCollection();
    switchView('coleccion');
}

function goToOnboarding() {
    document.getElementById('main-app').style.display = 'none';
    document.getElementById('view-onboarding').style.display = 'flex';
}

function switchView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.style.display = 'none');

    const target = document.getElementById('view-' + viewId);
    if (target) target.style.display = 'block';

    // Sticky filter bar + legend — only in collection view
    const filterBar = document.getElementById('sticky-filter-bar');
    const legend    = document.getElementById('footer-legend');
    const isCol     = viewId === 'coleccion';
    if (filterBar) filterBar.style.display = isCol ? '' : 'none';
    if (legend)    legend.style.display    = isCol ? 'flex' : 'none';

    // Active nav
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    const activeBtn = document.querySelector(`.nav-item[onclick*="${viewId}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    if (viewId === 'stats')    updateStats();
    if (viewId === 'trade')    renderTradeView();
    if (viewId === 'ontheway') renderOTWView();
}

// ============================================================
// HINT STRIP
// ============================================================
function dismissHint() {
    const hint = document.getElementById('hint-strip');
    if (hint) { hint.style.display = 'none'; localStorage.setItem('hint_dismissed', '1'); }
}

// ============================================================
// MEMBER FILTER CHIPS — generated from groupsData dynamically
// ============================================================
function updateMemberFilters() {
    const panel = document.getElementById('member-checkbox-panel');
    if (!panel) return;
    panel.innerHTML = '';
    selectedMembers = new Set(['todos']);

    // Collect unique member names across all versions of all albums
    const nameSet = new Set();
    (groupsData[currentArtist] || []).forEach(album => {
        album.versions.forEach(version => {
            version.members.forEach(m => {
                // Skip "Group" / "Unit" type entries from the chip list
                if (!['group','unit 1','unit 2','unit'].includes(m.name.toLowerCase())) {
                    nameSet.add(m.name);
                }
            });
        });
    });

    createChip('ALL', 'todos', true, panel);
    nameSet.forEach(name => createChip(name, name, false, panel));
}

function createChip(label, value, isAll, container) {
    const wrapper = document.createElement('div');
    wrapper.className = 'member-checkbox-wrapper';

    const input = document.createElement('input');
    input.type      = 'checkbox';
    input.className = 'member-checkbox-input';
    input.value     = value;
    input.id        = `member-filter-${value}`;
    if (value === 'todos') input.checked = true;

    const lbl = document.createElement('label');
    lbl.className = isAll ? 'member-label all-label' : 'member-label';
    lbl.htmlFor   = `member-filter-${value}`;
    lbl.innerText = label;

    input.addEventListener('change', handleMemberChipChange);
    wrapper.appendChild(input);
    wrapper.appendChild(lbl);
    container.appendChild(wrapper);
}

function handleMemberChipChange(e) {
    const { value, checked } = e.target;

    if (value === 'todos') {
        if (checked) {
            document.querySelectorAll('.member-checkbox-input').forEach(c => {
                if (c.value !== 'todos') c.checked = false;
            });
            selectedMembers.clear();
            selectedMembers.add('todos');
        }
    } else {
        if (checked) {
            const allChk = document.getElementById('member-filter-todos');
            if (allChk) allChk.checked = false;
            selectedMembers.delete('todos');
            selectedMembers.add(value);
        } else {
            selectedMembers.delete(value);
            if (selectedMembers.size === 0) {
                const allChk = document.getElementById('member-filter-todos');
                if (allChk) allChk.checked = true;
                selectedMembers.add('todos');
            }
        }
    }
    renderCollection();
}

// ============================================================
// STATUS FILTER TABS
// ============================================================
function setQuantityFilter(type, btn) {
    quantityFilter = type;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderCollection();
}

// ============================================================
// REAL-TIME SEARCH
// ============================================================
function handleSearch(val) {
    searchQuery = val.trim().toLowerCase();
    const clearBtn = document.getElementById('search-clear');
    if (clearBtn) clearBtn.style.display = searchQuery ? 'flex' : 'none';
    renderCollection();
}

function clearSearch() {
    const input = document.getElementById('search-input');
    if (input) input.value = '';
    searchQuery = '';
    const clearBtn = document.getElementById('search-clear');
    if (clearBtn) clearBtn.style.display = 'none';
    renderCollection();
}

// ============================================================
// RENDER COLLECTION (full rebuild on filter change)
// ============================================================
function renderCollection() {
    const grid = document.getElementById('collection-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const showPOBs = document.getElementById('pob-switch')?.checked ?? true;
    const showSpecial = document.getElementById('toggle-sa')?.checked ?? true;
    const showJapanese = document.getElementById('toggle-jp')?.checked ?? true;

    const albums   = groupsData[currentArtist] || [];
    let   anyVisible = false;

    albums.forEach(album => {

        if (album.category === 'special' && !showSpecial) return;
        if (album.category === 'japanese' && !showJapanese) return;

        album.versions.forEach(version => {
            if (version.is_pob && !showPOBs) return;

            // Search: match album name or version subname
            if (searchQuery) {
                const hay = `${album.album} ${version.subname}`.toLowerCase();
                if (!hay.includes(searchQuery)) return;
            }

            const ownedInVersion = version.members.filter(
                m => (userProgress[m.id] || 0) === 1
            ).length;

            const section = document.createElement('div');
            section.className = 'era-section';
            section.innerHTML = `
                <div class="era-title">
                    <span class="era-album-name">${album.album}</span>
                    <span class="era-version-name">— ${version.subname}</span>
                    <span class="era-count">${ownedInVersion}/${version.members.length}</span>
                </div>
                <div class="pc-grid"></div>
            `;

            const pcGrid = section.querySelector('.pc-grid');
            let sectionHasCards = false;

            version.members.forEach(member => {
                const status = userProgress[member.id] || 0;

                // Member filter
                const matchesMember = selectedMembers.has('todos') || selectedMembers.has(member.name);

                // Status filter
                //   'all'  → show everything
                //   'have' → status 1
                //   'way'  → status 3
                //   'wish' → status 2
                let matchesQuantity = true;
                if (quantityFilter === 'have') matchesQuantity = status === 1;
                if (quantityFilter === 'way')  matchesQuantity = status === 3;
                if (quantityFilter === 'wish') matchesQuantity = status === 2;

                if (!matchesMember || !matchesQuantity) return;

                sectionHasCards = true;
                pcGrid.appendChild(buildPCWrapper(member, status, false));
            });

            if (sectionHasCards) {
                grid.appendChild(section);
                anyVisible = true;
            }
        });
    });

    if (!anyVisible) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🌿</div>
                <p>No photocards match your current filters.</p>
            </div>`;
    }
}

// ============================================================
// BUILD A SINGLE PC WRAPPER
//   showTradeBadge: only true when called from trade view
// ============================================================
function buildPCWrapper(member, status, showTradeBadge = false) {
    const wrapper = document.createElement('div');
    wrapper.className = 'pc-wrapper';
    wrapper.id        = `wrapper-${member.id}`;

    // ── Card ──
    const pc = document.createElement('div');
    pc.className = `photocard status-${status}`;
    pc.id        = `pc-${member.id}`;

    const hasImg = member.img && member.img !== 'URL_AQUÍ';
    if (hasImg) {
        pc.innerHTML = `
            <img src="${member.img}" class="pc-image" alt="${member.name}"
                 onerror="this.onerror=null;this.parentElement.innerHTML='<div class=\\'pc-placeholder\\'><span>${member.name}</span></div>';">
            <div class="pc-name">${member.name}</div>`;
    } else {
        pc.innerHTML = `
            <div class="pc-placeholder"><span>${member.name}</span></div>
            <div class="pc-name">${member.name}</div>`;
    }

    // ── Interactions ──
    let timer, isLongPress = false;

    const startPress = () => {
        isLongPress = false;
        timer = setTimeout(() => {
            isLongPress = true;
            resetCard(member.id);
            if (navigator.vibrate) navigator.vibrate(50);
        }, 800);
    };

    const handleRelease = (e) => {
        clearTimeout(timer);
        if (e.cancelable) e.preventDefault();
        if (isLongPress) { setTimeout(() => { isLongPress = false; }, 100); return; }
        handleTap(member.id);
    };

    pc.addEventListener('mousedown',  (e) => { if (e.detail > 0) startPress(); });
    pc.addEventListener('mouseup',    (e) => { if (e.detail > 0) handleRelease(e); });
    pc.addEventListener('mouseleave', ()  => clearTimeout(timer));
    pc.addEventListener('touchstart', startPress,    { passive: false });
    pc.addEventListener('touchend',   handleRelease, { passive: false });

    wrapper.appendChild(pc);

    // ── Leaf badge ──
    // Modificado para que incluya el status 4 (Trade)
    // Mostramos la hoja si:
    // status 2 (Wishlist/Priority), status 3 (On the Way) O status 4 (Trade)
    const shouldShowLeaf = (status === 2 || status === 3 || status === 4);
    
    const badge = buildLeafBadge(status, shouldShowLeaf); 
    if (badge) wrapper.appendChild(badge);

    return wrapper;
}

function buildLeafBadge(status, showTradeBadge) {
    // Determine which statuses to badge
    let color = null;
    if (status === 2) color = LEAF_COLORS[2]; // Wishlist — always show
    if (status === 3) color = LEAF_COLORS[3]; // On the Way — always show
    if (status === 4) color = LEAF_COLORS[4]; // Trade — always show

    if (!color) return null;

    const badge = document.createElement('div');
    badge.className = 'leaf-badge-overlay';
    badge.innerHTML = makeLeafSVG(color);
    return badge;
}

// ============================================================
// SURGICAL SINGLE-CARD UPDATE (no full re-render on tap)
// ============================================================
function updateSingleCardUI(memberId, newStatus) {
    const pc      = document.getElementById(`pc-${memberId}`);
    const wrapper = document.getElementById(`wrapper-${memberId}`);
    if (!pc || !wrapper) { renderCollection(); return; }

    // Update class
    pc.className = `photocard status-${newStatus}`;

    // Rebuild leaf badge
    const old = wrapper.querySelector('.leaf-badge-overlay');
    if (old) old.remove();
    const fresh = buildLeafBadge(newStatus, false); // collection context
    if (fresh) wrapper.appendChild(fresh);

    // Update era counter
    updateEraCounter(wrapper);
}

function updateEraCounter(wrapper) {
    const section = wrapper.closest('.era-section');
    if (!section) return;
    const counter = section.querySelector('.era-count');
    if (!counter) return;
    const all   = section.querySelectorAll('.pc-wrapper');
    const owned = [...all].filter(w => w.querySelector('.photocard')?.classList.contains('status-1')).length;
    counter.textContent = `${owned}/${all.length}`;
}

// ============================================================
// TAP / RESET
// ============================================================
function handleTap(memberId) {
    const cur  = userProgress[memberId] || 0;
    // Cycle: 0 → 1 (Have) → 2 (Wishlist) → 3 (On the Way) → 4 (Trade) → 0
    const next = (cur + 1) % 5;
    userProgress[memberId] = next;
    localStorage.setItem('userProgress', JSON.stringify(userProgress));
    updateSingleCardUI(memberId, next);
    updateStats();
}

function resetCard(id) {
    userProgress[id] = 0;
    localStorage.setItem('userProgress', JSON.stringify(userProgress));
    updateSingleCardUI(id, 0);
    updateStats();
}

// ============================================================
// STATS
// ============================================================
function updateStats() {
    const albums = groupsData[currentArtist] || [];
    let total = 0, owned = 0, tradeCount = 0, wishCount = 0;

    const eraList = document.getElementById('era-stats-list');
    if (eraList) eraList.innerHTML = '';

    albums.forEach(album => {
        album.versions.forEach(version => {
            let vOwned = 0;
            const vTotal = version.members.length;
            total += vTotal;

            version.members.forEach(m => {
                const s = userProgress[m.id] || 0;
                if (s === 1) { vOwned++; owned++; }
                if (s === 4) tradeCount++;
                if (s === 2) wishCount++;
            });

            const pct = Math.round((vOwned / vTotal) * 100) || 0;
            if (eraList) {
                eraList.innerHTML += `
                    <div class="era-stat-row">
                        <div class="era-stat-info">
                            <span>${album.album} — ${version.subname}</span>
                            <span>${pct}%</span>
                        </div>
                        <div class="progress-bar-bg">
                            <div class="progress-bar-fill" style="width:${pct}%"></div>
                        </div>
                    </div>`;
            }
        });
    });

    const pct = Math.round((owned / total) * 100) || 0;
    const $ = id => document.getElementById(id);

    if ($('stat-obtained'))       $('stat-obtained').innerText        = owned;
    if ($('stat-missing'))        $('stat-missing').innerText         = total - owned;
    if ($('stat-reps'))           $('stat-reps').innerText            = tradeCount;
    if ($('stat-total'))          $('stat-total').innerText           = total;
    if ($('stat-wishlist'))       $('stat-wishlist').innerText        = wishCount;
    if ($('stat-wishlist-percent')) $('stat-wishlist-percent').innerText = `${pct}%`;
    if ($('total-percent-text'))  $('total-percent-text').innerText   = `${pct}% complete`;
    if ($('total-progress-fill')) $('total-progress-fill').style.width = `${pct}%`;

    const sub = $('stats-subtitle');
    if (sub) sub.innerText = `${currentArtist.toUpperCase()} · All versions`;
}

// ============================================================
// ON THE WAY VIEW
// ============================================================
function renderOTWView() {
    const list = document.getElementById('otw-list');
    if (!list) return;
    list.innerHTML = '';

    const albums = groupsData[currentArtist] || [];
    let hasOTW   = false;

    albums.forEach(album => {
        album.versions.forEach(version => {
            version.members.forEach(member => {
                if ((userProgress[member.id] || 0) !== 3) return;
                hasOTW = true;

                const saved   = trackingData[member.id] || {};
                const carrier = CARRIERS.find(c => c.id === saved.carrierId) || null;
                const hasInfo = saved.carrierId || saved.trackingNumber;

                const card = document.createElement('div');
                card.className = 'otw-card';
                card.id        = `otw-card-${member.id}`;

                const hasImg = member.img && member.img !== 'URL_AQUÍ';
                const imgSrc = hasImg
                    ? member.img
                    : `https://placehold.co/80x120/fffde8/9c9289?text=${encodeURIComponent(member.name)}`;

                // Build status line
                let statusLine = `<span class="otw-no-info">No tracking info yet — tap to add</span>`;
                if (hasInfo) {
                    const carrierLabel = carrier ? carrier.label : (saved.carrierId || 'Unknown');
                    statusLine = `
                        <span class="otw-carrier-label">${carrierLabel}</span>
                        ${saved.trackingNumber
                            ? `<span class="otw-tracking-num">${saved.trackingNumber}</span>`
                            : '<span class="otw-no-info">No tracking number</span>'}
                    `;
                }

                card.innerHTML = `
                    <div class="otw-card-img-wrap">
                        <img src="${imgSrc}" class="otw-card-img"
                             onerror="this.onerror=null;this.src='https://placehold.co/80x120/fffde8/9c9289?text=${encodeURIComponent(member.name)}';">
                        <span class="otw-leaf-chip">${makeLeafSVG('#F9E4A0')}</span>
                    </div>
                    <div class="otw-card-info">
                        <div class="otw-card-top">
                            <span class="otw-member-name">${member.name}</span>
                            <span class="otw-album-name">${album.album} — ${version.subname}</span>
                        </div>
                        <div class="otw-status-line">${statusLine}</div>
                        ${saved.notes ? `<div class="otw-notes">${saved.notes}</div>` : ''}
                    </div>
                    <div class="otw-card-actions">
                        <button class="otw-edit-btn" onclick="openTrackingModal('${member.id}','${member.name.replace(/'/g,"\\'")}','${album.album.replace(/'/g,"\\'")} — ${version.subname.replace(/'/g,"\\'")}')">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        ${(hasInfo && saved.trackingNumber && carrier && carrier.url)
                            ? `<button class="otw-track-btn" onclick="openTrackingURL('${member.id}')">
                                   <i class="fa-solid fa-arrow-up-right-from-square"></i> Track
                               </button>`
                            : ''}
                    </div>
                `;

                list.appendChild(card);
            });
        });
    });

    if (!hasOTW) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📦</div>
                <p>No photocards marked as On the Way yet.</p>
                <p style="font-size:11px;margin-top:6px;">Tap any card in your collection and cycle it to the yellow leaf status.</p>
            </div>`;
    }
}

// Open the carrier's tracking page with the number pre-filled
function openTrackingURL(memberId) {
    const saved   = trackingData[memberId];
    if (!saved?.carrierId || !saved?.trackingNumber) {
        showToast('Add a carrier and tracking number first.');
        return;
    }
    const carrier = CARRIERS.find(c => c.id === saved.carrierId);
    if (!carrier || !carrier.url) {
        showToast('No tracking URL for this carrier. Open their website manually.');
        return;
    }
    const url = carrier.url.replace('{n}', encodeURIComponent(saved.trackingNumber));
    window.open(url, '_blank', 'noopener');
}

// ============================================================
// TRACKING MODAL
// ============================================================
function openTrackingModal(memberId, memberName, albumLabel) {
    const existing = document.getElementById('tracking-modal');
    if (existing) existing.remove();

    const saved = trackingData[memberId] || { carrierId: '', trackingNumber: '', notes: '' };

    // Build carrier options
    const carrierOptions = CARRIERS.map(c =>
        `<option value="${c.id}" ${saved.carrierId === c.id ? 'selected' : ''}>${c.label}</option>`
    ).join('');

    const LEAF_SVG_INLINE = `<svg viewBox="0 0 24 24" style="width:15px;height:15px;display:block;"><path d="${LEAF_SVG_PATH}" fill="#F9E4A0"/></svg>`;

    const modal = document.createElement('div');
    modal.id        = 'tracking-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-sheet">
            <div class="modal-handle"></div>

            <div class="modal-header">
                <div class="modal-title-block">
                    <span class="modal-leaf-icon">${LEAF_SVG_INLINE}</span>
                    <div>
                        <h3 class="modal-title">${memberName}</h3>
                        <p class="modal-subtitle">${albumLabel || 'On the Way'}</p>
                    </div>
                </div>
                <button class="modal-close" onclick="closeTrackingModal()">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <div class="modal-body">

                <div class="modal-field">
                    <label class="modal-label">Carrier / Shop</label>
                    <select id="track-carrier" class="modal-input modal-select">
                        <option value="">— Select carrier —</option>
                        ${carrierOptions}
                    </select>
                </div>

                <div class="modal-field">
                    <label class="modal-label">Tracking Number</label>
                    <div class="modal-input-row">
                        <input id="track-number" class="modal-input" type="text"
                               placeholder="e.g. 7489 4355 0246 0"
                               value="${saved.trackingNumber}"
                               autocomplete="off" spellcheck="false">
                        <button class="modal-copy-btn" onclick="copyTrackingNumber()" title="Copy">
                            <i class="fa-solid fa-copy"></i>
                        </button>
                    </div>
                </div>

                <div class="modal-field">
                    <label class="modal-label">Notes</label>
                    <textarea id="track-notes" class="modal-input modal-textarea"
                              placeholder="e.g. Estimated arrival April 10 · from Leaves Garden 🌿"
                              rows="2">${saved.notes || ''}</textarea>
                </div>

                <!-- Live preview of the tracking URL -->
                <div class="modal-track-preview" id="track-preview" style="display:none;">
                    <i class="fa-solid fa-link"></i>
                    <span id="track-preview-text"></span>
                </div>

            </div>

            <div class="modal-actions">
                <button class="modal-btn-secondary" onclick="closeTrackingModal()">Cancel</button>
                <button class="modal-btn-save" onclick="saveTracking('${memberId}')">Save</button>
                <button class="modal-btn-track" id="modal-track-btn"
                        onclick="saveAndTrack('${memberId}')"
                        style="display:none;">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> Track
                </button>
            </div>
        </div>
    `;

    modal.addEventListener('click', ev => { if (ev.target === modal) closeTrackingModal(); });
    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('modal-open'));

    // Wire up live URL preview
    const carrierSel = modal.querySelector('#track-carrier');
    const numInput   = modal.querySelector('#track-number');
    const updatePreview = () => {
        const cid = carrierSel.value;
        const num = numInput.value.trim();
        const carrier = CARRIERS.find(c => c.id === cid);
        const trackBtn    = document.getElementById('modal-track-btn');
        const previewBox  = document.getElementById('track-preview');
        const previewText = document.getElementById('track-preview-text');

        if (carrier && carrier.url && num) {
            const url = carrier.url.replace('{n}', num);
            previewText.textContent = url.length > 55 ? url.slice(0, 55) + '…' : url;
            previewBox.style.display = 'flex';
            if (trackBtn) trackBtn.style.display = 'flex';
        } else {
            previewBox.style.display = 'none';
            if (trackBtn) trackBtn.style.display = 'none';
        }
    };

    carrierSel.addEventListener('change', updatePreview);
    numInput.addEventListener('input',    updatePreview);
    updatePreview(); // run once on open if data already exists
}

function closeTrackingModal() {
    const modal = document.getElementById('tracking-modal');
    if (!modal) return;
    modal.classList.remove('modal-open');
    setTimeout(() => modal.remove(), 280);
}

function saveTracking(memberId) {
    const carrierId      = document.getElementById('track-carrier')?.value  || '';
    const trackingNumber = document.getElementById('track-number')?.value.trim()  || '';
    const notes          = document.getElementById('track-notes')?.value.trim()   || '';

    trackingData[memberId] = { carrierId, trackingNumber, notes };
    localStorage.setItem('trackingData', JSON.stringify(trackingData));
    closeTrackingModal();
    showToast('Tracking info saved 🌿');
    renderOTWView(); // refresh the OTW list
}

function saveAndTrack(memberId) {
    // Save first, then open the tracking URL
    const carrierId      = document.getElementById('track-carrier')?.value  || '';
    const trackingNumber = document.getElementById('track-number')?.value.trim()  || '';
    const notes          = document.getElementById('track-notes')?.value.trim()   || '';

    trackingData[memberId] = { carrierId, trackingNumber, notes };
    localStorage.setItem('trackingData', JSON.stringify(trackingData));
    closeTrackingModal();
    renderOTWView();

    const carrier = CARRIERS.find(c => c.id === carrierId);
    if (carrier && carrier.url && trackingNumber) {
        const url = carrier.url.replace('{n}', encodeURIComponent(trackingNumber));
        window.open(url, '_blank', 'noopener');
    } else {
        showToast('Tracking info saved 🌿');
    }
}

function copyTrackingNumber() {
    const val = (document.getElementById('track-number')?.value || '').trim();
    if (!val) { showToast('No tracking number to copy.'); return; }
    navigator.clipboard.writeText(val)
        .then(() => showToast('Tracking number copied!'))
        .catch(() => showToast('Could not copy.'));
}

// ============================================================
// TRADE VIEW — leaf badge visible here for status 4
// ============================================================
function renderTradeView() {
    const tradeGrid = document.getElementById('trade-grid');
    if (!tradeGrid) return;
    tradeGrid.innerHTML = '';

    const albums   = groupsData[currentArtist] || [];
    let   hasTrade = false;

    albums.forEach(album => {
        album.versions.forEach(version => {
            version.members.forEach(member => {
                if ((userProgress[member.id] || 0) !== 4) return;
                hasTrade = true;

                const count  = window.userReps[member.id] || 1;
                const card   = document.createElement('div');
                card.className = 'trade-card-modern';
                card.id        = `trade-card-${member.id}`;

                const hasImg = member.img && member.img !== 'URL_AQUÍ';
                const imgSrc = hasImg
                    ? member.img
                    : `https://placehold.co/200x300/f5f3f0/9c9289?text=${encodeURIComponent(member.name)}`;

                card.innerHTML = `
                    <div class="trade-image-wrapper">
                        <img src="${imgSrc}" class="trade-img"
                             onerror="this.onerror=null;this.src='https://placehold.co/200x300/f5f3f0/9c9289?text=${encodeURIComponent(member.name)}';">
                        <div class="trade-count-overlay" id="rep-${member.id}">${count}</div>
                    </div>
                    <div class="trade-info-bar">
                        <button class="count-btn" onclick="changeRepCount('${member.id}', -1)">−</button>
                        <span class="trade-member-name">${member.name}</span>
                        <button class="count-btn" onclick="changeRepCount('${member.id}', +1)">+</button>
                    </div>
                `;
                tradeGrid.appendChild(card);
            });
        });
    });

    if (!hasTrade) {
        tradeGrid.innerHTML = `
            <div class="empty-state" style="grid-column:1/-1">
                <div class="empty-icon">🌿</div>
                <p>No photocards marked for trade yet.</p>
            </div>`;
    }
}

function changeRepCount(id, delta) {
    window.userReps[id] = Math.max(1, (window.userReps[id] || 1) + delta);
    localStorage.setItem('userReps', JSON.stringify(window.userReps));
    const overlay = document.getElementById(`rep-${id}`);
    if (overlay) overlay.textContent = window.userReps[id];
}

// ============================================================
// SHARE TRADE LIST — Web Share API with clipboard fallback
// ============================================================
function shareTradeList() {
    const albums = groupsData[currentArtist] || [];
    const lines  = [`🌿 ${currentArtist.toUpperCase()} — Trade List\n`];
    let   count  = 0;

    albums.forEach(album => {
        album.versions.forEach(version => {
            const trades = version.members.filter(m => (userProgress[m.id] || 0) === 4);
            if (!trades.length) return;
            lines.push(`📀 ${album.album} — ${version.subname}`);
            trades.forEach(m => {
                const qty = window.userReps[m.id] || 1;
                lines.push(`  · ${m.name} (x${qty})`);
                count++;
            });
        });
    });

    if (count === 0) { showToast('No trade cards to share yet.'); return; }

    lines.push('');
    lines.push('✨ Find me on Leaves Garden MX');
    lines.push('📸 instagram.com/leavesgardenmx');
    lines.push('🌿 Made with BiasWall');

    const text = lines.join('\n');

    // Try native Web Share first (works on mobile)
    if (navigator.share) {
        navigator.share({ title: 'My Trade List · BiasWall', text })
            .catch(() => {}); // user cancelled
    } else {
        // Desktop fallback: copy to clipboard
        navigator.clipboard.writeText(text)
            .then(()  => showToast('Trade list copied to clipboard! 🌿'))
            .catch(()  => showToast('Could not share. Try again.'));
    }
}

// ============================================================
// EXPORT / RESET
// ============================================================
function exportCollection() {
    const data = {
        artist:       currentArtist,
        progress:     userProgress,
        trackingData: trackingData,
        date:         new Date().toISOString()
    };
    const a = Object.assign(document.createElement('a'), {
        href:     URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })),
        download: `biaswall-${currentArtist}-${Date.now()}.json`
    });
    a.click();
    showToast('Collection exported 💾');
}

function resetAllData() {
    if (!confirm('Are you sure? This will erase all your saved progress.')) return;
    userProgress    = {};
    window.userReps = {};
    trackingData    = {};
    localStorage.removeItem('userProgress');
    localStorage.removeItem('userReps');
    localStorage.removeItem('trackingData');
    renderCollection();
    updateStats();
    showToast('All data reset.');
}

// ============================================================
// TOAST
// ============================================================
function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800);
}

// ============================================================
// BLOCK CONTEXT MENU ON CARDS
// ============================================================
document.addEventListener('contextmenu', e => {
    if (e.target.closest('.photocard')) e.preventDefault();
}, false);

// ============================================================
// POB SWITCH
// ============================================================
window.addEventListener('DOMContentLoaded', () => {
    // Hint strip
    if (localStorage.getItem('hint_dismissed')) {
        const hint = document.getElementById('hint-strip');
        if (hint) hint.style.display = 'none';
    }

    // POB toggle
    const pobSwitch = document.getElementById('pob-switch');
    if (pobSwitch) {
        const saved = localStorage.getItem('pref_show_pobs');
        if (saved !== null) pobSwitch.checked = saved === 'true';
        pobSwitch.addEventListener('change', () => {
            localStorage.setItem('pref_show_pobs', pobSwitch.checked);
            renderCollection();
        });
    }

    // 2. Special Albums toggle
    const saSwitch = document.getElementById('toggle-sa');
    if (saSwitch) {
        const saved = localStorage.getItem('pref_show_special');
        if (saved !== null) saSwitch.checked = saved === 'true';
        saSwitch.addEventListener('change', () => {
            localStorage.setItem('pref_show_special', saSwitch.checked);
            renderCollection(); // Esto hará que el álbum aparezca/desaparezca al instante
        });
    }

    // 3. Japanese Albums toggle
    const jpSwitch = document.getElementById('toggle-jp');
    if (jpSwitch) {
        const saved = localStorage.getItem('pref_show_japanese');
        if (saved !== null) jpSwitch.checked = saved === 'true';
        jpSwitch.addEventListener('change', () => {
            localStorage.setItem('pref_show_japanese', jpSwitch.checked);
            renderCollection();
        });
    }
});

// ============================================================
// INITIAL RENDER
// ============================================================
renderCollection();