const statisticheService = require('../services/statisticheService');

// Ottieni statistiche generali
const getStatisticheGenerali = async (req, res) => {
  try {
    const statistiche = await statisticheService.getStatisticheGenerali();
    res.json(statistiche);
  } catch (error) {
    console.error('Errore API statistiche:', error);
    res.status(500).json({ error: 'Errore nel calcolo delle statistiche' });
  }
};

// Ottieni statistiche della lega
const getStatisticheLega = async (req, res) => {
  try {
    const statistiche = await statisticheService.getStatisticheLega();
    res.json(statistiche);
  } catch (error) {
    console.error('Errore API statistiche lega:', error);
    res.status(500).json({ error: 'Errore nel calcolo delle statistiche della lega' });
  }
};

// Ottieni statistiche comparative
const getStatisticheComparative = async (req, res) => {
  try {
    const statistiche = await statisticheService.getStatisticheComparative();
    res.json(statistiche);
  } catch (error) {
    console.error('Errore API statistiche comparative:', error);
    res.status(500).json({ error: 'Errore nel calcolo delle statistiche comparative' });
  }
};

module.exports = {
  getStatisticheGenerali,
  getStatisticheLega,
  getStatisticheComparative
};
