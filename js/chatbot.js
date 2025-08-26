// Chatbot Avanzato per Wali Wheelse
class AutoChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.currentStep = 'welcome';
        this.userInfo = {};
        this.init();
    }

    init() {
        this.createChatbotHTML();
        this.bindEvents();
        this.loadWelcomeMessage();
    }

    createChatbotHTML() {
        const chatbotHTML = `
            <div class="chatbot-container" id="chatbotContainer">
                <!-- Chatbot Toggle Button -->
                <button class="chatbot-toggle" id="chatbotToggle" aria-label="Apri Chatbot">
                    <svg class="chatbot-icon" viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                    </svg>
                    <span class="chatbot-label">Assistenza</span>
                    <div class="chatbot-pulse"></div>
                </button>

                <!-- Chatbot Window -->
                <div class="chatbot-window" id="chatbotWindow">
                    <div class="chatbot-header">
                        <div class="chatbot-header-info">
                            <div class="chatbot-avatar">
                                <img src="assets/images/chatbot-avatar.png" alt="Assistente Wali" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iMjAiIGZpbGw9IiM2NDY5RjAiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiIHg9IjgiIHk9IjgiPgo8cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptLTIgMTVsLTUtNSAxLjQxLTEuNDFMMTAgMTQuMTdsNy41OS03LjU5TDE5IDhsLTkgOXoiLz4KPC9zdmc+Cjwvc3ZnPgo='">
                            </div>
                            <div class="chatbot-info">
                                <h3>Assistente Wali</h3>
                                <p class="chatbot-status">Online</p>
                            </div>
                        </div>
                        <button class="chatbot-close" id="chatbotClose" aria-label="Chiudi Chatbot">
                            <svg viewBox="0 0 24 24">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>
                    </div>

                    <div class="chatbot-messages" id="chatbotMessages">
                        <!-- I messaggi verranno inseriti qui -->
                    </div>

                    <div class="chatbot-input-container">
                        <div class="chatbot-quick-actions" id="quickActions">
                            <!-- Azioni rapide verranno inserite qui -->
                        </div>
                        <div class="chatbot-input-wrapper">
                            <input type="text" id="chatbotInput" placeholder="Scrivi il tuo messaggio..." maxlength="500">
                            <button class="chatbot-send" id="chatbotSend" aria-label="Invia Messaggio">
                                <svg viewBox="0 0 24 24">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    bindEvents() {
        const toggle = document.getElementById('chatbotToggle');
        const close = document.getElementById('chatbotClose');
        const input = document.getElementById('chatbotInput');
        const send = document.getElementById('chatbotSend');

        toggle.addEventListener('click', () => this.toggleChatbot());
        close.addEventListener('click', () => this.closeChatbot());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        send.addEventListener('click', () => this.sendMessage());

        // Chiudi chatbot cliccando fuori
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.chatbot-container') && this.isOpen) {
                this.closeChatbot();
            }
        });
    }

    toggleChatbot() {
        if (this.isOpen) {
            this.closeChatbot();
        } else {
            this.openChatbot();
        }
    }

    openChatbot() {
        this.isOpen = true;
        document.getElementById('chatbotContainer').classList.add('open');
        document.getElementById('chatbotInput').focus();
        this.animateChatbot();
    }

    closeChatbot() {
        this.isOpen = false;
        document.getElementById('chatbotContainer').classList.remove('open');
    }

    animateChatbot() {
        const messages = document.getElementById('chatbotMessages');
        messages.style.opacity = '0';
        messages.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            messages.style.opacity = '1';
            messages.style.transform = 'translateY(0)';
        }, 100);
    }

    loadWelcomeMessage() {
        const welcomeMessage = {
            type: 'bot',
            content: 'Ciao! Sono l\'assistente virtuale di Wali Wheelse. Come posso aiutarti oggi?',
            timestamp: new Date(),
            quickActions: [
                '🏠 Vedi le nostre auto',
                '💰 Calcola finanziamento',
                '📅 Prenota test drive',
                '📞 Contattaci'
            ]
        };

        this.addMessage(welcomeMessage);
        this.showQuickActions(welcomeMessage.quickActions);
    }

    addMessage(message) {
        this.messages.push(message);
        this.renderMessage(message);
        this.scrollToBottom();
    }

    renderMessage(message) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const messageElement = document.createElement('div');
        messageElement.className = `chatbot-message ${message.type}-message`;

        const time = message.timestamp.toLocaleTimeString('it-IT', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        messageElement.innerHTML = `
            <div class="message-content">
                <div class="message-text">${message.content}</div>
                <div class="message-time">${time}</div>
            </div>
        `;

        messagesContainer.appendChild(messageElement);
    }

    showQuickActions(actions) {
        const quickActionsContainer = document.getElementById('quickActions');
        quickActionsContainer.innerHTML = '';

        actions.forEach(action => {
            const actionButton = document.createElement('button');
            actionButton.className = 'quick-action-btn';
            actionButton.textContent = action;
            actionButton.addEventListener('click', () => this.handleQuickAction(action));
            quickActionsContainer.appendChild(actionButton);
        });
    }

    handleQuickAction(action) {
        switch(action) {
            case '🏠 Vedi le nostre auto':
                this.addMessage({
                    type: 'user',
                    content: 'Voglio vedere le auto disponibili',
                    timestamp: new Date()
                });
                this.showCarOptions();
                break;
            case '💰 Calcola finanziamento':
                this.addMessage({
                    type: 'user',
                    content: 'Voglio calcolare un finanziamento',
                    timestamp: new Date()
                });
                this.showFinancingCalculator();
                break;
            case '📅 Prenota test drive':
                this.addMessage({
                    type: 'user',
                    content: 'Voglio prenotare un test drive',
                    timestamp: new Date()
                });
                this.showTestDriveBooking();
                break;
            case '📞 Contattaci':
                this.addMessage({
                    type: 'user',
                    content: 'Voglio contattarvi',
                    timestamp: new Date()
                });
                this.showContactInfo();
                break;
        }
    }

    showCarOptions() {
        const response = {
            type: 'bot',
            content: 'Perfetto! Abbiamo diverse categorie di auto. Quale ti interessa di più?',
            timestamp: new Date(),
            quickActions: [
                '🚗 Auto di Lusso',
                '🏎️ Auto Sportive',
                '🚙 SUV & Crossover',
                '⚡ Auto Elettriche',
                '🏛️ Auto Classiche'
            ]
        };

        this.addMessage(response);
        this.showQuickActions(response.quickActions);
    }

    showFinancingCalculator() {
        const response = {
            type: 'bot',
            content: 'Ottimo! Per calcolare il finanziamento ho bisogno di alcune informazioni. Qual è il prezzo dell\'auto che ti interessa?',
            timestamp: new Date()
        };

        this.addMessage(response);
        this.currentStep = 'financing_price';
    }

    showTestDriveBooking() {
        const response = {
            type: 'bot',
            content: 'Perfetto! Per prenotare un test drive, dimmi quale auto ti interessa e quando preferisci venire.',
            timestamp: new Date(),
            quickActions: [
                '📅 Oggi pomeriggio',
                '📅 Domani mattina',
                '📅 Domani pomeriggio',
                '📅 Weekend'
            ]
        };

        this.addMessage(response);
        this.showQuickActions(response.quickActions);
    }

    showContactInfo() {
        const response = {
            type: 'bot',
            content: 'Ecco i nostri contatti:\n\n📞 Telefono: +39 123 456 789\n📧 Email: info@waliwheelse.it\n📍 Indirizzo: Via Roma 123, Milano\n\nVuoi che ti aiuti con qualcos\'altro?',
            timestamp: new Date(),
            quickActions: [
                '🏠 Vedi le nostre auto',
                '💰 Calcola finanziamento',
                '📅 Prenota test drive'
            ]
        };

        this.addMessage(response);
        this.showQuickActions(response.quickActions);
    }

    sendMessage() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();

        if (!message) return;

        // Aggiungi messaggio utente
        this.addMessage({
            type: 'user',
            content: message,
            timestamp: new Date()
        });

        input.value = '';

        // Simula risposta bot
        this.simulateBotResponse(message);
    }

    simulateBotResponse(userMessage) {
        setTimeout(() => {
            let response;

            if (userMessage.toLowerCase().includes('prezzo') || userMessage.toLowerCase().includes('costo')) {
                response = {
                    type: 'bot',
                    content: 'I nostri prezzi partono da €25.000 per auto usate e da €50.000 per auto nuove. Vuoi che ti mostri le nostre offerte speciali?',
                    timestamp: new Date(),
                    quickActions: ['💰 Sì, mostrami le offerte', '🏠 No, vedo il catalogo']
                };
            } else if (userMessage.toLowerCase().includes('garanzia') || userMessage.toLowerCase().includes('garantito')) {
                response = {
                    type: 'bot',
                    content: 'Tutte le nostre auto sono controllate rigorosamente e vengono fornite con garanzia. Le auto nuove hanno garanzia del costruttore, quelle usate hanno garanzia estesa. Vuoi saperne di più?',
                    timestamp: new Date(),
                    quickActions: ['✅ Sì, dimmi di più', '🏠 No, grazie']
                };
            } else if (userMessage.toLowerCase().includes('test drive') || userMessage.toLowerCase().includes('prova')) {
                response = {
                    type: 'bot',
                    content: 'Perfetto! I test drive sono gratuiti e durano circa 30 minuti. Hai già un\'auto in mente o vuoi che ti consigli qualcosa?',
                    timestamp: new Date(),
                    quickActions: ['🚗 Sì, ho già scelto', '🤔 Aiutami a scegliere']
                };
            } else {
                response = {
                    type: 'bot',
                    content: 'Grazie per il tuo messaggio! Un nostro consulente ti risponderà al più presto. Nel frattempo, posso aiutarti con altre informazioni?',
                    timestamp: new Date(),
                    quickActions: [
                        '🏠 Vedi le nostre auto',
                        '💰 Calcola finanziamento',
                        '📅 Prenota test drive'
                    ]
                };
            }

            this.addMessage(response);
            this.showQuickActions(response.quickActions);
        }, 1000);
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chatbotMessages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Inizializza il chatbot quando il DOM è caricato
document.addEventListener('DOMContentLoaded', () => {
    window.autoChatbot = new AutoChatbot();
});

// Esporta per uso esterno
window.AutoChatbot = AutoChatbot;
