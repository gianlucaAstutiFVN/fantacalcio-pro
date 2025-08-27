# Deployment su Render

Questo progetto è configurato per essere deployato su Render.com come applicazione full-stack.

## Struttura del Deployment

Il progetto viene deployato come due servizi separati:

1. **fantacalcio-api** - Backend Node.js/Express
2. **fantacalcio-client** - Frontend React (Static Site)

## Configurazione Automatica

Il file `render.yaml` nella root del progetto configura automaticamente entrambi i servizi.

### Variabili d'Ambiente

#### Backend (fantacalcio-api)
- `NODE_ENV=production`
- `PORT=10000`
- `CORS_ORIGIN=https://fantacalcio-client.onrender.com`
- `LOG_LEVEL=info`

#### Frontend (fantacalcio-client)
- `VITE_API_URL=https://fantacalcio-api.onrender.com/api`

## Passi per il Deployment

### 1. Push su GitHub
```bash
git add .
git commit -m "Configurazione per deployment su Render"
git push origin main
```

### 2. Connettere a Render

1. Vai su [render.com](https://render.com)
2. Crea un nuovo account o accedi
3. Clicca su "New +" e seleziona "Blueprint"
4. Connetti il repository GitHub
5. Render rileverà automaticamente il file `render.yaml` e creerà entrambi i servizi

### 3. Configurazione Manuale (Alternativa)

Se preferisci configurare manualmente:

#### Backend Service
- **Type**: Web Service
- **Environment**: Node
- **Build Command**: `npm run install-all && npm run build`
- **Start Command**: `cd server && npm start`
- **Plan**: Free

#### Frontend Service
- **Type**: Static Site
- **Build Command**: `cd client && npm install && npm run build:prod`
- **Publish Directory**: `client/dist`
- **Plan**: Free

## Note Importanti

1. **Database**: Il progetto usa SQLite che viene salvato localmente. In produzione, considera di migrare a un database persistente come PostgreSQL.

2. **File Uploads**: I file caricati vengono salvati nella cartella `uploads/`. In produzione, considera di usare un servizio di storage come AWS S3.

3. **CORS**: Assicurati che le variabili CORS_ORIGIN siano configurate correttamente per permettere la comunicazione tra frontend e backend.

4. **Environment Variables**: Tutte le variabili d'ambiente necessarie sono definite nel file `render.yaml`.

## Troubleshooting

### Problemi Comuni

1. **Build Fallisce**: Controlla i log di build su Render per errori di dipendenze
2. **CORS Errors**: Verifica che CORS_ORIGIN sia configurato correttamente
3. **Database Errors**: Assicurati che la cartella `data/` sia accessibile in scrittura

### Logs

I log del server sono disponibili nel dashboard di Render per entrambi i servizi.

## Aggiornamenti

Per aggiornare l'applicazione:
1. Fai push delle modifiche su GitHub
2. Render rileverà automaticamente i cambiamenti e farà il redeploy
