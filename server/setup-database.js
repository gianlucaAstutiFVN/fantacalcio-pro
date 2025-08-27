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
  
  console.log('🎯 Setup Database Fantacalcio');
  console.log('================================');
  
  const migration = new Migration();
  
  try {
    switch (command.toLowerCase()) {
      case 'init':
        console.log('📋 Comando: Inizializzazione database');
        await migration.initializeDatabase();
        break;
        
      case 'migrate':
        console.log('📋 Comando: Migrazione dati');
        await migration.migrateFromCSV();
        break;
        
      case 'reset':
        console.log('📋 Comando: Reset database');
        await migration.resetDatabase();
        break;
        
      case 'full':
      default:
        console.log('📋 Comando: Setup completo (init + migrate)');
        await migration.initializeDatabase();
        await migration.migrateFromCSV();
        break;
    }
    
    console.log('');
    console.log('🎉 Setup completato con successo!');
    console.log('');
    console.log('📊 Database pronto per l\'uso:');
    console.log('   - Giocatori caricati dai CSV');
    console.log('   - Quotazioni 2025 importate');
    console.log('   - Squadre di esempio create');
    console.log('   - Schema ottimizzato con indici');
    console.log('');
    
  } catch (error) {
    console.error('');
    console.error('❌ Errore durante il setup:', error.message);
    console.error('');
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
  console.log('\n🛑 Setup interrotto dall\'utente');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Setup terminato');
  process.exit(0);
});

// Esegui
main().catch(console.error);
