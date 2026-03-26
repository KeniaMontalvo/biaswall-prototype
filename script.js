const btsData = [
    { name: "BUTTER ERA", year: "2021", members: ["RM", "Jin", "Suga", "J-Hope", "Jimin", "V", "JK"] },
    { name: "LOVE YOURSELF", year: "2018", members: ["RM", "Jin", "Suga", "J-Hope", "Jimin", "V", "JK"] }
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