# Server Fantacalcio Asta - Versione 2.0

Server backend modulare per la gestione delle aste del fantacalcio, completamente riscritto con una struttura pulita e mantenibile.

## 🏗️ Struttura del Progetto

```
server/
├── src/
│   ├── controllers/          # Controllers per gestire le richieste HTTP
│   │   ├── giocatoriController.js
│   │   ├── astaController.js
│   │   ├── squadreController.js
│   │   └── statisticheController.js
│   ├── services/             # Logica di business
│   │   ├── giocatoriService.js
│   │   ├── astaService.js
│   │   ├── squadreService.js
│   │   └── statisticheService.js
│   ├── routes/               # Definizione delle routes API
│   │   ├── giocatoriRoutes.js
│   │   ├── astaRoutes.js
│   │   ├── squadreRoutes.js
│   │   ├── statisticheRoutes.js
│   │   └── index.js
│   ├── config/               # Configurazioni
│   │   └── index.js
│   ├── app.js                # Configurazione dell'app Express
│   └── server.js             # Entry point del server
├── package.json
└── README.md
```

## 🚀 Installazione e Avvio

### Prerequisiti
- Node.js 14+ 
- npm o yarn

### Installazione
```bash
cd server
npm install
```

### Avvio
```bash
# Produzione
npm start

# Sviluppo (con auto-reload)
npm run dev
```

## 📊 API Endpoints

### Giocatori
- `GET /api/giocatori` - Ottieni tutti i giocatori
- `GET /api/giocatori/:ruolo` - Ottieni giocatori per ruolo

### Aste
- `POST /api/asta/acquista` - Registra acquisto giocatore
- `GET /api/asta/storico` - Storico delle aste
- `GET /api/aste/attive` - Aste attive

### Squadre
- `GET /api/squadre` - Lista tutte le squadre
- `POST /api/squadre` - Crea nuova squadra
- `PUT /api/squadre/:id` - Aggiorna squadra
- `DELETE /api/squadre/:id` - Elimina squadra
- `POST /api/squadre/:id/wishlist` - Aggiungi alla wishlist
- `GET /api/squadre/:id/wishlist` - Visualizza wishlist
- `DELETE /api/squadre/:id/wishlist/:giocatoreId` - Rimuovi dalla wishlist
- `POST /api/squadre/:id/acquista` - Acquista giocatore
- `GET /api/squadre/:id/stats` - Statistiche squadra
- `POST /api/squadre/:id/reset` - Reset budget

### Statistiche
- `GET /api/statistiche` - Statistiche generali

### Health Check
- `GET /api/health` - Stato del server

## 🔧 Configurazione

Le configurazioni sono centralizzate in `src/config/index.js`:

- **Server**: Porta e host
- **CORS**: Origini permesse e opzioni
- **Percorsi**: Cartelle data e asta
- **CSV**: Headers per i file CSV

## 🏛️ Architettura

### Pattern MVC
- **Controllers**: Gestiscono le richieste HTTP e le risposte
- **Services**: Contengono la logica di business
- **Routes**: Definiscono i percorsi delle API

### Separazione delle Responsabilità
- Ogni modulo ha una responsabilità specifica
- Logica di business separata dalla gestione HTTP
- Configurazioni centralizzate
- Gestione errori uniforme

### Gestione Errori
- Middleware per errori 404
- Middleware per errori globali
- Logging strutturato
- Gestione processi non catturati

## 📈 Vantaggi della Nuova Struttura

1. **Manutenibilità**: Codice organizzato in moduli logici
2. **Scalabilità**: Facile aggiungere nuove funzionalità
3. **Testabilità**: Services isolati e testabili
4. **Riusabilità**: Logica di business riutilizzabile
5. **Leggibilità**: Codice più chiaro e comprensibile
6. **Debugging**: Errori più facili da tracciare

## 🔄 Migrazione dalla Versione 1.0

La nuova struttura mantiene la compatibilità con le API esistenti, ma organizza il codice in modo più professionale:

- **Vecchio**: Tutto in `index.js` (551 righe)
- **Nuovo**: Moduli separati e organizzati
- **API**: Stesse endpoint, stessa funzionalità
- **Performance**: Migliorata grazie alla modularità

## 🛠️ Sviluppo

### Aggiungere un Nuovo Controller
1. Crea il file in `src/controllers/`
2. Implementa la logica
3. Crea il service corrispondente
4. Aggiungi le routes
5. Importa in `src/routes/index.js`

### Aggiungere un Nuovo Service
1. Crea il file in `src/services/`
2. Implementa la logica di business
3. Esporta le funzioni
4. Importa nei controllers

## 📝 Logging

Il server include logging automatico per:
- Tutte le richieste HTTP
- Errori e eccezioni
- Avvio e chiusura del server
- Operazioni critiche

## 🔒 Sicurezza

- CORS configurato per origini specifiche
- Validazione input nei controllers
- Gestione errori senza esposizione di dettagli interni
- Sanitizzazione dati CSV

## 🚀 Deploy

Il server è pronto per il deploy in produzione:
- Gestione variabili d'ambiente
- Gestione segnali di terminazione
- Logging strutturato
- Gestione errori robusta
