// AutoShop Premium - Database Auto e Funzioni Utilità

// Database delle auto con dati completi
const carsDatabase = [
    {
        id: 1,
        slug: "mercedes-amg-gt-2024",
        titolo: "Mercedes-AMG GT 2024",
        marca: "Mercedes-Benz",
        modello: "AMG GT",
        anno: 2024,
        prezzo: 185000,
        km: 0,
        alimentazione: "Benzina",
        cambio: "Automatico",
        potenza_cv: 585,
        colore: "Obsidian Black",
        trazione: "Posteriore",
        carrozzeria: "Sportiva",
        emissioni_co2: 280,
        "0_100": 3.2,
        consumi_l_100km: 12.5,
        dimensioni: {
            lunghezza_mm: 4544,
            larghezza_mm: 1939,
            altezza_mm: 1287,
            passo_mm: 2630
        },
        bagagliaio_l: 350,
        porte: 2,
        posti: 2,
        badge: ["Nuovo"],
        immagini: [
            "/assets/img/cars/mercedes-amg-gt-1.jpg",
            "/assets/img/cars/mercedes-amg-gt-2.jpg",
            "/assets/img/cars/mercedes-amg-gt-3.jpg"
        ],
        video360: "/assets/video/mercedes-amg-gt-360.mp4",
        dotazioni: [
            "AMG DYNAMIC PLUS Package",
            "Burmester® Surround Sound System",
            "AMG Performance Seats",
            "Head-up Display",
            "360° Camera",
            "AMG Track Pace",
            "Carbon Fiber Interior",
            "Panoramic Sunroof"
        ],
        descrizione: "La Mercedes-AMG GT rappresenta l'eccellenza sportiva tedesca. Con il suo motore V8 biturbo da 585 CV, offre prestazioni straordinarie e un design aggressivo che incarna la passione per la velocità.",
        categoria: "sportiva"
    },
    {
        id: 2,
        slug: "bmw-x7-m60i-2024",
        titolo: "BMW X7 M60i 2024",
        marca: "BMW",
        modello: "X7 M60i",
        anno: 2024,
        prezzo: 165000,
        km: 0,
        alimentazione: "Benzina",
        cambio: "Automatico",
        potenza_cv: 530,
        colore: "Tanzanite Blue",
        trazione: "Integrale xDrive",
        carrozzeria: "SUV",
        emissioni_co2: 295,
        "0_100": 4.7,
        consumi_l_100km: 13.8,
        dimensioni: {
            lunghezza_mm: 5151,
            larghezza_mm: 2000,
            altezza_mm: 1805,
            passo_mm: 3105
        },
        bagagliaio_l: 750,
        porte: 5,
        posti: 7,
        badge: ["Nuovo"],
        immagini: [
            "/assets/img/cars/bmw-x7-1.jpg",
            "/assets/img/cars/bmw-x7-2.jpg",
            "/assets/img/cars/bmw-x7-3.jpg"
        ],
        video360: "/assets/video/bmw-x7-360.mp4",
        dotazioni: [
            "M Sport Package",
            "Panoramic Sky Lounge",
            "Bowers & Wilkins Diamond Sound",
            "Executive Lounge Seating",
            "Gesture Control",
            "BMW Live Cockpit Professional",
            "Driving Assistant Professional",
            "Parking Assistant Plus"
        ],
        descrizione: "Il BMW X7 M60i è il SUV di lusso definitivo che combina eleganza, comfort e prestazioni sportive. Con il suo motore V8 da 530 CV, offre un'esperienza di guida senza compromessi.",
        categoria: "suv"
    },
    {
        id: 3,
        slug: "audi-rs-e-tron-gt-2024",
        titolo: "Audi RS e-tron GT 2024",
        marca: "Audi",
        modello: "RS e-tron GT",
        anno: 2024,
        prezzo: 145000,
        km: 0,
        alimentazione: "Elettrica",
        cambio: "Automatico",
        potenza_cv: 646,
        colore: "Daytona Gray",
        trazione: "Integrale quattro",
        carrozzeria: "Sportiva",
        emissioni_co2: 0,
        "0_100": 3.3,
        consumi_l_100km: 0,
        dimensioni: {
            lunghezza_mm: 4986,
            larghezza_mm: 1964,
            altezza_mm: 1393,
            passo_mm: 2900
        },
        bagagliaio_l: 450,
        porte: 4,
        posti: 5,
        badge: ["Nuovo"],
        immagini: [
            "/assets/img/cars/audi-rs-etron-1.jpg",
            "/assets/img/cars/audi-rs-etron-2.jpg",
            "/assets/img/cars/audi-rs-etron-3.jpg"
        ],
        video360: "/assets/video/audi-rs-etron-360.mp4",
        dotazioni: [
            "RS Sport Package",
            "Bang & Olufsen 3D Sound",
            "Matrix LED Headlights",
            "Virtual Cockpit Plus",
            "MMI Navigation Plus",
            "Audi Pre Sense",
            "Adaptive Air Suspension",
            "Carbon Fiber Package"
        ],
        descrizione: "L'Audi RS e-tron GT rappresenta il futuro della mobilità sportiva. Con 646 CV di potenza elettrica, offre accelerazioni da supercar mantenendo la sostenibilità ambientale.",
        categoria: "elettrica"
    },
    {
        id: 4,
        slug: "porsche-911-carrera-s-2024",
        titolo: "Porsche 911 Carrera S 2024",
        marca: "Porsche",
        modello: "911 Carrera S",
        anno: 2024,
        prezzo: 175000,
        km: 0,
        alimentazione: "Benzina",
        cambio: "Automatico PDK",
        potenza_cv: 450,
        colore: "GT Silver Metallic",
        trazione: "Posteriore",
        carrozzeria: "Sportiva",
        emissioni_co2: 245,
        "0_100": 3.7,
        consumi_l_100km: 10.8,
        dimensioni: {
            lunghezza_mm: 4537,
            larghezza_mm: 1852,
            altezza_mm: 1297,
            passo_mm: 2450
        },
        bagagliaio_l: 264,
        porte: 2,
        posti: 4,
        badge: ["Nuovo"],
        immagini: [
            "/assets/img/cars/porsche-911-1.jpg",
            "/assets/img/cars/porsche-911-2.jpg",
            "/assets/img/cars/porsche-911-3.jpg"
        ],
        video360: "/assets/video/porsche-911-360.mp4",
        dotazioni: [
            "Sport Chrono Package",
            "PASM Sport Suspension",
            "Porsche Ceramic Composite Brakes",
            "Sport Exhaust System",
            "Bose Surround Sound",
            "Porsche Communication Management",
            "Adaptive Cruise Control",
            "Lane Change Assistant"
        ],
        descrizione: "La Porsche 911 Carrera S è l'icona dello sport automobilistico. Con il suo motore boxer da 450 CV, offre la perfetta combinazione di prestazioni, maneggevolezza e comfort quotidiano.",
        categoria: "sportiva"
    },
    {
        id: 5,
        slug: "ferrari-sf90-stradale-2024",
        titolo: "Ferrari SF90 Stradale 2024",
        marca: "Ferrari",
        modello: "SF90 Stradale",
        anno: 2024,
        prezzo: 450000,
        km: 0,
        alimentazione: "Ibrida Plug-in",
        cambio: "Automatico",
        potenza_cv: 1000,
        colore: "Rosso Corsa",
        trazione: "Integrale",
        carrozzeria: "Sportiva",
        emissioni_co2: 340,
        "0_100": 2.5,
        consumi_l_100km: 15.2,
        dimensioni: {
            lunghezza_mm: 4710,
            larghezza_mm: 1972,
            altezza_mm: 1186,
            passo_mm: 2650
        },
        bagagliaio_l: 270,
        porte: 2,
        posti: 2,
        badge: ["Nuovo"],
        immagini: [
            "/assets/img/cars/ferrari-sf90-1.jpg",
            "/assets/img/cars/ferrari-sf90-2.jpg",
            "/assets/img/cars/ferrari-sf90-3.jpg"
        ],
        video360: "/assets/video/ferrari-sf90-360.mp4",
        dotazioni: [
            "Assetto Fiorano",
            "Carbon Fiber Wheels",
            "Carbon Fiber Monocoque",
            "eManettino",
            "7-speed DCT",
            "RAC-e (eCornering)",
            "Carbon Fiber Package",
            "Racing Seats"
        ],
        descrizione: "La Ferrari SF90 Stradale è la supercar ibrida più potente mai prodotta dalla casa di Maranello. Con 1000 CV di potenza combinata, rappresenta il futuro della velocità.",
        categoria: "sportiva"
    },
    {
        id: 6,
        slug: "lamborghini-urus-2024",
        titolo: "Lamborghini Urus 2024",
        marca: "Lamborghini",
        modello: "Urus",
        anno: 2024,
        prezzo: 220000,
        km: 0,
        alimentazione: "Benzina",
        cambio: "Automatico",
        potenza_cv: 650,
        colore: "Verde Mantis",
        trazione: "Integrale",
        carrozzeria: "SUV",
        emissioni_co2: 325,
        "0_100": 3.6,
        consumi_l_100km: 14.7,
        dimensioni: {
            lunghezza_mm: 5112,
            larghezza_mm: 2016,
            altezza_mm: 1638,
            passo_mm: 3003
        },
        bagagliaio_l: 616,
        porte: 5,
        posti: 5,
        badge: ["Nuovo"],
        immagini: [
            "/assets/img/cars/lamborghini-urus-1.jpg",
            "/assets/img/cars/lamborghini-urus-2.jpg",
            "/assets/img/cars/lamborghini-urus-3.jpg"
        ],
        video360: "/assets/video/lamborghini-urus-360.mp4",
        dotazioni: [
            "Ad Personam Program",
            "Bang & Olufsen 3D Sound",
            "Lamborghini Telemetry System",
            "Adaptive Air Suspension",
            "Carbon Ceramic Brakes",
            "21\" Alloy Wheels",
            "Panoramic Roof",
            "Sport Seats"
        ],
        descrizione: "Il Lamborghini Urus è il SUV più veloce del mondo. Con 650 CV di potenza, combina la versatilità di un SUV con le prestazioni di una supercar.",
        categoria: "suv"
    },
    {
        id: 7,
        slug: "mercedes-s-class-2024",
        titolo: "Mercedes-Benz S-Class 2024",
        marca: "Mercedes-Benz",
        modello: "S-Class",
        anno: 2024,
        prezzo: 135000,
        km: 0,
        alimentazione: "Benzina",
        cambio: "Automatico 9G-TRONIC",
        potenza_cv: 367,
        colore: "Obsidian Black",
        trazione: "Posteriore",
        carrozzeria: "Berlina",
        emissioni_co2: 185,
        "0_100": 5.1,
        consumi_l_100km: 8.1,
        dimensioni: {
            lunghezza_mm: 5289,
            larghezza_mm: 1921,
            altezza_mm: 1503,
            passo_mm: 3216
        },
        bagagliaio_l: 550,
        porte: 4,
        posti: 5,
        badge: ["Nuovo"],
        immagini: [
            "/assets/img/cars/mercedes-s-class-1.jpg",
            "/assets/img/cars/mercedes-s-class-2.jpg",
            "/assets/img/cars/mercedes-s-class-3.jpg"
        ],
        video360: "/assets/video/mercedes-s-class-360.mp4",
        dotazioni: [
            "Executive Rear Seat Package",
            "Burmester® 4D Surround Sound",
            "MBUX Interior Assistant",
            "Digital Light",
            "E-ACTIVE BODY CONTROL",
            "PRE-SAFE® PLUS",
            "Panoramic Sliding Sunroof",
            "Ambient Lighting"
        ],
        descrizione: "La Mercedes-Benz S-Class è la berlina di lusso per eccellenza. Con tecnologie all'avanguardia e comfort ineguagliabile, rappresenta il pinnacolo dell'ingegneria automobilistica.",
        categoria: "berlina"
    },
    {
        id: 8,
        slug: "bmw-7-series-2024",
        titolo: "BMW 7 Series 2024",
        marca: "BMW",
        modello: "7 Series",
        anno: 2024,
        prezzo: 125000,
        km: 0,
        alimentazione: "Benzina",
        cambio: "Automatico Steptronic",
        potenza_cv: 381,
        colore: "Alpine White",
        trazione: "Posteriore",
        carrozzeria: "Berlina",
        emissioni_co2: 175,
        "0_100": 5.4,
        consumi_l_100km: 7.8,
        dimensioni: {
            lunghezza_mm: 5391,
            larghezza_mm: 1950,
            altezza_mm: 1544,
            passo_mm: 3215
        },
        bagagliaio_l: 515,
        porte: 4,
        posti: 5,
        badge: ["Nuovo"],
        immagini: [
            "/assets/img/cars/bmw-7-series-1.jpg",
            "/assets/img/cars/bmw-7-series-2.jpg",
            "/assets/img/cars/bmw-7-series-3.jpg"
        ],
        video360: "/assets/video/bmw-7-series-360.mp4",
        dotazioni: [
            "Executive Lounge Seating",
            "Bowers & Wilkins Diamond Sound",
            "BMW Live Cockpit Professional",
            "Gesture Control",
            "Sky Lounge Panoramic Roof",
            "Driving Assistant Professional",
            "Parking Assistant Plus",
            "Ambient Air Package"
        ],
        descrizione: "La BMW 7 Series è la berlina di lusso che combina eleganza classica con tecnologie moderne. Con il suo design imponente e interni raffinati, offre un'esperienza di guida senza compromessi.",
        categoria: "berlina"
    },
    {
        id: 9,
        slug: "tesla-model-s-plaid-2024",
        titolo: "Tesla Model S Plaid 2024",
        marca: "Tesla",
        modello: "Model S Plaid",
        anno: 2024,
        prezzo: 110000,
        km: 0,
        alimentazione: "Elettrica",
        cambio: "Automatico",
        potenza_cv: 1020,
        colore: "Deep Blue Metallic",
        trazione: "Integrale AWD",
        carrozzeria: "Berlina",
        emissioni_co2: 0,
        "0_100": 2.1,
        consumi_l_100km: 0,
        dimensioni: {
            lunghezza_mm: 4979,
            larghezza_mm: 1964,
            altezza_mm: 1445,
            passo_mm: 2960
        },
        bagagliaio_l: 793,
        porte: 4,
        posti: 5,
        badge: ["Nuovo"],
        immagini: [
            "/assets/img/cars/tesla-model-s-1.jpg",
            "/assets/img/cars/tesla-model-s-2.jpg",
            "/assets/img/cars/tesla-model-s-3.jpg"
        ],
        video360: "/assets/video/tesla-model-s-360.mp4",
        dotazioni: [
            "Plaid Powertrain",
            "21\" Arachnid Wheels",
            "Carbon Fiber Décor",
            "Premium Interior",
            "Autopilot",
            "Full Self-Driving Capability",
            "Premium Audio",
            "Glass Roof"
        ],
        descrizione: "La Tesla Model S Plaid è la berlina elettrica più veloce del mondo. Con 1020 CV di potenza e accelerazione da 0 a 100 km/h in soli 2.1 secondi, rappresenta il futuro della mobilità.",
        categoria: "elettrica"
    },
    {
        id: 10,
        slug: "porsche-taycan-turbo-s-2024",
        titolo: "Porsche Taycan Turbo S 2024",
        marca: "Porsche",
        modello: "Taycan Turbo S",
        anno: 2024,
        prezzo: 180000,
        km: 0,
        alimentazione: "Elettrica",
        cambio: "Automatico",
        potenza_cv: 761,
        colore: "Frozen Blue Metallic",
        trazione: "Integrale",
        carrozzeria: "Sportiva",
        emissioni_co2: 0,
        "0_100": 2.8,
        consumi_l_100km: 0,
        dimensioni: {
            lunghezza_mm: 4963,
            larghezza_mm: 1966,
            altezza_mm: 1378,
            passo_mm: 2900
        },
        bagagliaio_l: 491,
        porte: 4,
        posti: 4,
        badge: ["Nuovo"],
        immagini: [
            "/assets/img/cars/porsche-taycan-1.jpg",
            "/assets/img/cars/porsche-taycan-2.jpg",
            "/assets/img/cars/porsche-taycan-3.jpg"
        ],
        video360: "/assets/video/porsche-taycan-360.mp4",
        dotazioni: [
            "Performance Battery Plus",
            "Porsche Ceramic Composite Brakes",
            "Adaptive Sport Seats Plus",
            "Burmester 3D Sound System",
            "Porsche Communication Management",
            "Matrix LED Headlights",
            "Sport Chrono Package",
            "Carbon Fiber Package"
        ],
        descrizione: "La Porsche Taycan Turbo S è la sportiva elettrica che mantiene il DNA Porsche. Con 761 CV di potenza e prestazioni da supercar, offre un'esperienza di guida elettrica senza precedenti.",
        categoria: "elettrica"
    },
    {
        id: 11,
        slug: "ferrari-296-gtb-2024",
        titolo: "Ferrari 296 GTB 2024",
        marca: "Ferrari",
        modello: "296 GTB",
        anno: 2024,
        prezzo: 320000,
        km: 0,
        alimentazione: "Ibrida",
        cambio: "Automatico 8F-DCT",
        potenza_cv: 830,
        colore: "Rosso Maranello",
        trazione: "Posteriore",
        carrozzeria: "Sportiva",
        emissioni_co2: 149,
        "0_100": 2.9,
        consumi_l_100km: 6.4,
        dimensioni: {
            lunghezza_mm: 4565,
            larghezza_mm: 1958,
            altezza_mm: 1191,
            passo_mm: 2600
        },
        bagagliaio_l: 150,
        porte: 2,
        posti: 2,
        badge: ["Nuovo"],
        immagini: [
            "/assets/img/cars/ferrari-296-1.jpg",
            "/assets/img/cars/ferrari-296-2.jpg",
            "/assets/img/cars/ferrari-296-3.jpg"
        ],
        video360: "/assets/video/ferrari-296-360.mp4",
        dotazioni: [
            "Assetto Fiorano",
            "Carbon Fiber Wheels",
            "Carbon Ceramic Brakes",
            "Racing Seats",
            "Telemetry System",
            "7-speed DCT",
            "eManettino",
            "Carbon Fiber Package"
        ],
        descrizione: "La Ferrari 296 GTB è la supercar ibrida che combina il meglio della tradizione Ferrari con l'innovazione tecnologica. Con 830 CV di potenza, offre prestazioni straordinarie e efficienza.",
        categoria: "sportiva"
    },
    {
        id: 12,
        slug: "lamborghini-revuelto-2024",
        titolo: "Lamborghini Revuelto 2024",
        marca: "Lamborghini",
        modello: "Revuelto",
        anno: 2024,
        prezzo: 580000,
        km: 0,
        alimentazione: "Ibrida Plug-in",
        cambio: "Automatico 8-speed",
        potenza_cv: 1001,
        colore: "Verde Revuelto",
        trazione: "Integrale",
        carrozzeria: "Sportiva",
        emissioni_co2: 439,
        "0_100": 2.8,
        consumi_l_100km: 19.3,
        dimensioni: {
            lunghezza_mm: 4947,
            larghezza_mm: 2033,
            altezza_mm: 1160,
            passo_mm: 2770
        },
        bagagliaio_l: 100,
        porte: 2,
        posti: 2,
        badge: ["Nuovo"],
        immagini: [
            "/assets/img/cars/lamborghini-revuelto-1.jpg",
            "/assets/img/cars/lamborghini-revuelto-2.jpg",
            "/assets/img/cars/lamborghini-revuelto-3.jpg"
        ],
        video360: "/assets/video/lamborghini-revuelto-360.mp4",
        dotazioni: [
            "Lamborghini Telemetry System",
            "Carbon Fiber Monocoque",
            "Carbon Ceramic Brakes",
            "Lifting System",
            "Carbon Fiber Wheels",
            "Racing Seats",
            "Lamborghini Connect",
            "Carbon Fiber Package"
        ],
        descrizione: "La Lamborghini Revuelto è la supercar ibrida che segna l'inizio di una nuova era. Con 1001 CV di potenza combinata, rappresenta il futuro della velocità e dell'innovazione tecnologica.",
        categoria: "sportiva"
    }
];

// Funzioni utilità per la gestione dei dati
const CarUtils = {
    // Formatta il prezzo in formato italiano
    formatPrice: (price) => {
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0
        }).format(price);
    },

    // Formatta i chilometri
    formatKm: (km) => {
        if (km === 0) return 'Nuova';
        return new Intl.NumberFormat('it-IT').format(km) + ' km';
    },

    // Genera slug da titolo
    generateSlug: (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    },

    // Filtra auto per categoria
    filterByCategory: (cars, category) => {
        if (category === 'tutte') return cars;
        return cars.filter(car => car.categoria === category);
    },

    // Filtra auto per prezzo
    filterByPrice: (cars, minPrice, maxPrice) => {
        return cars.filter(car => {
            if (minPrice && car.prezzo < minPrice) return false;
            if (maxPrice && car.prezzo > maxPrice) return false;
            return true;
        });
    },

    // Filtra auto per marca
    filterByBrand: (cars, brand) => {
        if (!brand) return cars;
        return cars.filter(car => 
            car.marca.toLowerCase().includes(brand.toLowerCase())
        );
    },

    // Filtra auto per anno
    filterByYear: (cars, minYear, maxYear) => {
        return cars.filter(car => {
            if (minYear && car.anno < minYear) return false;
            if (maxYear && car.anno > maxYear) return false;
            return true;
        });
    },

    // Filtra auto per alimentazione
    filterByFuel: (cars, fuel) => {
        if (!fuel || fuel === 'tutte') return cars;
        return cars.filter(car => car.alimentazione === fuel);
    },

    // Filtra auto per cambio
    filterByTransmission: (cars, transmission) => {
        if (!transmission || transmission === 'tutte') return cars;
        return cars.filter(car => car.cambio === transmission);
    },

    // Ordina auto
    sortCars: (cars, sortBy, sortOrder = 'asc') => {
        const sortedCars = [...cars];
        
        switch (sortBy) {
            case 'prezzo':
                sortedCars.sort((a, b) => sortOrder === 'asc' ? a.prezzo - b.prezzo : b.prezzo - a.prezzo);
                break;
            case 'anno':
                sortedCars.sort((a, b) => sortOrder === 'asc' ? a.anno - b.anno : b.anno - a.anno);
                break;
            case 'km':
                sortedCars.sort((a, b) => sortOrder === 'asc' ? a.km - b.km : b.km - a.km);
                break;
            case 'potenza':
                sortedCars.sort((a, b) => sortOrder === 'asc' ? a.potenza_cv - b.potenza_cv : b.potenza_cv - a.potenza_cv);
                break;
            case 'nome':
                sortedCars.sort((a, b) => {
                    const nameA = `${a.marca} ${a.modello}`.toLowerCase();
                    const nameB = `${b.marca} ${b.modello}`.toLowerCase();
                    return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
                });
                break;
            default:
                break;
        }
        
        return sortedCars;
    },

    // Ricerca testuale nelle auto
    searchCars: (cars, searchTerm) => {
        if (!searchTerm) return cars;
        
        const term = searchTerm.toLowerCase();
        return cars.filter(car => 
            car.marca.toLowerCase().includes(term) ||
            car.modello.toLowerCase().includes(term) ||
            car.titolo.toLowerCase().includes(term) ||
            car.colore.toLowerCase().includes(term)
        );
    },

    // Ottieni auto correlate
    getRelatedCars: (currentCar, count = 3) => {
        const related = carsDatabase
            .filter(car => 
                car.id !== currentCar.id && 
                (car.categoria === currentCar.categoria || car.marca === currentCar.marca)
            )
            .slice(0, count);
        
        return related;
    },

    // Ottieni statistiche delle auto
    getCarStats: () => {
        const stats = {
            total: carsDatabase.length,
            byCategory: {},
            byBrand: {},
            byFuel: {},
            priceRange: {
                min: Math.min(...carsDatabase.map(car => car.prezzo)),
                max: Math.max(...carsDatabase.map(car => car.prezzo)),
                average: Math.round(carsDatabase.reduce((sum, car) => sum + car.prezzo, 0) / carsDatabase.length)
            },
            yearRange: {
                min: Math.min(...carsDatabase.map(car => car.anno)),
                max: Math.max(...carsDatabase.map(car => car.anno))
            }
        };

        // Statistiche per categoria
        carsDatabase.forEach(car => {
            stats.byCategory[car.categoria] = (stats.byCategory[car.categoria] || 0) + 1;
            stats.byBrand[car.marca] = (stats.byBrand[car.marca] || 0) + 1;
            stats.byFuel[car.alimentazione] = (stats.byFuel[car.alimentazione] || 0) + 1;
        });

        return stats;
    },

    // Ottieni auto in evidenza (prime 6)
    getFeaturedCars: () => {
        return carsDatabase.slice(0, 6);
    },

    // Ottieni auto per categoria
    getCarsByCategory: (category) => {
        return CarUtils.filterByCategory(carsDatabase, category);
    },

    // Ottieni auto per marca
    getCarsByBrand: (brand) => {
        return CarUtils.filterByBrand(carsDatabase, brand);
    },

    // Ottieni auto per prezzo
    getCarsByPriceRange: (minPrice, maxPrice) => {
        return CarUtils.filterByPrice(carsDatabase, minPrice, maxPrice);
    },

    // Ottieni auto per anno
    getCarsByYearRange: (minYear, maxYear) => {
        return CarUtils.filterByYear(carsDatabase, minYear, maxYear);
    },

    // Ottieni auto per alimentazione
    getCarsByFuel: (fuel) => {
        return CarUtils.filterByFuel(carsDatabase, fuel);
    },

    // Ottieni auto per cambio
    getCarsByTransmission: (transmission) => {
        return CarUtils.filterByTransmission(carsDatabase, transmission);
    },

    // Applica filtri multipli
    applyFilters: (filters) => {
        let filteredCars = [...carsDatabase];

        if (filters.category && filters.category !== 'tutte') {
            filteredCars = CarUtils.filterByCategory(filteredCars, filters.category);
        }

        if (filters.brand) {
            filteredCars = CarUtils.filterByBrand(filteredCars, filters.brand);
        }

        if (filters.minPrice || filters.maxPrice) {
            filteredCars = CarUtils.filterByPrice(filteredCars, filters.minPrice, filters.maxPrice);
        }

        if (filters.minYear || filters.maxYear) {
            filteredCars = CarUtils.filterByYear(filteredCars, filters.minYear, filters.maxYear);
        }

        if (filters.fuel && filters.fuel !== 'tutte') {
            filteredCars = CarUtils.filterByFuel(filteredCars, filters.fuel);
        }

        if (filters.transmission && filters.transmission !== 'tutte') {
            filteredCars = CarUtils.filterByTransmission(filteredCars, filters.transmission);
        }

        if (filters.search) {
            filteredCars = CarUtils.searchCars(filteredCars, filters.search);
        }

        if (filters.sortBy) {
            filteredCars = CarUtils.sortCars(filteredCars, filters.sortBy, filters.sortOrder);
        }

        return filteredCars;
    }
};

// Esporta per uso globale
window.carsDatabase = carsDatabase;
window.CarUtils = CarUtils;
