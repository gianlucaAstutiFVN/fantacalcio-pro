const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Headers standard per i CSV
const CSV_HEADERS = {
  giocatori: [
    { id: 'nome', title: 'Nome' },
    { id: 'squadra', title: 'Squadra' },
    { id: 'ruolo', title: 'Ruolo' },
    { id: 'valore', title: 'Valore' },
    { id: 'squadraAcquirente', title: 'Squadra Acquirente' },
    { id: 'data', title: 'Data Acquisto' },
    { id: 'gazzetta', title: 'Gazzetta' },
    { id: 'fascia', title: 'Fascia' },
    { id: 'consiglio', title: 'Consiglio' },
    { id: 'voto', title: 'Voto' },
    { id: 'mia_valutazione', title: 'Mia_Valutazione (0-100)' },
    { id: 'note', title: 'Ruolo_note' }
  ]
};

// Leggi un file CSV
const readCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      return resolve([]);
    }

    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
};

// Scrivi su un file CSV
const writeCSV = (filePath, data, headers = CSV_HEADERS.giocatori, append = false) => {
  return new Promise((resolve, reject) => {
    try {
      // Crea la directory se non esiste
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const csvWriter = createCsvWriter({
        path: filePath,
        header: headers,
        append
      });

      csvWriter.writeRecords(data)
        .then(() => resolve(data))
        .catch(reject);
    } catch (error) {
      reject(error);
    }
  });
};

// Inizializza un file CSV se non esiste
const initializeCSV = async (filePath, headers = CSV_HEADERS.giocatori) => {
  if (!fs.existsSync(filePath)) {
    return await writeCSV(filePath, [], headers, false);
  }
  return Promise.resolve();
};

// Aggiungi record a un CSV esistente
const appendToCSV = async (filePath, data, headers = CSV_HEADERS.giocatori) => {
  return await writeCSV(filePath, data, headers, true);
};

// Valida i dati CSV
const validateCSVData = (data, requiredFields = []) => {
  const errors = [];
  
  if (!Array.isArray(data)) {
    errors.push('I dati devono essere un array');
    return errors;
  }

  data.forEach((row, index) => {
    requiredFields.forEach(field => {
      if (!row[field] && row[field] !== 0) {
        errors.push(`Riga ${index + 1}: campo '${field}' mancante`);
      }
    });
  });

  return errors;
};

// Sanitizza i dati CSV
const sanitizeCSVData = (data) => {
  return data.map(row => {
    const sanitized = {};
    Object.keys(row).forEach(key => {
      let value = row[key];
      
      // Gestisci valori "n/d" e stringhe vuote
      if (value === 'n/d' || value === '' || value === undefined) {
        value = null;
      }
      
      // Sanitizza stringhe
      if (typeof value === 'string') {
        value = value.trim();
      }
      
      sanitized[key] = value;
    });
    return sanitized;
  });
};

module.exports = {
  CSV_HEADERS,
  readCSV,
  writeCSV,
  initializeCSV,
  appendToCSV,
  validateCSVData,
  sanitizeCSVData
};
