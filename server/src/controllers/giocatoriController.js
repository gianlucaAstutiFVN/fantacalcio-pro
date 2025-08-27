const giocatoriService = require('../services/giocatoriService');
const fs = require('fs');
const csv = require('csv-parser');

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
      res.status(500).json({
        success: false,
        error: 'Errore interno del server'
      });
    }
  }

  // PATCH /api/giocatori/:id/valutazione - Aggiorna valutazione
  async updateValutazione(req, res) {
    try {
      const { id } = req.params;
      const { valutazione } = req.body;
      
      if (valutazione === undefined) {
        return res.status(400).json({
          success: false,
          error: 'Campo "valutazione" richiesto'
        });
      }
      
      // Validazione: la valutazione deve essere un numero tra 1 e 10 o null
      if (valutazione !== null && (isNaN(valutazione) || valutazione < 1 || valutazione > 10)) {
        return res.status(400).json({
          success: false,
          error: 'La valutazione deve essere un numero tra 1 e 10'
        });
      }
      
      const success = await giocatoriService.updateValutazione(id, valutazione);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Giocatore non trovato'
        });
      }
      
      res.json({
        success: true,
        message: 'Valutazione aggiornata con successo',
        data: { id, valutazione }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Errore interno del server'
      });
    }
  }

  // POST - Upload CSV per importazione giocatori
  async uploadCSV(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'File CSV richiesto'
        });
      }

      const csvData = [];
      
      // Leggi il file CSV
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (row) => {
          csvData.push(row);
        })
        .on('end', async () => {
          try {
            // Rimuovi il file temporaneo
            fs.unlinkSync(req.file.path);
            
            // Importa i dati
            const result = await giocatoriService.importFromCSV(csvData);
            res.json(result);
          } catch (error) {
            res.status(500).json({
              success: false,
              error: error.message || 'Errore nell\'importazione del CSV giocatori'
            });
          }
        })
        .on('error', (error) => {
          // Rimuovi il file temporaneo in caso di errore
          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
          
          res.status(400).json({
            success: false,
            error: 'Errore nella lettura del file CSV giocatori'
          });
        });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Errore interno del server'
      });
    }
  }
}

module.exports = new GiocatoriController();
