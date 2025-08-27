# 🏆 Statistiche della Lega - Documentazione

## 📋 Panoramica

Il sistema delle statistiche della lega fornisce un'analisi completa e dettagliata delle performance finanziarie e strategiche di tutte le squadre partecipanti al fantacalcio.

## 🎯 Funzionalità Principali

### 1. **Statistiche Generali Lega**
- **Spesa Totale Lega**: Somma di tutti gli acquisti effettuati
- **Numero Totale Acquisti**: Conteggio complessivo dei giocatori acquistati
- **Prezzo Medio Lega**: Valore medio per giocatore a livello di lega
- **Squadre Attive**: Numero di squadre partecipanti

### 2. **Top Giocatori per Reparto**
- **Portieri**: Top 5 portieri più pagati
- **Difensori**: Top 5 difensori più pagati  
- **Centrocampisti**: Top 5 centrocampisti più pagati
- **Attaccanti**: Top 5 attaccanti più pagati

Per ogni giocatore viene mostrato:
- Nome e squadra di appartenenza
- Squadra acquirente
- Valore dell'acquisto

### 3. **Analisi per Reparto**
- **Spesa Totale**: Investimento complessivo per ruolo
- **Numero Acquisti**: Quantità di giocatori per ruolo
- **Prezzo Medio**: Valore medio per giocatore del ruolo

### 4. **Analisi per Squadra**
- **Spesa Totale**: Investimento complessivo della squadra
- **Budget Rimanente**: Crediti ancora disponibili
- **Distribuzione Ruoli**: Numero di giocatori per ruolo
- **Spesa per Ruolo**: Investimento specifico per ogni reparto

## 📊 Tab "Analisi Comparativa"

### **Vista Tabellare**
- Classifica squadre ordinabile per:
  - Spesa Totale
  - Numero Giocatori
  - Prezzo Medio
  - Efficienza Spesa
- Distribuzione ruoli per ogni squadra
- Posizione in classifica

### **Vista a Card**
- Visualizzazione grafica delle statistiche
- Confronto immediato tra squadre
- Metriche chiave evidenziate

### **Metriche di Efficienza**
- **Efficienza Spesa**: Rapporto qualità/prezzo
- **Prezzo Medio**: Valore medio per giocatore
- **Distribuzione Ruoli**: Bilanciamento della rosa

## 🔧 API Endpoints

### **Statistiche Lega**
```http
GET /api/statistiche/lega
```

**Response:**
```json
{
  "topGiocatoriPerRuolo": {
    "portiere": [...],
    "difensore": [...],
    "centrocampista": [...],
    "attaccante": [...]
  },
  "statisticheRuoli": [...],
  "statisticheSquadre": [...],
  "spesaTotaleLega": 500000,
  "numeroTotaleAcquisti": 25,
  "prezzoMedioLega": 20000
}
```

### **Statistiche Comparative**
```http
GET /api/statistiche/comparative
```

**Response:**
```json
[
  {
    "squadra": "Squadra A",
    "spesaTotale": 100000,
    "numeroGiocatori": 5,
    "prezzoMedio": 20000,
    "distribuzioneRuoli": {...},
    "spesaPerRuolo": {...},
    "efficienzaSpesa": 1.25
  }
]
```

## 🎨 Interfaccia Utente

### **Design System**
- **Colori Ruoli**:
  - 🟦 Portieri: Primary
  - 🟩 Difensori: Success  
  - 🟨 Centrocampisti: Warning
  - 🟥 Attaccanti: Error

### **Componenti Utilizzati**
- **Material-UI**: Design system completo
- **Responsive Grid**: Layout adattivo
- **Interactive Tables**: Ordinamento e filtri
- **Accordion**: Espansione dettagli squadra
- **Chips**: Etichette colorate per ruoli

### **Viste Disponibili**
1. **📊 Statistiche**: Statistiche generali esistenti
2. **🏆 Statistiche Lega**: Nuove statistiche della lega
3. **📈 Analisi Comparativa**: Confronti tra squadre
4. **📁 Upload CSV**: Gestione quotazioni

## 🚀 Utilizzo

### **Per gli Utenti**
1. Navigare al tab "🏆 Statistiche Lega"
2. Esplorare le statistiche per reparto
3. Analizzare le performance delle squadre
4. Confrontare strategie di mercato

### **Per gli Amministratori**
1. Monitorare la salute finanziaria della lega
2. Identificare trend di mercato
3. Analizzare l'efficienza degli acquisti
4. Generare report per la gestione

## 🔄 Aggiornamenti

### **Tempo Reale**
- Le statistiche si aggiornano automaticamente
- Refresh automatico ad ogni cambio tab
- Gestione errori e stati di caricamento

### **Performance**
- Lazy loading dei componenti
- Ottimizzazione delle query database
- Caching delle statistiche calcolate

## 🛠️ Sviluppo

### **Stack Tecnologico**
- **Frontend**: React + TypeScript + Material-UI
- **Backend**: Node.js + Express + SQLite
- **Architettura**: MVC con services separati

### **Struttura File**
```
client/src/pages/Statistiche/
├── StatistichePage.tsx          # Pagina principale
├── components/
│   ├── StatisticheLega.tsx      # Tab statistiche lega
│   ├── StatisticheComparative.tsx # Tab analisi comparativa
│   └── QuotazioniUpload.tsx     # Tab upload CSV
└── index.ts                     # Esportazioni
```

### **Estensibilità**
- Facile aggiunta di nuove metriche
- Sistema modulare per nuovi tab
- API scalabili per future funzionalità

## 📈 Roadmap

### **Funzionalità Future**
- Grafici interattivi (Chart.js)
- Export PDF delle statistiche
- Notifiche per record battuti
- Dashboard personalizzabili
- Confronti storici tra stagioni

### **Miglioramenti**
- Filtri avanzati per periodo
- Metriche di performance giocatori
- Analisi trend di mercato
- Integrazione con API esterne

---

*Documentazione aggiornata al: ${new Date().toLocaleDateString('it-IT')}*
