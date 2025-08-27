-- Schema per il database Fantacalcio
-- Versione 3.1 - Schema normalizzato senza duplicazioni

-- Tabella giocatori (solo dati base)
CREATE TABLE IF NOT EXISTS giocatori (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    squadra TEXT NOT NULL,
    ruolo TEXT NOT NULL,
    fantasquadra TEXT,
    status TEXT DEFAULT 'disponibile',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabella quotazioni (gestione separata)
CREATE TABLE IF NOT EXISTS quotazioni (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    giocatore_id TEXT NOT NULL,
    fantacalciopedia TEXT,
    pazzidifanta TEXT,
    stadiosport TEXT,
    unveil TEXT,
    gazzetta TEXT,
    mia_valutazione INTEGER,
    note TEXT,
    preferito BOOLEAN DEFAULT 0,
    fonte TEXT DEFAULT 'manuale',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (giocatore_id) REFERENCES giocatori(id) ON DELETE CASCADE
);

-- Tabella squadre
CREATE TABLE IF NOT EXISTS squadre (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    proprietario TEXT NOT NULL,
    budget INTEGER DEFAULT 500,
    budget_residuo INTEGER DEFAULT 500,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabella wishlist globale
CREATE TABLE IF NOT EXISTS wishlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    giocatore_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (giocatore_id) REFERENCES giocatori(id) ON DELETE CASCADE
);

-- Tabella acquisti
CREATE TABLE IF NOT EXISTS acquisti (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    giocatore_id TEXT NOT NULL,
    squadra_id INTEGER NOT NULL,
    prezzo INTEGER NOT NULL,
    data_acquisto DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (giocatore_id) REFERENCES giocatori(id) ON DELETE CASCADE,
    FOREIGN KEY (squadra_id) REFERENCES squadre(id) ON DELETE CASCADE
);

-- Tabella storico aste
CREATE TABLE IF NOT EXISTS asta_storico (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    giocatore_id TEXT NOT NULL,
    squadra_id INTEGER NOT NULL,
    prezzo INTEGER NOT NULL,
    tipo TEXT DEFAULT 'acquisto',
    data_operazione DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (giocatore_id) REFERENCES giocatori(id) ON DELETE CASCADE,
    FOREIGN KEY (squadra_id) REFERENCES squadre(id) ON DELETE CASCADE
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_giocatori_squadra ON giocatori(squadra);
CREATE INDEX IF NOT EXISTS idx_giocatori_ruolo ON giocatori(ruolo);
CREATE INDEX IF NOT EXISTS idx_giocatori_status ON giocatori(status);
CREATE INDEX IF NOT EXISTS idx_quotazioni_giocatore ON quotazioni(giocatore_id);
CREATE INDEX IF NOT EXISTS idx_quotazioni_fonte ON quotazioni(fonte);
CREATE INDEX IF NOT EXISTS idx_wishlist_giocatore ON wishlist(giocatore_id);

CREATE INDEX IF NOT EXISTS idx_acquisti_squadra ON acquisti(squadra_id);
CREATE INDEX IF NOT EXISTS idx_acquisti_giocatore ON acquisti(giocatore_id);
CREATE INDEX IF NOT EXISTS idx_squadre_nome ON squadre(nome);

-- Trigger per aggiornare updated_at
CREATE TRIGGER IF NOT EXISTS update_giocatori_timestamp 
    AFTER UPDATE ON giocatori
    BEGIN
        UPDATE giocatori SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_quotazioni_timestamp 
    AFTER UPDATE ON quotazioni
    BEGIN
        UPDATE quotazioni SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_squadre_timestamp 
    AFTER UPDATE ON squadre
    BEGIN
        UPDATE squadre SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;


