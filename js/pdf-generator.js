// Generatore PDF per Schede Auto - Wali Wheelse
class AutoPDFGenerator {
    constructor() {
        this.init();
    }

    init() {
        // Carica jsPDF se disponibile
        this.loadJSPDF();
    }

    async loadJSPDF() {
        if (typeof window.jsPDF === 'undefined') {
            try {
                // Carica jsPDF da CDN
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
                script.onload = () => {
                    console.log('jsPDF caricato con successo');
                };
                document.head.appendChild(script);
            } catch (error) {
                console.error('Errore nel caricamento di jsPDF:', error);
            }
        }
    }

    async generateCarPDF(carData) {
        // Aspetta che jsPDF sia caricato
        let attempts = 0;
        while (typeof window.jsPDF === 'undefined' && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }

        if (typeof window.jsPDF === 'undefined') {
            this.showError('Impossibile generare il PDF. Riprova più tardi.');
            return;
        }

        try {
            const { jsPDF } = window.jsPDF;
            const doc = new jsPDF();
            
            // Imposta font e stili
            doc.setFont('helvetica');
            
            // Header con logo
            this.addHeader(doc, carData);
            
            // Informazioni principali dell'auto
            this.addCarMainInfo(doc, carData);
            
            // Specifiche tecniche
            this.addTechnicalSpecs(doc, carData);
            
            // Dotazioni
            this.addFeatures(doc, carData);
            
            // Prezzo e finanziamento
            this.addPricingInfo(doc, carData);
            
            // Contatti concessionaria
            this.addDealerInfo(doc);
            
            // Footer
            this.addFooter(doc);
            
            // Genera e scarica PDF
            const fileName = `${carData.marca}_${carData.modello}_${carData.anno}.pdf`;
            doc.save(fileName);
            
            this.showSuccess('PDF generato e scaricato con successo!');
            
        } catch (error) {
            console.error('Errore nella generazione PDF:', error);
            this.showError('Errore nella generazione del PDF. Riprova.');
        }
    }

    addHeader(doc, carData) {
        // Logo e titolo
        doc.setFillColor(102, 126, 234);
        doc.rect(0, 0, 210, 30, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('Wali Wheelse', 20, 20);
        
        // Sottotitolo
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Concessionaria Auto di Lusso', 20, 28);
        
        // Reset colori
        doc.setTextColor(0, 0, 0);
        doc.setFillColor(255, 255, 255);
    }

    addCarMainInfo(doc, carData) {
        let yPosition = 50;
        
        // Titolo auto
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text(`${carData.marca} ${carData.modello}`, 20, yPosition);
        
        yPosition += 15;
        
        // Anno e chilometraggio
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.text(`Anno: ${carData.anno}`, 20, yPosition);
        doc.text(`Chilometraggio: ${carData.km.toLocaleString('it-IT')} km`, 120, yPosition);
        
        yPosition += 10;
        
        // Alimentazione e cambio
        doc.text(`Alimentazione: ${carData.alimentazione}`, 20, yPosition);
        doc.text(`Cambio: ${carData.cambio}`, 120, yPosition);
        
        yPosition += 10;
        
        // Potenza
        doc.text(`Potenza: ${carData.potenza_cv} CV`, 20, yPosition);
        
        yPosition += 10;
        
        // Colore e trazione
        doc.text(`Colore: ${carData.colore}`, 20, yPosition);
        doc.text(`Trazione: ${carData.trazione}`, 120, yPosition);
        
        yPosition += 20;
        
        // Descrizione
        if (carData.descrizione) {
            doc.setFontSize(12);
            doc.text('Descrizione:', 20, yPosition);
            yPosition += 8;
            
            const descriptionLines = this.splitTextToFit(doc, carData.descrizione, 170);
            descriptionLines.forEach(line => {
                doc.text(line, 20, yPosition);
                yPosition += 6;
            });
            
            yPosition += 10;
        }
        
        return yPosition;
    }

    addTechnicalSpecs(doc, carData) {
        let yPosition = 140;
        
        // Titolo sezione
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Specifiche Tecniche', 20, yPosition);
        
        yPosition += 15;
        
        // Prestazioni
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Prestazioni:', 20, yPosition);
        yPosition += 8;
        
        doc.setFont('helvetica', 'normal');
        if (carData['0_100']) {
            doc.text(`0-100 km/h: ${carData['0_100']} secondi`, 30, yPosition);
            yPosition += 6;
        }
        
        if (carData.consumi_l_100km) {
            doc.text(`Consumi: ${carData.consumi_l_100km} l/100km`, 30, yPosition);
            yPosition += 6;
        }
        
        if (carData.emissioni_co2) {
            doc.text(`Emissioni CO2: ${carData.emissioni_co2} g/km`, 30, yPosition);
            yPosition += 6;
        }
        
        yPosition += 10;
        
        // Dimensioni
        if (carData.dimensioni) {
            doc.setFont('helvetica', 'bold');
            doc.text('Dimensioni:', 20, yPosition);
            yPosition += 8;
            
            doc.setFont('helvetica', 'normal');
            doc.text(`Lunghezza: ${carData.dimensioni.lunghezza_mm} mm`, 30, yPosition);
            yPosition += 6;
            doc.text(`Larghezza: ${carData.dimensioni.larghezza_mm} mm`, 30, yPosition);
            yPosition += 6;
            doc.text(`Altezza: ${carData.dimensioni.altezza_mm} mm`, 30, yPosition);
            yPosition += 6;
            doc.text(`Passo: ${carData.dimensioni.passo_mm} mm`, 30, yPosition);
            yPosition += 6;
            
            if (carData.bagagliaio_l) {
                doc.text(`Bagagliaio: ${carData.bagagliaio_l} litri`, 30, yPosition);
                yPosition += 6;
            }
            
            yPosition += 10;
        }
        
        // Altri dettagli
        if (carData.porte || carData.posti) {
            doc.setFont('helvetica', 'bold');
            doc.text('Caratteristiche:', 20, yPosition);
            yPosition += 8;
            
            doc.setFont('helvetica', 'normal');
            if (carData.porte) {
                doc.text(`Porte: ${carData.porte}`, 30, yPosition);
                yPosition += 6;
            }
            if (carData.posti) {
                doc.text(`Posti: ${carData.posti}`, 30, yPosition);
                yPosition += 6;
            }
            
            yPosition += 10;
        }
        
        return yPosition;
    }

    addFeatures(doc, carData) {
        if (!carData.dotazioni || carData.dotazioni.length === 0) {
            return 200;
        }
        
        let yPosition = 200;
        
        // Titolo sezione
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Dotazioni Principali', 20, yPosition);
        
        yPosition += 15;
        
        // Lista dotazioni
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        
        const featuresPerColumn = 8;
        const columnWidth = 80;
        
        carData.dotazioni.forEach((feature, index) => {
            const column = Math.floor(index / featuresPerColumn);
            const row = index % featuresPerColumn;
            const x = 20 + (column * columnWidth);
            const y = yPosition + (row * 6);
            
            if (y < 280) { // Evita di scrivere oltre i margini
                doc.text(`• ${feature}`, x, y);
            }
        });
        
        return 280;
    }

    addPricingInfo(doc, carData) {
        let yPosition = 280;
        
        // Titolo sezione
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Prezzo e Finanziamento', 20, yPosition);
        
        yPosition += 15;
        
        // Prezzo principale
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(102, 126, 234);
        doc.text(`€ ${carData.prezzo.toLocaleString('it-IT')}`, 20, yPosition);
        
        yPosition += 10;
        
        // Informazioni finanziamento
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text('Finanziamento disponibile:', 20, yPosition);
        yPosition += 8;
        doc.text('• Tasso da 2.9% TAN', 30, yPosition);
        yPosition += 6;
        doc.text('• Durata fino a 84 mesi', 30, yPosition);
        yPosition += 6;
        doc.text('• Approvazione in 24h', 30, yPosition);
        yPosition += 6;
        doc.text('• Nessun acconto richiesto', 30, yPosition);
        
        return yPosition + 20;
    }

    addDealerInfo(doc) {
        let yPosition = 350;
        
        // Box informazioni concessionaria
        doc.setFillColor(248, 250, 252);
        doc.rect(15, yPosition - 10, 180, 40, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.rect(15, yPosition - 10, 180, 40, 'S');
        
        // Titolo
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('Contattaci per Maggiori Informazioni', 20, yPosition);
        
        yPosition += 10;
        
        // Contatti
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text('📞 +39 123 456 789', 20, yPosition);
        yPosition += 6;
        doc.text('📧 info@waliwheelse.it', 20, yPosition);
        yPosition += 6;
        doc.text('📍 Via Roma 123, 20100 Milano', 20, yPosition);
        yPosition += 6;
        doc.text('🕒 Lun-Ven: 9:00-18:00 | Sab: 9:00-12:00', 20, yPosition);
    }

    addFooter(doc) {
        const pageHeight = doc.internal.pageSize.height;
        
        // Linea separatrice
        doc.setDrawColor(226, 232, 240);
        doc.line(20, pageHeight - 30, 190, pageHeight - 30);
        
        // Footer text
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text('Wali Wheelse - Concessionaria Auto di Lusso', 20, pageHeight - 20);
        doc.text('Documento generato automaticamente', 20, pageHeight - 15);
        doc.text(`Data: ${new Date().toLocaleDateString('it-IT')}`, 20, pageHeight - 10);
    }

    splitTextToFit(doc, text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        
        words.forEach(word => {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const testWidth = doc.getTextWidth(testLine);
            
            if (testWidth > maxWidth && currentLine !== '') {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        });
        
        if (currentLine) {
            lines.push(currentLine);
        }
        
        return lines;
    }

    showSuccess(message) {
        // Crea notifica di successo
        this.createNotification(message, 'success');
    }

    showError(message) {
        // Crea notifica di errore
        this.createNotification(message, 'error');
    }

    createNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `pdf-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✅' : '❌'}</span>
                <span class="notification-text">${message}</span>
            </div>
        `;
        
        // Stili inline per la notifica
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            z-index: 10002;
            transform: translateX(400px);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Anima entrata
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Rimuovi dopo 4 secondi
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    // Metodo per aggiungere pulsante download a schede auto
    addDownloadButton(carElement, carData) {
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'download-pdf-btn';
        downloadBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            <span>Scarica Scheda PDF</span>
        `;
        
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.generateCarPDF(carData);
        });
        
        // Aggiungi pulsante all'elemento auto
        if (carElement) {
            carElement.appendChild(downloadBtn);
        }
        
        return downloadBtn;
    }

    // Metodo per aggiungere pulsanti download a tutte le auto
    addDownloadButtonsToAllCars() {
        if (window.carsDatabase) {
            window.carsDatabase.forEach(car => {
                // Cerca elementi auto nel DOM
                const carElements = document.querySelectorAll(`[data-car-id="${car.id}"], .car-card[data-id="${car.id}"]`);
                carElements.forEach(element => {
                    this.addDownloadButton(element, car);
                });
            });
        }
    }
}

// Inizializza il generatore PDF
document.addEventListener('DOMContentLoaded', () => {
    window.autoPDFGenerator = new AutoPDFGenerator();
    
    // Aggiungi pulsanti download dopo un breve delay per permettere il caricamento delle auto
    setTimeout(() => {
        if (window.autoPDFGenerator) {
            window.autoPDFGenerator.addDownloadButtonsToAllCars();
        }
    }, 1000);
});

// Esporta per uso esterno
window.AutoPDFGenerator = AutoPDFGenerator;
