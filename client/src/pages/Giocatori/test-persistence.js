// Test per verificare la persistenza degli stati nell'URL
// Esegui questo script nella console del browser sulla pagina Giocatori

console.log('🧪 Test Persistenza Stati Giocatori (URL)');

// Test 1: Verifica URL parameters
function testURLParams() {
  console.log('\n🔗 Test URL Parameters:');
  
  const urlParams = new URLSearchParams(window.location.search);
  const params = {
    ruolo: urlParams.get('ruolo'),
    search: urlParams.get('search'),
    squad: urlParams.get('squad'),
    status: urlParams.get('status'),
    page: urlParams.get('page'),
    pageSize: urlParams.get('pageSize'),
    sortField: urlParams.get('sortField'),
    sortDirection: urlParams.get('sortDirection')
  };
  
  console.log('Parametri URL attuali:', params);
  return params;
}

// Test 2: Simula cambio stato
function testStateChange() {
  console.log('\n🔄 Test Cambio Stato:');
  
  // Simula filtri
  const currentUrl = new URL(window.location.href);
  currentUrl.searchParams.set('search', 'messi');
  currentUrl.searchParams.set('squad', 'Inter,Milan');
  currentUrl.searchParams.set('status', 'disponibile');
  
  // Simula paginazione
  currentUrl.searchParams.set('page', '2');
  currentUrl.searchParams.set('pageSize', '50');
  
  // Simula sorting
  currentUrl.searchParams.set('sortField', 'nome');
  currentUrl.searchParams.set('sortDirection', 'desc');
  
  window.history.pushState({}, '', currentUrl);
  console.log('✅ URL aggiornato con tutti i parametri');
  console.log('Nuovo URL:', currentUrl.toString());
  
  // Ricarica la pagina per testare la persistenza
  console.log('💡 Ora ricarica la pagina (F5) per verificare che gli stati rimangano');
}

// Test 3: Verifica sincronizzazione
function testSync() {
  console.log('\n🔄 Test Sincronizzazione:');
  
  const urlData = testURLParams();
  
  console.log('Stati nell\'URL:', {
    ruolo: !!urlData.ruolo,
    filtri: !!(urlData.search || urlData.squad || urlData.status),
    paginazione: !!(urlData.page || urlData.pageSize),
    sorting: !!(urlData.sortField || urlData.sortDirection)
  });
  
  return urlData;
}

// Test 4: Reset automatico per cambio ruolo
function testReset() {
  console.log('\n🔄 Test Reset Automatico:');
  
  // Simula cambio ruolo
  const currentUrl = new URL(window.location.href);
  currentUrl.searchParams.set('ruolo', 'portiere');
  
  // Mantieni altri parametri per testare il reset
  currentUrl.searchParams.set('search', 'test');
  currentUrl.searchParams.set('page', '3');
  
  window.history.pushState({}, '', currentUrl);
  
  console.log('✅ URL aggiornato per cambio ruolo');
  console.log('I filtri dovrebbero essere resettati automaticamente');
  console.log('Nuovo URL:', currentUrl.toString());
}

// Test 5: Verifica persistenza completa
function testFullPersistence() {
  console.log('\n🔄 Test Persistenza Completa:');
  
  const testUrl = new URL(window.location.href);
  
  // Imposta tutti i parametri
  testUrl.searchParams.set('ruolo', 'attaccante');
  testUrl.searchParams.set('search', 'ronaldo');
  testUrl.searchParams.set('squad', 'Juventus');
  testUrl.searchParams.set('status', 'disponibile');
  testUrl.searchParams.set('page', '1');
  testUrl.searchParams.set('pageSize', '25');
  testUrl.searchParams.set('sortField', 'valore');
  testUrl.searchParams.set('sortDirection', 'asc');
  
  window.history.pushState({}, '', testUrl);
  
  console.log('✅ URL completo impostato');
  console.log('URL completo:', testUrl.toString());
  console.log('💡 Ricarica la pagina per verificare la persistenza completa');
}

// Esegui tutti i test
function runAllTests() {
  console.log('🚀 Avvio test completi...');
  
  testURLParams();
  testStateChange();
  testSync();
  testReset();
  testFullPersistence();
  
  console.log('\n✅ Test completati!');
  console.log('💡 Ricarica la pagina per verificare la persistenza');
}

// Funzioni disponibili globalmente
window.testPersistence = {
  testURLParams,
  testStateChange,
  testSync,
  testReset,
  testFullPersistence,
  runAllTests
};

console.log('💡 Usa testPersistence.runAllTests() per eseguire tutti i test');
console.log('💡 Usa testPersistence.testURLParams() per test specifici');
console.log('💡 Usa testPersistence.testFullPersistence() per test completo');
