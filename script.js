const btsData = [
    { name: "BUTTER ERA", year: "2021", members: ["RM", "Jin", "Suga", "J-Hope", "Jimin", "V", "JK"] },
    { name: "LOVE YOURSELF 轉 'TEAR'", year: "2018", members: ["RM", "Jin", "Suga", "J-Hope", "Jimin", "V", "JK"] }
];

// Estado de la colección: { "EraName_Member": cantidad }
let userProgress = {};

function renderCollection() {
    const grid = document.getElementById('collection-grid');
    grid.innerHTML = '';

    btsData.forEach(era => {
        const section = document.createElement('div');
        section.className = 'era-section';
        
        // Calcular progreso de la era
        let ownedInEra = era.members.filter(m => userProgress[`${era.name}_${m}`] > 0).length;

        section.innerHTML = `
            <div class="era-title">
                ${era.name} — ${era.year} <span style="color:#D6A6A6">${ownedInEra}/${era.members.length}</span>
            </div>
            <div class="pc-grid"></div>
        `;

        const pcGrid = section.querySelector('.pc-grid');

        era.members.forEach(member => {
            const key = `${era.name}_${member}`;
            const count = userProgress[key] || 0;
            const pc = document.createElement('div');
            pc.className = `photocard ${count > 0 ? 'owned' : 'not-owned'}`;
            
            pc.innerHTML = `
                ${count > 1 ? `<div class="reps-badge">${count}</div>` : ''}
                <div class="pc-initial">${member[0]}</div>
                <div class="pc-name">${member}</div>
            `;

            // EVENTOS
            let timer;
            pc.addEventListener('click', () => handleTap(key));
            
            // Simulación Long Press
            pc.addEventListener('mousedown', () => {
                timer = setTimeout(() => resetCard(key), 800);
            });
            pc.addEventListener('mouseup', () => clearTimeout(timer));
            pc.addEventListener('mouseleave', () => clearTimeout(timer));

            pcGrid.appendChild(pc);
        });

        grid.appendChild(section);
    });
}

function handleTap(key) {
    if (!userProgress[key]) {
        userProgress[key] = 1; // Primer tap: obtener
    } else {
        userProgress[key] += 1; // Taps siguientes: repetida
    }
    renderCollection();
}

function resetCard(key) {
    delete userProgress[key]; // Resetear
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