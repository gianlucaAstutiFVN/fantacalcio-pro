const { getDatabase } = require('./database');

async function migrateDatabase() {
  const db = getDatabase();
  
  try {
    await db.connect();
    console.log('🔄 Iniziando migrazione database...');
    
    // Verifica se le tabelle esistono
    const tableInfo = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
    const existingTables = tableInfo.map(t => t.name);
    
    console.log('📋 Tabelle esistenti:', existingTables);
    
    // Rimuovi la tabella asta_storico se esiste
    if (existingTables.includes('asta_storico')) {
      console.log('🗑️ Rimuovendo tabella asta_storico obsoleta...');
      await db.run('DROP TABLE IF EXISTS asta_storico');
    }
    
    // Rimuovi la tabella asta se esiste (non più necessaria)
    if (existingTables.includes('asta')) {
      console.log('🗑️ Rimuovendo tabella asta obsoleta...');
      await db.run('DROP TABLE IF EXISTS asta');
    }
    
    // Verifica se la tabella quotazioni esiste
    if (!existingTables.includes('quotazioni')) {
      console.log('➕ Creando tabella quotazioni...');
      await db.run(`
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
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Crea indici per quotazioni
      await db.run('CREATE INDEX IF NOT EXISTS idx_quotazioni_giocatore ON quotazioni(giocatore_id)');
      
      // Crea trigger per quotazioni
      await db.run(`
        CREATE TRIGGER IF NOT EXISTS update_quotazioni_timestamp 
          AFTER UPDATE ON quotazioni
          BEGIN
            UPDATE quotazioni SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
          END
      `);
      
      console.log('✅ Tabella quotazioni creata con successo');
    } else {
      // Verifica se le colonne esistono già nella tabella quotazioni
      const quotazioniTableInfo = await db.all("PRAGMA table_info(quotazioni)");
      const existingColumns = quotazioniTableInfo.map(col => col.name);
      
      console.log('📋 Colonne esistenti in quotazioni:', existingColumns);
      
      // Rimuovi le colonne obsolete se esistono
      const obsoleteColumns = ['pazzidifanta', 'fantacalciopedia', 'stadiosport', 'unveil', 'unveil_fvm', 'gazzetta_fascia', 'fonte'];
      const hasObsoleteColumns = obsoleteColumns.some(col => existingColumns.includes(col));
      
      if (hasObsoleteColumns) {
        console.log('🗑️ Rimuovendo colonne obsolete da quotazioni...');
        // SQLite non supporta DROP COLUMN direttamente, quindi ricreiamo la tabella
        await db.run('BEGIN TRANSACTION');
        
        try {
          // Crea tabella temporanea con nuova struttura
          await db.run(`
            CREATE TABLE quotazioni_new (
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
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
          `);
          
          // Copia i dati esistenti (escludendo le colonne obsolete)
          await db.run(`
            INSERT INTO quotazioni_new (
              id, giocatore_id, gazzetta, mia_valutazione, note, preferito, created_at, updated_at
            )
            SELECT 
              id, giocatore_id, gazzetta, mia_valutazione, note, preferito, created_at, updated_at
            FROM quotazioni
          `);
          
          // Rimuovi tabella vecchia e rinomina la nuova
          await db.run('DROP TABLE quotazioni');
          await db.run('ALTER TABLE quotazioni_new RENAME TO quotazioni');
          
          // Ricrea gli indici
          await db.run('CREATE INDEX IF NOT EXISTS idx_quotazioni_giocatore ON quotazioni(giocatore_id)');
          
          // Ricrea i trigger
          await db.run(`
            CREATE TRIGGER IF NOT EXISTS update_quotazioni_timestamp 
              AFTER UPDATE ON quotazioni
              BEGIN
                UPDATE quotazioni SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
              END
          `);
          
          await db.run('COMMIT');
          console.log('✅ Colonne obsolete rimosse con successo da quotazioni');
        } catch (error) {
          await db.run('ROLLBACK');
          throw error;
        }
      }
      
      // Aggiungi le nuove colonne se non esistono
      if (!existingColumns.includes('fascia')) {
        console.log('➕ Aggiungendo colonna fascia...');
        await db.run('ALTER TABLE quotazioni ADD COLUMN fascia TEXT');
      }
      
      if (!existingColumns.includes('consiglio')) {
        console.log('➕ Aggiungendo colonna consiglio...');
        await db.run('ALTER TABLE quotazioni ADD COLUMN consiglio TEXT');
      }
      
      
      // La colonna voto viene creata automaticamente quando ricreiamo la tabella
      // quindi non dobbiamo aggiungerla qui
    }
    
    // Assicurati che tutte le altre tabelle necessarie esistano
    if (!existingTables.includes('giocatori')) {
      console.log('➕ Creando tabella giocatori...');
      await db.run(`
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
      
      // Crea indici per giocatori
      await db.run('CREATE INDEX IF NOT EXISTS idx_giocatori_squadra ON giocatori(squadra)');
      await db.run('CREATE INDEX IF NOT EXISTS idx_giocatori_ruolo ON giocatori(ruolo)');
      await db.run('CREATE INDEX IF NOT EXISTS idx_giocatori_status ON giocatori(status)');
      
      // Crea trigger per giocatori
      await db.run(`
        CREATE TRIGGER IF NOT EXISTS update_giocatori_timestamp 
          AFTER UPDATE ON giocatori
          BEGIN
            UPDATE giocatori SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
          END
      `);
    }
    
    if (!existingTables.includes('squadre')) {
      console.log('➕ Creando tabella squadre...');
      await db.run(`
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
      
      // Crea indici per squadre
      await db.run('CREATE INDEX IF NOT EXISTS idx_squadre_nome ON squadre(nome)');
      
      // Crea trigger per squadre
      await db.run(`
        CREATE TRIGGER IF NOT EXISTS update_squadre_timestamp 
          AFTER UPDATE ON squadre
          BEGIN
            UPDATE squadre SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
          END
      `);
    }
    
    if (!existingTables.includes('wishlist')) {
      console.log('➕ Creando tabella wishlist...');
      await db.run(`
        CREATE TABLE wishlist (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          giocatore_id TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Crea indici per wishlist
      await db.run('CREATE INDEX IF NOT EXISTS idx_wishlist_giocatore ON wishlist(giocatore_id)');
    }
    
    if (!existingTables.includes('acquisti')) {
      console.log('➕ Creando tabella acquisti...');
      await db.run(`
        CREATE TABLE acquisti (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          giocatore_id TEXT NOT NULL,
          squadra_id INTEGER NOT NULL,
          prezzo INTEGER NOT NULL,
          data_acquisto DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Crea indici per acquisti
      await db.run('CREATE INDEX IF NOT EXISTS idx_acquisti_squadra ON acquisti(squadra_id)');
      await db.run('CREATE INDEX IF NOT EXISTS idx_acquisti_giocatore ON acquisti(giocatore_id)');
    }
    
    console.log('✅ Migrazione completata con successo!');
    
    // Verifica finale
    const finalTableInfo = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
    const finalTables = finalTableInfo.map(t => t.name);
    console.log('📋 Tabelle finali:', finalTables);
    
    if (finalTables.includes('quotazioni')) {
      const finalColumns = await db.all("PRAGMA table_info(quotazioni)");
      const finalColumnNames = finalColumns.map(col => col.name);
      console.log('📋 Struttura finale tabella quotazioni:', finalColumnNames);
    }
    
  } catch (error) {
    console.error('❌ Errore durante la migrazione:', error);
    throw error;
  }
}

module.exports = { migrateDatabase };
