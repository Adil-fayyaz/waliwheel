# ⚡ Quick Start - Wali Wheels React App

## 🚀 Setup in 5 minuti

### 1. Installa dipendenze
```bash
npm install
```

### 2. Configura Firebase
1. Vai su [Firebase Console](https://console.firebase.google.com/)
2. Crea progetto → Abilita Google Auth
3. Copia le credenziali in `src/firebase/config.js`

### 3. Avvia sviluppo
```bash
npm run dev
```

### 4. Deploy
```bash
npm run deploy
```

## 🔧 Configurazione Firebase

Sostituisci in `src/firebase/config.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## 📱 Test

1. Apri `http://localhost:5173`
2. Clicca "Accedi con Google"
3. Verifica login e profilo

## 🚀 Deploy

```bash
# Installa Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## ✅ Funzionalità

- ✅ Login Google
- ✅ Profilo utente
- ✅ Logout
- ✅ Design responsive
- ✅ Effetti glassmorphism
- ✅ Gestione errori
- ✅ Loading states

---

**Pronto in 5 minuti! 🎉**

