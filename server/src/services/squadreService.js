const { getDatabase } = require('../config/database');

class SquadreService {
  constructor() {
    this.db = getDatabase();
  }

  // Ottiene tutte le squadre
  async getAllSquadre() {
    try {
      await this.db.connect();
      
      // Prima ottieni tutte le squadre
      const squadreQuery = `
        SELECT id, nome, proprietario, budget, budget_residuo, created_at
        FROM squadre 
        ORDER BY nome
      `;
      
      const squadre = await this.db.all(squadreQuery);
      
      // Per ogni squadra, ottieni i giocatori assegnati
      for (const squadra of squadre) {
        const giocatoriQuery = `
          SELECT 
            g.id,
            g.nome,
            g.squadra as squadra_giocatore,
            g.ruolo,
            a.prezzo as valore,
            a.data_acquisto,
            q.mia_valutazione,
            q.unveil,
            q.gazzetta,
            q.pazzidifanta,
            q.note
          FROM acquisti a
          JOIN giocatori g ON a.giocatore_id = g.id
          LEFT JOIN quotazioni q ON g.id = q.giocatore_id
          WHERE a.squadra_id = ?
          ORDER BY g.ruolo, g.nome
        `;
        
        const giocatori = await this.db.all(giocatoriQuery, [squadra.id]);
        
        // Calcola il budget residuo basato sui giocatori assegnati
        const spesaTotale = giocatori.reduce((sum, g) => sum + (g.valore || 0), 0);
        squadra.budget_residuo = squadra.budget - spesaTotale;
        squadra.giocatori = giocatori;
        squadra.spesaTotale = spesaTotale;
        
        // Debug: log per verificare i giocatori di ogni squadra
        if (giocatori.length > 0) {
          console.log(`🏆 Squadra ${squadra.nome}: ${giocatori.length} giocatori`)
          giocatori.forEach(g => {
            console.log(`  - ${g.nome} (${g.ruolo}) - €${g.valore}`)
          })
        }
      }
      
      return squadre;
    } catch (error) {
      console.error('❌ Errore getAllSquadre:', error);
      throw error;
    }
  }

  // Ottiene squadra per ID
  async getSquadraById(id) {
    try {
      await this.db.connect();
      
      // Prima ottieni la squadra
      const squadraQuery = `
        SELECT id, nome, proprietario, budget, budget_residuo, created_at
        FROM squadre 
        WHERE id = ?
      `;
      
      const squadra = await this.db.get(squadraQuery, [id]);
      if (!squadra) return null;
      
      // Ottieni i giocatori assegnati
      const giocatoriQuery = `
        SELECT 
          g.id,
          g.nome,
          g.squadra as squadra_giocatore,
          g.ruolo,
          a.prezzo as valore,
          a.data_acquisto,
          q.mia_valutazione,
          q.unveil,
          q.gazzetta,
          q.pazzidifanta,
          q.note
        FROM acquisti a
        JOIN giocatori g ON a.giocatore_id = g.id
        LEFT JOIN quotazioni q ON g.id = q.giocatore_id
        WHERE a.squadra_id = ?
        ORDER BY g.ruolo, g.nome
      `;
      
      const giocatori = await this.db.all(giocatoriQuery, [id]);
      
      // Calcola il budget residuo basato sui giocatori assegnati
      const spesaTotale = giocatori.reduce((sum, g) => sum + (g.valore || 0), 0);
      squadra.budget_residuo = squadra.budget - spesaTotale;
      squadra.giocatori = giocatori;
      squadra.spesaTotale = spesaTotale;
      
      return squadra;
    } catch (error) {
      console.error('❌ Errore getSquadraById:', error);
      throw error;
    }
  }

  // Crea nuova squadra
  async createSquadra(squadraData) {
    try {
      await this.db.connect();
      
      const query = `
        INSERT INTO squadre (nome, proprietario, budget, budget_residuo)
        VALUES (?, ?, ?, ?)
      `;
      
      const result = await this.db.run(query, [
        squadraData.nome,
        squadraData.proprietario,
        squadraData.budget || 500,
        squadraData.budget || 500
      ]);
      
      return result.lastID;
    } catch (error) {
      console.error('❌ Errore createSquadra:', error);
      throw error;
    }
  }

  // Aggiorna squadra
  async updateSquadra(id, squadraData) {
    try {
      await this.db.connect();
      
      const query = `
        UPDATE squadre 
        SET nome = ?, proprietario = ?, budget = ?, budget_residuo = ?
        WHERE id = ?
      `;
      
      const result = await this.db.run(query, [
        squadraData.nome,
        squadraData.proprietario,
        squadraData.budget,
        squadraData.budget_residuo,
        id
      ]);
      
      return result.changes > 0;
    } catch (error) {
      console.error('❌ Errore updateSquadra:', error);
      throw error;
    }
  }

  // Elimina squadra
  async deleteSquadra(id) {
    try {
      await this.db.connect();
      
      // Prima ottieni la squadra per verificare che esista
      const squadra = await this.db.get('SELECT nome FROM squadre WHERE id = ?', [id]);
      if (!squadra) {
        return false;
      }
      
      // Ottieni tutti i giocatori assegnati a questa squadra
      const giocatoriAssegnati = await this.db.all(`
        SELECT g.id, g.nome 
        FROM acquisti a
        JOIN giocatori g ON a.giocatore_id = g.id
        WHERE a.squadra_id = ?
      `, [id]);
      
      // Inizia transazione per operazioni atomiche
      await this.db.run('BEGIN TRANSACTION');
      
      try {
        // 1. Rimetti tutti i giocatori come "disponibili"
        if (giocatoriAssegnati.length > 0) {
          for (const giocatore of giocatoriAssegnati) {
            await this.db.run(
              'UPDATE giocatori SET status = ?, fantasquadra = NULL WHERE id = ?',
              ['disponibile', giocatore.id]
            );
            console.log(`🔄 Giocatore ${giocatore.nome} rimesso disponibile`);
          }
        }
        
        // 2. Elimina tutti i record di acquisto
        await this.db.run('DELETE FROM acquisti WHERE squadra_id = ?', [id]);
        
        // 3. Elimina eventuali record dalla wishlist per i giocatori che erano assegnati
        if (giocatoriAssegnati.length > 0) {
          const giocatoriIds = giocatoriAssegnati.map(g => g.id);
          const placeholders = giocatoriIds.map(() => '?').join(',');
          await this.db.run(`DELETE FROM wishlist WHERE giocatore_id IN (${placeholders})`, giocatoriIds);
        }
        
        // 4. Elimina la squadra
        const result = await this.db.run('DELETE FROM squadre WHERE id = ?', [id]);
        
        await this.db.run('COMMIT');
        
        console.log(`✅ Squadra ${squadra.nome} eliminata con successo`);
        console.log(`📊 ${giocatoriAssegnati.length} giocatori rimessi disponibili`);
        
        return result.changes > 0;
      } catch (error) {
        await this.db.run('ROLLBACK');
        throw error;
      }
    } catch (error) {
      console.error('❌ Errore deleteSquadra:', error);
      throw error;
    }
  }

  // WISHLIST GLOBALE
  // Aggiunge giocatore alla wishlist globale
  async addToWishlist(giocatoreId) {
    try {
      await this.db.connect();
      
      // Controlla se il giocatore esiste
      const giocatore = await this.db.get('SELECT id FROM giocatori WHERE id = ?', [giocatoreId]);
      if (!giocatore) {
        throw new Error('Giocatore non trovato');
      }
      
      // Controlla se è già in wishlist
      const existing = await this.db.get(
        'SELECT id FROM wishlist WHERE giocatore_id = ?', 
        [giocatoreId]
      );
      
      if (existing) {
        return false; // Già in wishlist
      }
      
      // Aggiungi alla wishlist globale
      const query = `
        INSERT INTO wishlist (giocatore_id, created_at)
        VALUES (?, datetime('now'))
      `;
      
      await this.db.run(query, [giocatoreId]);
      return true;
    } catch (error) {
      console.error('❌ Errore addToWishlist:', error);
      throw error;
    }
  }

  // Rimuove giocatore dalla wishlist globale
  async removeFromWishlist(giocatoreId) {
    try {
      console.log('🔍 Tentativo di rimuovere dalla wishlist:', giocatoreId);
      
      await this.db.connect();
      console.log('✅ Database connesso');
      
      // Prima controlla se il giocatore esiste nella wishlist
      const checkQuery = 'SELECT COUNT(*) as count FROM wishlist WHERE giocatore_id = ?';
      const checkResult = await this.db.get(checkQuery, [giocatoreId]);
      console.log('🔍 Giocatore trovato nella wishlist:', checkResult?.count || 0);
      
      if (!checkResult || checkResult.count === 0) {
        console.log('⚠️ Giocatore non trovato nella wishlist');
        return false;
      }
      
      const query = 'DELETE FROM wishlist WHERE giocatore_id = ?';
      console.log('🗑️ Esecuzione query DELETE:', query, 'con parametro:', giocatoreId);
      
      const result = await this.db.run(query, [giocatoreId]);
      console.log('✅ Risultato DELETE:', result);
      
      return result.changes > 0;
    } catch (error) {
      console.error('❌ Errore removeFromWishlist:', error);
      console.error('❌ Stack trace:', error.stack);
      throw error;
    }
  }

  // Ottiene wishlist globale
  async getWishlist() {
    try {
      await this.db.connect();
      
      const query = `
        SELECT w.id, w.giocatore_id, w.created_at,
               g.nome, g.squadra, g.ruolo
        FROM wishlist w
        INNER JOIN giocatori g ON w.giocatore_id = g.id
        ORDER BY w.created_at DESC
      `;
      
      return await this.db.all(query);
    } catch (error) {
      console.error('❌ Errore getWishlist:', error);
      throw error;
    }
  }

  // Controlla se un giocatore è in wishlist
  async isInWishlist(giocatoreId) {
    try {
      await this.db.connect();
      
      const query = `
        SELECT COUNT(*) as count 
        FROM wishlist 
        WHERE giocatore_id = ?
      `;
      
      const result = await this.db.get(query, [giocatoreId]);
      return result.count > 0;
    } catch (error) {
      console.error('❌ Errore isInWishlist:', error);
      return false;
    }
  }

  // ACQUISTI
  // Acquista giocatore
  async acquistaGiocatore(giocatoreId, squadraId, prezzo) {
    try {
      await this.db.connect();
      
      // Controlla se il giocatore è disponibile
      const giocatore = await this.db.get(
        'SELECT id, status FROM giocatori WHERE id = ?', 
        [giocatoreId]
      );
      
      if (!giocatore || giocatore.status !== 'disponibile') {
        throw new Error('Giocatore non disponibile');
      }
      
      // Controlla budget squadra
      const squadra = await this.db.get(
        'SELECT budget_residuo FROM squadre WHERE id = ?', 
        [squadraId]
      );
      
      if (!squadra || squadra.budget_residuo < prezzo) {
        throw new Error('Budget insufficiente');
      }
      
      // Inizia transazione
      await this.db.run('BEGIN TRANSACTION');
      
      try {
        // Aggiorna status giocatore
        await this.db.run(
          'UPDATE giocatori SET status = ?, fantasquadra = ? WHERE id = ?',
          ['acquistato', squadraId, giocatoreId]
        );
        
        // Aggiorna budget squadra
        await this.db.run(
          'UPDATE squadre SET budget_residuo = budget_residuo - ? WHERE id = ?',
          [prezzo, squadraId]
        );
        
        // Registra acquisto
        await this.db.run(`
          INSERT INTO acquisti (giocatore_id, squadra_id, prezzo, data_acquisto)
          VALUES (?, ?, ?, datetime('now'))
        `, [giocatoreId, squadraId, prezzo]);
        
        // Rimuovi dalla wishlist se presente
        await this.db.run(
          'DELETE FROM wishlist WHERE giocatore_id = ?',
          [giocatoreId]
        );
        
        await this.db.run('COMMIT');
        return true;
      } catch (error) {
        await this.db.run('ROLLBACK');
        throw error;
      }
    } catch (error) {
      console.error('❌ Errore acquistaGiocatore:', error);
      throw error;
    }
  }

  // Ottiene acquisti di una squadra
  async getAcquistiSquadra(squadraId) {
    try {
      await this.db.connect();
      
      const query = `
        SELECT a.id, a.giocatore_id, a.prezzo, a.data_acquisto,
               g.nome, g.squadra, g.ruolo
        FROM acquisti a
        INNER JOIN giocatori g ON a.giocatore_id = g.id
        WHERE a.squadra_id = ?
        ORDER BY a.data_acquisto DESC
      `;
      
      return await this.db.all(query, [squadraId]);
    } catch (error) {
      console.error('❌ Errore getAcquistiSquadra:', error);
      throw error;
    }
  }

  // Ottiene giocatore per ID
  async getGiocatoreById(id) {
    try {
      await this.db.connect();
      
      const query = `
        SELECT id, nome, squadra, ruolo, status, fantasquadra
        FROM giocatori 
        WHERE id = ?
      `;
      
      return await this.db.get(query, [id]);
    } catch (error) {
      console.error('❌ Errore getGiocatoreById:', error);
      throw error;
    }
  }

  // Assegna giocatore a squadra (metodo generico)
  async assegnaGiocatore(giocatoreId, squadraId, prezzo) {
    try {
      await this.db.connect();
      
      // Verifica esistenza giocatore
      const giocatore = await this.db.get(
        'SELECT id, nome, squadra, ruolo, status FROM giocatori WHERE id = ?', 
        [giocatoreId]
      );
      
      if (!giocatore) {
        throw new Error('Giocatore non trovato');
      }
      
      if (giocatore.status !== 'disponibile') {
        throw new Error('Giocatore non disponibile per l\'acquisto');
      }
      
      // Verifica esistenza squadra e budget
      const squadra = await this.db.get(
        'SELECT id, nome, budget, budget_residuo FROM squadre WHERE id = ?', 
        [squadraId]
      );
      
      if (!squadra) {
        throw new Error('Squadra non trovata');
      }
      
      if (squadra.budget_residuo < prezzo) {
        throw new Error(`Budget insufficiente. La squadra ha €${squadra.budget_residuo} disponibili`);
      }
      
      // Inizia transazione
      await this.db.run('BEGIN TRANSACTION');
      
      try {
        // Aggiorna status giocatore
        await this.db.run(
          'UPDATE giocatori SET status = ?, fantasquadra = ? WHERE id = ?',
          ['acquistato', squadraId, giocatoreId]
        );
        
        // Aggiorna budget squadra
        await this.db.run(
          'UPDATE squadre SET budget_residuo = budget_residuo - ? WHERE id = ?',
          [prezzo, squadraId]
        );
        
        // Registra acquisto
        await this.db.run(`
          INSERT INTO acquisti (giocatore_id, squadra_id, prezzo, data_acquisto)
          VALUES (?, ?, ?, datetime('now'))
        `, [giocatoreId, squadraId, prezzo]);
        
        // Rimuovi dalla wishlist se presente
        await this.db.run(
          'DELETE FROM wishlist WHERE giocatore_id = ?',
          [giocatoreId]
        );
        
        await this.db.run('COMMIT');
        
        console.log(`✅ Giocatore ${giocatore.nome} assegnato alla squadra ${squadra.nome} per €${prezzo}`);
        console.log(`📊 Budget residuo squadra: €${squadra.budget_residuo - prezzo}`);
        
        return true;
      } catch (error) {
        await this.db.run('ROLLBACK');
        throw error;
      }
    } catch (error) {
      console.error('❌ Errore assegnaGiocatore:', error);
      throw error;
    }
  }

  // Svincola giocatore da squadra
  async svincolaGiocatore(giocatoreId, squadraId) {
    try {
      await this.db.connect();
      
      // Verifica esistenza giocatore e che sia assegnato alla squadra
      const giocatore = await this.db.get(
        'SELECT id, nome, squadra, ruolo, status, fantasquadra FROM giocatori WHERE id = ?', 
        [giocatoreId]
      );
      
      if (!giocatore) {
        throw new Error('Giocatore non trovato');
      }
      
      if (giocatore.status !== 'acquistato' || giocatore.fantasquadra != squadraId) {
        throw new Error('Giocatore non assegnato a questa squadra');
      }
      
      // Verifica esistenza squadra
      const squadra = await this.db.get(
        'SELECT id, nome, budget, budget_residuo FROM squadre WHERE id = ?', 
        [squadraId]
      );
      
      if (!squadra) {
        throw new Error('Squadra non trovata');
      }
      
      // Ottieni il prezzo di acquisto del giocatore
      const acquisto = await this.db.get(
        'SELECT prezzo FROM acquisti WHERE giocatore_id = ? AND squadra_id = ?',
        [giocatoreId, squadraId]
      );
      
      if (!acquisto) {
        throw new Error('Acquisto non trovato');
      }
      
      const prezzoRimborso = acquisto.prezzo;
      
      // Inizia transazione
      await this.db.run('BEGIN TRANSACTION');
      
      try {
        // Aggiorna status giocatore (rimetti disponibile)
        await this.db.run(
          'UPDATE giocatori SET status = ?, fantasquadra = NULL WHERE id = ?',
          ['disponibile', giocatoreId]
        );
        
        // Aggiorna budget squadra (restituisci i crediti)
        await this.db.run(
          'UPDATE squadre SET budget_residuo = budget_residuo + ? WHERE id = ?',
          [prezzoRimborso, squadraId]
        );
        
        // Elimina record di acquisto
        await this.db.run(
          'DELETE FROM acquisti WHERE giocatore_id = ? AND squadra_id = ?',
          [giocatoreId, squadraId]
        );
        
        await this.db.run('COMMIT');
        
        console.log(`🔄 Giocatore ${giocatore.nome} svincolato dalla squadra ${squadra.nome}`);
        console.log(`💰 Budget restituito: €${prezzoRimborso}`);
        console.log(`📊 Nuovo budget residuo squadra: €${squadra.budget_residuo + prezzoRimborso}`);
        
        return {
          success: true,
          giocatore: giocatore.nome,
          squadra: squadra.nome,
          budgetRecuperato: prezzoRimborso,
          nuovoBudgetResiduo: squadra.budget_residuo + prezzoRimborso
        };
      } catch (error) {
        await this.db.run('ROLLBACK');
        throw error;
      }
    } catch (error) {
      console.error('❌ Errore svincolaGiocatore:', error);
      throw error;
    }
  }
}

module.exports = new SquadreService();
