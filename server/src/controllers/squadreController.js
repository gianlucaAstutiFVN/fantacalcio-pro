const squadreService = require('../services/squadreService');

class SquadreController {
  // GET /api/squadre - Lista tutte le squadre
  async getAllSquadre(req, res) {
    try {
      const squadre = await squadreService.getAllSquadre();
      
      res.json({
        success: true,
        count: squadre.length,
        data: squadre
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Errore interno del server'
      });
    }
  }

  // GET /api/squadre/:id - Squadra specifica
  async getSquadraById(req, res) {
    try {
      const { id } = req.params;
      const squadra = await squadreService.getSquadraById(id);
      
      if (!squadra) {
        return res.status(404).json({
          success: false,
          error: 'Squadra non trovata'
        });
      }
      
      res.json({
        success: true,
        data: squadra
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Errore interno del server'
      });
    }
  }

  // POST /api/squadre - Crea nuova squadra
  async createSquadra(req, res) {
    try {
      const { nome, proprietario, budget } = req.body;
      
      if (!nome || !proprietario) {
        return res.status(400).json({
          success: false,
          error: 'Nome e proprietario sono obbligatori'
        });
      }
      
      const squadraId = await squadreService.createSquadra({
        nome,
        proprietario,
        budget: budget || 500
      });
      
      res.status(201).json({
        success: true,
        message: 'Squadra creata con successo',
        data: { id: squadraId, nome, proprietario, budget: budget || 500 }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Errore interno del server'
      });
    }
  }

  // PUT /api/squadre/:id - Aggiorna squadra
  async updateSquadra(req, res) {
    try {
      const { id } = req.params;
      const { nome, proprietario, budget, budget_residuo } = req.body;
      
      if (!nome || !proprietario) {
        return res.status(400).json({
          success: false,
          error: 'Nome e proprietario sono obbligatori'
        });
      }
      
      const success = await squadreService.updateSquadra(id, {
        nome,
        proprietario,
        budget,
        budget_residuo
      });
      
      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Squadra non trovata'
        });
      }
      
      res.json({
        success: true,
        message: 'Squadra aggiornata con successo',
        data: { id, nome, proprietario, budget, budget_residuo }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Errore interno del server'
      });
    }
  }

  // DELETE /api/squadre/:id - Elimina squadra
  async deleteSquadra(req, res) {
    try {
      const { id } = req.params;
      const success = await squadreService.deleteSquadra(id);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Squadra non trovata'
        });
      }
      
      res.json({
        success: true,
        message: 'Squadra eliminata con successo. I giocatori sono stati rimessi disponibili.',
        data: { squadraId: id }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Errore interno del server'
      });
    }
  }

  // WISHLIST GLOBALE
  // POST /api/squadre/wishlist - Aggiungi giocatore alla wishlist
  async addToWishlist(req, res) {
    try {
      const { giocatoreId } = req.body;
      
      if (!giocatoreId) {
        return res.status(400).json({
          success: false,
          error: 'giocatoreId è obbligatorio'
        });
      }
      
      const success = await squadreService.addToWishlist(giocatoreId);
      
      if (!success) {
        return res.status(400).json({
          success: false,
          error: 'Giocatore già in wishlist'
        });
      }
      
      res.json({
        success: true,
        message: 'Giocatore aggiunto alla wishlist',
        data: { giocatoreId }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Errore interno del server'
      });
    }
  }

  // GET /api/squadre/wishlist - Ottieni wishlist globale
  async getWishlist(req, res) {
    try {
      const wishlist = await squadreService.getWishlist();
      
      res.json({
        success: true,
        count: wishlist.length,
        data: wishlist
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Errore interno del server'
      });
    }
  }

  // DELETE /api/squadre/wishlist/:giocatoreId - Rimuovi giocatore dalla wishlist
  async removeFromWishlist(req, res) {
    try {
      const { giocatoreId } = req.params;
      const success = await squadreService.removeFromWishlist(giocatoreId);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Giocatore non trovato nella wishlist'
        });
      }
      
      res.json({
        success: true,
        message: 'Giocatore rimosso dalla wishlist',
        data: { giocatoreId }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Errore interno del server'
      });
    }
  }

  // ACQUISTI
  // POST /api/squadre/:id/acquista - Acquista giocatore
  async acquistaGiocatore(req, res) {
    try {
      const { id: squadraId } = req.params;
      const { giocatoreId, prezzo } = req.body;
      
      if (!giocatoreId || !prezzo) {
        return res.status(400).json({
          success: false,
          error: 'giocatoreId e prezzo sono obbligatori'
        });
      }
      
      if (prezzo <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Il prezzo deve essere maggiore di zero'
        });
      }
      
      await squadreService.acquistaGiocatore(giocatoreId, squadraId, prezzo);
      
      res.json({
        success: true,
        message: 'Giocatore acquistato con successo',
        data: { giocatoreId, squadraId, prezzo }
      });
    } catch (error) {
      if (error.message === 'Giocatore non disponibile') {
        return res.status(400).json({
          success: false,
          error: 'Giocatore non disponibile'
        });
      }
      
      if (error.message === 'Budget insufficiente') {
        return res.status(400).json({
          success: false,
          error: 'Budget insufficiente'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Errore interno del server'
      });
    }
  }

  // POST /api/squadre/assegna-giocatore - Assegna giocatore a squadra (generico)
  async assegnaGiocatore(req, res) {
    try {
      const { giocatoreId, squadraId, prezzo } = req.body;
      
      // Validazione input
      if (!giocatoreId || !squadraId || !prezzo) {
        return res.status(400).json({
          success: false,
          error: 'giocatoreId, squadraId e prezzo sono obbligatori'
        });
      }
      
      if (prezzo <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Il prezzo deve essere maggiore di zero'
        });
      }
      
      // Verifica esistenza squadra
      const squadra = await squadreService.getSquadraById(squadraId);
      if (!squadra) {
        return res.status(404).json({
          success: false,
          error: 'Squadra non trovata'
        });
      }
      
      // Verifica esistenza giocatore
      const giocatore = await squadreService.getGiocatoreById(giocatoreId);
      if (!giocatore) {
        return res.status(404).json({
          success: false,
          error: 'Giocatore non trovato'
        });
      }
      
      // Verifica disponibilità giocatore
      if (giocatore.status !== 'disponibile') {
        return res.status(409).json({
          success: false,
          error: 'Giocatore non disponibile per l\'acquisto'
        });
      }
      
      // Verifica budget squadra
      if (squadra.budget_residuo < prezzo) {
        return res.status(409).json({
          success: false,
          error: `Budget insufficiente. La squadra ha €${squadra.budget_residuo} disponibili`
        });
      }
      
      // Esegui l'assegnazione
      await squadreService.assegnaGiocatore(giocatoreId, squadraId, prezzo);
      
      res.json({
        success: true,
        message: 'Giocatore assegnato con successo alla squadra',
        data: { 
          giocatoreId, 
          squadraId, 
          prezzo,
          budgetRimanente: squadra.budget_residuo - prezzo
        }
      });
    } catch (error) {
      // Gestione errori specifici
      if (error.message.includes('Giocatore non disponibile')) {
        return res.status(409).json({
          success: false,
          error: 'Giocatore non disponibile per l\'acquisto'
        });
      }
      
      if (error.message.includes('Budget insufficiente')) {
        return res.status(409).json({
          success: false,
          error: error.message
        });
      }
      
      if (error.message.includes('Giocatore non trovato')) {
        return res.status(404).json({
          success: false,
          error: 'Giocatore non trovato'
        });
      }
      
      if (error.message.includes('Squadra non trovata')) {
        return res.status(404).json({
          success: false,
          error: 'Squadra non trovata'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Errore interno del server durante l\'assegnazione',
        message: error.message
      });
    }
  }

  // GET /api/squadre/:id/acquisti - Ottieni acquisti di una squadra
  async getAcquistiSquadra(req, res) {
    try {
      const { id: squadraId } = req.params;
      const acquisti = await squadreService.getAcquistiSquadra(squadraId);
      
      res.json({
        success: true,
        count: acquisti.length,
        data: acquisti
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Errore interno del server'
      });
    }
  }

  // POST /api/squadre/svincola-giocatore - Svincola giocatore da squadra
  async svincolaGiocatore(req, res) {
    try {
      const { giocatoreId, squadraId } = req.body;
      
      // Validazione input
      if (!giocatoreId || !squadraId) {
        return res.status(400).json({
          success: false,
          error: 'giocatoreId e squadraId sono obbligatori'
        });
      }
      
      // Verifica esistenza squadra
      const squadra = await squadreService.getSquadraById(squadraId);
      if (!squadra) {
        return res.status(404).json({
          success: false,
          error: 'Squadra non trovata'
        });
      }
      
      // Verifica esistenza giocatore
      const giocatore = await squadreService.getGiocatoreById(giocatoreId);
      if (!giocatore) {
        return res.status(404).json({
          success: false,
          error: 'Giocatore non trovato'
        });
      }
      
      // Verifica che il giocatore sia assegnato alla squadra
      if (giocatore.status !== 'acquistato' || giocatore.fantasquadra != squadraId) {
        return res.status(409).json({
          success: false,
          error: 'Giocatore non assegnato a questa squadra'
        });
      }
      
      // Esegui lo svincolo
      const risultato = await squadreService.svincolaGiocatore(giocatoreId, squadraId);
      
      res.json({
        success: true,
        message: 'Giocatore svincolato con successo',
        data: risultato
      });
    } catch (error) {
      // Gestione errori specifici
      if (error.message.includes('Giocatore non assegnato')) {
        return res.status(409).json({
          success: false,
          error: 'Giocatore non assegnato a questa squadra'
        });
      }
      
      if (error.message.includes('Giocatore non trovato')) {
        return res.status(404).json({
          success: false,
          error: 'Giocatore non trovato'
        });
      }
      
      if (error.message.includes('Squadra non trovata')) {
        return res.status(404).json({
          success: false,
          error: 'Squadra non trovata'
        });
      }
      
      if (error.message.includes('Acquisto non trovato')) {
        return res.status(404).json({
          success: false,
          error: 'Acquisto non trovato'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Errore interno del server durante lo svincolo',
        message: error.message
      });
    }
  }
}

module.exports = new SquadreController();
