const groupsData = {
    bts: [
        { name: "BUTTER ERA", year: "2021", members: ["RM", "Jin", "Suga", "J-Hope", "Jimin", "V", "JK"] },
        { name: "LOVE YOURSELF 轉 'TEAR'", year: "2018", members: ["RM", "Jin", "Suga", "J-Hope", "Jimin", "V", "JK"] }
    ],
    twice: [
        { name: "READY TO BE", year: "2023", members: ["Nayeon", "Jeongyeon", "Momo", "Sana", "Jihyo", "Mina", "Dahyun", "Chaeyoung", "Tzuyu"] },
        { name: "FORMULA OF LOVE", year: "2021", members: ["Nayeon", "Jeongyeon", "Momo", "Sana", "Jihyo", "Mina", "Dahyun", "Chaeyoung", "Tzuyu"] }
    ]
};

// Variable global para saber qué artista estamos viendo
let currentArtist = 'bts';

// Función que se ejecuta al seleccionar un artista inicial
function selectInitialArtist(artistId) {
    currentArtist = artistId;
    
    // Ocultar lista de artistas y mostrar la app
    document.getElementById('view-onboarding').style.display = 'none';
    document.getElementById('main-app').style.display = 'flex'; // Usamos el ID nuevo
    
    const headerName = document.getElementById('header-artist-name');
    if (headerName) {
        headerName.innerText = artistId.toUpperCase();
    }
    
    updateMemberDropdown();
    renderCollection();

    switchView('coleccion');
}

function goToOnboarding() {
    // Regresar a la nada... ¡ahora corregido!
    document.getElementById('main-app').style.display = 'none';
    document.getElementById('view-onboarding').style.display = 'flex';
}

// Estado de la colección: { "EraName_Member": cantidad }
let userProgress = {};

// Variables de estado de filtros
let selectedMember = 'todos';
let quantityFilter = 'todos'; // 'todos', '1' (solo obtenidas), '2+' (repetidas)

// Esta función llena el selector dependiendo del grupo (BTS o Twice)
function updateMemberDropdown() {
    const select = document.getElementById('member-filter');
    if (!select) return;

    // 1. Limpiamos el menú y dejamos la opción por defecto
    select.innerHTML = '<option value="todos">Todo el grupo</option>';

    // 2. Obtenemos los miembros de la primera era del artista seleccionado
    const members = groupsData[currentArtist][0].members; 
    
    // 3. Creamos una opción por cada miembro
    members.forEach(member => {
        const option = document.createElement('option');
        option.value = member;
        option.innerText = member;
        select.appendChild(option);
    });
    
    // 4. Resetear el valor visual del select a "todos" al cambiar de grupo
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

function applyFilters() {
    selectedMember = document.getElementById('member-filter').value;
    renderCollection();
}

function renderCollection() {
    const grid = document.getElementById('collection-grid');
    grid.innerHTML = '';
    
    const selectedData = groupsData[currentArtist] || [];

    selectedData.forEach(era => {
        // --- 1. FILTRADO DE MIEMBROS ---
        // Aquí decidimos qué miembros mostrar según el selector de Bias
        const membersToDisplay = era.members.filter(member => {
            const isAllMembers = selectedMember === 'todos';
            const isSpecificBias = selectedMember === member;
            return isAllMembers || isSpecificBias;
        });

        // Si después de filtrar no hay nadie que mostrar en esta era, saltamos a la siguiente
        if (membersToDisplay.length === 0) return;

        const section = document.createElement('div');
        section.className = 'era-section';
        
        let ownedInEra = era.members.filter(m => userProgress[`${era.name}_${m}`] > 0).length;

        section.innerHTML = `
            <div class="era-title">
                ${era.name} — ${era.year} <span style="color:#D6A6A6">${ownedInEra}/${era.members.length}</span>
            </div>
            <div class="pc-grid"></div>
        `;

        const pcGrid = section.querySelector('.pc-grid');

        // --- 2. DIBUJAR SOLO LOS FILTRADOS ---
        membersToDisplay.forEach(member => {
            const key = `${era.name}_${member}`;
            const count = userProgress[key] || 0;
            const pc = document.createElement('div');
            pc.className = `photocard ${count > 0 ? 'owned' : 'not-owned'}`;
            
            pc.innerHTML = `
                ${count > 1 ? `<div class="reps-badge">${count}</div>` : ''}
                <div class="pc-initial">${member[0]}</div>
                <div class="pc-name">${member}</div>
            `;

            // EVENTOS (Tus eventos originales)
            let timer;
            let isLongPress = false;

            const startPress = () => {
                isLongPress = false; 
                timer = setTimeout(() => {
                    resetCard(key);
                    isLongPress = true;
                    if (navigator.vibrate) navigator.vibrate(50);
                }, 800);
            };

            const cancelPress = () => clearTimeout(timer);

            const handleRelease = (e) => {
                clearTimeout(timer);
                if (isLongPress) {
                    setTimeout(() => { isLongPress = false; }, 100);
                    return; 
                }
                handleTap(key, e);
            };

            pc.addEventListener('mousedown', startPress);
            pc.addEventListener('mouseup', handleRelease);
            pc.addEventListener('mouseleave', cancelPress);
            pc.addEventListener('touchstart', (e) => startPress(), { passive: true });
            pc.addEventListener('touchend', (e) => {
                handleRelease(e);
                if (isLongPress) e.preventDefault(); 
            });
            pc.addEventListener('touchcancel', cancelPress);

            pcGrid.appendChild(pc);
        });

        grid.appendChild(section);
    });
}

function handleTap(key, event) {
    // Si presionas ALT en PC mientras haces click, resetea la carta
    if (event && event.altKey) {
        resetCard(key);
        return; // Salimos de la función para que no sume una unidad
    }

    // Lógica normal de suma
    if (!userProgress[key]) {
        userProgress[key] = 1; 
    } else {
        userProgress[key] += 1;
    }
    renderCollection();
}

function resetCard(key) {
    if (userProgress[key] > 1) {
        // Si tienes más de una, solo restamos una
        userProgress[key] -= 1;
    } else {
        // Si solo tenías una, la eliminamos por completo
        delete userProgress[key];
    }
    renderCollection();
}

// Carga inicial
renderCollection();

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
    const totalPossible = btsData.length * 7; // 2 eras x 7 miembros
    let totalOwned = 0;
    let totalReps = 0;

    const eraListContainer = document.getElementById('era-stats-list');
    eraListContainer.innerHTML = '';

    btsData.forEach(era => {
        let ownedInEra = 0;
        era.members.forEach(m => {
            const count = userProgress[`${era.name}_${m}`] || 0;
            if (count > 0) ownedInEra++;
            if (count > 1) totalReps += (count - 1);
        });
        totalOwned += ownedInEra;

        // Crear barra por era
        const percent = Math.round((ownedInEra / era.members.length) * 100);
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

    // Actualizar números generales
    const totalPercent = Math.round((totalOwned / totalPossible) * 100);
    document.getElementById('stat-obtained').innerText = totalOwned;
    document.getElementById('stat-missing').innerText = totalPossible - totalOwned;
    document.getElementById('stat-reps').innerText = totalReps;
    document.getElementById('total-percent-text').innerText = `${totalPercent}% completado`;
    document.getElementById('total-progress-fill').style.width = `${totalPercent}%`;
    document.getElementById('stat-wishlist-percent').innerText = `${totalPercent}%`;
}

function switchView(viewId) {
    // 1. Ocultar todas las vistas
    document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
    
    // 2. Mostrar la vista seleccionada
    document.getElementById('view-' + viewId).style.display = 'block';

    // 3. Manejar la visibilidad de la leyenda (Footer)
    const footer = document.querySelector('.footer-legend');
    if (viewId === 'coleccion') {
        footer.style.display = 'block';
    } else {
        footer.style.display = 'none';
    }

    // 4. Actualizar estado activo en la barra inferior
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    // Buscamos el botón que tiene el onclick con el viewId correspondiente
    const activeBtn = document.querySelector(`.nav-item[onclick="switchView('${viewId}')"]`);
    if (activeBtn) activeBtn.classList.add('active');
}

// Bloquea el menú contextual en las photocards para que no estorbe el reset
document.addEventListener('contextmenu', function(e) {
    if (e.target.closest('.photocard')) {
        e.preventDefault();
    }
}, false);