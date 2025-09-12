# Firebase Authentication - Google Login

Un progetto web statico completo che implementa l'autenticazione Google utilizzando Firebase Authentication.

## 🚀 Caratteristiche

- ✅ **Firebase Authentication** con provider Google
- ✅ **Design moderno** con effetto glassmorphism
- ✅ **Responsive** per tutti i dispositivi
- ✅ **Fallback redirect** per popup bloccati
- ✅ **Gestione errori** completa
- ✅ **Pronto per Vercel** (static site)

## 📁 Struttura File

```
firebase-auth-example/
├── index.html          # Pagina principale
├── style.css           # Stili CSS
├── app.js             # Logica JavaScript
└── README.md          # Documentazione
```

## 🛠️ Configurazione

### 1. Configura Firebase Console

1. Vai su [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuovo progetto o seleziona uno esistente
3. Vai su **Authentication** → **Sign-in method**
4. Abilita **Google** come provider
5. In **Authentication** → **Settings** → **Authorized domains**
   aggiungi il tuo dominio Vercel (es: `tuoprogetto.vercel.app`)

### 2. Configura il Codice

1. Apri `app.js`
2. Sostituisci la configurazione `firebaseConfig` con i tuoi dati:

```javascript
const firebaseConfig = {
    apiKey: "LA_TUA_API_KEY",
    authDomain: "TUO_PROGETTO.firebaseapp.com",
    projectId: "TUO_PROGETTO_ID",
    storageBucket: "TUO_PROGETTO.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456",
    measurementId: "G-XXXXXXXXXX"
};
```

### 3. Deploy su Vercel

1. Carica tutti i file su Vercel
2. Il sito funzionerà immediatamente come static site
3. Aggiungi il dominio Vercel nei domini autorizzati di Firebase

## 🔧 Funzionalità

### Login con Google
- **Popup**: Metodo principale per il login
- **Redirect**: Fallback automatico se i popup sono bloccati
- **Gestione errori**: Messaggi chiari per ogni tipo di errore

### UI/UX
- **Glassmorphism**: Effetto vetro moderno
- **Animazioni**: Transizioni fluide e microinterazioni
- **Responsive**: Ottimizzato per mobile e desktop
- **Accessibilità**: Supporto per screen reader e navigazione da tastiera

### Gestione Stati
- **Loading**: Indicatore di caricamento durante l'autenticazione
- **Errori**: Messaggi di errore chiari e informativi
- **Successo**: Visualizzazione delle informazioni utente

## 🎨 Personalizzazione

### Colori
Modifica le variabili CSS in `style.css`:

```css
/* Gradiente di sfondo */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Colore del pannello glass */
background: rgba(255, 255, 255, 0.1);
```

### Testo
Personalizza i testi direttamente in `index.html`:

```html
<h1>🔐 Il Tuo Brand</h1>
<p>Il tuo messaggio personalizzato</p>
```

## 🐛 Debug

Apri la console del browser e usa:

```javascript
// Controlla lo stato dell'autenticazione
window.firebaseAuth.auth.currentUser

// Testa il login manualmente
window.firebaseAuth.signInWithGooglePopup()

// Testa il logout
window.firebaseAuth.signOutUser()
```

## 🔒 Sicurezza

- ✅ **Domini autorizzati**: Configurati in Firebase Console
- ✅ **HTTPS**: Obbligatorio per Firebase Authentication
- ✅ **Validazione client**: Controlli di sicurezza lato client
- ✅ **Gestione errori**: Nessuna informazione sensibile esposta

## 📱 Compatibilità

- ✅ **Browser moderni**: Chrome, Firefox, Safari, Edge
- ✅ **Mobile**: iOS Safari, Chrome Mobile
- ✅ **Desktop**: Windows, macOS, Linux
- ✅ **Accessibilità**: Screen reader, navigazione da tastiera

## 🚀 Deploy

### Vercel (Raccomandato)
1. Carica i file su GitHub
2. Connetti il repository a Vercel
3. Deploy automatico

### Altri provider
- **Netlify**: Drag & drop dei file
- **GitHub Pages**: Push su branch `gh-pages`
- **Firebase Hosting**: Usa Firebase CLI

## 📞 Supporto

Per problemi o domande:
1. Controlla la console del browser per errori
2. Verifica la configurazione Firebase
3. Assicurati che il dominio sia autorizzato

## 📄 Licenza

Questo progetto è open source e disponibile sotto licenza MIT.
