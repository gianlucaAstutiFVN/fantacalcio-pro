const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const routes = require('./routes');

// Crea l'applicazione Express
const app = express();

// Middleware
app.use(express.json());
app.use(cors(config.cors));

// Servi file statici dalla cartella public
app.use(express.static('public'));

// Monta le routes
app.use('/api', routes);

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
