const app = require('./app');
const config = require('./config');

// Funzione per inizializzare il database in produzione
const initializeDatabase = async () => {
  if (process.env.NODE_ENV === 'production') {
    try {
      console.log('🔄 Inizializzazione database in produzione...');
      
      const Migration = require('./utils/migration');
      const migration = new Migration();
      
      await migration.initializeDatabase();
      await migration.migrateFromCSV();
      
      console.log('✅ Database inizializzato con successo');
    } catch (error) {
      console.error('❌ Errore inizializzazione database:', error);
      console.log('⚠️  Il database verrà inizializzato al primo accesso');
    }
  }
};

// Avvia il server
const startServer = async () => {
  const { port, host } = config.server;
  
  // Inizializza il database prima di avviare il server
  await initializeDatabase();
  
  app.listen(port, host, () => {
    console.log(`Server avviato su http://${host}:${port}`);
    console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
  });
};

// Gestione errori non catturati
process.on('uncaughtException', (error) => {
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
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
