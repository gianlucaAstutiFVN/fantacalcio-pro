const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const config = require('./config');
const routes = require('./routes');

// Crea l'applicazione Express
const app = express();

// Assicurati che la cartella temp esista
const tempDir = path.join(process.cwd(), 'temp');
try {
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
    console.log('📁 Cartella temp globale creata:', tempDir);
  }
} catch (error) {
  console.error('⚠️ Errore nella creazione della cartella temp globale:', error.message);
}

// Middleware
app.use(express.json());
app.use(cors(config.cors));

// Servi file statici dalla cartella public
app.use(express.static('public'));

// In produzione, servi i file statici del client
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.join(__dirname, '../../client/dist');
  const fs = require('fs');
  
  console.log('🔍 Verificando cartella client/dist...');
  console.log('📁 Percorso:', clientDistPath);
  console.log('📂 Esiste:', fs.existsSync(clientDistPath));
  
  // Verifica che la cartella client/dist esista
  if (fs.existsSync(clientDistPath)) {
    console.log('✅ Cartella client/dist trovata. Servendo file statici...');
    app.use(express.static(clientDistPath));
  } else {
    console.warn('⚠️  Cartella client/dist non trovata. Il frontend non sarà disponibile.');
    console.log('📋 Contenuto directory corrente:', fs.readdirSync(__dirname));
    console.log('📋 Contenuto directory parent:', fs.readdirSync(path.join(__dirname, '../..')));
  }
}

// Monta le routes
app.use('/api', routes);

// In produzione, gestisci le route del client per SPA
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.join(__dirname, '../../client/dist');
  const fs = require('fs');
  
  if (fs.existsSync(clientDistPath)) {
    app.get('*', (req, res) => {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    });
  }
}

// Middleware per gestire errori 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route non trovata',
    path: req.originalUrl,
    method: req.method
  });
});

// Middleware per gestire errori globali
app.use((error, req, res, next) => {
  res.status(500).json({ 
    error: 'Errore interno del server',
    message: error.message || 'Si è verificato un errore imprevisto'
  });
});

module.exports = app;
