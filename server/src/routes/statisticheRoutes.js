const express = require('express');
const router = express.Router();
const statisticheController = require('../controllers/statisticheController');

// GET /api/statistiche - Ottieni statistiche generali
router.get('/', statisticheController.getStatisticheGenerali);

// GET /api/statistiche/lega - Ottieni statistiche della lega
router.get('/lega', statisticheController.getStatisticheLega);

// GET /api/statistiche/comparative - Ottieni statistiche comparative
router.get('/comparative', statisticheController.getStatisticheComparative);

module.exports = router;
