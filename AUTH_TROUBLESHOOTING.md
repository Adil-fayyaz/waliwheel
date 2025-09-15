# 🔧 Guida Risoluzione Problemi Autenticazione Google

## 🚨 Problemi Comuni e Soluzioni

### 1. **Errore: "Dominio non autorizzato"**

**Problema:** `auth/unauthorized-domain`

**Soluzione:**
1. Vai su [Firebase Console](https://console.firebase.google.com/)
2. Seleziona il progetto `log-in-33798`
3. Vai su **Authentication** → **Settings** → **Authorized domains**
4. Aggiungi questi domini:
   ```
   localhost
   127.0.0.1
   sito-di-vendita-auto.vercel.app
   sito-di-vendita-auto-10fwlyrur-adil-fayyazs-projects.vercel.app
   ```

### 2. **Errore: "Popup bloccato"**

**Problema:** `auth/popup-blocked`

**Soluzione:**
- **Chrome/Edge:** Clicca sull'icona del lucchetto nella barra degli indirizzi → Popup → Consenti
- **Firefox:** Clicca sull'icona dello scudo → Disabilita protezione per questo sito
- **Safari:** Safari → Preferenze → Siti web → Popup → Consenti per questo sito

### 3. **Errore: "Operazione non consentita"**

**Problema:** `auth/operation-not-allowed`

**Soluzione:**
1. Firebase Console → **Authentication** → **Sign-in method**
2. Abilita **Google** come provider
3. Configura il **Project support email**
4. Salva le modifiche

### 4. **Errore: "Troppi tentativi"**

**Problema:** `auth/too-many-requests`

**Soluzione:**
- Aspetta 5-10 minuti prima di riprovare
- Pulisci la cache del browser
- Usa il pulsante "Clear Storage" nel debug panel

### 5. **Errore: "Errore di rete"**

**Problema:** `auth/network-request-failed`

**Soluzione:**
- Controlla la connessione internet
- Disabilita temporaneamente VPN/proxy
- Prova con un altro browser
- Controlla se il firewall blocca le richieste

## 🔍 Sistema di Debug

### Come Usare il Debug Panel

1. **Apri il sito** su localhost o Vercel
2. **Cerca il pannello** in alto a destra (solo in sviluppo)
3. **Controlla lo stato** di Firebase e domini
4. **Usa i pulsanti** per testare l'autenticazione

### Pulsanti Debug Disponibili

- **Test Google Auth:** Testa l'autenticazione Google
- **Clear Storage:** Pulisce tutti i dati salvati
- **Show User Info:** Mostra informazioni utente correnti

## 🛠️ Configurazione Firebase

### 1. Verifica Configurazione

Controlla che il file `js/firebase-config.js` contenga:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBj5nRA_1R3RLL91PyZM11rNYDR2PTgqkc",
  authDomain: "log-in-33798.firebaseapp.com",
  projectId: "log-in-33798",
  storageBucket: "log-in-33798.firebasestorage.app",
  messagingSenderId: "300481719153",
  appId: "1:300481719153:web:69804e7364079a2373a4d0",
  measurementId: "G-LWWR2DR9L2"
};
```

### 2. Abilita Google Authentication

1. Firebase Console → **Authentication** → **Sign-in method**
2. Clicca su **Google**
3. Abilita il toggle
4. Inserisci **Project support email**
5. Salva

### 3. Configura Domini Autorizzati

1. Firebase Console → **Authentication** → **Settings**
2. Tab **Authorized domains**
3. Aggiungi tutti i domini necessari

## 🧪 Test dell'Autenticazione

### Test Manuale

1. **Apri la console** del browser (F12)
2. **Clicca su "Accedi con Google"**
3. **Osserva i log** nella console
4. **Controlla il debug panel** per errori

### Test Automatico

Usa il pulsante **"Test Google Auth"** nel debug panel per un test automatico.

## 📱 Problemi Mobile

### iOS Safari
- Assicurati che i popup siano abilitati
- Controlla le impostazioni di privacy
- Prova in modalità incognito

### Android Chrome
- Abilita popup per il sito
- Controlla le impostazioni di sicurezza
- Prova con Chrome incognito

## 🔄 Reset Completo

Se nulla funziona:

1. **Pulisci tutto:**
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   ```

2. **Ricarica la pagina**

3. **Riprova l'autenticazione**

4. **Controlla la console** per nuovi errori

## 📞 Supporto

### Log da Inviare

Se hai ancora problemi, invia questi log:

1. **Console errors** (F12 → Console)
2. **Network errors** (F12 → Network)
3. **Debug panel status**
4. **Browser e versione**
5. **Sistema operativo**

### Controlli Rapidi

- [ ] Firebase config corretto
- [ ] Google provider abilitato
- [ ] Domini autorizzati
- [ ] Popup non bloccati
- [ ] Connessione internet OK
- [ ] Browser aggiornato

## 🎯 Soluzioni per Caso d'Uso

### Sviluppo Locale
```bash
# Aggiungi a Firebase Authorized domains:
localhost
127.0.0.1
```

### Produzione Vercel
```bash
# Aggiungi a Firebase Authorized domains:
sito-di-vendita-auto.vercel.app
sito-di-vendita-auto-10fwlyrur-adil-fayyazs-projects.vercel.app
```

### Test su Dispositivi
```bash
# Aggiungi il tuo IP locale:
192.168.1.xxx (sostituisci con il tuo IP)
```

## ✅ Checklist Finale

Prima di considerare risolto:

- [ ] Login Google funziona
- [ ] Logout funziona
- [ ] Dati utente salvati correttamente
- [ ] UI aggiornata dopo login/logout
- [ ] Funziona su desktop e mobile
- [ ] Funziona su localhost e produzione
- [ ] Nessun errore in console
- [ ] Debug panel mostra tutto OK

---

**💡 Suggerimento:** Usa sempre il debug panel per identificare rapidamente i problemi!
