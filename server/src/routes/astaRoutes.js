const express = require('express');
const router = express.Router();
const astaController = require('../controllers/astaController');

// POST /api/acquista - Registra l'acquisto di un giocatore
router.post('/acquista', astaController.registraAcquisto);

// GET /api/asta - Ottieni lo storico delle aste
router.get('/storico', astaController.getStoricoAste);

// GET /api/aste - Ottieni aste attive
router.get('/attive', astaController.getAsteAttive);

module.exports = router;
