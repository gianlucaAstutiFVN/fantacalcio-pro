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
      
      // Inizia transazione
      await this.db.run('BEGIN TRANSACTION');
      
      try {
        // Disabilita temporaneamente i controlli delle foreign keys per il ripristino
        await this.db.run('PRAGMA foreign_keys = OFF');
        
        // Ricrea le tabelle
        await this.recreateTables();
        
        // Ripristina i dati
        await this.restoreData(sections);
        
        // Riabilita i controlli delle foreign keys
        await this.db.run('PRAGMA foreign_keys = ON');
        
        // Commit transazione
        await this.db.run('COMMIT');
        
        console.log('✅ Ripristino completato con successo');
        
      } catch (error) {
        // Rollback in caso di errore
        await this.db.run('ROLLBACK');
        throw error;
      }
      
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
    try {
      // Prima rimuovi le tabelle esistenti
      const dropQueries = [
        'DROP TABLE IF EXISTS acquisti',
        'DROP TABLE IF EXISTS wishlist', 
        'DROP TABLE IF EXISTS quotazioni',
        'DROP TABLE IF EXISTS squadre',
        'DROP TABLE IF EXISTS giocatori'
      ];
      
      for (const query of dropQueries) {
        await this.db.run(query);
      }
      
      // Rimuovi trigger esistenti
      await this.db.run('DROP TRIGGER IF EXISTS update_giocatori_timestamp');
      await this.db.run('DROP TRIGGER IF EXISTS update_quotazioni_timestamp');
      await this.db.run('DROP TRIGGER IF EXISTS update_squadre_timestamp');
      
      // Rimuovi indici esistenti
      const dropIndexes = [
        'DROP INDEX IF EXISTS idx_giocatori_squadra',
        'DROP INDEX IF EXISTS idx_giocatori_ruolo',
        'DROP INDEX IF EXISTS idx_giocatori_status',
        'DROP INDEX IF EXISTS idx_quotazioni_giocatore',
        'DROP INDEX IF EXISTS idx_wishlist_giocatore',
        'DROP INDEX IF EXISTS idx_acquisti_squadra',
        'DROP INDEX IF EXISTS idx_acquisti_giocatore',
        'DROP INDEX IF EXISTS idx_squadre_nome'
      ];
      
      for (const query of dropIndexes) {
        await this.db.run(query);
      }
      
      // Ora crea le tabelle una per una
      await this.db.run(`
        CREATE TABLE giocatori (
          id TEXT PRIMARY KEY,
          nome TEXT NOT NULL,
          squadra TEXT NOT NULL,
          ruolo TEXT NOT NULL,
          fantasquadra TEXT,
          status TEXT DEFAULT 'disponibile',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      await this.db.run(`
        CREATE TABLE quotazioni (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          giocatore_id TEXT NOT NULL,
          gazzetta TEXT,
          fascia TEXT,
          consiglio TEXT,
          voto INTEGER,
          mia_valutazione INTEGER,
          note TEXT,
          preferito BOOLEAN DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (giocatore_id) REFERENCES giocatori(id) ON DELETE CASCADE
        )
      `);
      
      await this.db.run(`
        CREATE TABLE squadre (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT NOT NULL,
          proprietario TEXT NOT NULL,
          budget INTEGER DEFAULT 500,
          budget_residuo INTEGER DEFAULT 500,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      await this.db.run(`
        CREATE TABLE wishlist (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          giocatore_id TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (giocatore_id) REFERENCES giocatori(id) ON DELETE CASCADE
        )
      `);
      
      await this.db.run(`
        CREATE TABLE acquisti (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          giocatore_id TEXT NOT NULL,
          squadra_id INTEGER NOT NULL,
          prezzo INTEGER NOT NULL,
          data_acquisto DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (giocatore_id) REFERENCES giocatori(id) ON DELETE CASCADE,
          FOREIGN KEY (squadra_id) REFERENCES squadre(id) ON DELETE CASCADE
        )
      `);
      
      // Crea gli indici
      await this.db.run('CREATE INDEX idx_giocatori_squadra ON giocatori(squadra)');
      await this.db.run('CREATE INDEX idx_giocatori_ruolo ON giocatori(ruolo)');
      await this.db.run('CREATE INDEX idx_giocatori_status ON giocatori(status)');
      await this.db.run('CREATE INDEX idx_quotazioni_giocatore ON quotazioni(giocatore_id)');
      await this.db.run('CREATE INDEX idx_wishlist_giocatore ON wishlist(giocatore_id)');
      await this.db.run('CREATE INDEX idx_acquisti_squadra ON acquisti(squadra_id)');
      await this.db.run('CREATE INDEX idx_acquisti_giocatore ON acquisti(giocatore_id)');
      await this.db.run('CREATE INDEX idx_squadre_nome ON squadre(nome)');
      
      // Crea i trigger
      await this.db.run(`
        CREATE TRIGGER update_giocatori_timestamp 
          AFTER UPDATE ON giocatori
          BEGIN
            UPDATE giocatori SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
          END
      `);
      
      await this.db.run(`
        CREATE TRIGGER update_quotazioni_timestamp 
          AFTER UPDATE ON quotazioni
          BEGIN
            UPDATE quotazioni SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
          END
      `);
      
      await this.db.run(`
        CREATE TRIGGER update_squadre_timestamp 
          AFTER UPDATE ON squadre
          BEGIN
            UPDATE squadre SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
          END
      `);
      
    } catch (error) {
      console.error('Errore nella ricreazione delle tabelle:', error);
      throw error;
    }
  }

  // Ripristina i dati
  async restoreData(sections) {
    // Ordine di inserimento per rispettare le foreign keys
    const order = ['squadre', 'giocatori', 'quotazioni', 'acquisti', 'wishlist'];
    
    // Colonne obsolete da filtrare durante il ripristino
    const obsoleteColumns = ['fonte', 'pazzidifanta', 'fantacalciopedia', 'stadiosport', 'unveil', 'unveil_fvm', 'gazzetta_fascia'];
    
    // Pulisci i dati prima del ripristino
    this.cleanDataForRestore(sections);
    
    // Validazione preliminare delle foreign keys
    await this.validateForeignKeys(sections);
    
    for (const tableName of order) {
      if (sections[tableName] && sections[tableName].data.length > 0) {
        const { headers, data } = sections[tableName];
        
        // Filtra le colonne obsolete
        const validHeaders = headers.filter(header => !obsoleteColumns.includes(header));
        
        console.log(`🔄 Ripristinando tabella ${tableName} con ${data.length} record...`);
        
        let successCount = 0;
        let errorCount = 0;
        
        for (const row of data) {
          try {
            // Filtra i valori per le colonne valide
            const validValues = validHeaders.map(header => row[header]);
            
            if (validHeaders.length > 0) {
              const columns = validHeaders.join(', ');
              const placeholders = validHeaders.map(() => '?').join(', ');
              
              const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
              await this.db.run(query, validValues);
              successCount++;
            }
          } catch (error) {
            console.error(`❌ Errore inserimento in ${tableName}:`, error.message);
            console.error(`Record problematico:`, row);
            errorCount++;
            
            // Se è un errore di foreign key constraint, continua con il prossimo record
            if (error.message.includes('FOREIGN KEY constraint failed')) {
              console.log(`⚠️ Saltando record con foreign key constraint failed`);
              continue;
            }
            
            // Per altri errori, lancia l'eccezione
            throw new Error(`Errore inserimento in ${tableName}: ${error.message}`);
          }
        }
        
        console.log(`📊 ${tableName}: ${successCount} inseriti, ${errorCount} errori`);
        
        console.log(`✅ Ripristinati ${successCount} record per la tabella ${tableName} (colonne valide: ${validHeaders.length}/${headers.length})`);
      }
    }
  }

  // Validazione e pulizia delle foreign keys prima del ripristino
  async validateForeignKeys(sections) {
    console.log('🔍 Validazione e pulizia foreign keys...');
    
    // Raccogli tutti gli ID di giocatori e squadre
    const giocatoriIds = new Set();
    const squadreIds = new Set();
    
    if (sections.giocatori) {
      sections.giocatori.data.forEach(row => {
        if (row.id) giocatoriIds.add(row.id);
      });
    }
    
    if (sections.squadre) {
      sections.squadre.data.forEach(row => {
        if (row.id) squadreIds.add(row.id);
      });
    }
    
    let removedRecords = 0;
    
    // Pulisci acquisti con riferimenti non validi
    if (sections.acquisti) {
      const originalLength = sections.acquisti.data.length;
      sections.acquisti.data = sections.acquisti.data.filter(row => {
        const validGiocatore = !row.giocatore_id || giocatoriIds.has(row.giocatore_id);
        const validSquadra = !row.squadra_id || squadreIds.has(row.squadra_id);
        
        if (!validGiocatore) {
          console.log(`⚠️ Rimuovo acquisto con giocatore_id '${row.giocatore_id}' non trovato`);
        }
        if (!validSquadra) {
          console.log(`⚠️ Rimuovo acquisto con squadra_id '${row.squadra_id}' non trovato`);
        }
        
        return validGiocatore && validSquadra;
      });
      removedRecords += originalLength - sections.acquisti.data.length;
    }
    
    // Pulisci quotazioni con riferimenti non validi
    if (sections.quotazioni) {
      const originalLength = sections.quotazioni.data.length;
      sections.quotazioni.data = sections.quotazioni.data.filter(row => {
        const validGiocatore = !row.giocatore_id || giocatoriIds.has(row.giocatore_id);
        
        if (!validGiocatore) {
          console.log(`⚠️ Rimuovo quotazione con giocatore_id '${row.giocatore_id}' non trovato`);
        }
        
        return validGiocatore;
      });
      removedRecords += originalLength - sections.quotazioni.data.length;
    }
    
    // Pulisci wishlist con riferimenti non validi
    if (sections.wishlist) {
      const originalLength = sections.wishlist.data.length;
      sections.wishlist.data = sections.wishlist.data.filter(row => {
        const validGiocatore = !row.giocatore_id || giocatoriIds.has(row.giocatore_id);
        
        if (!validGiocatore) {
          console.log(`⚠️ Rimuovo wishlist con giocatore_id '${row.giocatore_id}' non trovato`);
        }
        
        return validGiocatore;
      });
      removedRecords += originalLength - sections.wishlist.data.length;
    }
    
    if (removedRecords > 0) {
      console.log(`⚠️ Rimossi ${removedRecords} record con riferimenti non validi`);
    }
    
    console.log('✅ Validazione e pulizia foreign keys completata');
  }

  // Pulisce i dati prima del ripristino
  cleanDataForRestore(sections) {
    console.log('🧹 Pulizia dati per il ripristino...');
    
    // Pulisci il campo fantasquadra nei giocatori
    if (sections.giocatori) {
      sections.giocatori.data.forEach(row => {
        // Se fantasquadra è un numero (ID squadra), lo rimuovi
        if (row.fantasquadra && !isNaN(row.fantasquadra)) {
          row.fantasquadra = null;
        }
        // Se status è "acquistato" ma non c'è fantasquadra, cambia in "disponibile"
        if (row.status === 'acquistato' && !row.fantasquadra) {
          row.status = 'disponibile';
        }
      });
    }
    
    console.log('✅ Pulizia dati completata');
  }
}

module.exports = BackupService;
