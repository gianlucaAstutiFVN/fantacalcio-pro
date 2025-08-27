const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testStatistiche() {
  try {
    console.log('🧪 Test delle nuove API statistiche...\n');

    // Test 1: Statistiche generali
    console.log('1️⃣ Test statistiche generali...');
    const response1 = await axios.get(`${BASE_URL}/statistiche`);
    console.log('✅ Statistiche generali:', response1.data);
    console.log('');

    // Test 2: Statistiche della lega
    console.log('2️⃣ Test statistiche della lega...');
    const response2 = await axios.get(`${BASE_URL}/statistiche/lega`);
    console.log('✅ Statistiche lega:', response2.data);
    console.log('');

    // Test 3: Statistiche comparative
    console.log('3️⃣ Test statistiche comparative...');
    const response3 = await axios.get(`${BASE_URL}/statistiche/comparative`);
    console.log('✅ Statistiche comparative:', response3.data);
    console.log('');

    console.log('🎉 Tutti i test sono passati con successo!');

  } catch (error) {
    console.error('❌ Errore durante i test:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Esegui i test
testStatistiche();
