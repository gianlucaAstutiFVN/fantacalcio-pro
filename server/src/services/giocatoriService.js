const { getDatabase } = require('../config/database');

class GiocatoriService {
  constructor() {
    this.db = getDatabase();
  }

  // Ottiene tutti i giocatori
  async getAllGiocatori(includeWishlist = false) {
    try {
      await this.db.connect();
      
      let query = `
        SELECT g.id, g.nome, g.squadra, g.ruolo, g.fantasquadra, g.status,
               q.fantacalciopedia, q.pazzidifanta, q.stadiosport, q.unveil, 
               q.gazzetta, q.mia_valutazione, q.note, q.preferito,
               a.prezzo as prezzo_acquisto,
               s.nome as nome_squadra_acquirente
        FROM giocatori g
        LEFT JOIN quotazioni q ON g.id = q.giocatore_id
        LEFT JOIN acquisti a ON g.id = a.giocatore_id
        LEFT JOIN squadre s ON a.squadra_id = s.id
        ORDER BY g.nome
      `;
      
      const giocatori = await this.db.all(query);
      
      if (includeWishlist) {
        for (const giocatore of giocatori) {
          const inWishlist = await this.isInWishlist(giocatore.id);
          giocatore.inWishlist = inWishlist;
          giocatore.wishlistIcon = inWishlist ? '❤️' : '🤍';
        }
      }
      
      return giocatori;
    } catch (error) {
      throw error;
    }
  }

  // Ottiene giocatori per ruolo
  async getGiocatoriByRuolo(ruolo, includeWishlist = false) {
    try {
      await this.db.connect();
      
      let query = `
        SELECT g.id, g.nome, g.squadra, g.ruolo, g.fantasquadra, g.status,
               q.fantacalciopedia, q.pazzidifanta, q.stadiosport, q.unveil, 
               q.gazzetta, q.mia_valutazione, q.note, q.preferito,
               a.prezzo as prezzo_acquisto,
               s.nome as nome_squadra_acquirente
        FROM giocatori g
        LEFT JOIN quotazioni q ON g.id = q.giocatore_id
        LEFT JOIN acquisti a ON g.id = a.giocatore_id
        LEFT JOIN squadre s ON a.squadra_id = s.id
        WHERE g.ruolo = ?
        ORDER BY g.nome
      `;
      
      const giocatori = await this.db.all(query, [ruolo]);
      
      if (includeWishlist) {
        for (const giocatore of giocatori) {
          const inWishlist = await this.isInWishlist(giocatore.id);
          giocatore.inWishlist = inWishlist;
          giocatore.wishlistIcon = inWishlist ? '❤️' : '🤍';
        }
      }
      
      return giocatori;
    } catch (error) {
      throw error;
    }
  }

  // Ottiene giocatori in wishlist
  async getGiocatoriInWishlist() {
    try {
      await this.db.connect();
      
      const query = `
        SELECT g.id, g.nome, g.squadra, g.ruolo, g.fantasquadra, g.status,
               q.fantacalciopedia, q.pazzidifanta, q.stadiosport, q.unveil, 
               q.gazzetta, q.mia_valutazione, q.note, q.preferito,
               a.prezzo as prezzo_acquisto,
               s.nome as nome_squadra_acquirente
        FROM giocatori g
        INNER JOIN wishlist w ON g.id = w.giocatore_id
        LEFT JOIN quotazioni q ON g.id = q.giocatore_id
        LEFT JOIN acquisti a ON g.id = a.giocatore_id
        LEFT JOIN squadre s ON a.squadra_id = s.id
        ORDER BY g.nome
      `;
      
      return await this.db.all(query);
    } catch (error) {
      throw error;
    }
  }

  // Ottiene giocatore per ID
  async getGiocatoreById(id) {
    try {
      await this.db.connect();
      
      const query = `
        SELECT g.id, g.nome, g.squadra, g.ruolo, g.fantasquadra, g.status,
               q.fantacalciopedia, q.pazzidifanta, q.stadiosport, q.unveil, 
               q.gazzetta, q.mia_valutazione, q.note, q.preferito,
               a.prezzo as prezzo_acquisto,
               s.nome as nome_squadra_acquirente
        FROM giocatori g
        LEFT JOIN quotazioni q ON g.id = q.giocatore_id
        LEFT JOIN acquisti a ON g.id = a.giocatore_id
        LEFT JOIN squadre s ON a.squadra_id = s.id
        WHERE g.id = ?
      `;
      
      return await this.db.get(query, [id]);
    } catch (error) {
      throw error;
    }
  }

  // Aggiorna campo note di un giocatore
  async updateNote(id, note) {
    try {
      await this.db.connect();
      
      // Prima controlla se esiste già una riga nella tabella quotazioni
      const existingQuote = await this.db.get(
        'SELECT id FROM quotazioni WHERE giocatore_id = ?',
        [id]
      );
      
      if (existingQuote) {
        // Aggiorna la riga esistente
        const query = `
          UPDATE quotazioni 
          SET note = ?, updated_at = CURRENT_TIMESTAMP
          WHERE giocatore_id = ?
        `;
        
        const result = await this.db.run(query, [note, id]);
        return result.changes > 0;
      } else {
        // Crea una nuova riga nella tabella quotazioni
        const query = `
          INSERT INTO quotazioni (giocatore_id, note, fonte)
          VALUES (?, ?, 'manuale')
        `;
        
        const result = await this.db.run(query, [id, note]);
        return result.changes > 0;
      }
    } catch (error) {
      throw error;
    }
  }

  // Aggiorna fantasquadra di un giocatore
  async updateFantasquadra(id, fantasquadra) {
    try {
      await this.db.connect();
      
      const query = `
        UPDATE giocatori 
        SET fantasquadra = ? 
        WHERE id = ?
      `;
      
      const result = await this.db.run(query, [fantasquadra, id]);
      return result.changes > 0;
    } catch (error) {
      throw error;
    }
  }

  // Aggiorna valutazione di un giocatore
  async updateValutazione(id, valutazione) {
    try {
      await this.db.connect();
      
      // Verifica che il giocatore esista
      const giocatore = await this.db.get('SELECT id FROM giocatori WHERE id = ?', [id]);
      if (!giocatore) {
        return false;
      }

      // Verifica se esiste già una quotazione per questo giocatore
      let quotazione = await this.db.get('SELECT id FROM quotazioni WHERE giocatore_id = ?', [id]);
      
      if (quotazione) {
        // Aggiorna la quotazione esistente
        await this.db.run(
          'UPDATE quotazioni SET mia_valutazione = ?, updated_at = CURRENT_TIMESTAMP WHERE giocatore_id = ?', 
          [valutazione, id]
        );
      } else {
        // Crea una nuova quotazione
        await this.db.run(
          'INSERT INTO quotazioni (giocatore_id, mia_valutazione, created_at, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)', 
          [valutazione, id]
        );
      }
      
      return true;
    } catch (error) {
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
      return false;
    }
  }

  // Importa giocatori da CSV
  async importFromCSV(csvData) {
    try {
      const results = [];
      const errors = [];

      for (const row of csvData) {
        try {
          // Crea ID univoco basato sul nome e squadra
          const id = `${row.Nome?.replace(/\s+/g, '_')}_${row.Squadra?.replace(/\s+/g, '_')}`.toLowerCase();
          
          // Verifica se il giocatore esiste già
          const existingGiocatore = await this.db.get(
            'SELECT * FROM giocatori WHERE id = ?',
            [id]
          );

          // Funzione per preservare valori esistenti se il CSV ha campi vuoti
          const preserveExistingValue = (csvValue, existingValue) => {
            if (csvValue !== null && csvValue !== undefined && csvValue !== '') {
              return csvValue;
            }
            return existingValue;
          };

          // Determina il ruolo dal campo Ruolo o dal nome del file
          let ruolo = row.Ruolo || '';
          if (!ruolo && row.R) {
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
          }

          const giocatoreData = {
            id,
            nome: preserveExistingValue(row.Nome, existingGiocatore?.nome),
            squadra: preserveExistingValue(row.Squadra, existingGiocatore?.squadra),
            ruolo: preserveExistingValue(ruolo, existingGiocatore?.ruolo),
            fantasquadra: preserveExistingValue(row.Fantasquadra, existingGiocatore?.fantasquadra),
            status: preserveExistingValue(row.Status, existingGiocatore?.status) || 'disponibile'
          };

          if (existingGiocatore) {
            // Aggiorna giocatore esistente
            const query = `
              UPDATE giocatori 
              SET nome = ?, squadra = ?, ruolo = ?, fantasquadra = ?, status = ?, updated_at = CURRENT_TIMESTAMP
              WHERE id = ?
            `;
            
            await this.db.run(query, [
              giocatoreData.nome,
              giocatoreData.squadra,
              giocatoreData.ruolo,
              giocatoreData.fantasquadra,
              giocatoreData.status,
              id
            ]);

            results.push({
              giocatore: id,
              action: 'updated',
              data: giocatoreData
            });
          } else {
            // Crea nuovo giocatore
            const query = `
              INSERT INTO giocatori (id, nome, squadra, ruolo, fantasquadra, status)
              VALUES (?, ?, ?, ?, ?, ?)
            `;
            
            await this.db.run(query, [
              giocatoreData.id,
              giocatoreData.nome,
              giocatoreData.squadra,
              giocatoreData.ruolo,
              giocatoreData.fantasquadra,
              giocatoreData.status
            ]);

            results.push({
              giocatore: id,
              action: 'created',
              data: giocatoreData
            });
          }
        } catch (error) {
          errors.push({
            row: row,
            error: error.message
          });
        }
      }

      return {
        success: true,
        message: `Importazione completata: ${results.length} operazioni, ${errors.length} errori`,
        data: {
          results,
          errors,
          summary: {
            total: csvData.length,
            successful: results.length,
            failed: errors.length
          }
        }
      };
    } catch (error) {
      throw new Error('Errore nell\'importazione del CSV giocatori');
    }
  }
}

module.exports = new GiocatoriService();
