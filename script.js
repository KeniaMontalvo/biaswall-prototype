const groupsData = {
    bts: [
        {
            album: "ARIRANG",
            year: "2026",
            versions: [
                {
                    subname: "Rooted in Korea",
                    members: [
                        { id: "arirang_rik_rm", name: "RM", img: "URL_AQUÍ" },
                        { id: "arirang_rik_jin", name: "Jin", img: "URL_AQUÍ" },
                        { id: "arirang_rik_suga", name: "Suga", img: "URL_AQUÍ" },
                        { id: "arirang_rik_jhope", name: "J-Hope", img: "URL_AQUÍ" },
                        { id: "arirang_rik_jimin", name: "Jimin", img: "URL_AQUÍ" },
                        { id: "arirang_rik_v", name: "V", img: "URL_AQUÍ" },
                        { id: "arirang_rik_jk", name: "JK", img: "URL_AQUÍ" }
                    ]
                },
                {
                    subname: "Living Legend",
                    members: [
                        { id: "arirang_ll_rm", name: "RM", img: "URL_AQUÍ" },
                        { id: "arirang_ll_jin", name: "Jin", img: "URL_AQUÍ" },
                        { id: "arirang_ll_suga", name: "Suga", img: "URL_AQUÍ" },
                        { id: "arirang_ll_jhope", name: "J-Hope", img: "URL_AQUÍ" },
                        { id: "arirang_ll_jimin", name: "Jimin", img: "URL_AQUÍ" },
                        { id: "arirang_ll_v", name: "V", img: "URL_AQUÍ" },
                        { id: "arirang_ll_jk", name: "JK", img: "URL_AQUÍ" }
                    ]
                }
                // Puedes seguir añadiendo versiones aquí siguiendo el mismo formato
            ]
        }
    ],
    twice: [
        { 
            name: "READY TO BE", 
            year: "2023", 
            members: [
                { id: "nayeon_rtb", name: "Nayeon", type: "album", img: "assets/twice/rtb/nayeon.jpg" },
                { id: "momo_rtb", name: "Momo", type: "album", img: "assets/twice/rtb/momo.jpg" }
                // Agregaremos el resto después
            ] 
        }
    ]
};

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
    input.id = `chk-${value}`;
    
    // Si 'todos' está seleccionado al inicio, lo marcamos
    if (value === 'todos' && selectedMembers.has('todos')) {
        input.checked = true;
    }

    const spanLabel = document.createElement('label');
    spanLabel.className = isAll ? 'member-label all-label' : 'member-label';
    spanLabel.htmlFor = `chk-${value}`;
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
        // Lógica de 'ALL':
        // Si activas 'ALL', deseleccionamos todos los demás checkboxes
        if (checkbox.checked) {
            document.querySelectorAll('.member-checkbox-input:not(#chk-todos)')
                .forEach(chk => chk.checked = false);
            selectedMembers.clear();
            selectedMembers.add('todos');
        } else {
            // Si desactivas 'ALL' y no hay nada más marcado, lo forzamos.
            // (Para que nunca esté vacío)
            if (selectedMembers.size === 0) {
                checkbox.checked = true;
                selectedMembers.add('todos');
            }
        }
    } else {
        // Lógica de miembros individuales:
        if (checkbox.checked) {
            // Si marcas a un miembro, quitamos el check de 'ALL'
            document.getElementById('chk-todos').checked = false;
            selectedMembers.delete('todos');
            selectedMembers.add(val);
        } else {
            selectedMembers.delete(val);
            // Si desmarcas a todos los miembros, forzamos el check de 'ALL'
            if (selectedMembers.size === 0) {
                document.getElementById('chk-todos').checked = true;
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
    
    const albums = groupsData[currentArtist] || [];

    albums.forEach(album => {
        // Recorremos las versiones (ej. Rooted in Korea, Living Legend)
        album.versions.forEach(version => {
            
            // 1. Crear el Título de la Versión
            const section = document.createElement('div');
            section.className = 'era-section';
            
            // Calculamos cuántas tienes de esta versión específica
            const ownedInVersion = version.members.filter(m => (userProgress[m.id] || 0) === 1).length;

            section.innerHTML = `
                <div class="era-title">
                    ${album.album} — ${version.subname} <span style="color:#D6A6A6">${ownedInVersion}/${version.members.length}</span>
                </div>
                <div class="pc-grid"></div>
            `;

            const pcGrid = section.querySelector('.pc-grid');

            // 2. Filtrado y Renderizado de Cards
            version.members.forEach(member => {
                const status = userProgress[member.id] || 0;

                // Aplicar filtros (Miembro y Estado)
                const matchesMember = selectedMembers.has('todos') || selectedMembers.has(member.name);
                let matchesQuantity = true;
                if (quantityFilter === '1') matchesQuantity = status === 1;
                if (quantityFilter === '2') matchesQuantity = status === 2;
                if (quantityFilter === '4') matchesQuantity = status === 4;

                if (!matchesMember || !matchesQuantity) return;

                const pc = document.createElement('div');
                pc.className = `photocard status-${status}`;
                pc.style.backgroundColor = status === 0 ? '#f0f0f0' : '#ffffff';
                
                pc.innerHTML = `
                    <img src="${member.img}" 
                        class="pc-image" 
                        alt="${member.name}" 
                        onerror="this.onerror=null; this.src='https://placehold.co/200x300?text=${member.name}';">
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
                    if (isLongPress) {
                        setTimeout(() => { isLongPress = false; }, 100);
                        return; 
                    }
                    handleTap(member.id);
                };

                pc.addEventListener('mousedown', startPress);
                pc.addEventListener('mouseup', handleRelease);
                pc.addEventListener('mouseleave', () => clearTimeout(timer));
                pc.addEventListener('touchstart', startPress, { passive: true });
                pc.addEventListener('touchend', (e) => {
                    handleRelease(e);
                    if (isLongPress) e.preventDefault(); 
                });

                pcGrid.appendChild(pc);
            });

            // Solo añadimos la sección si tiene cartas que mostrar
            if (pcGrid.children.length > 0) {
                grid.appendChild(section);
            }
        });
    });
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
    
    // Refrescamos la UI
    renderCollection();
    if (typeof updateStats === "function") updateStats();
}

function resetCard(id) {
    userProgress[id] = 0; // Resetear a estado "No tengo"
    renderCollection();
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
    document.getElementById('view-' + viewId).style.display = 'block';
    
    // Actualizar nav bar
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`.nav-item[onclick="switchView('${viewId}')"]`);
    if (activeBtn) activeBtn.classList.add('active');

    if(viewId === 'view-stats') updateStats();
}

// Bloqueo de menú contextual
document.addEventListener('contextmenu', e => {
    if (e.target.closest('.photocard')) e.preventDefault();
}, false);

// Render inicial
renderCollection();