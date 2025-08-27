const express = require('express');
const router = express.Router();

// Importa le routes specifiche
const giocatoriRoutes = require('./giocatoriRoutes');
const astaRoutes = require('./astaRoutes');
const squadreRoutes = require('./squadreRoutes');
const statisticheRoutes = require('./statisticheRoutes');
const quotazioniRoutes = require('./quotazioniRoutes');

// Monta le routes sui percorsi appropriati
router.use('/giocatori', giocatoriRoutes);
router.use('/asta', astaRoutes);
router.use('/squadre', squadreRoutes);
router.use('/statistiche', statisticheRoutes);
router.use('/quotazioni', quotazioniRoutes);

// Route di health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server Fantacalcio Asta funzionante',
    timestamp: new Date().toISOString()
  });
});

// Route per inizializzare il database (solo in produzione)
router.post('/init-db', async (req, res) => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return res.status(403).json({ 
        success: false, 
        error: 'Endpoint disponibile solo in produzione' 
      });
    }

    const Migration = require('../../utils/migration');
    const migration = new Migration();
    
    await migration.initializeDatabase();
    await migration.migrateFromCSV();
    
    res.json({ 
      success: true, 
      message: 'Database inizializzato con successo',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Errore inizializzazione database:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Errore durante l\'inizializzazione del database',
      details: error.message
    });
  }
});

module.exports = router;
