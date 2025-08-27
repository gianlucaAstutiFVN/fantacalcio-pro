// Database in memoria per le squadre
let squadre = []
let nextId = 1

// Wishlist per ogni squadra
let wishlist = {}

// Storico acquisti per ogni squadra
let acquisti = {}

// Inizializza con alcune squadre di esempio
const initializeSquadre = () => {
  if (squadre.length === 0) {
    squadre = [
      {
        id: nextId++,
        nome: 'Squadra A',
        proprietario: 'Mario Rossi',
        budget: 500,
        budget_residuo: 262,
        giocatori: [],
        dataCreazione: new Date().toISOString()
      },
      {
        id: nextId++,
        nome: 'Squadra B',
        proprietario: 'Giuseppe Verdi',
        budget: 500,
        budget_residuo: 246,
        giocatori: [],
        dataCreazione: new Date().toISOString()
      },
      {
        id: nextId++,
        nome: 'Squadra C',
        proprietario: 'Antonio Bianchi',
        budget: 500,
        budget_residuo: 282,
        giocatori: [],
        dataCreazione: new Date().toISOString()
      }
    ]
  }
}

// Ottieni tutte le squadre
const getAllSquadre = () => {
  initializeSquadre()
  const squadreConStats = squadre.map(squadra => ({
    ...squadra,
    spesaTotale: squadra.giocatori.reduce((sum, g) => sum + (g.valore || 0), 0),
    budget_residuo: squadra.budget - squadra.giocatori.reduce((sum, g) => sum + (g.valore || 0), 0)
  }))
  
  // Debug: log per verificare i giocatori di ogni squadra
  squadreConStats.forEach(s => {
    if (s.giocatori && s.giocatori.length > 0) {
      console.log(`🏆 Squadra ${s.nome}: ${s.giocatori.length} giocatori`)
      s.giocatori.forEach(g => {
        console.log(`  - ${g.nome} (${g.ruolo}) - €${g.valore}`)
      })
    }
  })
  
  return squadreConStats
}

// Ottieni squadra per ID
const getSquadraById = (id) => {
  initializeSquadre()
  const squadra = squadre.find(s => s.id === parseInt(id))
  if (squadra) {
    return {
      ...squadra,
      spesaTotale: squadra.giocatori.reduce((sum, g) => sum + (g.valore || 0), 0),
      budget_residuo: squadra.budget - squadra.giocatori.reduce((sum, g) => sum + (g.valore || 0), 0)
    }
  }
  return null
}

// Crea nuova squadra
const createSquadra = (squadraData) => {
  initializeSquadre()
  const nuovaSquadra = {
    id: nextId++,
    ...squadraData,
    giocatori: [],
    budget_residuo: squadraData.budget || 0,
    dataCreazione: new Date().toISOString()
  }
  squadre.push(nuovaSquadra)
  return nuovaSquadra
}

// Aggiorna squadra esistente
const updateSquadra = (id, squadraData) => {
  initializeSquadre()
  const index = squadre.findIndex(s => s.id === parseInt(id))
  if (index !== -1) {
    squadre[index] = { ...squadre[index], ...squadraData }
    // Ricalcola budget residuo
    const squadra = squadre[index]
    squadra.budget_residuo = squadra.budget - squadra.giocatori.reduce((sum, g) => sum + (g.valore || 0), 0)
    return squadra
  }
  return null
}

// Elimina squadra
const deleteSquadra = (id) => {
  initializeSquadre()
  const index = squadre.findIndex(s => s.id === parseInt(id))
  if (index !== -1) {
    const squadraEliminata = squadre[index]
    squadre.splice(index, 1)
    
    // Rimuovi anche dalla wishlist e acquisti
    delete wishlist[id]
    delete acquisti[id]
    
    return squadraEliminata
  }
  return null
}

// Aggiungi giocatore alla wishlist
const addToWishlist = (squadraId, giocatoreId) => {
  if (!wishlist[squadraId]) {
    wishlist[squadraId] = []
  }
  
  if (!wishlist[squadraId].includes(giocatoreId)) {
    wishlist[squadraId].push(giocatoreId)
  }
  
  return wishlist[squadraId]
}

// Rimuovi giocatore dalla wishlist
const removeFromWishlist = (squadraId, giocatoreId) => {
  if (wishlist[squadraId]) {
    wishlist[squadraId] = wishlist[squadraId].filter(id => id !== giocatoreId)
  }
  return wishlist[squadraId] || []
}

// Ottieni wishlist di una squadra
const getWishlist = (squadraId) => {
  return wishlist[squadraId] || []
}

// Acquista giocatore
const acquistaGiocatore = (squadraId, giocatoreData) => {
  // Trova la squadra direttamente nell'array squadre (non una copia)
  const squadraIndex = squadre.findIndex(s => s.id === parseInt(squadraId))
  if (squadraIndex === -1) {
    throw new Error('Squadra non trovata')
  }
  
  const squadra = squadre[squadraIndex]
  
  // Se giocatoreData è un oggetto giocatore completo
  if (giocatoreData.nome) {
    const { nome, squadra: squadraGiocatore, ruolo, prezzo, quotazione, mia_valutazione, unveil_fvm, gazzetta_fascia, pazzidifanta, note } = giocatoreData
    
    // Verifica budget
    const spesaTotale = squadra.giocatori.reduce((sum, g) => sum + (g.valore || 0), 0)
    if (spesaTotale + prezzo > squadra.budget) {
      throw new Error('Budget insufficiente')
    }
    
    // Aggiungi giocatore alla squadra con tutte le informazioni
    const giocatoreAcquistato = {
      id: giocatoreData.id,
      nome: nome,
      squadra: squadraGiocatore,
      ruolo: ruolo,
      valore: prezzo,
      quotazione: quotazione || mia_valutazione || 0,
      unveil_fvm: unveil_fvm,
      gazzetta_fascia: gazzetta_fascia,
      pazzidifanta: pazzidifanta,
      mia_valutazione: mia_valutazione,
      dataAcquisto: new Date().toISOString(),
      note: note || ''
    }
    
    squadra.giocatori.push(giocatoreAcquistato)
    
    // Debug: log per verificare che il giocatore sia stato aggiunto
    console.log(`✅ Giocatore ${giocatoreAcquistato.nome} aggiunto alla squadra ${squadra.nome}`)
    console.log(`📊 Squadra ora ha ${squadra.giocatori.length} giocatori`)
    
    // Aggiorna budget residuo
    squadra.budget_residuo = squadra.budget - squadra.giocatori.reduce((sum, g) => sum + (g.valore || 0), 0)
    
    // Rimuovi dalla wishlist se presente
    removeFromWishlist(squadraId, giocatoreData.id)
    
    // Registra l'acquisto
    if (!acquisti[squadraId]) {
      acquisti[squadraId] = []
    }
    acquisti[squadraId].push({
      giocatoreId: giocatoreData.id,
      prezzo,
      data: new Date().toISOString(),
      note: note || ''
    })
    
    return squadra
  } else {
    // Gestione legacy per compatibilità
    const { giocatoreId, prezzo, note, data } = giocatoreData
    
    // Verifica budget
    const spesaTotale = squadra.giocatori.reduce((sum, g) => sum + (g.valore || 0), 0)
    if (spesaTotale + prezzo > squadra.budget) {
      throw new Error('Budget insufficiente')
    }
    
    // Aggiungi giocatore alla squadra
    const giocatoreAcquistato = {
      id: giocatoreId,
      valore: prezzo,
      dataAcquisto: data || new Date().toISOString(),
      note: note || ''
    }
    
    squadra.giocatori.push(giocatoreAcquistato)
    
    // Aggiorna budget residuo
    squadra.budget_residuo = squadra.budget - squadra.giocatori.reduce((sum, g) => sum + (g.valore || 0), 0)
    
    // Rimuovi dalla wishlist se presente
    removeFromWishlist(squadraId, giocatoreId)
    
    // Registra l'acquisto
    if (!acquisti[squadraId]) {
      acquisti[squadraId] = []
    }
    acquisti[squadraId].push({
      giocatoreId,
      prezzo,
      data: data || new Date().toISOString(),
      note: note || ''
    })
    
    return squadra
  }
}

// Ottieni statistiche dettagliate squadra
const getSquadraStats = (squadraId) => {
  const squadra = getSquadraById(squadraId)
  if (!squadra) {
    return null
  }
  
  const spesaTotale = squadra.giocatori.reduce((sum, g) => sum + (g.valore || 0), 0)
  const budgetRimanente = squadra.budget_residuo || (squadra.budget - spesaTotale)
  
  // Statistiche per ruolo
  const statsPerRuolo = {}
  squadra.giocatori.forEach(g => {
    if (g.ruolo) {
      if (!statsPerRuolo[g.ruolo]) {
        statsPerRuolo[g.ruolo] = { count: 0, spesa: 0 }
      }
      statsPerRuolo[g.ruolo].count++
      statsPerRuolo[g.ruolo].spesa += g.valore || 0
    }
  })
  
  return {
    squadra: {
      id: squadra.id,
      nome: squadra.nome,
      proprietario: squadra.proprietario
    },
    budget: {
      iniziale: squadra.budget,
      speso: spesaTotale,
      rimanente: budgetRimanente,
      percentualeUtilizzato: (spesaTotale / squadra.budget) * 100
    },
    giocatori: {
      totali: squadra.giocatori.length,
      perRuolo: statsPerRuolo
    },
    wishlist: getWishlist(squadraId).length,
    acquisti: acquisti[squadraId] || []
  }
}

// Reset budget per nuova stagione
const resetBudget = (squadraId, nuovoBudget) => {
  const squadra = getSquadraById(squadraId)
  if (!squadra) {
    throw new Error('Squadra non trovata')
  }
  
  // Reset giocatori e acquisti
  squadra.giocatori = []
  acquisti[squadraId] = []
  
  // Aggiorna budget
  squadra.budget = nuovoBudget || 500
  squadra.budget_residuo = squadra.budget
  squadra.dataCreazione = new Date().toISOString()
  
  return squadra
}

module.exports = {
  getAllSquadre,
  getSquadraById,
  createSquadra,
  updateSquadra,
  deleteSquadra,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  acquistaGiocatore,
  getSquadraStats,
  resetBudget
}
