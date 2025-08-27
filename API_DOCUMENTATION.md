# 📚 Documentazione API Backend Fantacalcio

## 🚀 **Nuove Funzionalità Implementate**

### 💰 **Gestione Credito Squadre**
- **Budget iniziale**: 1000 crediti per ogni squadra
- **Controllo automatico**: Verifica budget prima di ogni acquisto
- **Rimborso automatico**: Quando un giocatore viene rimosso

### 🏆 **Gestione Squadre Avanzata**
- **Creazione squadre** con nome e proprietario
- **Statistiche dettagliate** per ogni squadra
- **Reset budget** per nuova stagione

### ⭐ **Sistema Wishlist**
- **Aggiungere giocatori** di interesse
- **Rimuovere giocatori** dalla wishlist
- **Visualizzare wishlist** di ogni squadra

### 🎯 **Assegnazione Giocatori**
- **Acquisto diretto** con prezzo specificato
- **Controllo budget** automatico
- **Aggiornamento formazione** per ruolo
- **Integrazione CSV** asta con nuova struttura

---

## 📊 **Struttura CSV Giocatori**

I file CSV devono avere la seguente struttura:

```csv
Nome,Squadra,Unveil_FVM,Gazzetta_Fascia,PazzidiFanta,Mia_Valutazione,Note
Lautaro Martinez,Inter,85,85,87,86,Capocannoniere Serie A
Federico Chiesa,Juventus,78,78,80,79,Ex Fiorentina
```

### 📋 **Campi CSV:**
- **Nome**: Nome del giocatore
- **Squadra**: Squadra di appartenenza
- **Unveil_FVM**: Valutazione FVM
- **Gazzetta_Fascia**: Fascia Gazzetta dello Sport
- **PazzidiFanta**: Valutazione Pazzi di Fanta
- **Mia_Valutazione**: Valutazione personale
- **Note**: Note aggiuntive

---

## 📋 **API Endpoints Dettagliati**

### 🏃 **Gestione Giocatori**
```http
GET /api/giocatori
GET /api/giocatori/:ruolo
```

**Risposta con nuova struttura:**
```json
{
  "Nome": "Lautaro Martinez",
  "Squadra": "Inter",
  "Unveil_FVM": "85",
  "Gazzetta_Fascia": "85",
  "PazzidiFanta": "87",
  "Mia_Valutazione": "86",
  "Note": "Capocannoniere Serie A",
  "ruolo": "attaccante",
  "nome": "Lautaro Martinez",
  "squadra": "Inter",
  "unveil_fvm": "85",
  "gazzetta_fascia": "85",
  "pazzi_di_fanta": "87",
  "mia_valutazione": "86",
  "note": "Capocannoniere Serie A"
}
```

### 🏆 **Gestione Squadre**
```http
GET /api/squadre                    # Lista tutte le squadre
GET /api/squadre/:id/stats          # Statistiche dettagliate squadra
POST /api/squadre                   # Crea nuova squadra
PUT /api/squadre/:id                # Aggiorna squadra
DELETE /api/squadre/:id             # Elimina squadra
```

### ⭐ **Gestione Wishlist**
```http
POST /api/squadre/:id/wishlist                    # Aggiungi alla wishlist
DELETE /api/squadre/:id/wishlist/:giocatoreId     # Rimuovi dalla wishlist
GET /api/squadre/:id/wishlist                      # Ottieni wishlist squadra
```

### 💰 **Gestione Acquisti**
```http
POST /api/squadre/:id/acquista                    # Acquista giocatore per squadra
DELETE /api/squadre/:id/giocatori/:giocatoreId    # Rimuovi giocatore da squadra
```

### 🔄 **Gestione Budget**
```http
POST /api/squadre/:id/reset                       # Reset budget per nuova stagione
```

---

## 📊 **Struttura Dati Squadra**

```json
{
  "id": "1",
  "nome": "Squadra A",
  "proprietario": "Mario Rossi",
  "budget": 1000,
  "budgetIniziale": 1000,
  "giocatori": [
    {
      "id": "1",
      "nome": "Lautaro Martinez",
      "squadra": "Inter",
      "ruolo": "Attaccante",
      "unveil_fvm": "85",
      "gazzetta_fascia": "85",
      "pazzi_di_fanta": "87",
      "mia_valutazione": "86",
      "note": "Capocannoniere Serie A",
      "prezzoPagato": 75,
      "dataAcquisto": "2024-01-15T10:30:00.000Z"
    }
  ],
  "wishlist": [],
  "formazione": {
    "portieri": [],
    "difensori": [],
    "centrocampisti": [],
    "attaccanti": []
  }
}
```

---

## 🎯 **Esempi di Utilizzo**

### 1. **Creare Nuova Squadra**
```bash
curl -X POST http://localhost:5000/api/squadre \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Dream Team",
    "proprietario": "Giovanni Bianchi",
    "budget": 1000
  }'
```

### 2. **Aggiungere Giocatore alla Wishlist**
```bash
curl -X POST http://localhost:5000/api/squadre/1/wishlist \
  -H "Content-Type: application/json" \
  -d '{
    "giocatore": {
      "id": "123",
      "nome": "Erling Haaland",
      "squadra": "Manchester City",
      "ruolo": "Attaccante",
      "unveil_fvm": "95",
      "gazzetta_fascia": "95",
      "pazzi_di_fanta": "97",
      "mia_valutazione": "96",
      "note": "Capocannoniere Premier"
    }
  }'
```

### 3. **Acquistare Giocatore**
```bash
curl -X POST http://localhost:5000/api/squadre/1/acquista \
  -H "Content-Type: application/json" \
  -d '{
    "giocatore": {
      "id": "123",
      "nome": "Erling Haaland",
      "squadra": "Manchester City",
      "ruolo": "Attaccante",
      "unveil_fvm": "95",
      "gazzetta_fascia": "95",
      "pazzi_di_fanta": "97",
      "mia_valutazione": "96",
      "note": "Capocannoniere Premier"
    },
    "prezzoPagato": 80
  }'
```

### 4. **Visualizzare Statistiche Squadra**
```bash
curl http://localhost:5000/api/squadre/1/stats
```

### 5. **Reset Budget per Nuova Stagione**
```bash
curl -X POST http://localhost:5000/api/squadre/1/reset
```

---

## 🔒 **Controlli di Sicurezza**

### 💰 **Controllo Budget**
- **Verifica automatica** prima di ogni acquisto
- **Errore 400** se budget insufficiente
- **Aggiornamento automatico** del budget rimanente

### 📝 **Validazione Dati**
- **Campi obbligatori** per creazione squadra
- **Controllo esistenza** squadra per operazioni
- **Gestione errori** robusta per tutte le operazioni

---

## 📈 **Statistiche Disponibili**

### 🏆 **Per Squadra**
- Budget iniziale e rimanente
- Spesa totale per giocatori
- Numero giocatori acquistati
- Numero giocatori in wishlist
- Formazione organizzata per ruolo

### 📊 **Globali**
- Totale acquisti e spesa totale
- Prezzo medio per giocatore
- Distribuzione acquisti per ruolo
- Distribuzione acquisti per squadra acquirente

---

## 🚀 **Come Testare**

1. **Avvia il server**: `npm run dev` nella cartella `server/`
2. **Prepara i CSV**: Assicurati che i file CSV abbiano la struttura corretta
3. **Testa le API**: Usa Postman o curl per testare gli endpoint
4. **Verifica funzionalità**: Crea squadre, aggiungi wishlist, acquista giocatori
5. **Controlla budget**: Verifica che il budget si aggiorni correttamente

---

## 📁 **Struttura File Richiesta**

```
data/
├── portieri.csv      # Con struttura CSV specificata
├── difensori.csv     # Con struttura CSV specificata
├── centrocampisti.csv # Con struttura CSV specificata
└── attaccanti.csv    # Con struttura CSV specificata
```

Ogni CSV deve contenere i campi: `Nome,Squadra,Unveil_FVM,Gazzetta_Fascia,PazzidiFanta,Mia_Valutazione,Note`

---

## 🔮 **Funzionalità Future**

- **Aste in tempo reale** con WebSocket
- **Database persistente** (MongoDB/PostgreSQL)
- **Autenticazione utenti** e permessi
- **Notifiche** per offerte e scadenze
- **Export dati** in vari formati
- **Analisi avanzate** basate sui nuovi campi CSV
