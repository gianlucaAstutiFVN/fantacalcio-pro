const giocatoriService = require('../services/giocatoriService');

class GiocatoriController {
  // GET /api/giocatori - Lista completa giocatori
  async getAllGiocatori(req, res) {
    try {
      const { withWishlist } = req.query;
      const includeWishlist = withWishlist === 'true';
      
      const giocatori = await giocatoriService.getAllGiocatori(includeWishlist);
      
      res.json({
        success: true,
        count: giocatori.length,
        data: giocatori
      });
    } catch (error) {
      console.error('❌ Errore getAllGiocatori:', error);
      res.status(500).json({
        success: false,
        error: 'Errore interno del server'
      });
    }
  }

  // GET /api/giocatori/:ruolo - Giocatori per ruolo
  async getGiocatoriByRuolo(req, res) {
    try {
      const { ruolo } = req.params;
      const { withWishlist } = req.query;
      const includeWishlist = withWishlist === 'true';
      
      const giocatori = await giocatoriService.getGiocatoriByRuolo(ruolo, includeWishlist);
      
      res.json({
        success: true,
        ruolo,
        count: giocatori.length,
        data: giocatori
      });
    } catch (error) {
      console.error('❌ Errore getGiocatoriByRuolo:', error);
      res.status(500).json({
        success: false,
        error: 'Errore interno del server'
      });
    }
  }

  // GET /api/giocatori/in-wishlist - Giocatori in wishlist
  async getGiocatoriInWishlist(req, res) {
    try {
      const giocatori = await giocatoriService.getGiocatoriInWishlist();
      
      res.json({
        success: true,
        count: giocatori.length,
        data: giocatori
      });
    } catch (error) {
      console.error('❌ Errore getGiocatoriInWishlist:', error);
      res.status(500).json({
        success: false,
        error: 'Errore interno del server'
      });
    }
  }

  // GET /api/giocatori/:id - Giocatore specifico
  async getGiocatoreById(req, res) {
    try {
      const { id } = req.params;
      const giocatore = await giocatoriService.getGiocatoreById(id);
      
      if (!giocatore) {
        return res.status(404).json({
          success: false,
          error: 'Giocatore non trovato'
        });
      }
      
      res.json({
        success: true,
        data: giocatore
      });
    } catch (error) {
      console.error('❌ Errore getGiocatoreById:', error);
      res.status(500).json({
        success: false,
        error: 'Errore interno del server'
      });
    }
  }

  // PATCH /api/giocatori/:id/note - Aggiorna note
  async updateNote(req, res) {
    try {
      const { id } = req.params;
      const { note } = req.body;
      
      if (note === undefined) {
        return res.status(400).json({
          success: false,
          error: 'Campo "note" richiesto'
        });
      }
      
      const success = await giocatoriService.updateNote(id, note);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Giocatore non trovato'
        });
      }
      
      res.json({
        success: true,
        message: 'Note aggiornate con successo',
        data: { id, note }
      });
    } catch (error) {
      console.error('❌ Errore updateNote:', error);
      res.status(500).json({
        success: false,
        error: 'Errore interno del server'
      });
    }
  }

  // PATCH /api/giocatori/:id/fantasquadra - Aggiorna fantasquadra
  async updateFantasquadra(req, res) {
    try {
      const { id } = req.params;
      const { fantasquadra } = req.body;
      
      if (fantasquadra === undefined) {
        return res.status(400).json({
          success: false,
          error: 'Campo "fantasquadra" richiesto'
        });
      }
      
      const success = await giocatoriService.updateFantasquadra(id, fantasquadra);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Giocatore non trovato'
        });
      }
      
      res.json({
        success: true,
        message: 'Fantasquadra aggiornata con successo',
        data: { id, fantasquadra }
      });
    } catch (error) {
      console.error('❌ Errore updateFantasquadra:', error);
      res.status(500).json({
        success: false,
        error: 'Errore interno del server'
      });
    }
  }
}

module.exports = new GiocatoriController();
