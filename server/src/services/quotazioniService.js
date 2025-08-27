const { getDatabase } = require('../config/database');

class QuotazioniService {
    constructor() {
        this.db = getDatabase();
    }

    /**
     * Ottiene tutte le quotazioni con informazioni giocatore
     */
    async getAllQuotazioni() {
        try {
            const query = `
                SELECT 
                    q.id,
                    q.giocatore_id,
                    q.fantacalciopedia,
                    q.pazzidifanta,
                    q.stadiosport,
                    q.unveil,
                    q.gazzetta,
                    q.mia_valutazione,
                    q.note,
                    q.preferito,
                    q.fonte,
                    q.created_at,
                    q.updated_at,
                    g.nome,
                    g.squadra,
                    g.ruolo
                FROM quotazioni q
                JOIN giocatori g ON q.giocatore_id = g.id
                ORDER BY g.nome, g.squadra
            `;
            
            const quotazioni = await this.db.all(query);
            return {
                success: true,
                count: quotazioni.length,
                data: quotazioni
            };
        } catch (error) {
            console.error('Errore nel recupero quotazioni:', error);
            throw new Error('Errore nel recupero delle quotazioni');
        }
    }

    /**
     * Ottiene quotazioni per giocatore specifico
     */
    async getQuotazioniByGiocatore(giocatoreId) {
        try {
            const query = `
                SELECT 
                    q.*,
                    g.nome,
                    g.squadra,
                    g.ruolo
                FROM quotazioni q
                JOIN giocatori g ON q.giocatore_id = g.id
                WHERE q.giocatore_id = ?
                ORDER BY q.updated_at DESC
            `;
            
            const quotazioni = await this.db.all(query, [giocatoreId]);
            return {
                success: true,
                count: quotazioni.length,
                data: quotazioni
            };
        } catch (error) {
            console.error('Errore nel recupero quotazioni giocatore:', error);
            throw new Error('Errore nel recupero delle quotazioni del giocatore');
        }
    }

    /**
     * Crea nuova quotazione
     */
    async createQuotazione(quotazioneData) {
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
                fonte = 'manuale'
            } = quotazioneData;

            // Verifica che il giocatore esista
            const giocatore = await this.db.get('SELECT id FROM giocatori WHERE id = ?', [giocatore_id]);
            if (!giocatore) {
                throw new Error('Giocatore non trovato');
            }

            const query = `
                INSERT INTO quotazioni (
                    giocatore_id, fantacalciopedia, pazzidifanta, stadiosport,
                    unveil, gazzetta, mia_valutazione, note, preferito, fonte
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            const result = await this.db.run(query, [
                giocatore_id, fantacalciopedia, pazzidifanta, stadiosport,
                unveil, gazzetta, mia_valutazione, note, preferito, fonte
            ]);

            return {
                success: true,
                message: 'Quotazione creata con successo',
                data: {
                    id: result.lastID,
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
                }
            };
        } catch (error) {
            console.error('Errore nella creazione quotazione:', error);
            throw error;
        }
    }

    /**
     * Aggiorna quotazione esistente
     */
    async updateQuotazione(id, quotazioneData) {
        try {
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
            } = quotazioneData;

            // Verifica che la quotazione esista
            const quotazione = await this.db.get('SELECT id FROM quotazioni WHERE id = ?', [id]);
            if (!quotazione) {
                throw new Error('Quotazione non trovata');
            }

            const query = `
                UPDATE quotazioni SET
                    fantacalciopedia = COALESCE(?, fantacalciopedia),
                    pazzidifanta = COALESCE(?, pazzidifanta),
                    stadiosport = COALESCE(?, stadiosport),
                    unveil = COALESCE(?, unveil),
                    gazzetta = COALESCE(?, gazzetta),
                    mia_valutazione = COALESCE(?, mia_valutazione),
                    note = COALESCE(?, note),
                    preferito = COALESCE(?, preferito),
                    fonte = COALESCE(?, fonte),
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `;
            
            await this.db.run(query, [
                fantacalciopedia, pazzidifanta, stadiosport, unveil,
                gazzetta, mia_valutazione, note, preferito, fonte, id
            ]);

            return {
                success: true,
                message: 'Quotazione aggiornata con successo',
                data: { id }
            };
        } catch (error) {
            console.error('Errore nell\'aggiornamento quotazione:', error);
            throw error;
        }
    }

    /**
     * Elimina quotazione
     */
    async deleteQuotazione(id) {
        try {
            // Verifica che la quotazione esista
            const quotazione = await this.db.get('SELECT id FROM quotazioni WHERE id = ?', [id]);
            if (!quotazione) {
                throw new Error('Quotazione non trovata');
            }

            await this.db.run('DELETE FROM quotazioni WHERE id = ?', [id]);

            return {
                success: true,
                message: 'Quotazione eliminata con successo',
                data: { id }
            };
        } catch (error) {
            console.error('Errore nell\'eliminazione quotazione:', error);
            throw error;
        }
    }

    /**
     * Importa quotazioni da CSV
     */
    async importFromCSV(csvData) {
        try {
            const results = [];
            const errors = [];

            for (const row of csvData) {
                try {
                    // Verifica che il giocatore esista
                    const giocatore = await this.db.get(
                        'SELECT id FROM giocatori WHERE nome = ? AND squadra = ?',
                        [row.Nome, row.Squadra]
                    );

                    if (!giocatore) {
                        errors.push({
                            row: row,
                            error: 'Giocatore non trovato'
                        });
                        continue;
                    }

                    // Verifica se esiste già una quotazione per questo giocatore
                    const existingQuotazione = await this.db.get(
                        'SELECT * FROM quotazioni WHERE giocatore_id = ?',
                        [giocatore.id]
                    );

                    // Funzione per preservare valori esistenti se il CSV ha campi vuoti
                    const preserveExistingValue = (csvValue, existingValue) => {
                        // Se il CSV ha un valore valido (non vuoto, non null, non undefined), usalo
                        if (csvValue !== null && csvValue !== undefined && csvValue !== '') {
                            return csvValue;
                        }
                        // Altrimenti mantieni il valore esistente
                        return existingValue;
                    };

                    // Prepara i dati per l'aggiornamento, preservando i valori esistenti
                    const quotazioneData = {
                        giocatore_id: giocatore.id,
                        fantacalciopedia: preserveExistingValue(row.Fantacalciopedia, existingQuotazione?.fantacalciopedia),
                        pazzidifanta: preserveExistingValue(row.PazzidiFanta, existingQuotazione?.pazzidifanta),
                        stadiosport: preserveExistingValue(row.Stadiosport, existingQuotazione?.stadiosport),
                        unveil: preserveExistingValue(row.Unveil, existingQuotazione?.unveil),
                        gazzetta: preserveExistingValue(row.Gazzetta, existingQuotazione?.gazzetta),
                        mia_valutazione: row.Mia_Valutazione && row.Mia_Valutazione !== '' ? 
                            parseInt(row.Mia_Valutazione) : existingQuotazione?.mia_valutazione,
                        note: preserveExistingValue(row.Note, existingQuotazione?.note),
                        preferito: row.Preferito === 'true' || row.Preferito === '1' ? 1 : 0,
                        fonte: 'csv_import'
                    };

                    if (existingQuotazione) {
                        // Aggiorna quotazione esistente
                        await this.updateQuotazione(existingQuotazione.id, quotazioneData);
                        results.push({
                            giocatore: giocatore.id,
                            action: 'updated',
                            data: quotazioneData
                        });
                    } else {
                        // Crea nuova quotazione (per nuove quotazioni, usa i valori del CSV o null)
                        const newQuotazioneData = {
                            giocatore_id: giocatore.id,
                            fantacalciopedia: row.Fantacalciopedia || null,
                            pazzidifanta: row.PazzidiFanta || null,
                            stadiosport: row.Stadiosport || null,
                            unveil: row.Unveil || null,
                            gazzetta: row.Gazzetta || null,
                            mia_valutazione: row.Mia_Valutazione ? parseInt(row.Mia_Valutazione) : null,
                            note: row.Note || null,
                            preferito: row.Preferito === 'true' || row.Preferito === '1' ? 1 : 0,
                            fonte: 'csv_import'
                        };
                        
                        const result = await this.createQuotazione(newQuotazioneData);
                        results.push({
                            giocatore: giocatore.id,
                            action: 'created',
                            data: result.data
                        });
                    }

                    // Gestione automatica wishlist per giocatori preferiti
                    if (quotazioneData.preferito) {
                        try {
                            // Verifica se il giocatore è già in wishlist
                            const existingWishlist = await this.db.get(
                                'SELECT id FROM wishlist WHERE giocatore_id = ?',
                                [giocatore.id]
                            );

                            if (!existingWishlist) {
                                // Aggiungi alla wishlist
                                await this.db.run(
                                    'INSERT INTO wishlist (giocatore_id) VALUES (?)',
                                    [giocatore.id]
                                );
                                results[results.length - 1].wishlistAdded = true;
                            }
                        } catch (wishlistError) {
                            console.warn(`Errore nell'aggiunta alla wishlist per giocatore ${giocatore.id}:`, wishlistError);
                            // Non bloccare l'importazione per errori wishlist
                        }
                    } else {
                        // Se non è più preferito, rimuovi dalla wishlist
                        try {
                            await this.db.run(
                                'DELETE FROM wishlist WHERE giocatore_id = ?',
                                [giocatore.id]
                            );
                            results[results.length - 1].wishlistRemoved = true;
                        } catch (wishlistError) {
                            console.warn(`Errore nella rimozione dalla wishlist per giocatore ${giocatore.id}:`, wishlistError);
                            // Non bloccare l'importazione per errori wishlist
                        }
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
            console.error('Errore nell\'importazione CSV:', error);
            throw new Error('Errore nell\'importazione del CSV');
        }
    }

    /**
     * Ottiene quotazioni con filtri
     */
    async getQuotazioniWithFilters(filters = {}) {
        try {
            let query = `
                SELECT 
                    q.id,
                    q.giocatore_id,
                    q.fantacalciopedia,
                    q.pazzidifanta,
                    q.stadiosport,
                    q.unveil,
                    q.gazzetta,
                    q.mia_valutazione,
                    q.note,
                    q.preferito,
                    q.fonte,
                    q.created_at,
                    q.updated_at,
                    g.nome,
                    g.squadra,
                    g.ruolo
                FROM quotazioni q
                JOIN giocatori g ON q.giocatore_id = g.id
                WHERE 1=1
            `;
            
            const params = [];

            if (filters.ruolo) {
                query += ' AND g.ruolo = ?';
                params.push(filters.ruolo);
            }

            if (filters.squadra) {
                query += ' AND g.squadra = ?';
                params.push(filters.squadra);
            }

            if (filters.fonte) {
                query += ' AND q.fonte = ?';
                params.push(filters.fonte);
            }

            if (filters.preferito !== undefined) {
                query += ' AND q.preferito = ?';
                params.push(filters.preferito ? 1 : 0);
            }

            query += ' ORDER BY g.nome, g.squadra';

            const quotazioni = await this.db.all(query, params);
            return {
                success: true,
                count: quotazioni.length,
                filters,
                data: quotazioni
            };
        } catch (error) {
            console.error('Errore nel recupero quotazioni filtrate:', error);
            throw new Error('Errore nel recupero delle quotazioni filtrate');
        }
    }
}

module.exports = QuotazioniService;
