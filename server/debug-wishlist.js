const { getDatabase } = require('./src/config/database');

async function debugWishlist() {
  const db = getDatabase();
  
  try {
    console.log('🔍 Debug Wishlist');
    console.log('================');
    
    await db.connect();
    console.log('✅ Database connesso');
    
    // Controlla se il giocatore esiste
    const giocatore = await db.get('SELECT id, nome, squadra FROM giocatori WHERE id = ?', ['adzic_juventus']);
    console.log('👤 Giocatore trovato:', giocatore);
    
    // Controlla se è nella wishlist
    const wishlistItem = await db.get('SELECT * FROM wishlist WHERE giocatore_id = ?', ['adzic_juventus']);
    console.log('❤️ Wishlist item:', wishlistItem);
    
    // Conta tutti gli elementi nella wishlist
    const wishlistCount = await db.get('SELECT COUNT(*) as count FROM wishlist');
    console.log('📊 Totale elementi in wishlist:', wishlistCount?.count || 0);
    
    // Mostra alcuni elementi della wishlist
    const wishlistItems = await db.all('SELECT * FROM wishlist LIMIT 5');
    console.log('📋 Primi 5 elementi wishlist:', wishlistItems);
    
    // Testa la query DELETE
    console.log('🗑️ Testando DELETE...');
    const deleteResult = await db.run('DELETE FROM wishlist WHERE giocatore_id = ?', ['adzic_juventus']);
    console.log('✅ Risultato DELETE:', deleteResult);
    
  } catch (error) {
    console.error('❌ Errore:', error);
    console.error('❌ Stack trace:', error.stack);
  } finally {
    await db.close();
  }
}

debugWishlist();
