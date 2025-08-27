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

module.exports = router;
