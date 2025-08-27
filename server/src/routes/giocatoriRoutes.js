const express = require('express');
const multer = require('multer');
const router = express.Router();
const giocatoriController = require('../controllers/giocatoriController');

// Configurazione multer per upload file CSV
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'giocatori-' + uniqueSuffix + '.csv');
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
            cb(null, true);
        } else {
            cb(new Error('Solo file CSV sono permessi'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max
    }
});

// Middleware per creare la cartella uploads se non esiste
const fs = require('fs');
const path = require('path');
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// GET /api/giocatori - Lista completa giocatori
router.get('/', giocatoriController.getAllGiocatori.bind(giocatoriController));

// GET /api/giocatori/wishlist - Giocatori in wishlist
router.get('/wishlist', giocatoriController.getGiocatoriInWishlist.bind(giocatoriController));

// PATCH /api/giocatori/:id/note - Aggiorna note
router.patch('/:id/note', giocatoriController.updateNote.bind(giocatoriController));

// PATCH /api/giocatori/:id/fantasquadra - Aggiorna fantasquadra
router.patch('/:id/fantasquadra', giocatoriController.updateFantasquadra.bind(giocatoriController));

// PATCH /api/giocatori/:id/valutazione - Aggiorna valutazione
router.patch('/:id/valutazione', giocatoriController.updateValutazione.bind(giocatoriController));

// GET /api/giocatori/:ruolo - Giocatori per ruolo
router.get('/:ruolo', giocatoriController.getGiocatoriByRuolo.bind(giocatoriController));

// GET /api/giocatori/:id - Giocatore specifico
router.get('/:id', giocatoriController.getGiocatoreById.bind(giocatoriController));

// POST - Upload CSV per importazione giocatori
router.post('/upload-csv', upload.single('csv'), giocatoriController.uploadCSV.bind(giocatoriController));

module.exports = router;
