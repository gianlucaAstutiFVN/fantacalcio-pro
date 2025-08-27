const astaService = require('../services/astaService');

// Registra l'acquisto di un giocatore
const registraAcquisto = async (req, res) => {
  try {
    const { nome, squadra, ruolo, valore, squadraAcquirente, data, unveil_fvm, gazzetta_fascia, pazzidifanta, mia_valutazione, note } = req.body;
    
    const acquisto = await astaService.registraAcquisto({
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
    });
    
    res.json({ success: true, message: 'Acquisto registrato con successo', acquisto });
  } catch (error) {
    console.error('Errore API acquista:', error);
    res.status(500).json({ error: 'Errore nella registrazione dell\'acquisto' });
  }
};

// Ottieni lo storico delle aste
const getStoricoAste = async (req, res) => {
  try {
    const acquisti = await astaService.getStoricoAste();
    res.json(acquisti);
  } catch (error) {
    console.error('Errore API asta:', error);
    res.status(500).json({ error: 'Errore nella lettura dello storico aste' });
  }
};

// Ottieni aste attive
const getAsteAttive = async (req, res) => {
  try {
    const asteAttive = await astaService.getAsteAttive();
    res.json(asteAttive);
  } catch (error) {
    console.error('Errore API aste:', error);
    res.status(500).json({ error: 'Errore nel caricamento delle aste' });
  }
};

module.exports = {
  registraAcquisto,
  getStoricoAste,
  getAsteAttive
};
