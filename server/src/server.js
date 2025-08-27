const app = require('./app');
const config = require('./config');

// Avvia il server
const startServer = () => {
  const { port, host } = config.server;
  
  app.listen(port, host, () => {
    console.log(`Server avviato su http://${host}:${port}`);
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
  process.exit(0);
});

process.on('SIGINT', () => {
  process.exit(0);
});

// Avvia il server
startServer();
