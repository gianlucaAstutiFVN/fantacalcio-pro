const app = require('./app');
const config = require('./config');

// Avvia il server
const startServer = () => {
  const { port, host } = config.server;
  
  app.listen(port, host, () => {
    console.log(`🚀 Server Fantacalcio Asta avviato su http://${host}:${port}`);
    console.log(`📊 API disponibili:`);
    console.log(`   - GET  /api/health - Stato del server`);
    console.log(`   - GET  /api/giocatori - Tutti i giocatori`);
    console.log(`   - GET  /api/giocatori/:ruolo - Giocatori per ruolo`);
    console.log(`   - POST /api/asta/acquista - Registra acquisto`);
    console.log(`   - GET  /api/asta/storico - Storico aste`);
    console.log(`   - GET  /api/aste/attive - Aste attive`);
    console.log(`   - GET  /api/statistiche - Statistiche generali`);
    console.log(`   - GET  /api/statistiche/lega - Statistiche della lega`);
    console.log(`   - GET  /api/statistiche/comparative - Statistiche comparative`);
    console.log(`   - GET  /api/squadre - Lista squadre`);
    console.log(`   - POST /api/squadre - Crea squadra`);
    console.log(`   - PUT  /api/squadre/:id - Aggiorna squadra`);
    console.log(`   - DELETE /api/squadre/:id - Elimina squadra`);
    console.log(`   - POST /api/squadre/:id/wishlist - Aggiungi alla wishlist`);
    console.log(`   - GET  /api/squadre/:id/wishlist - Visualizza wishlist`);
    console.log(`   - DELETE /api/squadre/:id/wishlist/:giocatoreId - Rimuovi dalla wishlist`);
    console.log(`   - POST /api/squadre/:id/acquista - Acquista giocatore`);
    console.log(`   - GET  /api/squadre/:id/stats - Statistiche squadra`);
    console.log(`   - POST /api/squadre/:id/reset - Reset budget`);
    console.log(`⏰ Avviato il: ${new Date().toLocaleString('it-IT')}`);
  });
};

// Gestione errori non catturati
process.on('uncaughtException', (error) => {
  console.error('❌ Errore non catturato:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promise rifiutata non gestita:', reason);
  process.exit(1);
});

// Gestione segnale di terminazione
process.on('SIGTERM', () => {
  console.log('🛑 Ricevuto segnale SIGTERM, chiusura del server...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Ricevuto segnale SIGINT, chiusura del server...');
  process.exit(0);
});

// Avvia il server
startServer();
