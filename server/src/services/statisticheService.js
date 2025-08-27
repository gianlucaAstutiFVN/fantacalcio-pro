const giocatoriService = require('./giocatoriService');
const astaService = require('./astaService');
const squadreService = require('./squadreService');

// Importa anche il sistema squadre-db per compatibilità
let squadreDB;
try {
  squadreDB = require('../../squadre-db');
} catch (error) {
  
}

// Ottieni statistiche generali
const getStatisticheGenerali = async () => {
  try {
    const giocatori = await giocatoriService.getAllGiocatori();
    const acquisti = await astaService.getStoricoAste();
    
    const spesaTotale = acquisti.reduce((sum, a) => sum + (parseInt(a.valore) || 0), 0);
    const prezzoMedio = acquisti.length > 0 ? spesaTotale / acquisti.length : 0;
    
    // Distribuzione per ruolo
    const distribuzioneRuolo = {};
    acquisti.forEach(a => {
      const ruolo = a.ruolo || 'Non specificato';
      distribuzioneRuolo[ruolo] = (distribuzioneRuolo[ruolo] || 0) + 1;
    });
    
    // Distribuzione per squadra acquirente
    const distribuzioneSquadra = {};
    acquisti.forEach(a => {
      const squadra = a.squadraAcquirente || 'Non specificato';
      distribuzioneSquadra[squadra] = (distribuzioneSquadra[squadra] || 0) + 1;
    });
    
    const statistiche = {
      totaleAcquisti: acquisti.length,
      spesaTotale,
      prezzoMedio: Math.round(prezzoMedio * 100) / 100,
      distribuzioneRuolo,
      distribuzioneSquadra,
      giocatoriDisponibili: giocatori.filter(g => g.status === 'disponibile').length,
      giocatoriVenduti: giocatori.filter(g => g.status === 'venduto').length
    };
    
    return statistiche;
  } catch (error) {
    throw error;
  }
};

// Ottieni squadre da entrambi i sistemi
const getAllSquadre = async () => {
  try {
    // Prova prima il database
    if (squadreService && typeof squadreService.getAllSquadre === 'function') {
      return await squadreService.getAllSquadre();
    }
  } catch (error) {
    
  }
  
  // Fallback al sistema squadre-db
  if (squadreDB && typeof squadreDB.getAllSquadre === 'function') {
    return squadreDB.getAllSquadre();
  }
  
  // Se nessuno dei due è disponibile, restituisci squadre di esempio
  return [
    { nome: 'Squadra A', budget: 500, budget_residuo: 300 },
    { nome: 'Squadra B', budget: 500, budget_residuo: 250 },
    { nome: 'Squadra C', budget: 500, budget_residuo: 400 }
  ];
};

// Ottieni statistiche della lega
const getStatisticheLega = async () => {
  try {
    const acquisti = await astaService.getStatisticheAste();
    const squadre = await getAllSquadre();
    
    // Top giocatori per reparto
    const topGiocatoriPerRuolo = {};
    const ruoli = ['portiere', 'difensore', 'centrocampista', 'attaccante'];
    
    ruoli.forEach(ruolo => {
      const giocatoriRuolo = acquisti.filter(a => a.ruolo === ruolo);
      topGiocatoriPerRuolo[ruolo] = giocatoriRuolo
        .sort((a, b) => (parseInt(b.valore) || 0) - (parseInt(a.valore) || 0))
        .slice(0, 10)
        .map(a => ({
          nome: a.nome,
          squadra: a.squadra,
          ruolo: a.ruolo,
          valore: parseInt(a.valore) || 0,
          squadraAcquirente: a.squadraAcquirente
        }));
    });
    
    // Statistiche per ruolo
    const statisticheRuoli = ruoli.map(ruolo => {
      const acquistiRuolo = acquisti.filter(a => a.ruolo === ruolo);
      const spesaTotale = acquistiRuolo.reduce((sum, a) => sum + (parseInt(a.valore) || 0), 0);
      const prezzoMedio = acquistiRuolo.length > 0 ? spesaTotale / acquistiRuolo.length : 0;
      
      return {
        ruolo,
        spesaTotale,
        numeroAcquisti: acquistiRuolo.length,
        prezzoMedio: Math.round(prezzoMedio * 100) / 100,
        topGiocatori: topGiocatoriPerRuolo[ruolo] || []
      };
    });
    
    // Statistiche per squadra
    const statisticheSquadre = squadre.map(squadra => {
      const acquistiSquadra = acquisti.filter(a => a.squadraAcquirente === squadra.nome);
      const spesaTotale = acquistiSquadra.reduce((sum, a) => sum + (parseInt(a.valore) || 0), 0);
      
      const distribuzioneRuoli = {};
      const spesaPerRuolo = {};
      
      ruoli.forEach(ruolo => {
        const acquistiRuolo = acquistiSquadra.filter(a => a.ruolo === ruolo);
        distribuzioneRuoli[ruolo] = acquistiRuolo.length;
        spesaPerRuolo[ruolo] = acquistiRuolo.reduce((sum, a) => sum + (parseInt(a.valore) || 0), 0);
      });
      
      return {
        squadra: squadra.nome,
        spesaTotale,
        budgetRimanente: squadra.budget_residuo || squadra.budget || 0,
        distribuzioneRuoli,
        spesaPerRuolo
      };
    });
    
    const spesaTotaleLega = acquisti.reduce((sum, a) => sum + (parseInt(a.valore) || 0), 0);
    const prezzoMedioLega = acquisti.length > 0 ? spesaTotaleLega / acquisti.length : 0;
    
    return {
      topGiocatoriPerRuolo,
      statisticheRuoli,
      statisticheSquadre,
      spesaTotaleLega,
      numeroTotaleAcquisti: acquisti.length,
      prezzoMedioLega: Math.round(prezzoMedioLega * 100) / 100
    };
  } catch (error) {
    throw error;
  }
};

// Ottieni statistiche comparative
const getStatisticheComparative = async () => {
  try {
    const acquisti = await astaService.getStatisticheAste();
    const squadre = await getAllSquadre();
    
    const statisticheSquadre = squadre.map(squadra => {
      const acquistiSquadra = acquisti.filter(a => a.squadraAcquirente === squadra.nome);
      const spesaTotale = acquistiSquadra.reduce((sum, a) => sum + (parseInt(a.valore) || 0), 0);
      const prezzoMedio = acquistiSquadra.length > 0 ? spesaTotale / acquistiSquadra.length : 0;
      
      const distribuzioneRuoli = {};
      const spesaPerRuolo = {};
      
      ['portiere', 'difensore', 'centrocampista', 'attaccante'].forEach(ruolo => {
        const acquistiRuolo = acquistiSquadra.filter(a => a.ruolo === ruolo);
        distribuzioneRuoli[ruolo] = acquistiRuolo.length;
        spesaPerRuolo[ruolo] = acquistiRuolo.reduce((sum, a) => sum + (parseInt(a.valore) || 0), 0);
      });
      
      // Calcolo efficienza spesa (rapporto qualità/prezzo)
      // Per ora usiamo un valore basato sul numero di giocatori e spesa media
      const efficienzaSpesa = acquistiSquadra.length > 0 ? 
        (acquistiSquadra.length * 100) / (spesaTotale / 1000) : 0;
      
      return {
        squadra: squadra.nome,
        spesaTotale,
        numeroGiocatori: acquistiSquadra.length,
        prezzoMedio: Math.round(prezzoMedio * 100) / 100,
        distribuzioneRuoli,
        spesaPerRuolo,
        efficienzaSpesa: Math.round(efficienzaSpesa * 100) / 100
      };
    });
    
    return statisticheSquadre;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getStatisticheGenerali,
  getStatisticheLega,
  getStatisticheComparative
};
