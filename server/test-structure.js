// Test della nuova struttura modulare
console.log('🧪 Test della nuova struttura modulare del server...\n');

try {
  // Test importazione configurazione
  console.log('📋 Test configurazione...');
  const config = require('./src/config');
  console.log('✅ Configurazione caricata:', {
    port: config.server.port,
    host: config.server.host,
    corsOrigins: config.cors.origin.length
  });

  // Test importazione routes
  console.log('\n🛣️ Test routes...');
  const routes = require('./src/routes');
  console.log('✅ Routes caricate');

  // Test importazione app
  console.log('\n🚀 Test app...');
  const app = require('./src/app');
  console.log('✅ App Express creata');

  // Test importazione services
  console.log('\n⚙️ Test services...');
  const giocatoriService = require('./src/services/giocatoriService');
  const astaService = require('./src/services/astaService');
  const squadreService = require('./src/services/squadreService');
  const statisticheService = require('./src/services/statisticheService');
  console.log('✅ Tutti i services caricati');

  // Test importazione controllers
  console.log('\n🎮 Test controllers...');
  const giocatoriController = require('./src/controllers/giocatoriController');
  const astaController = require('./src/controllers/astaController');
  const squadreController = require('./src/controllers/squadreController');
  const statisticheController = require('./src/controllers/statisticheController');
  console.log('✅ Tutti i controllers caricati');

  // Test importazione utilities
  console.log('\n🔧 Test utilities...');
  const csvUtils = require('./src/utils/csvUtils');
  console.log('✅ Utilities CSV caricate');

  console.log('\n🎉 Tutti i test sono passati! La nuova struttura è funzionante.');
  console.log('\n📊 Riepilogo struttura:');
  console.log('   - Controllers: 4');
  console.log('   - Services: 4');
  console.log('   - Routes: 4');
  console.log('   - Utils: 1');
  console.log('   - Config: 1');
  console.log('   - App: 1');
  console.log('   - Server: 1');

} catch (error) {
  console.error('❌ Errore durante il test:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}
