// Test script per verificare la connettività API
// Esegui con: node test-api.js

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testAPI() {
  console.log('🧪 Test API Fantacalcio...\n');

  try {
    // Test 1: Lista Giocatori
    console.log('1️⃣ Test GET /api/giocatori');
    const giocatoriResponse = await axios.get(`${API_BASE_URL}/giocatori`);
    console.log(`✅ Giocatori caricati: ${giocatoriResponse.data.count || giocatoriResponse.data.data?.length || 'N/A'}`);
    console.log(`📊 Status: ${giocatoriResponse.status}\n`);

    // Test 2: Lista Squadre
    console.log('2️⃣ Test GET /api/squadre');
    const squadreResponse = await axios.get(`${API_BASE_URL}/squadre`);
    console.log(`✅ Squadre caricate: ${squadreResponse.data.count || squadreResponse.data.data?.length || 'N/A'}`);
    console.log(`📊 Status: ${squadreResponse.status}\n`);

    // Test 3: Wishlist
    console.log('3️⃣ Test GET /api/squadre/wishlist');
    const wishlistResponse = await axios.get(`${API_BASE_URL}/squadre/wishlist`);
    console.log(`✅ Wishlist caricata: ${wishlistResponse.data.count || wishlistResponse.data.data?.length || 'N/A'}`);
    console.log(`📊 Status: ${wishlistResponse.status}\n`);

    // Test 4: Giocatori per Ruolo
    console.log('4️⃣ Test GET /api/giocatori/portiere');
    const portieriResponse = await axios.get(`${API_BASE_URL}/giocatori/portiere`);
    console.log(`✅ Portieri caricati: ${portieriResponse.data.count || portieriResponse.data.data?.length || 'N/A'}`);
    console.log(`📊 Status: ${portieriResponse.status}\n`);

    console.log('🎉 Tutti i test API sono passati con successo!');
    console.log('🚀 Il frontend può connettersi correttamente al backend.');

  } catch (error) {
    console.error('❌ Errore durante il test API:');
    
    if (error.response) {
      console.error(`📊 Status: ${error.response.status}`);
      console.error(`📝 Messaggio: ${error.response.data?.error || error.response.statusText}`);
    } else if (error.request) {
      console.error('🌐 Errore di connessione:');
      console.error('   - Verifica che il backend sia in esecuzione');
      console.error('   - Controlla che sia in ascolto su http://localhost:3000');
      console.error('   - Verifica che non ci siano errori CORS');
    } else {
      console.error('🔧 Errore generico:', error.message);
    }
    
    console.log('\n💡 Soluzioni:');
    console.log('   1. Avvia il backend: cd server && npm start');
    console.log('   2. Verifica la porta 3000 sia libera');
    console.log('   3. Controlla i log del backend per errori');
  }
}

// Esegui il test
testAPI();
