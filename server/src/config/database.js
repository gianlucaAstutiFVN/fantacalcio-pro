const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Percorso del database
const DB_PATH = path.join(__dirname, '..', '..', 'data', 'fantacalcio.db');

// Assicurati che la cartella data esista
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Classe per gestire il database
class Database {
  constructor() {
    this.db = null;
  }

  // Connetti al database
  connect() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
          reject(err);
        } else {
          
          // Abilita foreign keys
          this.db.run('PRAGMA foreign_keys = ON');
          resolve(this.db);
        }
      });
    });
  }

  // Disconnetti dal database
  close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  // Esegui query
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  // Ottieni una riga
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Ottieni tutte le righe
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Esegui più query in transazione
  transaction(queries) {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run('BEGIN TRANSACTION');
        
        let results = [];
        let hasError = false;

        const executeQuery = (index) => {
          if (index >= queries.length) {
            if (hasError) {
              this.db.run('ROLLBACK');
              reject(new Error('Transaction rollback'));
            } else {
              this.db.run('COMMIT');
              resolve(results);
            }
            return;
          }

          const { sql, params } = queries[index];
          this.db.run(sql, params, function(err) {
            if (err) {
              hasError = true;
            } else {
              results.push({ id: this.lastID, changes: this.changes });
            }
            executeQuery(index + 1);
          });
        };

        executeQuery(0);
      });
    });
  }
}

// Singleton instance
let dbInstance = null;

const getDatabase = () => {
  if (!dbInstance) {
    dbInstance = new Database();
  }
  return dbInstance;
};

module.exports = {
  Database,
  getDatabase,
  DB_PATH
};
