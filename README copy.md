# Fantacalcio Asta - Piattaforma per l'Asta del Fantacalcio

Una piattaforma completa per gestire l'asta del fantacalcio con Node.js per il backend e React con Material-UI per il frontend.

## 🚀 Caratteristiche

- **Gestione giocatori**: Visualizzazione di tutti i giocatori divisi per ruolo
- **Asta in tempo reale**: Interfaccia per acquistare giocatori durante l'asta
- **Statistiche dettagliate**: Analisi complete dell'asta con grafici e tabelle
- **Dashboard**: Overview generale dell'asta
- **Salvataggio automatico**: Tutti gli acquisti vengono salvati in CSV
- **Interfaccia moderna**: Design responsive con Material-UI

## 📁 Struttura del Progetto

```
fantacalcio/
├── data/                    # File CSV con i giocatori
│   ├── portieri.csv
│   ├── difensori.csv
│   ├── centrocampisti.csv
│   └── attaccanti.csv
├── server/                  # Backend Node.js
│   ├── index.js
│   └── package.json
├── client/                  # Frontend React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── asta/                    # File CSV generati dall'asta
│   └── asta_giocatori.csv
└── package.json
```

## 🛠️ Installazione

1. **Clona il repository**
   ```bash
   git clone <repository-url>
   cd fantacalcio
   ```

2. **Installa tutte le dipendenze**
   ```bash
   npm run install-all
   ```

3. **Avvia il progetto in modalità sviluppo**
   ```bash
   npm run dev
   ```

   Questo comando avvierà:
   - Server backend sulla porta 5000
   - Client React sulla porta 3000

## 📊 Utilizzo

### Dashboard
- Visualizza statistiche generali dell'asta
- Mostra gli ultimi acquisti
- Contatori per ruolo

### Asta
- Seleziona un giocatore dalla lista
- Inserisci il prezzo di acquisto
- Specifica la squadra acquirente
- Conferma l'acquisto

### Giocatori
- Visualizza tutti i giocatori disponibili
- Filtra per ruolo, squadra o nome
- Tabella con informazioni dettagliate

### Statistiche
- Analisi dettagliate dell'asta
- Top 5 acquisti più costosi
- Spesa per squadra
- Media per ruolo

## 🔧 API Endpoints

### Backend (Porta 5000)

- `GET /api/giocatori` - Tutti i giocatori
- `GET /api/giocatori/:ruolo` - Giocatori per ruolo
- `POST /api/acquista` - Acquista un giocatore
- `GET /api/asta` - Lista acquisti
- `GET /api/statistiche` - Statistiche asta

## 📝 Formato CSV

### Giocatori (data/*.csv)
```csv
nome,squadra,valore_asta,note,punteggio
Maignan,Milan,50,Portiere affidabile,7.5
```

### Acquisti (asta/asta_giocatori.csv)
```csv
nome,squadra,ruolo,valore_asta,prezzo_acquisto,squadra_acquirente,note,punteggio,data_acquisto
```

## 🎨 Tecnologie Utilizzate

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **csv-parser** - Parsing file CSV
- **csv-writer** - Scrittura file CSV

### Frontend
- **React** - Libreria UI
- **Material-UI** - Componenti UI
- **Axios** - Client HTTP
- **React Router** - Routing

## 🚀 Deploy

### Produzione
```bash
# Build del client
npm run build

# Avvia solo il server
npm run server
```

### Sviluppo
```bash
# Avvia entrambi (server + client)
npm run dev
```

## 📱 Funzionalità Principali

1. **Gestione Giocatori**
   - Caricamento da file CSV
   - Filtri avanzati
   - Visualizzazione per ruolo

2. **Sistema Asta**
   - Selezione giocatori
   - Inserimento prezzi
   - Salvataggio automatico

3. **Statistiche**
   - Analisi in tempo reale
   - Grafici e tabelle
   - Export dati

4. **Interfaccia Utente**
   - Design responsive
   - Navigazione intuitiva
   - Feedback visivo

## 🔄 Aggiornamenti

Per aggiungere nuovi giocatori, modifica i file CSV nella cartella `data/`:

1. Aggiungi nuove righe ai file CSV esistenti
2. Riavvia il server per caricare i nuovi dati
3. I nuovi giocatori appariranno automaticamente nell'interfaccia

## 📞 Supporto

Per problemi o domande:
1. Controlla i log del server nella console
2. Verifica che tutti i file CSV siano nel formato corretto
3. Assicurati che le porte 3000 e 5000 siano libere

---

**Buona asta! ⚽**
