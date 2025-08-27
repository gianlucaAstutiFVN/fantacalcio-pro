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
      console.error('❌ Errore getAllGiocatori:', error);
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
      console.error('❌ Errore getGiocatoriByRuolo:', error);
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
      console.error('❌ Errore getGiocatoriInWishlist:', error);
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
      console.error('❌ Errore getGiocatoreById:', error);
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
      console.error('❌ Errore updateNote:', error);
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
      console.error('❌ Errore updateFantasquadra:', error);
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
}

module.exports = new GiocatoriService();
