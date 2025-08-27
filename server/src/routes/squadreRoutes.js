const express = require('express');
const router = express.Router();
const squadreController = require('../controllers/squadreController');

// GET /api/squadre - Lista tutte le squadre
router.get('/', squadreController.getAllSquadre.bind(squadreController));

// POST /api/squadre - Crea nuova squadra
router.post('/', squadreController.createSquadra.bind(squadreController));

// GET /api/squadre/:id - Squadra specifica
router.get('/:id', squadreController.getSquadraById.bind(squadreController));

// PUT /api/squadre/:id - Aggiorna squadra
router.put('/:id', squadreController.updateSquadra.bind(squadreController));

// DELETE /api/squadre/:id - Elimina squadra
router.delete('/:id', squadreController.deleteSquadra.bind(squadreController));

// WISHLIST GLOBALE
// POST /api/squadre/wishlist - Aggiungi giocatore alla wishlist
router.post('/wishlist', squadreController.addToWishlist.bind(squadreController));

// GET /api/squadre/wishlist - Ottieni wishlist globale
router.get('/wishlist', squadreController.getWishlist.bind(squadreController));

// DELETE /api/squadre/wishlist/:giocatoreId - Rimuovi giocatore dalla wishlist
router.delete('/wishlist/:giocatoreId', squadreController.removeFromWishlist.bind(squadreController));

// ACQUISTI
// POST /api/squadre/assegna-giocatore - Assegna giocatore a squadra (generico)
router.post('/assegna-giocatore', squadreController.assegnaGiocatore.bind(squadreController));

// POST /api/squadre/svincola-giocatore - Svincola giocatore da squadra
router.post('/svincola-giocatore', squadreController.svincolaGiocatore.bind(squadreController));

// POST /api/squadre/:id/acquista - Acquista giocatore
router.post('/:id/acquista', squadreController.acquistaGiocatore.bind(squadreController));

// GET /api/squadre/:id/acquisti - Ottieni acquisti di una squadra
router.get('/:id/acquisti', squadreController.getAcquistiSquadra.bind(squadreController));

module.exports = router;
