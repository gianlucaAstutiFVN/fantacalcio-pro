# Fix Deployment Render.com

## Problema Risolto

**Errore:** `Error: Cannot find module 'express'`

**Causa:** Render stava cercando di eseguire `server/index.js` invece del server modulare in `server/src/server.js`. Il file `server/index.js` era un server legacy che non aveva le dipendenze installate correttamente.

## Soluzione Implementata

### 1. Rimozione File Legacy

**Problema:** Il file `server/index.js` era un server legacy che causava confusione nel deployment.

**Soluzione:** Rimosso il file `server/index.js` per evitare conflitti con il server modulare in `server/src/server.js`.

### 2. Modifica al `render.yaml`

**Configurazione:**
```yaml
buildCommand: npm run install-all
startCommand: cd server && node src/server.js
```

### 2. Verifica della Struttura

La struttura del progetto è corretta:
```
fantacalcio-pro/
├── server/
│   ├── package.json (con dipendenze express, cors, etc.)
│   ├── src/
│   │   └── server.js
│   └── ...
├── client/
│   ├── package.json
│   └── ...
└── render.yaml
```

### 3. Script di Avvio

Il `package.json` della root contiene lo script corretto:
```json
{
  "scripts": {
    "start": "cd server && node src/server.js"
  }
}
```

Il `server/package.json` contiene lo script corretto:
```json
{
  "scripts": {
    "start": "node src/server.js"
  }
}
```

## Test del Deployment

1. **Commit e Push:** Assicurati che le modifiche siano committate e pushate su GitHub
2. **Render Dashboard:** Vai su Render.com e verifica che il deployment si avvii correttamente
3. **Logs:** Controlla i logs per verificare che non ci siano più errori di moduli mancanti

## Variabili d'Ambiente

Le variabili d'ambiente sono configurate correttamente:
- `NODE_ENV=production`
- `PORT=10000`
- `CORS_ORIGIN=https://fantacalcio-client.onrender.com`
- `LOG_LEVEL=info`

## Troubleshooting

Se il problema persiste:

1. **Verifica Build:** Controlla che il comando `cd server && npm install` si esegua correttamente
2. **Verifica Start:** Controlla che il comando `cd server && npm start` si esegua correttamente
3. **Logs Render:** Controlla i logs completi su Render per identificare altri errori
4. **Dipendenze:** Verifica che tutte le dipendenze nel `server/package.json` siano corrette

## Note Importanti

- Il server viene eseguito dalla cartella `server/`
- Le dipendenze vengono installate solo nella cartella `server/`
- Il client è configurato come sito statico separato
- La comunicazione tra client e server avviene tramite CORS configurato
