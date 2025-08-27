const express = require('express');
const router = express.Router();
const giocatoriController = require('../controllers/giocatoriController');

// GET /api/giocatori - Lista completa giocatori
router.get('/', giocatoriController.getAllGiocatori.bind(giocatoriController));

// GET /api/giocatori/in-wishlist - Giocatori in wishlist
router.get('/in-wishlist', giocatoriController.getGiocatoriInWishlist.bind(giocatoriController));

// GET /api/giocatori/:ruolo - Giocatori per ruolo
router.get('/:ruolo', giocatoriController.getGiocatoriByRuolo.bind(giocatoriController));

// GET /api/giocatori/:id - Giocatore specifico
router.get('/:id', giocatoriController.getGiocatoreById.bind(giocatoriController));

// PATCH /api/giocatori/:id/note - Aggiorna note
router.patch('/:id/note', giocatoriController.updateNote.bind(giocatoriController));

// PATCH /api/giocatori/:id/fantasquadra - Aggiorna fantasquadra
router.patch('/:id/fantasquadra', giocatoriController.updateFantasquadra.bind(giocatoriController));

module.exports = router;
