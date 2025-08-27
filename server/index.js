const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const csv = require('csv-parser')
const createCsvWriter = require('csv-writer').createObjectCsvWriter
const corsOptions = require('./cors-config')
const squadreDB = require('./squadre-db')

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cors(corsOptions))

// Funzione per leggere i CSV dei giocatori
const leggiGiocatoriCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const giocatori = []
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Aggiungi un ID univoco basato sul nome e squadra
        const id = `${row.Nome?.replace(/\s+/g, '_')}_${row.Squadra?.replace(/\s+/g, '_')}`.toLowerCase()
        
        // Gestisci i valori "n/d" convertendoli in null
        const parseValue = (value) => {
          if (value === 'n/d' || value === '' || value === undefined) return null
          return value
        }
        
        // Determina il ruolo dal nome del file
        const fileName = path.basename(filePath, '.csv')
        let ruolo = ''
        switch (fileName) {
          case 'portieri':
            ruolo = 'portiere'
            break
          case 'difensori':
            ruolo = 'difensore'
            break
          case 'centrocampisti':
            ruolo = 'centrocampista'
            break
          case 'attaccanti':
            ruolo = 'attaccante'
            break
          default:
            ruolo = fileName.slice(0, -1) // rimuove la 's' finale
        }
        
        giocatori.push({
          id,
          nome: row.Nome || '',
          squadra: row.Squadra || '',
          ruolo: ruolo,
          // Gestione campi con nomi specifici del CSV
          unveil_fvm: parseValue(row['Unveil FVM (0-100)']),
          gazzetta_fascia: parseValue(row['Gazzetta Fascia (1-4)']),
          pazzidifanta: parseValue(row['PazzidiFanta (Qualitativo)']),
          mia_valutazione: parseValue(row['Mia_Valutazione (0-100)']),
          note: row.Ruolo_note || '',
          // Campi legacy per compatibilità
          quotazione: parseValue(row['Mia_Valutazione (0-100)']) || 0,
          valore: parseValue(row['Mia_Valutazione (0-100)']) || 0,
          status: 'disponibile'
        })
      })
      .on('end', () => resolve(giocatori))
      .on('error', reject)
  })
}

// Funzione per leggere tutti i giocatori da tutti i file CSV
const leggiTuttiGiocatori = async () => {
  try {
    const cartellaData = path.join(__dirname, '..', 'data')
    const fileCSV = ['portieri.csv', 'difensori.csv', 'centrocampisti.csv', 'attaccanti.csv']
    
    let tuttiGiocatori = []
    
    for (const file of fileCSV) {
      const filePath = path.join(cartellaData, file)
      if (fs.existsSync(filePath)) {
        const giocatori = await leggiGiocatoriCSV(filePath)
        tuttiGiocatori = tuttiGiocatori.concat(giocatori)
      }
    }
    
    return tuttiGiocatori
  } catch (error) {
    console.error('Errore nella lettura dei CSV:', error)
    return []
  }
}

// Funzione per leggere giocatori per ruolo specifico
const leggiGiocatoriPerRuolo = async (ruolo) => {
  try {
    const cartellaData = path.join(__dirname, '..', 'data')
    let fileCSV = ''
    
    switch (ruolo.toLowerCase()) {
      case 'portiere':
      case 'portieri':
        fileCSV = 'portieri.csv'
        break
      case 'difensore':
      case 'difensori':
        fileCSV = 'difensori.csv'
        break
      case 'centrocampista':
      case 'centrocampisti':
        fileCSV = 'centrocampisti.csv'
        break
      case 'attaccante':
      case 'attaccanti':
        fileCSV = 'attaccanti.csv'
        break
      default:
        throw new Error('Ruolo non valido')
    }
    
    const filePath = path.join(cartellaData, fileCSV)
    if (fs.existsSync(filePath)) {
      return await leggiGiocatoriCSV(filePath)
    }
    
    return []
  } catch (error) {
    console.error(`Errore nella lettura del CSV per ruolo ${ruolo}:`, error)
    return []
  }
}

// API per ottenere tutti i giocatori
app.get('/api/giocatori', async (req, res) => {
  try {
    const giocatori = await leggiTuttiGiocatori()
    res.json(giocatori)
  } catch (error) {
    console.error('Errore API giocatori:', error)
    res.status(500).json({ error: 'Errore nel caricamento dei giocatori' })
  }
})

// API per ottenere giocatori per ruolo specifico
app.get('/api/giocatori/:ruolo', async (req, res) => {
  try {
    const { ruolo } = req.params
    const giocatori = await leggiGiocatoriPerRuolo(ruolo)
    res.json(giocatori)
  } catch (error) {
    console.error(`Errore API giocatori per ruolo ${req.params.ruolo}:`, error)
    res.status(500).json({ error: 'Errore nel caricamento dei giocatori per ruolo' })
  }
})

// API per registrare l'acquisto di un giocatore
app.post('/api/acquista', async (req, res) => {
  try {
    const { nome, squadra, ruolo, valore, squadraAcquirente, data, unveil_fvm, gazzetta_fascia, pazzidifanta, mia_valutazione, note } = req.body
    
    const acquisto = {
      nome,
      squadra,
      ruolo,
      valore,
      squadraAcquirente,
      data: data || new Date().toISOString(),
      unveil_fvm: unveil_fvm || '',
      gazzetta_fascia: gazzetta_fascia || '',
      pazzidifanta: pazzidifanta || '',
      mia_valutazione: mia_valutazione || '',
      note: note || ''
    }
    
    // Salva nel CSV degli acquisti
    const csvWriter = createCsvWriter({
      path: path.join(__dirname, '..', 'asta', 'asta_giocatori.csv'),
      header: [
        { id: 'nome', title: 'Nome' },
        { id: 'squadra', title: 'Squadra' },
        { id: 'ruolo', title: 'Ruolo' },
        { id: 'valore', title: 'Valore' },
        { id: 'squadraAcquirente', title: 'Squadra Acquirente' },
        { id: 'data', title: 'Data Acquisto' },
        { id: 'unveil_fvm', title: 'Unveil FVM (0-100)' },
        { id: 'gazzetta_fascia', title: 'Gazzetta Fascia (1-4)' },
        { id: 'pazzidifanta', title: 'PazzidiFanta (Qualitativo)' },
        { id: 'mia_valutazione', title: 'Mia_Valutazione (0-100)' },
        { id: 'note', title: 'Ruolo_note' }
      ],
      append: true
    })
    
    await csvWriter.writeRecords([acquisto])
    
    res.json({ success: true, message: 'Acquisto registrato con successo' })
  } catch (error) {
    console.error('Errore API acquista:', error)
    res.status(500).json({ error: 'Errore nella registrazione dell\'acquisto' })
  }
})

// API per ottenere lo storico delle aste
app.get('/api/asta', async (req, res) => {
  try {
    const filePath = path.join(__dirname, '..', 'asta', 'asta_giocatori.csv')
    
    if (!fs.existsSync(filePath)) {
      return res.json([])
    }
    
    const acquisti = []
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => acquisti.push(row))
      .on('end', () => res.json(acquisti))
      .on('error', (error) => {
        console.error('Errore nella lettura del CSV aste:', error)
        res.status(500).json({ error: 'Errore nella lettura dello storico aste' })
      })
  } catch (error) {
    console.error('Errore API asta:', error)
    res.status(500).json({ error: 'Errore nel caricamento dello storico aste' })
  }
})

// API per ottenere aste attive (dati di esempio)
app.get('/api/aste', async (req, res) => {
  try {
    const asteAttive = [
      {
        id: 1,
        giocatore: 'Lautaro Martinez',
        squadra: 'Inter',
        ruolo: 'Attaccante',
        quotazione: 85,
        prezzoBase: 50,
        offerte: [
          { squadra: 'Real Fantacalcio', offerta: 75, timestamp: new Date().toISOString() },
          { squadra: 'Barcelona Dreams', offerta: 80, timestamp: new Date().toISOString() }
        ],
        stato: 'attiva',
        scadenza: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 ore
      },
      {
        id: 2,
        giocatore: 'Federico Chiesa',
        squadra: 'Juventus',
        ruolo: 'Attaccante',
        quotazione: 78,
        prezzoBase: 45,
        offerte: [
          { squadra: 'Manchester United Fantasy', offerta: 60, timestamp: new Date().toISOString() }
        ],
        stato: 'attiva',
        scadenza: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString() // 12 ore
      }
    ]
    
    res.json(asteAttive)
  } catch (error) {
    console.error('Errore API aste:', error)
    res.status(500).json({ error: 'Errore nel caricamento delle aste' })
  }
})

// API per ottenere statistiche
app.get('/api/statistiche', async (req, res) => {
  try {
    const giocatori = await leggiTuttiGiocatori()
    const acquisti = await new Promise((resolve, reject) => {
      const filePath = path.join(__dirname, '..', 'asta', 'asta_giocatori.csv')
      if (!fs.existsSync(filePath)) {
        return resolve([])
      }
      
      const acquisti = []
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => acquisti.push(row))
        .on('end', () => resolve(acquisti))
        .on('error', reject)
    })
    
    const spesaTotale = acquisti.reduce((sum, a) => sum + (parseInt(a.valore) || 0), 0)
    const prezzoMedio = acquisti.length > 0 ? spesaTotale / acquisti.length : 0
    
    // Distribuzione per ruolo
    const distribuzioneRuolo = {}
    acquisti.forEach(a => {
      const ruolo = a.ruolo || 'Non specificato'
      distribuzioneRuolo[ruolo] = (distribuzioneRuolo[ruolo] || 0) + 1
    })
    
    // Distribuzione per squadra acquirente
    const distribuzioneSquadra = {}
    acquisti.forEach(a => {
      const squadra = a.squadraAcquirente || 'Non specificato'
      distribuzioneSquadra[squadra] = (distribuzioneSquadra[squadra] || 0) + 1
    })
    
    const statistiche = {
      totaleAcquisti: acquisti.length,
      spesaTotale,
      prezzoMedio: Math.round(prezzoMedio * 100) / 100,
      distribuzioneRuolo,
      distribuzioneSquadra,
      giocatoriDisponibili: giocatori.filter(g => g.status === 'disponibile').length,
      giocatoriVenduti: giocatori.filter(g => g.status === 'venduto').length
    }
    
    res.json(statistiche)
  } catch (error) {
    console.error('Errore API statistiche:', error)
    res.status(500).json({ error: 'Errore nel calcolo delle statistiche' })
  }
})

// API per le squadre (CRUD completo)
app.get('/api/squadre', (req, res) => {
  try {
    const squadre = squadreDB.getAllSquadre()
    
    // Debug: log per verificare i giocatori di ogni squadra
    console.log('🏆 API /api/squadre chiamata - Squadre restituite:')
    squadre.forEach(s => {
      if (s.giocatori && s.giocatori.length > 0) {
        console.log(`  📊 ${s.nome}: ${s.giocatori.length} giocatori`)
        s.giocatori.forEach(g => {
          console.log(`    - ${g.nome} (${g.ruolo}) - €${g.valore}`)
        })
      } else {
        console.log(`  📊 ${s.nome}: 0 giocatori`)
      }
    })
    
    res.json({
      success: true,
      data: squadre,
      message: `${squadre.length} squadre caricate con successo`
    })
  } catch (error) {
    console.error('❌ Errore API squadre:', error)
    res.status(500).json({ 
      success: false,
      error: 'Errore nel caricamento delle squadre',
      message: error.message 
    })
  }
})

app.post('/api/squadre', (req, res) => {
  try {
    const nuovaSquadra = squadreDB.createSquadra(req.body)
    res.status(201).json({
      success: true,
      data: nuovaSquadra,
      message: 'Squadra creata con successo'
    })
  } catch (error) {
    console.error('❌ Errore creazione squadra:', error)
    res.status(500).json({ 
      success: false,
      error: 'Errore nella creazione della squadra',
      message: error.message 
    })
  }
})

// POST /api/squadre/assegna-giocatore - Assegna giocatore a squadra (generico)
app.post('/api/squadre/assegna-giocatore', async (req, res) => {
  try {
    const { giocatoreId, squadraId, prezzo } = req.body
    
    // Validazione input
    if (!giocatoreId || !squadraId || !prezzo) {
      return res.status(400).json({
        success: false,
        error: 'giocatoreId, squadraId e prezzo sono obbligatori'
      })
    }
    
    if (prezzo <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Il prezzo deve essere maggiore di zero'
      })
    }
    
    // Verifica esistenza squadra
    const squadra = squadreDB.getSquadraById(squadraId)
    if (!squadra) {
      return res.status(404).json({
        success: false,
        error: 'Squadra non trovata'
      })
    }
    
    // Verifica esistenza giocatore
    const tuttiGiocatori = await leggiTuttiGiocatori()
    const giocatore = tuttiGiocatori.find(g => g.id === giocatoreId)
    if (!giocatore) {
      return res.status(404).json({
        success: false,
        error: 'Giocatore non trovato'
      })
    }
    
    // Verifica disponibilità giocatore
    if (giocatore.status !== 'disponibile') {
      return res.status(409).json({
        success: false,
        error: 'Giocatore non disponibile per l\'acquisto'
      })
    }
    
    // Verifica budget squadra
    if (squadra.budget_residuo < prezzo) {
      return res.status(409).json({
        success: false,
        error: `Budget insufficiente. La squadra ha €${squadra.budget_residuo} disponibili`
      })
    }
    
    // Esegui l'acquisto
    const squadraAggiornata = squadreDB.acquistaGiocatore(squadraId, giocatore, prezzo)
    
    res.json({
      success: true,
      message: 'Giocatore assegnato con successo alla squadra',
      data: { 
        giocatoreId, 
        squadraId, 
        prezzo,
        budgetRimanente: squadra.budget_residuo - prezzo
      }
    })
    
  } catch (error) {
    console.error('❌ Errore assegnaGiocatore:', error)
    
    // Gestione errori specifici
    if (error.message === 'Giocatore non disponibile') {
      return res.status(409).json({
        success: false,
        error: 'Giocatore non disponibile per l\'acquisto'
      })
    }
    
    if (error.message === 'Budget insufficiente') {
      return res.status(409).json({
        success: false,
        error: 'Budget insufficiente per completare l\'acquisto'
      })
    }
    
    res.status(500).json({
      success: false,
      error: 'Errore interno del server durante l\'assegnazione'
    })
  }
})

app.put('/api/squadre/:id', (req, res) => {
  try {
    const { id } = req.params
    const squadraAggiornata = squadreDB.updateSquadra(id, req.body)
    
    if (squadraAggiornata) {
      res.json({
        success: true,
        data: squadraAggiornata,
        message: 'Squadra aggiornata con successo'
      })
    } else {
      res.status(404).json({ 
        success: false,
        error: 'Squadra non trovata' 
      })
    }
  } catch (error) {
    console.error('❌ Errore aggiornamento squadra:', error)
    res.status(500).json({ 
      success: false,
      error: 'Errore nell\'aggiornamento della squadra',
      message: error.message 
    })
  }
})

app.delete('/api/squadre/:id', (req, res) => {
  try {
    const { id } = req.params
    const squadraEliminata = squadreDB.deleteSquadra(id)
    
    if (squadraEliminata) {
      res.json({ 
        success: true,
        message: 'Squadra eliminata con successo',
        data: squadraEliminata
      })
    } else {
      res.status(404).json({ 
        success: false,
        error: 'Squadra non trovata' 
      })
    }
  } catch (error) {
    console.error('❌ Errore eliminazione squadra:', error)
    res.status(500).json({ 
      success: false,
      error: 'Errore nell\'eliminazione della squadra',
      message: error.message 
    })
  }
})

// Nuove API per wishlist e acquisti
app.post('/api/squadre/:id/wishlist', (req, res) => {
  try {
    const { id } = req.params
    const { giocatoreId } = req.body
    
    const wishlist = squadreDB.addToWishlist(id, giocatoreId)
    res.json({ success: true, wishlist })
  } catch (error) {
    console.error('Errore aggiunta wishlist:', error)
    res.status(500).json({ error: 'Errore nell\'aggiunta alla wishlist' })
  }
})

app.get('/api/squadre/:id/wishlist', (req, res) => {
  try {
    const { id } = req.params
    const wishlist = squadreDB.getWishlist(id)
    res.json(wishlist)
  } catch (error) {
    console.error('Errore lettura wishlist:', error)
    res.status(500).json({ error: 'Errore nella lettura della wishlist' })
  }
})

app.delete('/api/squadre/:id/wishlist/:giocatoreId', (req, res) => {
  try {
    const { id, giocatoreId } = req.params
    const wishlist = squadreDB.removeFromWishlist(id, giocatoreId)
    res.json({ success: true, wishlist })
  } catch (error) {
    console.error('Errore rimozione wishlist:', error)
    res.status(500).json({ error: 'Errore nella rimozione dalla wishlist' })
  }
})

app.post('/api/squadre/:id/acquista', (req, res) => {
  try {
    const { id } = req.params
    const { giocatore, prezzoPagato } = req.body
    
    if (!giocatore || !prezzoPagato) {
      return res.status(400).json({ error: 'Giocatore e prezzo sono obbligatori' })
    }
    
    const squadra = squadreDB.acquistaGiocatore(id, giocatore, prezzoPagato)
    
    // Salva anche nel CSV dell'asta
    const acquistoData = {
      nome: giocatore.nome,
      squadra: giocatore.squadra,
      ruolo: giocatore.ruolo,
      valore: prezzoPagato,
      squadraAcquirente: squadra.nome,
      data: new Date().toISOString(),
      unveil_fvm: giocatore.unveil_fvm || '',
      gazzetta_fascia: giocatore.gazzetta_fascia || '',
      pazzidifanta: giocatore.pazzidifanta || '',
      mia_valutazione: giocatore.mia_valutazione || '',
      note: giocatore.note || ''
    }
    
    // Scrivi nel CSV dell'asta
    const csvWriter = createCsvWriter({
      path: path.join(__dirname, '..', 'asta', 'asta_giocatori.csv'),
      header: [
        { id: 'nome', title: 'Nome' },
        { id: 'squadra', title: 'Squadra' },
        { id: 'ruolo', title: 'Ruolo' },
        { id: 'valore', title: 'Valore' },
        { id: 'squadraAcquirente', title: 'Squadra Acquirente' },
        { id: 'data', title: 'Data Acquisto' },
        { id: 'unveil_fvm', title: 'Unveil FVM (0-100)' },
        { id: 'gazzetta_fascia', title: 'Gazzetta Fascia (1-4)' },
        { id: 'pazzidifanta', title: 'PazzidiFanta (Qualitativo)' },
        { id: 'mia_valutazione', title: 'Mia_Valutazione (0-100)' },
        { id: 'note', title: 'Ruolo_note' }
      ],
      append: true
    })
    
    csvWriter.writeRecords([acquistoData])
      .then(() => {
        res.json({ success: true, squadra })
      })
      .catch(err => {
        console.error('Errore scrittura CSV:', err)
        res.status(500).json({ error: 'Errore nel salvataggio dell\'acquisto' })
      })
    
  } catch (error) {
    console.error('Errore acquisto giocatore:', error)
    res.status(500).json({ error: error.message || 'Errore nell\'acquisto del giocatore' })
  }
})

app.get('/api/squadre/:id/stats', (req, res) => {
  try {
    const { id } = req.params
    const stats = squadreDB.getSquadraStats(id)
    
    if (stats) {
      res.json(stats)
    } else {
      res.status(404).json({ error: 'Squadra non trovata' })
    }
  } catch (error) {
    console.error('Errore statistiche squadra:', error)
    res.status(500).json({ error: 'Errore nel calcolo delle statistiche squadra' })
  }
})

app.post('/api/squadre/:id/reset', (req, res) => {
  try {
    const { id } = req.params
    const { nuovoBudget } = req.body
    
    const squadra = squadreDB.resetBudget(id, nuovoBudget)
    res.json({ success: true, squadra })
  } catch (error) {
    console.error('Errore reset budget:', error)
    res.status(500).json({ error: error.message || 'Errore nel reset del budget' })
  }
})

// Crea la cartella asta se non esiste
const astaDir = path.join(__dirname, '..', 'asta')
if (!fs.existsSync(astaDir)) {
  fs.mkdirSync(astaDir, { recursive: true })
}

// Crea il file CSV delle aste se non esiste
const astaFile = path.join(astaDir, 'asta_giocatori.csv')
if (!fs.existsSync(astaFile)) {
  const csvWriter = createCsvWriter({
    path: astaFile,
    header: [
      { id: 'nome', title: 'Nome' },
      { id: 'squadra', title: 'Squadra' },
      { id: 'ruolo', title: 'Ruolo' },
      { id: 'valore', title: 'Valore' },
      { id: 'squadraAcquirente', title: 'Squadra Acquirente' },
      { id: 'data', title: 'Data Acquisto' },
      { id: 'unveil_fvm', title: 'Unveil FVM (0-100)' },
      { id: 'gazzetta_fascia', title: 'Gazzetta Fascia (1-4)' },
      { id: 'pazzidifanta', title: 'PazzidiFanta (Qualitativo)' },
      { id: 'mia_valutazione', title: 'Mia_Valutazione (0-100)' },
      { id: 'note', title: 'Ruolo_note' }
    ]
  })
  
  csvWriter.writeRecords([])
    .then(() => console.log('File CSV aste creato'))
    .catch(err => console.error('Errore creazione CSV aste:', err))
}

app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`)
  console.log(`API disponibili:`)
  console.log(`- GET /api/giocatori - Tutti i giocatori`)
  console.log(`- GET /api/giocatori/:ruolo - Giocatori per ruolo`)
  console.log(`- POST /api/acquista - Registra acquisto`)
  console.log(`- GET /api/asta - Storico aste`)
  console.log(`- GET /api/aste - Aste attive`)
  console.log(`- GET /api/statistiche - Statistiche generali`)
  console.log(`- GET /api/squadre - Lista squadre`)
  console.log(`- POST /api/squadre - Crea squadra`)
  console.log(`- PUT /api/squadre/:id - Aggiorna squadra`)
  console.log(`- DELETE /api/squadre/:id - Elimina squadra`)
  console.log(`- POST /api/squadre/:id/wishlist - Aggiungi alla wishlist`)
  console.log(`- GET /api/squadre/:id/wishlist - Visualizza wishlist`)
  console.log(`- DELETE /api/squadre/:id/wishlist/:giocatoreId - Rimuovi dalla wishlist`)
console.log(`- POST /api/squadre/assegna-giocatore - Assegna giocatore a squadra (generico)`)
console.log(`- POST /api/squadre/:id/acquista - Acquista giocatore`)
console.log(`- GET /api/squadre/:id/stats - Statistiche squadra`)
console.log(`- POST /api/squadre/:id/reset - Reset budget`)
})
