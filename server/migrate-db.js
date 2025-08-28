#!/usr/bin/env node

const { migrateDatabase } = require('./src/config/migration');

async function main() {
  try {
    console.log('🚀 Avvio migrazione database...');
    await migrateDatabase();
    console.log('✅ Migrazione completata con successo!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Errore durante la migrazione:', error);
    process.exit(1);
  }
}

main();
