import { useState, useEffect } from 'react';
import { giocatoriAPI } from '../../../services/api';
import { Giocatore } from '../../../types';


export interface FormazioneSquadra {
  formazione: Giocatore[];
  immagini: string[];
}

export const useSquadraDetail = (squadraId: string | undefined) => {
  const [formazione, setFormazione] = useState<FormazioneSquadra | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Immagini placeholder per le squadre
  const immaginiPlaceholder = [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
  ];


  const fetchFormazioneSquadra = async (squadra: string) => {
    try {
      // Chiama l'API specifica per la squadra con wishlist
      const response = await giocatoriAPI.getBySquadra(squadra, true);
      
      if (response.success) {
        const giocatori = response.data;
        
        if (!giocatori || giocatori.length === 0) {
          return null;
        }
        
        // Raggruppa i giocatori per ruolo
        const portieri = giocatori.filter((g: Giocatore) => g.ruolo.toLowerCase().includes('portiere'));
        const difensori = giocatori.filter((g: Giocatore) => g.ruolo.toLowerCase().includes('difensore'));
        const centrocampisti = giocatori.filter((g: Giocatore) => g.ruolo.toLowerCase().includes('centrocampista'));
        const attaccanti = giocatori.filter((g: Giocatore) => g.ruolo.toLowerCase().includes('attaccante'));

        // Crea la formazione (11 giocatori)
        const formazione: Giocatore[] = [
          ...portieri,
          ...difensori,
          ...centrocampisti,
          ...attaccanti
        ];

        // Aggiungi numeri di maglia se non presenti
        formazione.forEach((giocatore, index) => {
          (giocatore as any).numero = index + 1;
        });

       
        return {
          formazione,
          immagini: immaginiPlaceholder,
        };
      }
      
      return null;
    } catch (error) {
      console.error(`Errore nel recuperare formazione per ${squadra}:`, error);
      return null;
    }
  };

  useEffect(() => {
    if (!squadraId) {
      setLoading(false);
      return;
    }

    const loadFormazione = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const formazioneData = await fetchFormazioneSquadra(squadraId.toLowerCase());
        
        if (formazioneData) {
          setFormazione(formazioneData);
        } else {
          setError('Formazione non trovata per questa squadra');
        }
      } catch (error) {
        setError('Errore nel caricamento della formazione');
        console.error('Errore nel caricamento della formazione:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFormazione();
  }, [squadraId]);

  const refreshFormazione = () => {
    if (squadraId) {
      fetchFormazioneSquadra(squadraId.toLowerCase()).then(setFormazione);
    }
  };

  return {
    formazione,
    loading,
    error,
    refreshFormazione
  };
};
