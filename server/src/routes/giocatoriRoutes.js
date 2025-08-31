const express = require('express');
const multer = require('multer');
const router = express.Router();
const giocatoriController = require('../controllers/giocatoriController');
const fs = require('fs');
const path = require('path');

// Determina la cartella temp da usare
let tempDir = path.join(process.cwd(), 'temp');
try {
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
    console.log('📁 Cartella temp creata per giocatori:', tempDir);
  }
} catch (error) {
  console.error('⚠️ Errore nella creazione della cartella temp per giocatori:', error.message);
  // Fallback: usa la cartella temporanea del sistema
  const os = require('os');
  tempDir = path.join(os.tmpdir(), 'fantacalcio-giocatori');
  try {
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    console.log('📁 Usando cartella temp di fallback per giocatori:', tempDir);
  } catch (fallbackError) {
    console.error('❌ Errore critico: impossibile creare cartella temporanea per giocatori:', fallbackError.message);
    throw new Error('Impossibile creare cartella temporanea per i giocatori');
  }
}

// Configurazione multer per upload file CSV
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempDir);
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

// GET /api/giocatori - Lista completa giocatori
router.get('/', giocatoriController.getAllGiocatori.bind(giocatoriController));

// GET /api/giocatori/wishlist - Giocatori in wishlist
router.get('/wishlist', giocatoriController.getGiocatoriInWishlist.bind(giocatoriController));

// GET /api/giocatori/squadra/:squadra - Giocatori per squadra
router.get('/squadra/:squadra', giocatoriController.getGiocatoriBySquadra.bind(giocatoriController));

// PATCH /api/giocatori/:id/note - Aggiorna note
router.patch('/:id/note', giocatoriController.updateNote.bind(giocatoriController));

// PATCH /api/giocatori/:id/fantasquadra - Aggiorna fantasquadra
router.patch('/:id/fantasquadra', giocatoriController.updateFantasquadra.bind(giocatoriController));

// PATCH /api/giocatori/:id/valutazione - Aggiorna valutazione
router.patch('/:id/valutazione', giocatoriController.updateValutazione.bind(giocatoriController));

// PATCH /api/giocatori/:id/fields - Aggiorna tutti i campi editabili
router.patch('/:id/fields', giocatoriController.updateGiocatoreFields.bind(giocatoriController));

// GET /api/giocatori/:ruolo - Giocatori per ruolo
router.get('/:ruolo', giocatoriController.getGiocatoriByRuolo.bind(giocatoriController));

// GET /api/giocatori/:id - Giocatore specifico
router.get('/:id', giocatoriController.getGiocatoreById.bind(giocatoriController));

// POST - Upload CSV per importazione giocatori
router.post('/upload-csv', upload.single('csv'), giocatoriController.uploadCSV.bind(giocatoriController));

module.exports = router;
