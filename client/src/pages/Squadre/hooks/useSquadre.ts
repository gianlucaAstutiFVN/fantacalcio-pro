import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Squadra } from '../../../types'

interface UseSquadreReturn {
  squadre: Squadra[]
  loading: boolean
  error: string
  formLoading: boolean
  fetchSquadre: () => Promise<void>
  createSquadra: (formData: any) => Promise<boolean>
  updateSquadra: (id: number, formData: any) => Promise<boolean>
  deleteSquadra: (id: number) => Promise<boolean>
  assegnaGiocatore: (giocatoreId: string, squadraId: number, prezzo: number) => Promise<boolean>
  svincolaGiocatore: (giocatoreId: string, squadraId: number) => Promise<boolean>
}

export const useSquadre = (): UseSquadreReturn => {
  const [squadre, setSquadre] = useState<Squadra[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  const fetchSquadre = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/squadre')
      if (response.data.success && Array.isArray(response.data.data)) {
        console.log('📥 Squadre ricevute dal server:', response.data.data)
        
        // Debug: verifica giocatori per ogni squadra
        response.data.data.forEach((squadra: any) => {
          if (squadra.giocatori && squadra.giocatori.length > 0) {
            console.log(`🏆 Frontend - Squadra ${squadra.nome}: ${squadra.giocatori.length} giocatori`)
            squadra.giocatori.forEach((g: any) => {
              console.log(`  - ${g.nome} (${g.ruolo}) - €${g.valore}`)
            })
          }
        })
        
        setSquadre(response.data.data)
        setError('')
      } else {
        console.error('Formato risposta non valido:', response.data)
        setError('Formato risposta non valido dal server')
        setSquadre([])
      }
    } catch (error) {
      console.error('Errore nel caricamento squadre:', error)
      setError('Errore nel caricamento delle squadre')
      setSquadre([])
    } finally {
      setLoading(false)
    }
  }, [])

  const createSquadra = useCallback(async (formData: any): Promise<boolean> => {
    try {
      setFormLoading(true)
      const response = await axios.post('/api/squadre', formData)
      if (response.data.success && response.data.data) {
        setSquadre(prev => [...prev, response.data.data])
        return true
      } else {
        const errorMessage = response.data.error || response.data.message || 'Errore nella creazione della squadra'
        alert(errorMessage)
        return false
      }
    } catch (error: any) {
      console.error('Errore nel salvataggio squadra:', error)
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Errore nel salvataggio della squadra'
      alert(errorMessage)
      return false
    } finally {
      setFormLoading(false)
    }
  }, [])

  const updateSquadra = useCallback(async (id: number, formData: any): Promise<boolean> => {
    try {
      setFormLoading(true)
      const response = await axios.put(`/api/squadre/${id}`, formData)
      if (response.data.success && response.data.data) {
        setSquadre(prev => prev.map(s => s.id === id ? response.data.data : s))
        return true
      } else {
        const errorMessage = response.data.error || response.data.message || 'Errore nell\'aggiornamento della squadra'
        alert(errorMessage)
        return false
      }
    } catch (error: any) {
      console.error('Errore nel salvataggio squadra:', error)
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Errore nel salvataggio della squadra'
      alert(errorMessage)
      return false
    } finally {
      setFormLoading(false)
    }
  }, [])

  const deleteSquadra = useCallback(async (id: number): Promise<boolean> => {
    try {
      const response = await axios.delete(`/api/squadre/${id}`)
      if (response.data.success) {
        setSquadre(prev => prev.filter(s => s.id !== id))
        return true
      } else {
        const errorMessage = response.data.error || response.data.message || 'Errore nell\'eliminazione della squadra'
        console.error('Risposta non valida:', response.data)
        alert(errorMessage)
        return false
      }
    } catch (error: any) {
      console.error('Errore nell\'eliminazione squadra:', error)
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Errore nell\'eliminazione della squadra'
      alert(errorMessage)
      return false
    }
  }, [])

  const assegnaGiocatore = useCallback(async (
    giocatoreId: string, 
    squadraId: number, 
    prezzo: number
  ): Promise<boolean> => {
    try {
      setFormLoading(true)
      
      // Chiamata POST per assegnare il giocatore alla squadra
      const response = await axios.post('/api/squadre/assegna-giocatore', {
        giocatoreId,
        squadraId,
        prezzo
      })
      
      if (response.data.success) {
        // Se l'assegnazione va a buon fine, invalida la cache e ricarica le squadre
        console.log('Giocatore assegnato con successo, ricarico le squadre...')
        await fetchSquadre()
        return true
      } else {
        // Se la risposta non è di successo, mostra l'errore dal server
        const errorMessage = response.data.message || 'Errore nell\'assegnazione del giocatore'
        console.error('Errore server:', response.data)
        alert(errorMessage)
        return false
      }
    } catch (error: any) {
      console.error('Errore nell\'assegnazione giocatore:', error)
      
      // Gestione errori specifici
      let errorMessage = 'Errore nell\'assegnazione del giocatore'
      
      if (error.response) {
        // Errore dal server con status code
        const status = error.response.status
        const data = error.response.data
        
        switch (status) {
          case 400:
            errorMessage = data.message || 'Dati non validi per l\'assegnazione'
            break
          case 404:
            errorMessage = 'Giocatore o squadra non trovati'
            break
          case 409:
            errorMessage = data.message || 'Conflitto: giocatore già assegnato o budget insufficiente'
            break
          case 500:
            errorMessage = 'Errore interno del server'
            break
          default:
            errorMessage = data.message || `Errore del server (${status})`
        }
      } else if (error.request) {
        // Errore di rete
        errorMessage = 'Errore di connessione al server'
      }
      
      alert(errorMessage)
      return false
    } finally {
      setFormLoading(false)
    }
  }, [fetchSquadre])

  const svincolaGiocatore = useCallback(async (
    giocatoreId: string, 
    squadraId: number
  ): Promise<boolean> => {
    try {
      setFormLoading(true)
      
      // Chiamata POST per svincolare il giocatore dalla squadra
      const response = await axios.post('/api/squadre/svincola-giocatore', {
        giocatoreId,
        squadraId
      })
      
      if (response.data.success) {
        // Se lo svincolo va a buon fine, invalida la cache e ricarica le squadre
        console.log('Giocatore svincolato con successo, ricarico le squadre...')
        await fetchSquadre()
        
        // Mostra messaggio di successo con i dettagli
        const data = response.data.data
        alert(`Giocatore ${data.giocatore} svincolato con successo!\nBudget recuperato: €${data.budgetRecuperato}`)
        
        return true
      } else {
        // Se la risposta non è di successo, mostra l'errore dal server
        const errorMessage = response.data.message || 'Errore nello svincolo del giocatore'
        console.error('Errore server:', response.data)
        alert(errorMessage)
        return false
      }
    } catch (error: any) {
      console.error('Errore nello svincolo giocatore:', error)
      
      // Gestione errori specifici
      let errorMessage = 'Errore nello svincolo del giocatore'
      
      if (error.response) {
        // Errore dal server con status code
        const status = error.response.status
        const data = error.response.data
        
        switch (status) {
          case 400:
            errorMessage = data.message || 'Dati non validi per lo svincolo'
            break
          case 404:
            errorMessage = 'Giocatore o squadra non trovati'
            break
          case 409:
            errorMessage = data.message || 'Conflitto: giocatore non assegnato a questa squadra'
            break
          case 500:
            errorMessage = 'Errore interno del server'
            break
          default:
            errorMessage = data.message || `Errore del server (${status})`
        }
      } else if (error.request) {
        // Errore di rete
        errorMessage = 'Errore di connessione al server'
      }
      
      alert(errorMessage)
      return false
    } finally {
      setFormLoading(false)
    }
  }, [fetchSquadre])

  // Carica le squadre al mount
  useEffect(() => {
    fetchSquadre()
  }, [fetchSquadre])

  return {
    squadre,
    loading,
    error,
    formLoading,
    fetchSquadre,
    createSquadra,
    updateSquadra,
    deleteSquadra,
    assegnaGiocatore,
    svincolaGiocatore
  }
}
