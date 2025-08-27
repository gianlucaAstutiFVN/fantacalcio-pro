const QuotazioniService = require('../services/quotazioniService');
const csv = require('csv-parser');
const fs = require('fs');

class QuotazioniController {
    constructor() {
        this.quotazioniService = new QuotazioniService();
    }

    /**
     * GET - Lista tutte le quotazioni
     */
    async getAllQuotazioni(req, res) {
        try {
            const result = await this.quotazioniService.getAllQuotazioni();
            res.json(result);
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || 'Errore interno del server'
            });
        }
    }

    /**
     * GET - Quotazioni per giocatore specifico
     */
    async getQuotazioniByGiocatore(req, res) {
        try {
            const { giocatoreId } = req.params;
            
            if (!giocatoreId) {
                return res.status(400).json({
                    success: false,
                    error: 'ID giocatore richiesto'
                });
            }

            const result = await this.quotazioniService.getQuotazioniByGiocatore(giocatoreId);
            res.json(result);
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || 'Errore interno del server'
            });
        }
    }

    /**
     * GET - Quotazioni con filtri
     */
    async getQuotazioniWithFilters(req, res) {
        try {
            const filters = {
                ruolo: req.query.ruolo,
                squadra: req.query.squadra,
                fonte: req.query.fonte,
                preferito: req.query.preferito !== undefined ? req.query.preferito === 'true' : undefined
            };

            const result = await this.quotazioniService.getQuotazioniWithFilters(filters);
            res.json(result);
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || 'Errore interno del server'
            });
        }
    }

    /**
     * POST - Crea nuova quotazione
     */
    async createQuotazione(req, res) {
        try {
            const {
                giocatore_id,
                fantacalciopedia,
                pazzidifanta,
                stadiosport,
                unveil,
                gazzetta,
                mia_valutazione,
                note,
                preferito,
                fonte
            } = req.body;

            // Validazione campi obbligatori
            if (!giocatore_id) {
                return res.status(400).json({
                    success: false,
                    error: 'giocatore_id è obbligatorio'
                });
            }

            const quotazioneData = {
                giocatore_id,
                fantacalciopedia,
                pazzidifanta,
                stadiosport,
                unveil,
                gazzetta,
                mia_valutazione: mia_valutazione ? parseInt(mia_valutazione) : null,
                note,
                preferito: preferito === true || preferito === 'true' || preferito === 1 ? 1 : 0,
                fonte: fonte || 'manuale'
            };

            const result = await this.quotazioniService.createQuotazione(quotazioneData);
            res.status(201).json(result);
        } catch (error) {
            if (error.message === 'Giocatore non trovato') {
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }

            res.status(500).json({
                success: false,
                error: error.message || 'Errore interno del server'
            });
        }
    }

    /**
     * PUT - Aggiorna quotazione esistente
     */
    async updateQuotazione(req, res) {
        try {
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    error: 'ID quotazione richiesto'
                });
            }

            const {
                fantacalciopedia,
                pazzidifanta,
                stadiosport,
                unveil,
                gazzetta,
                mia_valutazione,
                note,
                preferito,
                fonte
            } = req.body;

            const quotazioneData = {
                fantacalciopedia,
                pazzidifanta,
                stadiosport,
                unveil,
                gazzetta,
                mia_valutazione: mia_valutazione ? parseInt(mia_valutazione) : null,
                note,
                preferito: preferito !== undefined ? (preferito === true || preferito === 'true' || preferito === 1 ? 1 : 0) : undefined,
                fonte
            };

            const result = await this.quotazioniService.updateQuotazione(id, quotazioneData);
            res.json(result);
        } catch (error) {
            if (error.message === 'Quotazione non trovata') {
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }

            res.status(500).json({
                success: false,
                error: error.message || 'Errore interno del server'
            });
        }
    }

    /**
     * DELETE - Elimina quotazione
     */
    async deleteQuotazione(req, res) {
        try {
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    error: 'ID quotazione richiesto'
                });
            }

            const result = await this.quotazioniService.deleteQuotazione(id);
            res.json(result);
        } catch (error) {
            if (error.message === 'Quotazione non trovata') {
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }

            res.status(500).json({
                success: false,
                error: error.message || 'Errore interno del server'
            });
        }
    }

    /**
     * POST - Upload CSV per importazione quotazioni
     */
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
                        const result = await this.quotazioniService.importFromCSV(csvData);
                        res.json(result);
                                        } catch (error) {
            res.status(500).json({
              success: false,
              error: error.message || 'Errore nell\'importazione del CSV'
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
                        error: 'Errore nella lettura del file CSV'
                    });
                });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || 'Errore interno del server'
            });
        }
    }

    /**
     * GET - Statistiche quotazioni
     */
    async getQuotazioniStats(req, res) {
        try {
            // Questa è una versione semplificata, puoi espanderla
            const stats = {
                total_quotazioni: 0,
                per_fonte: {},
                per_ruolo: {},
                aggiornate_ultimo_mese: 0
            };

            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || 'Errore interno del server'
            });
        }
    }
}

module.exports = QuotazioniController;
