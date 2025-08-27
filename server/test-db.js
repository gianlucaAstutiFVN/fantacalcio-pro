const { getDatabase } = require('./src/config/database');

async function testDatabase() {
  const db = getDatabase();
  
  try {
    console.log('🔍 Test Database Structure...');
    
    // Connetti al database
    await db.connect();
    console.log('✅ Connesso al database');
    
    // Verifica se la tabella quotazioni esiste
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('📋 Tabelle esistenti:', tables.map(t => t.name));
    
    // Verifica struttura tabella quotazioni
    if (tables.some(t => t.name === 'quotazioni')) {
      const quotazioniSchema = await db.all("PRAGMA table_info(quotazioni)");
      console.log('📊 Schema tabella quotazioni:', quotazioniSchema);
      
      // Test: cerca il giocatore aboukhlal_torino
      const giocatore = await db.get("SELECT * FROM giocatori WHERE id = ?", ['aboukhlal_torino']);
      console.log('👤 Giocatore trovato:', giocatore ? giocatore.nome : 'NON TROVATO');
      
      if (giocatore) {
        // Test: verifica se esiste già una quotazione
        const quotazione = await db.get("SELECT * FROM quotazioni WHERE giocatore_id = ?", ['aboukhlal_torino']);
        console.log('💰 Quotazione esistente:', quotazione ? 'SI' : 'NO');
        
        if (quotazione) {
          console.log('📝 Note attuali:', quotazione.note);
        }
        
        // Test: prova a inserire/aggiornare una nota
        try {
          if (quotazione) {
            // Aggiorna
            const result = await db.run(
              "UPDATE quotazioni SET note = ?, updated_at = CURRENT_TIMESTAMP WHERE giocatore_id = ?",
              ['Test note aggiornata', 'aboukhlal_torino']
            );
            console.log('✅ Update completato, righe modificate:', result.changes);
          } else {
            // Inserisci nuova
            const result = await db.run(
              "INSERT INTO quotazioni (giocatore_id, note, fonte) VALUES (?, ?, 'manuale')",
              ['aboukhlal_torino', 'Test note inserita']
            );
            console.log('✅ Insert completato, ID:', result.id);
          }
        } catch (error) {
          console.error('❌ Errore durante test query:', error);
        }
      }
    } else {
      console.log('❌ Tabella quotazioni NON TROVATA!');
    }
    
  } catch (error) {
    console.error('❌ Errore generale:', error);
  } finally {
    await db.close();
    console.log('🔒 Database chiuso');
  }
}

testDatabase();
