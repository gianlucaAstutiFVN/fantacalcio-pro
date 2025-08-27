const express = require('express');
const multer = require('multer');
const QuotazioniController = require('../controllers/quotazioniController');

const router = express.Router();
const quotazioniController = new QuotazioniController();

// Configurazione multer per upload file CSV
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'quotazioni-' + uniqueSuffix + '.csv');
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

// GET - Lista tutte le quotazioni
router.get('/', quotazioniController.getAllQuotazioni.bind(quotazioniController));

// GET - Quotazioni con filtri
router.get('/filtri', quotazioniController.getQuotazioniWithFilters.bind(quotazioniController));

// GET - Quotazioni per giocatore specifico
router.get('/giocatore/:giocatoreId', quotazioniController.getQuotazioniByGiocatore.bind(quotazioniController));

// GET - Statistiche quotazioni
router.get('/stats', quotazioniController.getQuotazioniStats.bind(quotazioniController));

// POST - Crea nuova quotazione
router.post('/', quotazioniController.createQuotazione.bind(quotazioniController));

// POST - Upload CSV per importazione
router.post('/upload-csv', upload.single('csv'), quotazioniController.uploadCSV.bind(quotazioniController));

// PUT - Aggiorna quotazione esistente
router.put('/:id', quotazioniController.updateQuotazione.bind(quotazioniController));

// DELETE - Elimina quotazione
router.delete('/:id', quotazioniController.deleteQuotazione.bind(quotazioniController));

module.exports = router;
