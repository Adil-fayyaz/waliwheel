# 🚀 Istruzioni Deploy - Wali Wheels React App

## 📋 Prerequisiti

1. **Account Vercel** (gratuito): [vercel.com](https://vercel.com)
2. **Account Firebase** (gratuito): [firebase.google.com](https://firebase.google.com)
3. **Node.js** installato (versione 18+)

## 🔧 Configurazione Firebase

### 1. Crea un progetto Firebase
1. Vai su [Firebase Console](https://console.firebase.google.com/)
2. Clicca "Crea un progetto"
3. Nome progetto: `wali-wheels-auth` (o qualsiasi nome)
4. Abilita Google Analytics (opzionale)

### 2. Abilita Authentication
1. Nel menu laterale, clicca **Authentication**
2. Clicca **Inizia**
3. Vai su **Sign-in method**
4. Clicca su **Google**
5. **Abilita** il provider Google
6. Inserisci un **Project support email**
7. Salva

### 3. Configura domini autorizzati
1. Vai su **Authentication** → **Settings**
2. Tab **Authorized domains**
3. Aggiungi questi domini:
   ```
   localhost
   your-app-name.vercel.app
   ```

### 4. Ottieni le credenziali
1. Vai su **Project Settings** (icona ingranaggio)
2. Scorri fino a **Your apps**
3. Clicca **Add app** → **Web** (icona `</>`)
4. Nome app: `Wali Wheels Web`
5. **Non** abilitare Firebase Hosting
6. Clicca **Register app**
7. **Copia** la configurazione Firebase

### 5. Aggiorna il codice
Sostituisci il contenuto di `src/firebase/config.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## 🚀 Deploy su Vercel

### Metodo 1: Deploy automatico (Raccomandato)

1. **Installa Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login su Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd wali-wheels-react
   vercel --prod
   ```

4. **Segui le istruzioni**:
   - Nome progetto: `wali-wheels-react`
   - Framework: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Metodo 2: Deploy via GitHub

1. **Crea repository GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/wali-wheels-react.git
   git push -u origin main
   ```

2. **Connetti a Vercel**:
   - Vai su [vercel.com](https://vercel.com)
   - Clicca **New Project**
   - Importa il repository GitHub
   - Configura:
     - Framework Preset: `Vite`
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Clicca **Deploy**

### Metodo 3: Deploy manuale

1. **Build locale**:
   ```bash
   npm run build
   ```

2. **Carica su Vercel**:
   - Vai su [vercel.com](https://vercel.com)
   - Clicca **New Project**
   - Clicca **Browse all templates**
   - Clicca **Upload**
   - Trascina la cartella `dist/`

## 🔧 Configurazione Post-Deploy

### 1. Aggiorna domini autorizzati
1. Vai su Firebase Console
2. **Authentication** → **Settings** → **Authorized domains**
3. Aggiungi il dominio Vercel: `your-app-name.vercel.app`

### 2. Testa l'applicazione
1. Vai sul tuo URL Vercel
2. Clicca **"Accedi con Google"**
3. Verifica che il login funzioni
4. Controlla che il profilo si mostri correttamente

## 🐛 Troubleshooting

### Errore: "Dominio non autorizzato"
- **Soluzione**: Aggiungi il dominio Vercel in Firebase Console
- **Dove**: Authentication → Settings → Authorized domains

### Errore: "Popup bloccato"
- **Soluzione**: L'app usa automaticamente redirect
- **Test**: Funziona su tutti i browser

### Errore: "Build failed"
- **Soluzione**: Controlla che tutte le dipendenze siano installate
- **Comando**: `npm install` prima del build

### Errore: "Firebase config not found"
- **Soluzione**: Verifica che `src/firebase/config.js` contenga le credenziali corrette

## 📱 Test su Dispositivi

### Desktop
- ✅ Chrome/Edge (raccomandato)
- ✅ Firefox
- ✅ Safari

### Mobile
- ✅ iOS Safari
- ✅ Android Chrome
- ✅ Samsung Internet

## 🔄 Aggiornamenti

Per aggiornare l'app:

1. **Modifica il codice**
2. **Commit e push**:
   ```bash
   git add .
   git commit -m "Update app"
   git push
   ```
3. **Vercel deploy automatico** (se connesso a GitHub)
4. **Oppure deploy manuale**:
   ```bash
   vercel --prod
   ```

## 📊 Monitoraggio

### Vercel Analytics
- Vai su [vercel.com/dashboard](https://vercel.com/dashboard)
- Clicca sul tuo progetto
- Tab **Analytics** per statistiche

### Firebase Analytics
- Vai su Firebase Console
- **Analytics** → **Dashboard** per metriche

## 🎯 URL Finale

Dopo il deploy, la tua app sarà disponibile su:
```
https://your-app-name.vercel.app
```

## ✅ Checklist Finale

- [ ] Firebase configurato correttamente
- [ ] Google Authentication abilitato
- [ ] Domini autorizzati configurati
- [ ] App deployata su Vercel
- [ ] Login Google funziona
- [ ] Profilo utente si mostra
- [ ] Logout funziona
- [ ] Responsive su mobile
- [ ] Testato su diversi browser

---

**🎉 Congratulazioni! La tua app è online!**