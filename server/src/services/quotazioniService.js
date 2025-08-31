const { getDatabase } = require('../config/database');

class QuotazioniService {
    constructor() {
        this.db = getDatabase();
    }

    // Ottiene tutte le quotazioni con informazioni giocatore
    async getAllQuotazioni() {
        try {
            await this.db.connect();
            const query = `
                SELECT 
                    q.id,
                    q.giocatore_id,
                    q.gazzetta,
                    q.fascia,
                    q.consiglio,
                    q.voto,
                    q.mia_valutazione,
                    q.note,
                    q.preferito,
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
            throw new Error('Errore nel recupero delle quotazioni');
        }
    }

    // Ottiene quotazioni per giocatore specifico
    async getQuotazioniByGiocatore(giocatoreId) {
        try {
            await this.db.connect();
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
            throw new Error('Errore nel recupero delle quotazioni del giocatore');
        }
    }

    // Crea nuova quotazione
    async createQuotazione(quotazioneData) {
        try {
            await this.db.connect();
            const {
                giocatore_id,
                gazzetta,
                fascia,
                consiglio,
                voto,
                mia_valutazione,
                note,
                preferito
            } = quotazioneData;

            // Verifica che il giocatore esista
            const giocatore = await this.db.get('SELECT id FROM giocatori WHERE id = ?', [giocatore_id]);
            if (!giocatore) {
                throw new Error('Giocatore non trovato');
            }

            const query = `
                INSERT INTO quotazioni (
                    giocatore_id, gazzetta, fascia, consiglio, voto, mia_valutazione, note, preferito
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            const result = await this.db.run(query, [
                giocatore_id, gazzetta, fascia, consiglio, voto, mia_valutazione, note, preferito
            ]);

            return {
                success: true,
                message: 'Quotazione creata con successo',
                data: {
                    id: result.lastID,
                    giocatore_id,
                    gazzetta,
                    fascia,
                    consiglio,
                    voto,
                    mia_valutazione,
                    note,
                    preferito
                }
            };
        } catch (error) {
            throw error;
        }
    }

    // Aggiorna quotazione esistente
    async updateQuotazione(id, quotazioneData) {
        try {
            await this.db.connect();
            const {
                gazzetta,
                fascia,
                consiglio,
                voto,
                mia_valutazione,
                note,
                preferito
            } = quotazioneData;

            // Verifica che la quotazione esista
            const quotazione = await this.db.get('SELECT id FROM quotazioni WHERE id = ?', [id]);
            if (!quotazione) {
                throw new Error('Quotazione non trovata');
            }

            const query = `
                UPDATE quotazioni SET
                    gazzetta = COALESCE(?, gazzetta),
                    fascia = COALESCE(?, fascia),
                    consiglio = COALESCE(?, consiglio),
                    voto = COALESCE(?, voto),
                    mia_valutazione = COALESCE(?, mia_valutazione),
                    note = COALESCE(?, note),
                    preferito = COALESCE(?, preferito),
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `;
            
            await this.db.run(query, [
                gazzetta, fascia, consiglio, voto, mia_valutazione, note, preferito, id
            ]);

            return {
                success: true,
                message: 'Quotazione aggiornata con successo',
                data: { id }
            };
            } catch (error) {
      throw error;
    }
    }

    // Elimina quotazione
    async deleteQuotazione(id) {
        try {
            await this.db.connect();
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
      throw error;
    }
    }

    // Importa quotazioni da CSV
    async importFromCSV(csvData) {
        try {
            await this.db.connect();
            
            // Verifica che il CSV abbia i dati necessari
            if (!csvData || csvData.length === 0) {
                throw new Error('CSV vuoto o senza dati');
            }
            
            // Log delle colonne disponibili per debug
            if (csvData.length > 0) {
                const columns = Object.keys(csvData[0]);
                console.log('📋 Colonne CSV rilevate:', columns);
                
                // Verifica colonne obbligatorie
                if (!columns.includes('Nome') || !columns.includes('Squadra')) {
                    throw new Error('CSV deve contenere le colonne "Nome" e "Squadra"');
                }
            }
            
            const results = [];
            const errors = [];

            for (let i = 0; i < csvData.length; i++) {
                const row = csvData[i];
                
                // Log progresso ogni 50 righe
                if (i % 50 === 0) {
                    console.log(`📊 Processando riga ${i + 1}/${csvData.length}...`);
                }
                
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

                    // Mapping per supportare le colonne del CSV
                    // Il CSV ha "Fantagazzetta" che mappa alla colonna "gazzetta" del database
                    let gazzettaValue = null;
                    if (row.Fantagazzetta !== null && row.Fantagazzetta !== undefined && row.Fantagazzetta !== '') {
                        gazzettaValue = row.Fantagazzetta;
                        console.log(`🔄 Usando colonna Fantagazzetta per ${row.Nome}: ${row.Fantagazzetta}`);
                    } else if (row.FVM !== null && row.FVM !== undefined && row.FVM !== '') {
                        gazzettaValue = row.FVM;
                        console.log(`🔄 Mapping FVM -> fantagazzetta per ${row.Nome}: ${row.FVM}`);
                    } else if (row.Gazzetta !== null && row.Gazzetta !== undefined && row.Gazzetta !== '') {
                        gazzettaValue = row.Gazzetta;
                        console.log(`🔄 Usando colonna Gazzetta per ${row.Nome}: ${row.Gazzetta}`);
                    }

                    // Prepara i dati per l'aggiornamento, preservando i valori esistenti
                    // Il CSV ha solo Fantagazzetta, gli altri campi mantengono i valori esistenti
                    const quotazioneData = {
                        giocatore_id: giocatore.id,
                        gazzetta: preserveExistingValue(gazzettaValue, existingQuotazione?.gazzetta),
                        fascia: existingQuotazione?.fascia || null,
                        consiglio: existingQuotazione?.consiglio || null,
                        voto: existingQuotazione?.voto || null,
                        mia_valutazione: existingQuotazione?.mia_valutazione || null,
                        note: existingQuotazione?.note || null,
                        preferito: existingQuotazione?.preferito || 0
                        // fonte: 'csv_import' -- Removed: fonte column no longer exists
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
                        // Il CSV ha solo Fantagazzetta, gli altri campi sono null
                        const newQuotazioneData = {
                            giocatore_id: giocatore.id,
                            gazzetta: gazzettaValue || null,
                            fascia: null,
                            consiglio: null,
                            voto: null,
                            mia_valutazione: null,
                            note: null,
                            preferito: 0
                            // fonte: 'csv_import' -- Removed: fonte column no longer exists
                        };
                        
                        const result = await this.createQuotazione(newQuotazioneData);
                        results.push({
                            giocatore: giocatore.id,
                            action: 'created',
                            data: result.data
                        });
                    }

                    // Gestione automatica wishlist per giocatori preferiti
                    // Aggiungi alla wishlist solo se esplicitamente marcato come preferito nel CSV
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
                    }
                    // NOTA: Non rimuoviamo più i giocatori dalla wishlist quando non sono marcati come preferiti nel CSV
                    // Questo evita di perdere dati della wishlist durante l'importazione di quotazioni
                } catch (error) {
                    console.error(`❌ Errore per riga ${JSON.stringify(row)}:`, error.message);
                    errors.push({
                        row: row,
                        error: error.message
                    });
                }
            }

            console.log(`✅ Importazione completata: ${results.length} operazioni, ${errors.length} errori`);
            
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
            throw new Error('Errore nell\'importazione del CSV');
        }
    }

    // Ottiene quotazioni con filtri
    async getQuotazioniWithFilters(filters = {}) {
        try {
            await this.db.connect();
            let query = `
                SELECT 
                    q.id,
                    q.giocatore_id,
                    q.gazzetta,
                    q.fascia,
                    q.consiglio,
                    q.mia_valutazione,
                    q.note,
                    q.preferito,
                    -- q.fonte, -- Removed: fonte column no longer exists
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

            // if (filters.fonte) { -- Removed: fonte column no longer exists
            //     query += ' AND q.fonte = ?';
            //     params.push(filters.fonte);
            // }

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
            throw new Error('Errore nel recupero delle quotazioni filtrate');
        }
    }
}

module.exports = QuotazioniService;
