require('dotenv').config();

module.exports = {
  // Configurazione del server
  server: {
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost',
    env: process.env.NODE_ENV || 'development'
  },
  
  // Configurazione CORS
  cors: {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200
  },
  
  // Percorsi dei file
  paths: {
    data: '../data',
    asta: '../asta',
    logs: '../logs'
  },
  
  // Configurazione CSV
  csv: {
    headers: {
      giocatori: [
        { id: 'nome', title: 'Nome' },
        { id: 'squadra', title: 'Squadra' },
        { id: 'ruolo', title: 'Ruolo' },
        { id: 'valore', title: 'Valore' },
        { id: 'squadraAcquirente', title: 'Squadra Acquirente' },
        { id: 'data', title: 'Data Acquisto' },
        { id: 'unveil_fvm', title: 'Unveil FVM (0-100)' },
        { id: 'gazzetta_fascia', title: 'Gazzetta Fascia (1-4)' },
        { id: 'pazzidifanta', title: 'PazzidiFanta (Qualitativo)' },
        { id: 'mia_valutazione', title: 'Mia_Valutazione (0-100)' },
        { id: 'note', title: 'Ruolo_note' }
      ]
    }
  },
  
  // Configurazione logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/server.log'
  }
};
