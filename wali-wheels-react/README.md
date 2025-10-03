# 🚗 Wali Wheels - Advanced React Authentication App

Una moderna web app React completa con autenticazione Firebase avanzata, gestione profili, impostazioni di sicurezza e design glassmorphism.

## ✨ Caratteristiche Principali

### 🔐 Autenticazione Avanzata
- **Login Google** con popup e fallback redirect
- **Gestione errori** completa con messaggi user-friendly
- **Re-autenticazione** per operazioni sensibili
- **Persistenza stato** utente
- **Provider linking/unlinking** (Google, Email/Password)

### 👤 Gestione Profili
- **Visualizzazione profilo** con foto, nome, email
- **Modifica informazioni** personali
- **Upload foto** su Firebase Storage con preview
- **Crop e gestione** immagini
- **Aggiornamento profilo** in tempo reale

### ⚙️ Impostazioni di Sicurezza
- **Cambio email** con re-autenticazione
- **Cambio password** con validazione
- **Reset password** via email
- **Gestione provider** collegati
- **Eliminazione account** con conferma doppia
- **Esportazione dati** in formato JSON

### 🎨 UI/UX Moderna
- **Design glassmorphism** con effetti vetro
- **Animazioni fluide** e micro-interazioni
- **Responsive design** mobile-first
- **Accessibilità** completa (ARIA, focus management)
- **Loading states** e feedback visivi

## 🛠️ Stack Tecnologico

- **React 18** - Framework UI moderno
- **Vite** - Build tool veloce e hot reload
- **TailwindCSS** - Framework CSS utility-first
- **Firebase v9+** - SDK modulare per auth e storage
- **React Router** - Routing e navigazione
- **Lucide React** - Icone moderne e leggere
- **Jest + RTL** - Testing completo

## 🚀 Setup e Installazione

### 1. Clona e installa
```bash
git clone <repository-url>
cd wali-wheels-react
npm install
```

### 2. Configurazione Firebase

#### A. Crea progetto Firebase
1. Vai su [Firebase Console](https://console.firebase.google.com/)
2. Clicca "Crea un progetto"
3. Nome: `wali-wheels-auth` (o qualsiasi nome)
4. Abilita Google Analytics (opzionale)

#### B. Abilita Authentication
1. **Authentication** → **Inizia**
2. **Sign-in method** → **Google** → **Abilita**
3. Inserisci **Project support email**
4. Salva

#### C. Configura domini autorizzati
1. **Authentication** → **Settings** → **Authorized domains**
2. Aggiungi:
   ```
   localhost
   127.0.0.1
   your-app-name.vercel.app
   ```

#### D. Ottieni credenziali
1. **Project Settings** → **Your apps** → **Add app** → **Web**
2. Nome: `Wali Wheels Web`
3. **Non** abilitare Firebase Hosting
4. **Copia** la configurazione

#### E. Configura variabili ambiente
```bash
# Copia il file di esempio
cp env.example .env.local

# Modifica .env.local con le tue credenziali
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

### 3. Avvia sviluppo
```bash
npm run dev
```

L'app sarà disponibile su `http://localhost:5173`

## 📁 Struttura del Progetto

```
src/
├── components/              # Componenti riutilizzabili
│   ├── Navigation.jsx      # Navigazione principale
│   └── ProtectedRoute.jsx  # Route protette
├── contexts/               # React Context
│   └── AuthContext.jsx    # Context autenticazione
├── pages/                  # Pagine dell'app
│   ├── Login.jsx          # Pagina login
│   ├── Home.jsx           # Dashboard principale
│   ├── Profile.jsx        # Gestione profilo
│   └── Settings.jsx       # Impostazioni account
├── __tests__/             # Test files
│   ├── Login.test.jsx     # Test login
│   ├── Profile.test.jsx   # Test profilo
│   └── App.test.jsx       # Test app principale
├── firebase.js            # Configurazione Firebase
├── App.jsx               # Componente principale
├── main.jsx              # Entry point
└── index.css             # Stili TailwindCSS
```

## 🔐 Funzionalità di Autenticazione

### Login con Google
- **Popup method** con fallback automatico a redirect
- **Provider configuration** con `prompt: 'select_account'`
- **Gestione errori** specifici per ogni scenario
- **Loading states** durante l'autenticazione

### Gestione Errori
```javascript
// Esempi di errori gestiti
'auth/popup-blocked' → 'Popup bloccato dal browser'
'auth/unauthorized-domain' → 'Dominio non autorizzato'
'auth/account-exists-with-different-credential' → 'Account esistente con provider diverso'
'auth/requires-recent-login' → 'Re-autenticazione richiesta'
```

### Re-autenticazione
- **Cambio email** richiede password attuale
- **Cambio password** richiede password attuale
- **Eliminazione account** richiede password
- **Operazioni sensibili** protette

## 👤 Gestione Profili

### Informazioni Visualizzate
- **Foto profilo** con fallback automatico
- **Nome utente** modificabile
- **Email** con stato verifica
- **ID utente** (troncato per privacy)
- **Provider collegati** (Google, Email/Password)
- **Metadati** (data creazione, ultimo accesso)

### Upload Foto
- **Firebase Storage** per archiviazione
- **Validazione file** (tipo, dimensione)
- **Preview** prima del salvataggio
- **Progress bar** durante upload
- **Gestione errori** upload

## ⚙️ Impostazioni di Sicurezza

### Cambio Email
```javascript
// Richiede re-autenticazione
await updateUserEmail(newEmail, currentPassword);
```

### Cambio Password
```javascript
// Validazione e re-autenticazione
await updateUserPassword(newPassword, currentPassword);
```

### Reset Password
```javascript
// Invio email di reset
await sendPasswordResetEmail(email);
```

### Gestione Provider
- **Link provider** aggiuntivi
- **Unlink provider** esistenti
- **Gestione conflitti** account esistenti

### Eliminazione Account
- **Conferma doppia** (modal + digitare email)
- **Re-autenticazione** obbligatoria
- **Eliminazione permanente** dati

### Esportazione Dati
- **Download JSON** con informazioni utente
- **Esclusione token** sensibili
- **Formato strutturato** per portabilità

## 🎨 Design e UI

### Glassmorphism
```css
.glass-effect {
  @apply bg-white/10 backdrop-blur-md border border-white/20;
}
```

### Animazioni
- **Fade in/out** per transizioni
- **Slide up** per elementi
- **Hover effects** interattivi
- **Loading spinners** personalizzati

### Responsive Design
- **Mobile-first** approach
- **Breakpoints** TailwindCSS
- **Touch-friendly** su mobile
- **Navigation** adattiva

## 🧪 Testing

### Test Disponibili
```bash
npm test              # Esegui tutti i test
npm run test:watch    # Test in modalità watch
npm run test:coverage # Test con coverage
```

### Copertura Test
- **Login page** - Rendering e funzionalità
- **Profile page** - Gestione profilo
- **App component** - Routing e autenticazione
- **Error handling** - Gestione errori
- **Firebase integration** - Mock e test

### Test Coverage
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## 🚀 Deploy

### Vercel (Raccomandato)
```bash
# Installa Vercel CLI
npm install -g vercel

# Login e deploy
vercel login
vercel --prod
```

### Netlify
```bash
# Build e deploy
npm run build
# Carica dist/ su Netlify
```

### Altri Provider
```bash
npm run build
# Carica dist/ sul tuo provider
```

## 🔧 Script Disponibili

```bash
npm run dev          # Server di sviluppo
npm run build        # Build per produzione
npm run preview      # Preview build locale
npm run lint         # Linting del codice
npm test             # Esegui test
npm run test:watch   # Test in modalità watch
npm run test:coverage # Test con coverage
npm run deploy       # Build e deploy su Vercel
```

## 📱 Compatibilità

### Browser Supportati
- ✅ **Chrome/Edge** (raccomandato)
- ✅ **Firefox** (completo)
- ✅ **Safari** (completo)
- ✅ **Mobile browsers** (iOS/Android)

### Dispositivi
- ✅ **Desktop** (Windows, macOS, Linux)
- ✅ **Tablet** (iPad, Android)
- ✅ **Mobile** (iPhone, Android)

## 🐛 Troubleshooting

### Problemi Comuni

#### 1. Errore "Dominio non autorizzato"
```bash
# Soluzione: Aggiungi dominio in Firebase Console
# Authentication → Settings → Authorized domains
localhost
your-app-name.vercel.app
```

#### 2. Popup bloccato
```bash
# L'app usa automaticamente redirect
# Disabilita blocco popup per il sito
```

#### 3. Errori di build
```bash
# Controlla dipendenze
npm install

# Verifica configurazione Vite
npm run build
```

#### 4. Firebase non inizializzato
```bash
# Controlla variabili ambiente
cat .env.local

# Riavvia dev server
npm run dev
```

### Debug
- **Console DevTools** (F12) per errori
- **Network tab** per richieste Firebase
- **Application tab** per localStorage
- **Test su diversi browser**

## 🔒 Sicurezza

### Best Practices Implementate
- **Re-autenticazione** per operazioni sensibili
- **Validazione input** lato client
- **Gestione errori** senza esporre dettagli
- **Token non esposti** nell'UI
- **HTTPS** obbligatorio in produzione

### Configurazione Firebase
- **Security Rules** per Storage
- **Authorized domains** configurati
- **OAuth consent screen** configurato
- **API keys** pubbliche (normale per client-side)

## 📊 Performance

### Ottimizzazioni
- **Code splitting** automatico con Vite
- **Lazy loading** componenti
- **Image optimization** per foto profilo
- **Bundle size** ottimizzato
- **Caching** intelligente

### Metriche
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🤝 Contributi

### Come Contribuire
1. **Fork** il repository
2. **Crea branch** per feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** modifiche (`git commit -m 'Add AmazingFeature'`)
4. **Push** al branch (`git push origin feature/AmazingFeature`)
5. **Apri Pull Request**

### Standard di Codice
- **ESLint** per linting
- **Prettier** per formatting
- **Conventional Commits** per messaggi
- **Test coverage** mantenuto

## 📄 Licenza

MIT License - Vedi file [LICENSE](LICENSE) per dettagli.

## 📞 Supporto

### Risorse
- **GitHub Issues** per bug reports
- **Firebase Documentation** per configurazione
- **TailwindCSS Docs** per styling
- **React Docs** per componenti

### Contatti
- **Email**: support@waliwheels.com
- **GitHub**: [@waliwheels](https://github.com/waliwheels)
- **Documentation**: [docs.waliwheels.com](https://docs.waliwheels.com)

---

**Sviluppato con ❤️ per Wali Wheels**

*Una moderna soluzione di autenticazione React con Firebase, progettata per essere sicura, scalabile e user-friendly.*