// Variable global para saber qué artista estamos viendo
let currentArtist = 'bts';
let userProgress = {}; // { "id_de_la_pc": estado_0_al_3 }
let selectedMember = 'todos';
let quantityFilter = 'todos';
let selectedMembers = new Set(['todos']);

// Función que se ejecuta al seleccionar un artista inicial
function selectInitialArtist(artistId) {
    currentArtist = artistId;
    document.getElementById('view-onboarding').style.display = 'none';
    document.getElementById('main-app').style.display = 'flex';
    
    const headerName = document.getElementById('header-artist-name');
    if (headerName) headerName.innerText = artistId.toUpperCase();

    updateMemberFilters();
    renderCollection();
    switchView('coleccion');
}

function goToOnboarding() {
    document.getElementById('main-app').style.display = 'none';
    document.getElementById('view-onboarding').style.display = 'flex';
}

// Esta función llena el selector dependiendo del grupo (BTS o Twice)
function updateMemberFilters() {
    const panel = document.getElementById('member-checkbox-panel');
    if (!panel) return;
    panel.innerHTML = ''; // Limpiamos el panel

    // 1. OBTENER MIEMBROS (Aquí arreglamos el acceso a datos)
    // Buscamos el primer álbum y su primera versión para sacar los 7 nombres únicos de BTS
    const albumData = groupsData[currentArtist]?.[0];
    if (!albumData || !albumData.versions[0]) return;
    
    // Obtenemos una lista de solo los nombres (RM, Jin, Suga...)
    const memberNames = albumData.versions[0].members.map(m => m.name);

    // 2. CREAR EL CHECKBOX DE 'ALL'
    createCheckbox('ALL', 'todos', true, panel);

    // 3. CREAR LOS CHECKBOXES DE CADA MIEMBRO
    memberNames.forEach(name => {
        createCheckbox(name, name, false, panel);
    });
}

// Función auxiliar para crear cada checkbox de forma limpia
function createCheckbox(label, value, isAll, container) {
    const wrapper = document.createElement('div');
    wrapper.className = 'member-checkbox-wrapper';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.className = 'member-checkbox-input';
    input.value = value;
    input.id = `member-filter-${value}`;
    
    // Si 'todos' está seleccionado al inicio, lo marcamos
    if (value === 'todos' && selectedMembers.has('todos')) {
        input.checked = true;
    }

    const spanLabel = document.createElement('label');
    spanLabel.className = isAll ? 'member-label all-label' : 'member-label';
    spanLabel.htmlFor = `member-filter-${value}`;
    spanLabel.innerText = label;

    // EVENTO: Manejar los clicks en los checkboxes
    input.addEventListener('change', handleMemberCheckboxChange);

    wrapper.appendChild(input);
    wrapper.appendChild(spanLabel);
    container.appendChild(wrapper);
}

function handleMemberCheckboxChange(e) {
    const checkbox = e.target;
    const val = checkbox.value;

    if (val === 'todos') {
        if (checkbox.checked) {
            // Desmarcar todos los demás visualmente
            document.querySelectorAll('.member-checkbox-input').forEach(chk => {
                if(chk.value !== 'todos') chk.checked = false;
            });
            selectedMembers.clear();
            selectedMembers.add('todos');
        }
    } else {
        if (checkbox.checked) {
            // Si marcas un miembro, quita el check de 'ALL'
            const allBtn = document.getElementById('filter-member-todos'); // <--- USA ESTE ID
            if(allBtn) allBtn.checked = false;
            
            selectedMembers.delete('todos');
            selectedMembers.add(val);
        } else {
            selectedMembers.delete(val);
            if (selectedMembers.size === 0) {
                const allBtn = document.getElementById('filter-member-todos');
                if(allBtn) allBtn.checked = true;
                selectedMembers.add('todos');
            }
        }
    }

    // Finalmente, renderizamos la colección con los nuevos filtros.
    renderCollection();
}

function setQuantityFilter(type, btn) {
    quantityFilter = type;
    // Manejo visual de botones activos
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderCollection();
}

// FUNCIONES DE NAVEGACIÓN Y FILTROS
function applyFilters() {
    selectedMember = document.getElementById('member-filter').value;
    renderCollection();
}

function renderCollection() {
    const grid = document.getElementById('collection-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const pobSwitch = document.getElementById('pob-switch'); 
    const showPOBs = pobSwitch ? pobSwitch.checked : false;
    
    const albums = groupsData[currentArtist] || [];

    albums.forEach(album => {
        album.versions.forEach(version => {

            if (version.is_pob && !showPOBs) {
                return; 
            }

            const section = document.createElement('div');
            section.className = 'era-section';
            
            // Solo contamos las que "HAVE" (Status 1)
            const ownedInVersion = version.members.filter(m => (userProgress[m.id] || 0) === 1).length;

            section.innerHTML = `
                <div class="era-title">
                    ${album.album} — ${version.subname} <span class="version-counter">${ownedInVersion}/${version.members.length}</span>
                </div>
                <div class="pc-grid"></div>
            `;

            const pcGrid = section.querySelector('.pc-grid');

            version.members.forEach(member => {
                const status = userProgress[member.id] || 0;

                // Filtros
                const matchesMember = selectedMembers.has('todos') || selectedMembers.has(member.name);
                let matchesQuantity = true;
                if (quantityFilter === '1') matchesQuantity = status === 1;
                if (quantityFilter === '2') matchesQuantity = status === 2;

                if (!matchesMember || !matchesQuantity) return;

                const pc = document.createElement('div');
                // Si es status 0, no le ponemos clase de borde
                pc.className = `photocard status-${status}`;
                pc.id = `pc-${member.id}`;

                pc.innerHTML = `
                    <img src="${member.img}" 
                         class="pc-image" 
                         alt="${member.name}" 
                         onerror="this.src='https://placehold.co/200x300?text=${member.name}';">
                `;

                // --- TUS EVENTOS DE LONG PRESS (Mantenidos) ---
                let timer;
                let isLongPress = false;

                const startPress = () => {
                    isLongPress = false; 
                    timer = setTimeout(() => {
                        resetCard(member.id);
                        isLongPress = true;
                        if (navigator.vibrate) navigator.vibrate(50);
                    }, 800);
                };

                const handleRelease = (e) => {
                    clearTimeout(timer);
                    if (e.cancelable) e.preventDefault();
                    if (isLongPress) {
                        setTimeout(() => { isLongPress = false; }, 100);
                        return; 
                    }
                    handleTap(member.id);
                };

                pc.addEventListener('mousedown', (e) => {
                // Si es un mouse real (no un toque emulado), ejecutamos
                if (e.detail > 0) startPress(e);
            });
                pc.addEventListener('mouseup', (e) => {
                    if (e.detail > 0) handleRelease(e);
                });

                pc.addEventListener('mouseleave', () => clearTimeout(timer));

                pc.addEventListener('touchstart', startPress, { passive: false });
                pc.addEventListener('touchend', handleRelease, { passive: false });

                pcGrid.appendChild(pc);
            });

            // Solo añadimos la sección si tiene cartas que mostrar
            if (pcGrid.children.length > 0) {
                grid.appendChild(section);
            }
        });
    });
}

function updateSingleCardUI(memberId, newStatus) {
    const pcElement = document.getElementById(`pc-${memberId}`);
    if (pcElement) {
        // 1. Removemos todas las clases de status anteriores (0 a 4)
        pcElement.classList.remove('status-0', 'status-1', 'status-2', 'status-3', 'status-4');
        // 2. Añadimos la nueva clase
        pcElement.classList.add(`status-${newStatus}`);
    }
}

function handleTap(memberId) {
    // Obtenemos el estado actual o 0 si no existe
    let currentStatus = userProgress[memberId] || 0;
    
    // Ciclo de 4 estados: 
    // 0 (No) -> 1 (Have/Verde) -> 2 (Way/Amarillo) -> 3 (Drop/Rojo) -> 4 (Trade/Rosa) -> vuelve a 0
    let nextStatus = (currentStatus + 1) % 5;
    
    // Guardamos el progreso
    userProgress[memberId] = nextStatus;
    
    // Guardar en LocalStorage para no perder cambios al recargar
    localStorage.setItem('userProgress', JSON.stringify(userProgress));
    
    // Refrescamos
    updateSingleCardUI(memberId, nextStatus);

    if (typeof updateStats === "function") updateStats();
}

function resetCard(id) {
    userProgress[id] = 0;
    updateSingleCardUI(id, 0); 
    if (typeof updateStats === "function") updateStats();
}

function createPCElement(member) {
    const pc = document.createElement('div');
    pc.className = 'photocard status-0'; // Estado inicial: Pending
    
    // Si no hay URL, mostramos el texto del nombre
    if (!member.img || member.img === "URL_AQUÍ") {
        pc.innerHTML = `
            <div class="pc-placeholder">
                <span>${member.name}</span>
            </div>
        `;
    } else {
        pc.innerHTML = `
            <div class="pc-image-container">
                <img src="${member.img}" alt="${member.name}" class="pc-image">
            </div>
        `;
    }
    
    return pc;
}

//Estadísticas

// 1. Lógica de Navegación
const navButtons = document.querySelectorAll('.nav-btn');
const views = document.querySelectorAll('.view');

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Cambiar estado visual de botones
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Cambiar vista
        const viewId = `view-${btn.innerText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`;
        views.forEach(v => v.style.display = 'none');
        document.getElementById(viewId).style.display = 'block';

        if(viewId === 'view-stats') updateStats();
    });
});

// 2. Función para calcular estadísticas
function updateStats() {
    const selectedData = groupsData[currentArtist] || [];
    let totalPossible = 0;
    let totalOwned = 0;
    let totalOnTheWay = 0;

    const eraListContainer = document.getElementById('era-stats-list');
    eraListContainer.innerHTML = '';

    selectedData.forEach(era => {
        totalPossible += era.members.length;
        let ownedInEra = 0;

        era.members.forEach(m => {
            const status = userProgress[m.id] || 0;
            if (status === 1) ownedInEra++; // HAVE
            if (status === 2) totalOnTheWay++; // WAY
        });
        totalOwned += ownedInEra;

        const percent = Math.round((ownedInEra / era.members.length) * 100) || 0;
        eraListContainer.innerHTML += `
            <div class="era-stat-row">
                <div class="era-stat-info">
                    <span>${era.name}</span>
                    <span>${percent}%</span>
                </div>
                <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${percent}%"></div></div>
            </div>
        `;
    });

    const totalPercent = Math.round((totalOwned / totalPossible) * 100) || 0;
    document.getElementById('stat-obtained').innerText = totalOwned;
    document.getElementById('stat-missing').innerText = totalPossible - totalOwned;
    document.getElementById('stat-reps').innerText = totalOnTheWay; // Ahora mostramos "En camino" aquí
    document.getElementById('total-percent-text').innerText = `${totalPercent}% completado`;
    document.getElementById('total-progress-fill').style.width = `${totalPercent}%`;
}

function switchView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
    
    const currentView = document.getElementById('view-' + viewId);
    if (currentView) currentView.style.display = 'block';
    
    //Mostrar la barra de colores solo en colección
    const legend = document.querySelector('.footer-legend');
        if (legend) {
            legend.style.display = (viewId === 'coleccion') ? 'flex' : 'none';
        }

    if(viewId === 'stats') updateStats();
    if(viewId === 'trade') updateTradeView();

    // Actualizar nav bar
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`.nav-item[onclick*="${viewId}"]`);
    if (activeBtn) activeBtn.classList.add('active');

}

// Necesitamos un objeto para guardar las cantidades de repetidas si no existe
if (!window.userReps) {
    window.userReps = JSON.parse(localStorage.getItem('userReps')) || {};
}

function updateTradeView() {
    const tradeContainer = document.getElementById('view-trade');
    if (!tradeContainer) return;

    tradeContainer.innerHTML = `
        <div class="stats-header">
            <h1 class="view-title">Trade List</h1>
            <p class="view-subtitle">Gestiona tus cartas disponibles para intercambio.</p>
        </div>
        <div class="app-content">
            <div class="trade-grid" id="trade-grid"></div>
        </div>
    `;

    const tradeGrid = document.getElementById('trade-grid');
    let hasTrade = false;
    const currentAlbums = groupsData[currentArtist] || [];

    currentAlbums.forEach(album => {
        album.versions.forEach(version => {
            version.members.forEach(member => {
                const status = userProgress[member.id] || 0;

                if (status === 4) {
                    hasTrade = true;
                    const count = window.userReps[member.id] || 1;
                    
                    const card = document.createElement('div');
                    card.className = 'trade-card-modern';
                    card.innerHTML = `
                        <div class="trade-image-wrapper">
                            <img src="${member.img}" class="trade-img" onerror="this.src='https://placehold.co/200x300?text=${member.name}';">
                            <div class="trade-count-overlay">${count}</div>
                        </div>
                        <div class="trade-info-bar">
                            <button class="count-btn" onclick="changeRepCount('${member.id}', -1)">-</button>
                            <span class="trade-member-name">${member.name}</span>
                            <button class="count-btn" onclick="changeRepCount('${member.id}', 1)">+</button>
                        </div>
                    `;
                    tradeGrid.appendChild(card);
                }
            });
        });
    });

    if (!hasTrade) {
        tradeGrid.innerHTML = `<div class="empty-state">No hay cartas marcadas para trade.</div>`;
    }
}

// Función para aumentar/disminuir repetidas
function changeRepCount(id, delta) {
    if (!window.userReps[id]) window.userReps[id] = 1;
    window.userReps[id] += delta;
    
    if (window.userReps[id] < 1) window.userReps[id] = 1; // Mínimo 1 si está en trade
    
    localStorage.setItem('userReps', JSON.stringify(window.userReps));
    updateTradeView();
}

// Bloqueo de menú contextual
document.addEventListener('contextmenu', e => {
    if (e.target.closest('.photocard')) e.preventDefault();
}, false);

// Render inicial
renderCollection();

// Escuchar cambios en el switch de POBs (ajustes)
const pobSwitch = document.getElementById('pob-switch');
if (pobSwitch) {
    pobSwitch.addEventListener('change', () => {
        // Opcional: Guardar en localStorage para que se mantenga la preferencia
        localStorage.setItem('pref_show_pobs', pobSwitch.checked);
        renderCollection();
    });
}

// Al cargar la página, recuperar la preferencia del usuario
window.addEventListener('DOMContentLoaded', () => {
    const savedPobPref = localStorage.getItem('pref_show_pobs');
    const pobSwitch = document.getElementById('pob-switch');
    if (pobSwitch && savedPobPref !== null) {
        pobSwitch.checked = (savedPobPref === 'true');
    }
});