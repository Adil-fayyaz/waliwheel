function getQueryId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function getCars() {
    try {
        const raw = localStorage.getItem('waliwheels_cars');
        if (!raw) return [];
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

function labelType(type) {
    const map = { suv: 'SUV', berlina: 'Berlina', sportiva: 'Sportiva', elettrica: 'Elettrica', ibrida: 'Ibrida', cabrio: 'Cabrio', 'station-wagon': 'Station Wagon' };
    return map[type] || type || 'N/A';
}

function labelFuel(fuel) {
    const map = { benzina: 'Benzina', diesel: 'Diesel', elettrico: 'Elettrico', ibrido: 'Ibrido', gpl: 'GPL', metano: 'Metano' };
    return map[fuel] || fuel || 'N/A';
}

function render(car) {
    const mainImageEl = document.getElementById('detailImage');
    mainImageEl.src = car.image || '';
    document.getElementById('detailTitle').textContent = `${car.brand} ${car.model}`;
    document.getElementById('detailPrice').textContent = `€${(car.price||0).toLocaleString()}`;
    document.getElementById('detailYear').textContent = car.year || 'N/A';
    document.getElementById('detailType').textContent = labelType(car.type);
    document.getElementById('detailColor').textContent = car.color || 'N/A';
    document.getElementById('detailFuel').textContent = labelFuel(car.fuel);
    document.getElementById('detailKm').textContent = car.km ? `${car.km.toLocaleString()} km` : 'N/A';
    document.getElementById('detailEngine').textContent = car.engine ? `${car.engine}cc` : 'N/A';
    document.getElementById('detailPower').textContent = car.power ? `${car.power} CV` : 'N/A';
    document.getElementById('detailTransmission').textContent = car.transmission || 'N/A';
    document.getElementById('detailDoors').textContent = car.doors || 'N/A';
    document.getElementById('detailSeats').textContent = car.seats || 'N/A';
    document.getElementById('detailDescription').textContent = car.description || 'Nessuna descrizione disponibile.';

    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
    const seen = new Set();
    const images = [];
    const pushUnique = (src) => { if (src && !seen.has(src)) { seen.add(src); images.push(src); } };
    // Metti l'immagine principale per prima
    pushUnique(car.image);
    // Poi tutte le altre
    (Array.isArray(car.images) ? car.images : []).forEach(pushUnique);

    images.forEach((src, idx) => {
        const thumb = document.createElement('img');
        thumb.src = src;
        thumb.alt = `${car.brand} ${car.model}`;
        thumb.style.width = '100%';
        thumb.style.height = '140px';
        thumb.style.objectFit = 'cover';
        thumb.style.borderRadius = '10px';
        thumb.style.border = idx === 0 ? '2px solid #00ff88' : '1px solid rgba(255,255,255,0.15)';
        thumb.style.cursor = 'pointer';
        thumb.addEventListener('click', () => {
            mainImageEl.src = src;
            // Evidenzia la miniatura attiva
            Array.from(gallery.children).forEach((el) => { el.style.border = '1px solid rgba(255,255,255,0.15)'; });
            thumb.style.border = '2px solid #00ff88';
        });
        gallery.appendChild(thumb);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const id = getQueryId();
    const car = getCars().find(c => c.id === id);
    if (!car) {
        window.location.href = 'esplora-macchine.html';
        return;
    }
    render(car);
});


