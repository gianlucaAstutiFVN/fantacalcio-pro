const express = require('express');
const multer = require('multer');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Determina la cartella temp da usare
let tempDir = path.join(process.cwd(), 'temp');
try {
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
    console.log('📁 Cartella temp creata:', tempDir);
  }
} catch (error) {
  console.error('⚠️ Errore nella creazione della cartella temp:', error.message);
  // Fallback: usa la cartella temporanea del sistema
  const os = require('os');
  tempDir = path.join(os.tmpdir(), 'fantacalcio-backup');
  try {
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    console.log('📁 Usando cartella temp di fallback:', tempDir);
  } catch (fallbackError) {
    console.error('❌ Errore critico: impossibile creare cartella temporanea:', fallbackError.message);
    throw new Error('Impossibile creare cartella temporanea per i backup');
  }
}

// Funzione per pulire i file temporanei più vecchi di 1 ora
const cleanupTempFiles = () => {
  try {
    if (!fs.existsSync(tempDir)) {
      console.log('📁 Cartella temp non esiste, niente da pulire');
      return;
    }
    
    const files = fs.readdirSync(tempDir);
    const now = Date.now();
    const oneHour = 60 * 60 * 1000; // 1 ora in millisecondi
    let removedCount = 0;
    
    files.forEach(file => {
      try {
        const filePath = path.join(tempDir, file);
        const stats = fs.statSync(filePath);
        
        // Se il file è più vecchio di 1 ora, eliminalo
        if (now - stats.mtime.getTime() > oneHour) {
          fs.unlinkSync(filePath);
          console.log(`🗑️ Rimosso file temporaneo: ${file}`);
          removedCount++;
        }
      } catch (fileError) {
        console.warn(`⚠️ Errore durante la gestione del file ${file}:`, fileError.message);
      }
    });
    
    if (removedCount > 0) {
      console.log(`🧹 Pulizia completata: rimossi ${removedCount} file temporanei`);
    } else {
      console.log('🧹 Nessun file temporaneo da rimuovere');
    }
  } catch (error) {
    console.error('Errore durante la pulizia dei file temporanei:', error);
  }
};

// Pulisci i file temporanei all'avvio del server
cleanupTempFiles();

// Configurazione multer per upload file di backup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
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

// Route per pulire i file temporanei
router.post('/cleanup-temp', (req, res) => {
  try {
    cleanupTempFiles();
    res.json({ 
      success: true, 
      message: 'Pulizia file temporanei completata',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Errore pulizia file temporanei:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Errore durante la pulizia dei file temporanei',
      details: error.message
    });
  }
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
