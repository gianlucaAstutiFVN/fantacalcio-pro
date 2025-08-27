# 🚀 API Fantacalcio - Documentazione Completa

## 📋 Indice
- [Giocatori](#giocatori)
- [Squadre](#squadre)
- [Wishlist](#wishlist)
- [Acquisti](#acquisti)
- [Quotazioni](#quotazioni)
- [Caratteristiche Tecniche](#caratteristiche-tecniche)
- [Come Testare](#come-testare)

---

## 👥 **GIOCATORI**

### **1. GET - Lista Completa Giocatori**
```
GET /api/giocatori
GET /api/giocatori?withWishlist=true
```

**Query Parameters:**
- `withWishlist` (opzionale): `true` per includere informazioni wishlist

**Response Success:**
```json
{
  "success": true,
  "count": 517,
  "data": [
    {
      "id": "sommer_inter",
      "nome": "Sommer",
      "squadra": "Inter",
      "ruolo": "portiere",
      "fantacalciopedia": null,
      "pazzidifanta": null,
      "stadiosport": null,
      "unveil": null,
      "gazzetta": null,
      "mia_valutazione": null,
      "note": null,
      "preferito": 0,
      "fantasquadra": null,
      "status": "disponibile",
      "inWishlist": true,
      "wishlistIcon": "❤️"
    }
  ]
}
```

---

### **2. GET - Giocatori per Ruolo**
```
GET /api/giocatori/portiere
GET /api/giocatori/difensore
GET /api/giocatori/centrocampista
GET /api/giocatori/attaccante
GET /api/giocatori/portiere?withWishlist=true
```

**Path Parameters:**
- `ruolo`: `portiere`, `difensore`, `centrocampista`, `attaccante`

**Query Parameters:**
- `withWishlist` (opzionale): `true` per includere informazioni wishlist

**Response Success:**
```json
{
  "success": true,
  "ruolo": "portiere",
  "count": 67,
  "data": [
    {
      "id": "sommer_inter",
      "nome": "Sommer",
      "squadra": "Inter",
      "ruolo": "portiere",
      "fantacalciopedia": null,
      "pazzidifanta": null,
      "stadiosport": null,
      "unveil": null,
      "gazzetta": null,
      "mia_valutazione": null,
      "note": null,
      "preferito": 0,
      "fantasquadra": null,
      "status": "disponibile",
      "inWishlist": true,
      "wishlistIcon": "❤️"
    }
  ]
}
```

---

### **3. GET - Giocatori in Wishlist**
```
GET /api/giocatori/in-wishlist
```

**Response Success:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "sommer_inter",
      "nome": "Sommer",
      "squadra": "Inter",
      "ruolo": "portiere",
      "fantacalciopedia": null,
      "pazzidifanta": null,
      "stadiosport": null,
      "unveil": null,
      "gazzetta": null,
      "mia_valutazione": null,
      "note": null,
      "preferito": 0,
      "fantasquadra": null,
      "status": "disponibile"
    }
  ]
}
```

---

### **4. GET - Giocatore Specifico**
```
GET /api/giocatori/:id
```

**Path Parameters:**
- `id`: ID univoco del giocatore (es: `sommer_inter`)

**Response Success:**
```json
{
  "success": true,
  "data": {
    "id": "sommer_inter",
    "nome": "Sommer",
    "squadra": "Inter",
    "ruolo": "portiere",
    "fantacalciopedia": null,
    "pazzidifanta": null,
    "stadiosport": null,
    "unveil": null,
    "gazzetta": null,
    "mia_valutazione": null,
    "note": null,
    "preferito": 0,
    "fantasquadra": null,
    "status": "disponibile"
  }
}
```

**Response Error (404):**
```json
{
  "success": false,
  "error": "Giocatore non trovato"
}
```

---

### **5. PATCH - Aggiorna Note Giocatore**
```
PATCH /api/giocatori/:id/note
```

**Path Parameters:**
- `id`: ID univoco del giocatore

**Request Body:**
```json
{
  "note": "Giocatore molto promettente, da tenere d'occhio"
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "Note aggiornate con successo",
  "data": {
    "id": "sommer_inter",
    "note": "Giocatore molto promettente, da tenere d'occhio"
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "error": "Campo \"note\" richiesto"
}
```

**Response Error (404):**
```json
{
  "success": false,
  "error": "Giocatore non trovato"
}
```

---

### **6. PATCH - Aggiorna Fantasquadra Giocatore**
```
PATCH /api/giocatori/:id/fantasquadra
```

**Path Parameters:**
- `id`: ID univoco del giocatore

**Request Body:**
```json
{
  "fantasquadra": "I Fenomeni"
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "Fantasquadra aggiornata con successo",
  "data": {
    "id": "sommer_inter",
    "fantasquadra": "I Fenomeni"
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "error": "Campo \"fantasquadra\" richiesto"
}
```

**Response Error (404):**
```json
{
  "success": false,
  "error": "Giocatore non trovato"
}
```

---

## 🏆 **SQUADRE**

### **1. GET - Lista Tutte le Squadre**
```
GET /api/squadre
```

**Response Success:**
```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "id": 1,
      "nome": "I Fenomeni",
      "proprietario": "Mario Rossi",
      "budget": 500,
      "budget_residuo": 500,
      "created_at": "2024-01-15 10:30:00"
    },
    {
      "id": 2,
      "nome": "Dream Team",
      "proprietario": "Luca Bianchi",
      "budget": 500,
      "budget_residuo": 500,
      "created_at": "2024-01-15 10:30:00"
    }
  ]
}
```

---

### **2. POST - Crea Nuova Squadra**
```
POST /api/squadre
```

**Request Body:**
```json
{
  "nome": "Gli Invincibili",
  "proprietario": "Paolo Verdi",
  "budget": 600
}
```

**Campi:**
- `nome` (obbligatorio): Nome della squadra
- `proprietario` (obbligatorio): Nome del proprietario
- `budget` (opzionale): Budget iniziale (default: 500)

**Response Success (201):**
```json
{
  "success": true,
  "message": "Squadra creata con successo",
  "data": {
    "id": 3,
    "nome": "Gli Invincibili",
    "proprietario": "Paolo Verdi",
    "budget": 600
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "error": "Nome e proprietario sono obbligatori"
}
```

---

### **3. GET - Squadra Specifica**
```
GET /api/squadre/:id
```

**Path Parameters:**
- `id`: ID numerico della squadra

**Response Success:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nome": "I Fenomeni",
    "proprietario": "Mario Rossi",
    "budget": 500,
    "budget_residuo": 500,
    "created_at": "2024-01-15 10:30:00"
  }
}
```

**Response Error (404):**
```json
{
  "success": false,
  "error": "Squadra non trovata"
}
```

---

### **4. PUT - Modifica Squadra**
```
PUT /api/squadre/:id
```

**Path Parameters:**
- `id`: ID numerico della squadra

**Request Body:**
```json
{
  "nome": "I Fenomeni 2.0",
  "proprietario": "Mario Rossi",
  "budget": 600,
  "budget_residuo": 450
}
```

**Campi:**
- `nome` (obbligatorio): Nuovo nome della squadra
- `proprietario` (obbligatorio): Nuovo proprietario
- `budget` (opzionale): Nuovo budget iniziale
- `budget_residuo` (opzionale): Nuovo budget residuo

**Response Success:**
```json
{
  "success": true,
  "message": "Squadra aggiornata con successo",
  "data": {
    "id": 1,
    "nome": "I Fenomeni 2.0",
    "proprietario": "Mario Rossi",
    "budget": 600,
    "budget_residuo": 450
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "error": "Nome e proprietario sono obbligatori"
}
```

**Response Error (404):**
```json
{
  "success": false,
  "error": "Squadra non trovata"
}
```

---

### **5. DELETE - Elimina Squadra**
```
DELETE /api/squadre/:id
```

**Path Parameters:**
- `id`: ID numerico della squadra

**Response Success:**
```json
{
  "success": true,
  "message": "Squadra eliminata con successo"
}
```

**Response Error (404):**
```json
{
  "success": false,
  "error": "Squadra non trovata"
}
```

---

## ❤️ **WISHLIST**

### **1. POST - Aggiungi Giocatore alla Wishlist**
```
POST /api/squadre/wishlist
```

**Request Body:**
```json
{
  "giocatoreId": "sommer_inter"
}
```

**Campi:**
- `giocatoreId` (obbligatorio): ID del giocatore

**Response Success:**
```json
{
  "success": true,
  "message": "Giocatore aggiunto alla wishlist",
  "data": {
    "giocatoreId": "sommer_inter"
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "error": "giocatoreId è obbligatorio"
}
```

**Response Error (400):**
```json
{
  "success": false,
  "error": "Giocatore già in wishlist"
}
```

---

### **2. GET - Wishlist Globale**
```
GET /api/squadre/wishlist
```

**Response Success:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "giocatore_id": "sommer_inter",
      "created_at": "2024-01-15 10:30:00",
      "nome": "Sommer",
      "squadra": "Inter",
      "ruolo": "portiere"
    }
  ]
}
```

---

### **3. DELETE - Rimuovi dalla Wishlist**
```
DELETE /api/squadre/wishlist/:giocatoreId
```

**Path Parameters:**
- `giocatoreId`: ID del giocatore da rimuovere

**Response Success:**
```json
{
  "success": true,
  "message": "Giocatore rimosso dalla wishlist",
  "data": {
    "giocatoreId": "sommer_inter"
  }
}
```

**Response Error (404):**
```json
{
  "success": false,
  "error": "Giocatore non trovato nella wishlist"
}
```

---

## 💰 **ACQUISTI**

### **1. POST - Acquista Giocatore**
```
POST /api/squadre/:id/acquista
```

**Path Parameters:**
- `id`: ID della squadra che acquista

**Request Body:**
```json
{
  "giocatoreId": "sommer_inter",
  "prezzo": 25
}
```

**Campi:**
- `giocatoreId` (obbligatorio): ID del giocatore da acquistare
- `prezzo` (obbligatorio): Prezzo di acquisto

**Response Success:**
```json
{
  "success": true,
  "message": "Giocatore acquistato con successo",
  "data": {
    "giocatoreId": "sommer_inter",
    "squadraId": 1,
    "prezzo": 25
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "error": "giocatoreId e prezzo sono obbligatori"
}
```

**Response Error (400):**
```json
{
  "success": false,
  "error": "Il prezzo deve essere maggiore di zero"
}
```

**Response Error (400):**
```json
{
  "success": false,
  "error": "Giocatore non disponibile"
}
```

**Response Error (400):**
```json
{
  "success": false,
  "error": "Budget insufficiente"
}
```

---

### **2. GET - Acquisti di una Squadra**
```
GET /api/squadre/:id/acquisti
```

**Path Parameters:**
- `id`: ID della squadra

**Response Success:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "giocatore_id": "sommer_inter",
      "prezzo": 25,
      "data_acquisto": "2024-01-15 10:30:00",
      "nome": "Sommer",
      "squadra": "Inter",
      "ruolo": "portiere"
    }
  ]
}
```

---

nel db non vedo la tabella nova e la tabella giocatori ha tutti i campi delle quotazioni è giusto?## 📊 **QUOTAZIONI**

### **1. GET - Lista Tutte le Quotazioni**
```
GET /api/quotazioni
```

**Response Success:**
```json
{
  "success": true,
  "count": 25,
  "data": [
    {
      "id": 1,
      "giocatore_id": "sommer_inter",
      "fantacalciopedia": "85",
      "pazzidifanta": "Top",
      "stadiosport": "87",
      "unveil": "90",
      "gazzetta": "1",
      "mia_valutazione": 95,
      "note": "Portiere affidabile",
      "preferito": 1,
      "fonte": "manuale",
      "created_at": "2024-01-15 10:30:00",
      "updated_at": "2024-01-15 10:30:00",
      "nome": "Sommer",
      "squadra": "Inter",
      "ruolo": "portiere"
    }
  ]
}
```

---

### **2. GET - Quotazioni con Filtri**
```
GET /api/quotazioni/filtri?ruolo=portiere&squadra=Inter&fonte=manuale&preferito=true
```

**Query Parameters:**
- `ruolo` (opzionale): `portiere`, `difensore`, `centrocampista`, `attaccante`
- `squadra` (opzionale): Nome della squadra
- `fonte` (opzionale): `manuale`, `csv_import`, `fantacalciopedia`, `pazzidifanta`, `stadiosport`, `unveil`, `gazzetta`
- `preferito` (opzionale): `true`, `false`

**Response Success:**
```json
{
  "success": true,
  "count": 5,
  "filters": {
    "ruolo": "portiere",
    "squadra": "Inter"
  },
  "data": [...]
}
```

---

### **3. GET - Quotazioni per Giocatore**
```
GET /api/quotazioni/giocatore/:giocatoreId
```

**Path Parameters:**
- `giocatoreId`: ID del giocatore

**Response Success:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 1,
      "giocatore_id": "sommer_inter",
      "fantacalciopedia": "85",
      "pazzidifanta": "Top",
      "stadiosport": "87",
      "unveil": "90",
      "gazzetta": "1",
      "mia_valutazione": 95,
      "note": "Portiere affidabile",
      "preferito": 1,
      "fonte": "manuale",
      "created_at": "2024-01-15 10:30:00",
      "updated_at": "2024-01-15 10:30:00",
      "nome": "Sommer",
      "squadra": "Inter",
      "ruolo": "portiere"
    }
  ]
}
```

---

### **4. POST - Crea Nuova Quotazione**
```
POST /api/quotazioni
```

**Request Body:**
```json
{
  "giocatore_id": "sommer_inter",
  "fantacalciopedia": "85",
  "pazzidifanta": "Top",
  "stadiosport": "87",
  "unveil": "90",
  "gazzetta": "1",
  "mia_valutazione": 95,
  "note": "Portiere affidabile",
  "preferito": true,
  "fonte": "manuale"
}
```

**Campi:**
- `giocatore_id` (obbligatorio): ID del giocatore
- `fantacalciopedia` (opzionale): Valutazione Fantacalciopedia
- `pazzidifanta` (opzionale): Valutazione PazzidiFanta
- `stadiosport` (opzionale): Valutazione Stadiosport
- `unveil` (opzionale): Valutazione Unveil
- `gazzetta` (opzionale): Valutazione Gazzetta
- `mia_valutazione` (opzionale): Valutazione personale (0-100)
- `note` (opzionale): Note aggiuntive
- `preferito` (opzionale): Boolean per giocatore preferito
- `fonte` (opzionale): Fonte della quotazione (default: "manuale")

**Response Success (201):**
```json
{
  "success": true,
  "message": "Quotazione creata con successo",
  "data": {
    "id": 1,
    "giocatore_id": "sommer_inter",
    "fantacalciopedia": "85",
    "pazzidifanta": "Top",
    "stadiosport": "87",
    "unveil": "90",
    "gazzetta": "1",
    "mia_valutazione": 95,
    "note": "Portiere affidabile",
    "preferito": 1,
    "fonte": "manuale"
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "error": "giocatore_id è obbligatorio"
}
```

**Response Error (404):**
```json
{
  "success": false,
  "error": "Giocatore non trovato"
}
```

---

### **5. PUT - Aggiorna Quotazione**
```
PUT /api/quotazioni/:id
```

**Path Parameters:**
- `id`: ID della quotazione

**Request Body:**
```json
{
  "fantacalciopedia": "88",
  "mia_valutazione": 97,
  "note": "Aggiornato: Portiere molto affidabile"
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "Quotazione aggiornata con successo",
  "data": {
    "id": 1
  }
}
```

---

### **6. DELETE - Elimina Quotazione**
```
DELETE /api/quotazioni/:id
```

**Path Parameters:**
- `id`: ID della quotazione

**Response Success:**
```json
{
  "success": true,
  "message": "Quotazione eliminata con successo",
  "data": {
    "id": 1
  }
}
```

---

### **7. POST - Upload CSV per Importazione**
```
POST /api/quotazioni/upload-csv
```

**Request Body:**
- `Content-Type`: `multipart/form-data`
- `csv`: File CSV

**Formato CSV Atteso:**
```csv
Nome,Squadra,Fantacalciopedia,PazzidiFanta,Stadiosport,Unveil,Gazzetta,Mia_Valutazione,Note,Preferito
Sommer,Inter,85,Top,87,90,1,95,Portiere affidabile,true
```

**Response Success:**
```json
{
  "success": true,
  "message": "Importazione completata: 25 operazioni, 0 errori",
  "data": {
    "results": [...],
    "errors": [],
    "summary": {
      "total": 25,
      "successful": 25,
      "failed": 0
    }
  }
}
```

---

### **8. GET - Statistiche Quotazioni**
```
GET /api/quotazioni/stats
```

**Response Success:**
```json
{
  "success": true,
  "data": {
    "total_quotazioni": 25,
    "per_fonte": {
      "manuale": 15,
      "csv_import": 10
    },
    "per_ruolo": {
      "portiere": 5,
      "difensore": 8,
      "centrocampista": 7,
      "attaccante": 5
    },
    "aggiornate_ultimo_mese": 12
  }
}
```

---

## 🔧 **CARATTERISTICHE TECNICHE**

### **Database**
- **Tipo**: SQLite
- **Giocatori**: 517 importati da `Quotazioni_fantacalcio_2025.csv`
- **Ruoli**: Mappati correttamente (P=portiere, D=difensore, C=centrocampista, A=attaccante)
- **Campi**: Solo i 3 obbligatori (nome, squadra, ruolo) + campi opzionali vuoti
- **Quotazioni**: Gestione separata con tabella dedicata per valutazioni multiple

### **Wishlist**
- **Tipo**: Globale unica per tutti i giocatori e tutte le squadre
- **Icone**: ❤️ (in wishlist) / 🤍 (non in wishlist)
- **Gestione**: Aggiunta/rimozione con validazioni

### **Acquisti**
- **Transazioni**: Gestite per integrità dati
- **Budget**: Controllo automatico disponibilità
- **Status**: Giocatore passa da `disponibile` a `acquistato`
- **Wishlist**: Rimozione automatica dopo acquisto

### **Validazioni**
- **Campi obbligatori**: Controlli sui parametri richiesti
- **Esistenza**: Verifica ID giocatori/squadre
- **Business Logic**: Budget, disponibilità giocatori

---

## 📋 **COME TESTARE**

### **1. Avvia il Server**
```bash
cd server
npm start
```

### **2. Frontend Quotazioni**
Apri nel browser: `http://localhost:3000/quotazioni.html`

**Funzionalità disponibili:**
- 📁 **Upload CSV**: Trascina file CSV o seleziona da file system
- ✏️ **Form Manuale**: Aggiungi quotazioni singole
- 🔍 **Filtri Avanzati**: Per ruolo, squadra, fonte, preferiti
- 📊 **Tabella Dinamica**: Visualizza tutte le quotazioni
- 📥 **Esporta CSV**: Scarica dati in formato CSV

### **3. Testa le API**
- **Postman**: Importa le richieste
- **curl**: Comandi da terminale
- **Browser**: Per le GET

### **4. Esempi di Test**

#### **Lista Giocatori con Wishlist**
```bash
curl "http://localhost:3000/api/giocatori?withWishlist=true"
```

#### **Crea Squadra**
```bash
curl -X POST "http://localhost:3000/api/squadre" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Test Squad","proprietario":"Test User","budget":500}'
```

#### **Aggiungi alla Wishlist**
```bash
curl -X POST "http://localhost:3000/api/squadre/wishlist" \
  -H "Content-Type: application/json" \
  -d '{"giocatoreId":"sommer_inter"}'
```

#### **Aggiorna Note**
```bash
curl -X PATCH "http://localhost:3000/api/giocatori/sommer_inter/note" \
  -H "Content-Type: application/json" \
  -d '{"note":"Giocatore promettente"}'
```

#### **Crea Quotazione**
```bash
curl -X POST "http://localhost:3000/api/quotazioni" \
  -H "Content-Type: application/json" \
  -d '{"giocatore_id":"sommer_inter","fantacalciopedia":"85","mia_valutazione":95,"preferito":true}'
```

#### **Lista Quotazioni Filtrate**
```bash
curl "http://localhost:3000/api/quotazioni/filtri?ruolo=portiere&preferito=true"
```

---

## 🎯 **STATUS CODES**

- **200**: Successo
- **201**: Creato con successo
- **400**: Bad Request (parametri mancanti/invalidi)
- **404**: Non trovato
- **500**: Errore interno del server

---

## 📊 **STRUTTURA DATI**

### **Giocatore**
```json
{
  "id": "string (nome_squadra)",
  "nome": "string",
  "squadra": "string",
  "ruolo": "portiere|difensore|centrocampista|attaccante",
  "status": "disponibile|acquistato",
  "fantasquadra": "string|null",
  "note": "string|null"
}
```

### **Squadra**
```json
{
  "id": "number",
  "nome": "string",
  "proprietario": "string",
  "budget": "number",
  "budget_residuo": "number",
  "created_at": "datetime"
}
```

### **Wishlist**
```json
{
  "id": "number",
  "giocatore_id": "string",
  "created_at": "datetime"
}
```

---

## 🚀 **FEATURES AVANZATE**

- **Wishlist Globale**: Unica per tutti, con icone ❤️/🤍
- **Gestione Budget**: Controllo automatico disponibilità
- **Transazioni**: Integrità dati per acquisti
- **Validazioni**: Controlli sui parametri e business logic
- **Error Handling**: Messaggi di errore dettagliati
- **Async/Await**: Gestione asincrona completa
- **Database**: SQLite con migrazione da CSV
- **Gestione Quotazioni**: Sistema separato per valutazioni multiple con import CSV
- **Frontend Integrato**: Interfaccia web per gestione quotazioni con drag & drop

---

## 📞 **Supporto**

Per problemi o domande:
- Controlla i log del server
- Verifica la connessione al database
- Controlla i parametri delle richieste
- Assicurati che il server sia avviato

---

**🎉 API Fantacalcio pronte per l'uso!**
