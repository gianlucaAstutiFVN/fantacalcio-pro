#!/usr/bin/env node

/**
 * Script di setup del database
 * 
 * Uso:
 * node setup-database.js init     - Inizializza database
 * node setup-database.js migrate  - Migra dati da CSV
 * node setup-database.js reset    - Reset completo
 * node setup-database.js full     - Init + Migrate (setup completo)
 */

const Migration = require('./src/utils/migration');

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'full';
  

  
  const migration = new Migration();
  
  try {
    switch (command.toLowerCase()) {
      case 'init':
        await migration.initializeDatabase();
        break;
        
      case 'migrate':
        await migration.migrateFromCSV();
        break;
        
      case 'reset':
        await migration.resetDatabase();
        break;
        
      case 'full':
      default:
        await migration.initializeDatabase();
        await migration.migrateFromCSV();
        break;
    }
    

    
  } catch (error) {
    process.exit(1);
  } finally {
    // Chiudi la connessione
    try {
      await migration.db.close();
    } catch (e) {
      // Ignora errori di chiusura
    }
  }
}

// Gestisci interruzioni
process.on('SIGINT', async () => {
  process.exit(0);
});

process.on('SIGTERM', async () => {
  process.exit(0);
});

// Esegui
main().catch(() => process.exit(1));
