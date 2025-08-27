# 🚀 Fantacalcio Pro - Frontend

Frontend React per l'applicazione Fantacalcio Pro, integrato con le API backend.

## ✨ Features

### 🏆 **Gestione Giocatori**
- Lista completa giocatori con filtri per ruolo e ricerca
- Gestione wishlist (❤️/🤍) per ogni giocatore
- Modifica note personali per ogni giocatore
- Visualizzazione status (disponibile/acquistato)
- Filtri avanzati per ruolo e squadra

### 🏗️ **Gestione Squadre**
- Creazione e modifica squadre fantacalcio
- Gestione budget e budget residuo
- Visualizzazione acquisti per squadra
- Eliminazione squadre con conferma

### ⚡ **Asta e Acquisti**
- Interfaccia per acquistare giocatori
- Selezione squadra acquirente
- Controllo budget automatico
- Gestione wishlist integrata

### ❤️ **Wishlist Globale**
- Wishlist unica per tutti i giocatori
- Aggiunta/rimozione dalla wishlist
- Visualizzazione giocatori preferiti
- Gestione centralizzata

## 🚀 **Installazione e Avvio**

### 1. **Installazione Dependencies**
```bash
npm install
```

### 2. **Configurazione API**
Modifica `src/config/config.ts` per impostare l'URL corretto del backend:
```typescript
export const config = {
  API_BASE_URL: 'http://localhost:3000/api', // URL del tuo backend
  // ... altre configurazioni
}
```

### 3. **Avvio Sviluppo**
```bash
npm run dev
```

### 4. **Build Produzione**
```bash
npm run build:prod
```

## 🔧 **Configurazione**

### **Variabili d'Ambiente**
- `NODE_ENV`: Determina automaticamente l'URL API (development/production)

### **API Endpoints**
Il frontend si connette automaticamente ai seguenti endpoint:
- `GET /api/giocatori` - Lista giocatori
- `GET /api/squadre` - Lista squadre
- `POST /api/squadre` - Crea squadra
- `POST /api/squadre/wishlist` - Gestione wishlist
- `POST /api/squadre/:id/acquista` - Acquista giocatore

## 📱 **Componenti Principali**

### **GiocatoriList**
- DataGrid con filtri avanzati
- Gestione wishlist integrata
- Modifica note inline
- Filtri per ruolo e ricerca

### **SquadreComponent**
- Gestione CRUD squadre
- Visualizzazione budget e acquisti
- Dialog per creazione/modifica
- Tabella acquisti per squadra

### **AstaComponent**
- Interfaccia acquisti giocatori
- Selezione squadra acquirente
- Controllo budget automatico
- Gestione wishlist integrata

### **WishlistComponent**
- Wishlist globale centralizzata
- Rimozione giocatori
- Visualizzazione dettagli

## 🎨 **UI/UX Features**

### **Design System**
- Material-UI v5 con tema personalizzato
- Colori per ruoli giocatori
- Icone intuitive per azioni
- Responsive design completo

### **Interazioni**
- Dialog modali per azioni importanti
- Conferme per operazioni critiche
- Feedback visivo per azioni
- Loading states e error handling

## 🔌 **Integrazione API**

### **Gestione Errori**
- Try-catch per tutte le chiamate API
- Messaggi di errore user-friendly
- Retry automatico per operazioni fallite

### **Stato Applicazione**
- React hooks per state management
- Aggiornamento automatico dopo operazioni
- Sincronizzazione dati real-time

## 📊 **Struttura Dati**

### **Giocatore**
```typescript
interface Giocatore {
  id: string
  nome: string
  squadra: string
  ruolo: 'portiere' | 'difensore' | 'centrocampista' | 'attaccante'
  status: 'disponibile' | 'acquistato'
  inWishlist?: boolean
  note?: string
  // ... altri campi
}
```

### **Squadra**
```typescript
interface Squadra {
  id: number
  nome: string
  proprietario: string
  budget: number
  budget_residuo: number
  created_at: string
}
```

## 🚨 **Troubleshooting**

### **Problemi Comuni**

1. **Errore di Connessione API**
   - Verifica che il backend sia in esecuzione
   - Controlla l'URL in `config.ts`
   - Verifica CORS sul backend

2. **Giocatori non Caricati**
   - Controlla i log del browser
   - Verifica la risposta API
   - Controlla la struttura dati

3. **Wishlist non Funziona**
   - Verifica autenticazione se richiesta
   - Controlla i permessi API
   - Verifica la struttura wishlist

### **Debug**
- Console browser per errori JavaScript
- Network tab per chiamate API
- React DevTools per stato componenti

## 🔮 **Roadmap**

### **Prossime Features**
- [ ] Autenticazione utenti
- [ ] Notifiche real-time
- [ ] Export dati CSV/PDF
- [ ] Statistiche avanzate
- [ ] Mobile app nativa

### **Miglioramenti**
- [ ] PWA support
- [ ] Offline mode
- [ ] Performance optimization
- [ ] Accessibility improvements

## 📞 **Supporto**

Per problemi o domande:
1. Controlla i log del browser
2. Verifica la connessione API
3. Controlla la documentazione backend
4. Apri un issue su GitHub

---

**🎉 Frontend Fantacalcio Pro pronto per l'uso!**
