/* ===== IMMAGINI AUTO DI ALTA QUALITÀ ===== */

const carImages = {
    // Auto di lusso
    'mercedes-s-class': [
        'https://images.unsplash.com/photo-1618843479618-39b0b7a3b8c7?w=800&h=600&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1618843479618-39b0b7a3b8c7?w=800&h=600&fit=crop&crop=center&flip=h',
        'https://images.unsplash.com/photo-1618843479618-39b0b7a3b8c7?w=800&h=600&fit=crop&crop=center&flip=v'
    ],
    
    'bmw-7-series': [
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&crop=center&flip=h',
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&crop=center&flip=v'
    ],
    
    'audi-a8': [
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&crop=center&flip=h',
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&crop=center&flip=v'
    ],
    
    // Auto sportive
    'ferrari-488': [
        'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800&h=600&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800&h=600&fit=crop&crop=center&flip=h',
        'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800&h=600&fit=crop&crop=center&flip=v'
    ],
    
    'lamborghini-huracan': [
        'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop&crop=center&flip=h',
        'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop&crop=center&flip=v'
    ],
    
    'porsche-911': [
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&crop=center&flip=h',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&crop=center&flip=v'
    ],
    
    // SUV di lusso
    'range-rover-sport': [
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&crop=center&flip=h',
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&crop=center&flip=v'
    ],
    
    'bmw-x7': [
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&crop=center&flip=h',
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&crop=center&flip=v'
    ],
    
    'mercedes-gle': [
        'https://images.unsplash.com/photo-1618843479618-39b0b7a3b8c7?w=800&h=600&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1618843479618-39b0b7a3b8c7?w=800&h=600&fit=crop&crop=center&flip=h',
        'https://images.unsplash.com/photo-1618843479618-39b0b7a3b8c7?w=800&h=600&fit=crop&crop=center&flip=v'
    ],
    
    // Auto elettriche
    'tesla-model-s': [
        'https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=800&h=600&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=800&h=600&fit=crop&crop=center&flip=h',
        'https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=800&h=600&fit=crop&crop=center&flip=v'
    ],
    
    'porsche-taycan': [
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&crop=center&flip=h',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&crop=center&flip=v'
    ],
    
    'audi-e-tron': [
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&crop=center&flip=h',
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&crop=center&flip=v'
    ],
    
    // Auto classiche
    'rolls-royce-phantom': [
        'https://images.unsplash.com/photo-1618843479618-39b0b7a3b8c7?w=800&h=600&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1618843479618-39b0b7a3b8c7?w=800&h=600&fit=crop&crop=center&flip=h',
        'https://images.unsplash.com/photo-1618843479618-39b0b7a3b8c7?w=800&h=600&fit=crop&crop=center&flip=v'
    ],
    
    'bentley-continental': [
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&crop=center&flip=h',
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&crop=center&flip=v'
    ],
    
    'aston-martin-db11': [
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&crop=center&flip=h',
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&crop=center&flip=v'
    ]
};

// Funzione per ottenere immagini per un'auto specifica
function getCarImages(carModel) {
    return carImages[carModel] || [
        'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop&crop=center&flip=h',
        'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop&crop=center&flip=v'
    ];
}

// Funzione per ottenere immagine principale
function getMainCarImage(carModel) {
    const images = getCarImages(carModel);
    return images[0];
}

// Funzione per ottenere tutte le immagini di un'auto
function getAllCarImages(carModel) {
    return getCarImages(carModel);
}

// Esporta le funzioni
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { carImages, getCarImages, getMainCarImage, getAllCarImages };
}
