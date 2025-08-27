const { getDatabase } = require('../config/database');
const fs = require('fs');
const csv = require('csv-writer');
const path = require('path');

class BackupService {
  constructor() {
    this.db = getDatabase();
  }

  // Crea un backup completo del database
  async createBackup() {
    try {
      await this.db.connect();
      
      // Verifica se le tabelle esistono prima di fare le query
      const tableExists = async (tableName) => {
        try {
          const result = await this.db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`, [tableName]);
          return result !== undefined;
        } catch (error) {
          console.log(`Errore nel controllo della tabella ${tableName}:`, error.message);
          return false;
        }
      };
      
      // Raccogli tutti i dati dal database
      const backupData = {
        giocatori: await tableExists('giocatori') ? await this.db.all('SELECT * FROM giocatori') : [],
        quotazioni: await tableExists('quotazioni') ? await this.db.all('SELECT * FROM quotazioni') : [],
        squadre: await tableExists('squadre') ? await this.db.all('SELECT * FROM squadre') : [],
        acquisti: await tableExists('acquisti') ? await this.db.all('SELECT * FROM acquisti') : [],
        wishlist: await tableExists('wishlist') ? await this.db.all('SELECT * FROM wishlist') : []
      };

      // Converti in formato CSV compatibile
      const csvData = this.convertToCSV(backupData);
      
      // Se non ci sono dati, restituisci un messaggio informativo
      if (csvData.trim() === '# FANTACALCIO BACKUP - ' + new Date().toISOString()) {
        return csvData + '\n\n# Nessun dato presente nel database\n';
      }
      
      return csvData;
    } catch (error) {
      console.error('Errore durante la creazione del backup:', error);
      throw error;
    }
  }

  // Converte i dati in formato CSV
  convertToCSV(data) {
    let csvContent = '';
    
    // Header per identificare le sezioni
    csvContent += '# FANTACALCIO BACKUP - ' + new Date().toISOString() + '\n\n';
    
    // Sezione Giocatori
    if (data.giocatori && data.giocatori.length > 0) {
      csvContent += '# GIOCATORI\n';
      const headers = Object.keys(data.giocatori[0]).join(',');
      csvContent += headers + '\n';
      
      data.giocatori.forEach(giocatore => {
        const values = Object.values(giocatore).map(value => 
          typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(',');
        csvContent += values + '\n';
      });
      csvContent += '\n';
    }

    // Sezione Quotazioni
    if (data.quotazioni && data.quotazioni.length > 0) {
      csvContent += '# QUOTAZIONI\n';
      const headers = Object.keys(data.quotazioni[0]).join(',');
      csvContent += headers + '\n';
      
      data.quotazioni.forEach(quotazione => {
        const values = Object.values(quotazione).map(value => 
          typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(',');
        csvContent += values + '\n';
      });
      csvContent += '\n';
    }

    // Sezione Squadre
    if (data.squadre && data.squadre.length > 0) {
      csvContent += '# SQUADRE\n';
      const headers = Object.keys(data.squadre[0]).join(',');
      csvContent += headers + '\n';
      
      data.squadre.forEach(squadra => {
        const values = Object.values(squadra).map(value => 
          typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(',');
        csvContent += values + '\n';
      });
      csvContent += '\n';
    }

    // Sezione Acquisti
    if (data.acquisti && data.acquisti.length > 0) {
      csvContent += '# ACQUISTI\n';
      const headers = Object.keys(data.acquisti[0]).join(',');
      csvContent += headers + '\n';
      
      data.acquisti.forEach(acquisto => {
        const values = Object.values(acquisto).map(value => 
          typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(',');
        csvContent += values + '\n';
      });
      csvContent += '\n';
    }

    // Sezione Wishlist
    if (data.wishlist && data.wishlist.length > 0) {
      csvContent += '# WISHLIST\n';
      const headers = Object.keys(data.wishlist[0]).join(',');
      csvContent += headers + '\n';
      
      data.wishlist.forEach(item => {
        const values = Object.values(item).map(value => 
          typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(',');
        csvContent += values + '\n';
      });
      csvContent += '\n';
    }



    return csvContent;
  }

  // Ripristina il database da un backup CSV
  async restoreFromBackup(backupFilePath) {
    try {
      await this.db.connect();
      
      // Leggi il file di backup
      const backupContent = fs.readFileSync(backupFilePath, 'utf8');
      
      // Parsing del CSV di backup
      const sections = this.parseBackupCSV(backupContent);
      
      // Ricrea le tabelle
      await this.recreateTables();
      
      // Ripristina i dati
      await this.restoreData(sections);
      
      // Pulisci il file temporaneo
      fs.unlinkSync(backupFilePath);
      
    } catch (error) {
      throw error;
    }
  }

  // Parsing del CSV di backup
  parseBackupCSV(content) {
    const sections = {};
    let currentSection = null;
    let headers = [];
    let data = [];

    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('#')) {
        // Salva la sezione precedente
        if (currentSection && headers.length > 0) {
          sections[currentSection] = { headers, data };
        }
        
        // Nuova sezione
        if (trimmedLine.includes('GIOCATORI')) {
          currentSection = 'giocatori';
        } else if (trimmedLine.includes('QUOTAZIONI')) {
          currentSection = 'quotazioni';
        } else if (trimmedLine.includes('SQUADRE')) {
          currentSection = 'squadre';
        } else if (trimmedLine.includes('ACQUISTI')) {
          currentSection = 'acquisti';
        } else if (trimmedLine.includes('WISHLIST')) {
          currentSection = 'wishlist';
        }
        
        headers = [];
        data = [];
        continue;
      }
      
      if (trimmedLine && currentSection) {
        if (headers.length === 0) {
          // Prima riga non vuota = headers
          headers = trimmedLine.split(',').map(h => h.trim());
        } else {
          // Righe successive = dati
          const values = this.parseCSVLine(trimmedLine);
          if (values.length === headers.length) {
            const row = {};
            headers.forEach((header, index) => {
              let value = values[index];
              // Rimuovi le virgolette se presenti
              if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
              }
              row[header] = value;
            });
            data.push(row);
          }
        }
      }
    }
    
    // Salva l'ultima sezione
    if (currentSection && headers.length > 0) {
      sections[currentSection] = { headers, data };
    }
    
    return sections;
  }

  // Parsing sicuro di una riga CSV
  parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escape delle virgolette
          current += '"';
          i++; // Salta la prossima virgoletta
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    values.push(current.trim());
    return values;
  }

  // Ricrea le tabelle
  async recreateTables() {
    const schemaPath = path.join(__dirname, '..', 'config', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Rimuovi commenti e dividi in istruzioni
    const cleanSchema = schema.replace(/--.*$/gm, '');
    const statements = cleanSchema.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await this.db.run(statement.trim());
      }
    }
  }

  // Ripristina i dati
  async restoreData(sections) {
    // Ordine di inserimento per rispettare le foreign keys
    const order = ['squadre', 'giocatori', 'quotazioni', 'acquisti', 'wishlist'];
    
    for (const tableName of order) {
      if (sections[tableName] && sections[tableName].data.length > 0) {
        const { headers, data } = sections[tableName];
        
        for (const row of data) {
          const columns = headers.join(', ');
          const placeholders = headers.map(() => '?').join(', ');
          const values = headers.map(header => row[header]);
          
          const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
          await this.db.run(query, values);
        }
        
        console.log(`✅ Ripristinati ${data.length} record per la tabella ${tableName}`);
      }
    }
  }
}

module.exports = BackupService;
