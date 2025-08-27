const fs = require('fs');
const path = require('path');
const { 
  initializeCSV, 
  appendToCSV, 
  readCSV, 
  CSV_HEADERS 
} = require('../utils/csvUtils');

// Inizializza la cartella asta e il file CSV se non esistono
const initializeAstaFiles = async () => {
  const astaDir = path.join(__dirname, '..', '..', '..', 'asta');
  if (!fs.existsSync(astaDir)) {
    fs.mkdirSync(astaDir, { recursive: true });
  }

  const astaFile = path.join(astaDir, 'asta_giocatori.csv');
  return await initializeCSV(astaFile, CSV_HEADERS.giocatori);
};

// Registra un acquisto
const registraAcquisto = async (acquistoData) => {
  try {
    await initializeAstaFiles();
    
    const astaFile = path.join(__dirname, '..', '..', '..', 'asta', 'asta_giocatori.csv');
    await appendToCSV(astaFile, [acquistoData], CSV_HEADERS.giocatori);
    
    return acquistoData;
  } catch (error) {
    console.error('Errore nella registrazione dell\'acquisto:', error);
    throw error;
  }
};

// Ottieni lo storico delle aste
const getStoricoAste = async () => {
  try {
    const filePath = path.join(__dirname, '..', '..', '..', 'asta', 'asta_giocatori.csv');
    return await readCSV(filePath);
  } catch (error) {
    throw error;
  }
};

// Ottieni statistiche aste per le statistiche della lega
const getStatisticheAste = async () => {
  try {
    const filePath = path.join(__dirname, '..', '..', '..', 'asta', 'asta_giocatori.csv');
    const aste = await readCSV(filePath);
    
    // Mappa i dati per le statistiche
    return aste.map(asta => ({
      nome: asta.nome || asta.giocatore || 'Nome non disponibile',
      squadra: asta.squadra || 'Squadra non disponibile',
      ruolo: asta.ruolo ? asta.ruolo.toLowerCase() : 'ruolo non disponibile',
      valore: parseInt(asta.valore || asta.prezzo || 0),
      squadraAcquirente: asta.squadraAcquirente || 'Squadra non disponibile',
      dataAcquisto: asta.dataAcquisto || asta.data || new Date().toISOString()
    }));
  } catch (error) {
    return [];
  }
};

// Ottieni aste attive (dati di esempio)
const getAsteAttive = async () => {
  try {
    // Per ora restituisce dati di esempio, in futuro potrebbe leggere da un database
    const asteAttive = [
      {
        id: 1,
        giocatore: 'Lautaro Martinez',
        squadra: 'Inter',
        ruolo: 'Attaccante',
        quotazione: 85,
        prezzoBase: 50,
        offerte: [
          { squadra: 'Real Fantacalcio', offerta: 75, timestamp: new Date().toISOString() },
          { squadra: 'Barcelona Dreams', offerta: 80, timestamp: new Date().toISOString() }
        ],
        stato: 'attiva',
        scadenza: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 ore
      },
      {
        id: 2,
        giocatore: 'Federico Chiesa',
        squadra: 'Juventus',
        ruolo: 'Attaccante',
        quotazione: 78,
        prezzoBase: 45,
        offerte: [
          { squadra: 'Manchester United Fantasy', offerta: 60, timestamp: new Date().toISOString() }
        ],
        stato: 'attiva',
        scadenza: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString() // 12 ore
      }
    ];
    
    return asteAttive;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  registraAcquisto,
  getStoricoAste,
  getStatisticheAste,
  getAsteAttive
};
