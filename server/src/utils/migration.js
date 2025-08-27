const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { getDatabase } = require('../config/database');

class Migration {
  constructor() {
    this.db = getDatabase();
  }

  // Inizializza il database e crea le tabelle
  async initializeDatabase() {
    try {
    
      
      // Connetti al database
      await this.db.connect();
      
      // Rimuovi le tabelle esistenti per un setup pulito
  
      const dropQueries = [
        'DROP TABLE IF EXISTS asta_storico',
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
        'DROP INDEX IF EXISTS idx_quotazioni_fonte',
        'DROP INDEX IF EXISTS idx_wishlist_giocatore',
        'DROP INDEX IF EXISTS idx_acquisti_squadra',
        'DROP INDEX IF EXISTS idx_acquisti_giocatore',
        'DROP INDEX IF EXISTS idx_squadre_nome'
      ];
      
      for (const query of dropIndexes) {
        await this.db.run(query);
      }
      
      // Leggi e esegui lo schema
      const schemaPath = path.join(__dirname, '..', 'config', 'schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      
      // Parsing semplice ma efficace per SQLite
  
      
      // Rimuovi commenti
      const cleanSchema = schema.replace(/--.*$/gm, '');
      
      // Dividi in singole istruzioni SQL
      const statements = [];
      let currentStatement = '';
      let inTrigger = false;
      
      const lines = cleanSchema.split('\n');
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;
        
        currentStatement += line + '\n';
        
        // Controlla se siamo in un trigger
        if (trimmedLine.includes('CREATE TRIGGER')) {
          inTrigger = true;
        }
        
        // Se non siamo in un trigger, cerca la fine dell'istruzione
        if (!inTrigger && trimmedLine.endsWith(';')) {
          statements.push(currentStatement.trim());
          currentStatement = '';
        }
        
        // Se siamo in un trigger, cerca END;
        if (inTrigger && trimmedLine === 'END;') {
          statements.push(currentStatement.trim());
          currentStatement = '';
          inTrigger = false;
        }
      }
      
      // Aggiungi l'ultima istruzione se rimane
      if (currentStatement.trim()) {
        statements.push(currentStatement.trim());
      }
      
      // Esegui le istruzioni
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await this.db.run(statement);
          } catch (error) {
            console.error('❌ Errore esecuzione query:', error.message);
            console.error('Query problematica:', statement.substring(0, 100) + '...');
            throw error;
          }
        }
      }
      
  
      return true;
    } catch (error) {
      console.error('❌ Errore inizializzazione database:', error);
      throw error;
    }
  }

  // Migra i dati dai CSV al database
  async migrateFromCSV() {
    try {
  
      
      // Migra giocatori dalle quotazioni 2025
      await this.migrateGiocatoriFromQuotazioni();
      
      // Crea squadre di esempio
      await this.createSampleSquadre();
      
  
      return true;
    } catch (error) {
      console.error('❌ Errore migrazione:', error);
      throw error;
    }
  }

  // Migra giocatori dal file quotazioni 2025
  async migrateGiocatoriFromQuotazioni() {
    const dataDir = path.join(__dirname, '..', '..', '..', 'data');
    const filePath = path.join(dataDir, 'Quotazioni_fantacalcio_2025.csv');
    
    if (!fs.existsSync(filePath)) {
  
      return;
    }


    
    const giocatori = await this.readCSV(filePath);
    
    for (const row of giocatori) {
      const id = `${row.Nome?.replace(/\s+/g, '_')}_${row.Squadra?.replace(/\s+/g, '_')}`.toLowerCase();
      
      // Determina il ruolo dal campo R (Ruolo)
      let ruolo = '';
      switch (row.R?.toLowerCase()) {
        case 'p':
          ruolo = 'portiere';
          break;
        case 'd':
          ruolo = 'difensore';
          break;
        case 'c':
          ruolo = 'centrocampista';
          break;
        case 'a':
          ruolo = 'attaccante';
          break;
        default:
          ruolo = 'non specificato';
      }
      
      // Solo i campi base, senza quotazioni
      await this.db.run(`
        INSERT OR REPLACE INTO giocatori (
          id, nome, squadra, ruolo, fantasquadra, status
        ) VALUES (?, ?, ?, ?, ?, ?)
      `, [
        id,
        row.Nome || '',
        row.Squadra || '',
        ruolo,
        null, // fantasquadra default null
        'disponibile'
      ]);
    }
    

  }



  // Crea squadre di esempio
  async createSampleSquadre() {

    
    const squadreEsempio = [
      { nome: 'I Fenomeni', proprietario: 'Mario Rossi' },
      { nome: 'Dream Team', proprietario: 'Luca Bianchi' },
      { nome: 'Gli Invincibili', proprietario: 'Paolo Verdi' },
      { nome: 'Fantasia FC', proprietario: 'Andrea Neri' }
    ];

    for (const squadra of squadreEsempio) {
      try {
        await this.db.run(`
          INSERT OR IGNORE INTO squadre (nome, proprietario, budget, budget_residuo)
          VALUES (?, ?, 500, 500)
        `, [squadra.nome, squadra.proprietario]);
      } catch (error) {
        // Ignora errori di duplicati
      }
    }
    

  }

  // Utility per leggere CSV
  readCSV(filePath) {
    return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', reject);
    });
  }

  // Reset completo del database
  async resetDatabase() {
    try {
  
      
      // Connetti al database se non è già connesso
      if (!this.db.db) {
        await this.db.connect();
      }
      
      const tables = ['asta_storico', 'acquisti', 'wishlist', 'squadre', 'giocatori'];
      
      for (const table of tables) {
        await this.db.run(`DELETE FROM ${table}`);
      }
      
  
      return true;
    } catch (error) {
      console.error('❌ Errore reset database:', error);
      throw error;
    }
  }
}

module.exports = Migration;