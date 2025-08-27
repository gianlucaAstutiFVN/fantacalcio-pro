import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Giocatore } from '../../../types'

interface UseGiocatoriReturn {
  giocatori: Giocatore[]
  loading: boolean
  error: string
  fetchGiocatori: () => Promise<void>
  getGiocatoriDisponibili: () => Giocatore[]
  getTuttiGiocatori: () => Giocatore[]
}

export const useGiocatori = (): UseGiocatoriReturn => {
  const [giocatori, setGiocatori] = useState<Giocatore[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchGiocatori = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/giocatori')
      if (response.data.success && Array.isArray(response.data.data)) {
        const giocatoriConId = response.data.data.map((g: any, index: number) => ({
          ...g,
          id: g.id || index.toString(),
          valore: g.valore || 0
        }))
        setGiocatori(giocatoriConId)
        setError('')
      } else {
        console.error('Formato risposta giocatori non valido:', response.data)
        setError('Formato risposta giocatori non valido')
        setGiocatori([])
      }
    } catch (error) {
      console.error('Errore nel caricamento giocatori:', error)
      setError('Errore nel caricamento dei giocatori')
      setGiocatori([])
    } finally {
      setLoading(false)
    }
  }, [])

  const getGiocatoriDisponibili = useCallback(() => {
    // Filtra giocatori disponibili (non venduti e non già assegnati)
    return giocatori.filter(g => g.status === 'disponibile')
  }, [giocatori])

  const getTuttiGiocatori = useCallback(() => {
    // Restituisce tutti i giocatori (utile per debug e amministrazione)
    return giocatori
  }, [giocatori])

  // Carica i giocatori al mount
  useEffect(() => {
    fetchGiocatori()
  }, [fetchGiocatori])

  return {
    giocatori,
    loading,
    error,
    fetchGiocatori,
    getGiocatoriDisponibili,
    getTuttiGiocatori
  }
}
