const express = require('express');
const multer = require('multer');
const router = express.Router();

// Configurazione multer per upload file di backup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'backup-' + uniqueSuffix + '.csv');
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
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
});

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



// Route per scaricare backup completo del database
router.get('/backup/download', async (req, res) => {
  try {
    const BackupService = require('../services/backupService');
    const backupService = new BackupService();
    const backupData = await backupService.createBackup();
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="fantacalcio-backup-${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(backupData);
  } catch (error) {
    console.error('Errore creazione backup:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Errore durante la creazione del backup',
      details: error.message
    });
  }
});

// Route per caricare backup e ripristinare database
router.post('/backup/restore', upload.single('backup'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'File di backup richiesto' 
      });
    }

    const BackupService = require('../services/backupService');
    const backupService = new BackupService();
    await backupService.restoreFromBackup(req.file.path);
    
    res.json({ 
      success: true, 
      message: 'Database ripristinato con successo dal backup',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Errore ripristino backup:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Errore durante il ripristino del backup',
      details: error.message
    });
  }
});

module.exports = router;
