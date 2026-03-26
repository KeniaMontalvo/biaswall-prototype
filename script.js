const groupsData = {
    bts: [
        { 
            name: "ARIRANG", 
            year: "2024", 
            members: [
                { id: "rm_album", name: "RM", type: "album", img: "assets/bts/arirang/rm_album.jpg" },
                { id: "jin_album", name: "Jin", type: "album", img: "assets/bts/arirang/jin_album.jpg" },
                { id: "jimin_pob", name: "Jimin", type: "pob", img: "assets/bts/arirang/jimin_pob.jpg" },
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

// Función que se ejecuta al seleccionar un artista inicial
function selectInitialArtist(artistId) {
    currentArtist = artistId;
    document.getElementById('view-onboarding').style.display = 'none';
    document.getElementById('main-app').style.display = 'flex';
    
    const headerName = document.getElementById('header-artist-name');
    if (headerName) headerName.innerText = artistId.toUpperCase();

    updateMemberDropdown();
    renderCollection();
    switchView('coleccion');
}

function goToOnboarding() {
    document.getElementById('main-app').style.display = 'none';
    document.getElementById('view-onboarding').style.display = 'flex';
}

// Esta función llena el selector dependiendo del grupo (BTS o Twice)
function updateMemberDropdown() {
    const select = document.getElementById('member-filter');
    if (!select) return;

    select.innerHTML = '<option value="todos">Todo el grupo</option>';

    const members = groupsData[currentArtist][0].members; 
    
    // Usamos Set para que si un miembro tiene 5 cards, el nombre solo salga 1 vez
    const uniqueNames = [...new Set(members.map(m => m.name))];

    uniqueNames.forEach(name => {
        const option = document.createElement('option');
        option.value = name; // Guardamos el String "RM"
        option.innerText = name;
        select.appendChild(option);
    });
    
    select.value = 'todos';
    selectedMember = 'todos';
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
    grid.innerHTML = '';
    
    const selectedData = groupsData[currentArtist] || [];

    selectedData.forEach(era => {
        // 1. FILTRADO
        const membersToDisplay = era.members.filter(m => {
            const matchesMember = (selectedMember === 'todos' || selectedMember === m.name);
            const status = userProgress[m.id] || 0;
            
            let matchesQuantity = true;
            if (quantityFilter === '1') matchesQuantity = status === 1; // Obtenidas
            if (quantityFilter === '2+') matchesQuantity = status === 2; // En camino
            
            return matchesMember && matchesQuantity;
        });

        if (membersToDisplay.length === 0) return;

        const section = document.createElement('div');
        section.className = 'era-section';
        
        // Conteo de la era
        let ownedInEra = era.members.filter(m => (userProgress[m.id] || 0) === 1).length;

        section.innerHTML = `
            <div class="era-title">
                ${era.name} — ${era.year} <span style="color:#D6A6A6">${ownedInEra}/${era.members.length}</span>
            </div>
            <div class="pc-grid"></div>
        `;

        const pcGrid = section.querySelector('.pc-grid');

        membersToDisplay.forEach(member => {
            const status = userProgress[member.id] || 0;
            const pc = document.createElement('div');
            
            // Aplicamos la clase de estado (status-0, status-1, etc)
            pc.className = `photocard status-${status}`;

            pc.style.backgroundColor = status === 0 ? '#f0f0f0' : '#ffffff';
            
            pc.innerHTML = `
            <img src="${member.img}" 
                class="pc-image" 
                alt="${member.name}" 
                onerror="this.onerror=null; this.src='https://placehold.co/200x300?text=${member.name}';">
        `;

            // EVENTOS
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

        grid.appendChild(section);
    });
}

function handleTap(memberId) {
    // Obtenemos el estado actual o 0 si no existe
    let currentStatus = userProgress[memberId] || 0;
    
    // Ciclo de 4 estados: 
    // 0 (No) -> 1 (Have/Verde) -> 2 (Way/Amarillo) -> 3 (Drop/Rojo) -> vuelve a 0
    let nextStatus = (currentStatus + 1) % 4;
    
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