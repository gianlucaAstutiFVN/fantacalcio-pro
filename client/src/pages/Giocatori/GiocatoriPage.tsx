import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material'
import { giocatoriAPI, squadreAPI } from '../../services/api'
import { Filters, Giocatore, Squadra } from '../../types'
import GiocatoriDataGrid from './components/GiocatoriDataGrid'
import GiocatoriFilters from './components/GiocatoriFilters'
import RoleSelector from './components/RoleSelector'

const GiocatoriPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [giocatori, setGiocatori] = useState<Giocatore[]>([])
  const [squadre, setSquadre] = useState<Squadra[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isFirstRender = useRef(true)
  const previousRole = useRef<string>('')
  
  // Recupera filtri da URL
  const getInitialFilters = (): Filters => {
    const searchTermFromUrl = searchParams.get('search')
    const squadFromUrl = searchParams.get('squad')
    const statusFromUrl = searchParams.get('status')
    
    return {
      searchTerm: searchTermFromUrl || '',
      squad: squadFromUrl || '',
      status: statusFromUrl || '',
    }
  }
  
  const [filters, setFilters] = useState<Filters>(getInitialFilters)

  // Get current role from URL params or default to 'tutti'
  const currentRole = searchParams.get('ruolo') || 'tutti'

  useEffect(() => {
    fetchSquadre()
  }, [])

  useEffect(() => {
    fetchGiocatori()
  }, [currentRole])

  const fetchGiocatori = async () => {
    setLoading(true)
    setError(null)
    
    // Timeout di sicurezza per evitare loading infinito
    const loadingTimeout = setTimeout(() => {
      setLoading(false)
      setError('Timeout nel caricamento dei giocatori')
    }, 10000) // 10 secondi
    
    try {
      let response
      if (currentRole === 'tutti') {
        response = await giocatoriAPI.getAll(true)
      } else {
        response = await giocatoriAPI.getByRole(currentRole, true)
      }

      if (response.success && Array.isArray(response.data)) {
        const giocatoriConId = response.data.map((g: any, index: number) => ({
          ...g,
          id: g.id || index.toString(),
          valore: g.valore || 0
        }))
        setGiocatori(giocatoriConId)
      } else {
        console.error('Formato risposta giocatori non valido:', response)
        setError('Formato risposta giocatori non valido')
        setGiocatori([])
      }
    } catch (err) {
      setError('Errore nel caricamento dei giocatori')
      console.error('Errore fetch giocatori:', err)
      setGiocatori([])
    } finally {
      clearTimeout(loadingTimeout)
      setLoading(false)
    }
  }

  const fetchSquadre = async () => {
    try {
      const response = await squadreAPI.getAll()
      if (response.success && Array.isArray(response.data)) {
        setSquadre(response.data)
      } else if (Array.isArray(response)) {
        setSquadre(response)
      } else {
        console.error('Formato risposta squadre non valido:', response)
        setSquadre([])
      }
    } catch (err) {
      console.error('Errore fetch squadre:', err)
      setSquadre([])
    }
  }

  const handleRoleChange = (newRole: string) => {
    // Se il ruolo è effettivamente cambiato, resetta i filtri
    if (newRole !== currentRole) {
      const newSearchParams = new URLSearchParams(searchParams)
      
      // Imposta il nuovo ruolo
      if (newRole === 'tutti') {
        newSearchParams.delete('ruolo')
      } else {
        newSearchParams.set('ruolo', newRole)
      }
      
      // Resetta tutti i filtri e parametri quando cambia ruolo
      newSearchParams.delete('search')
      newSearchParams.delete('squad')
      newSearchParams.delete('status')
      newSearchParams.delete('page')
      newSearchParams.delete('pageSize')
      newSearchParams.delete('sortField')
      newSearchParams.delete('sortDirection')
      
      setSearchParams(newSearchParams)
      
      // Resetta filtri locali
      const resetFilters = { searchTerm: '', squad: '', status: '' }
      setFilters(resetFilters)
    }
  }

  const handleFiltersChange = async (newFilters: typeof filters) => {
    setLoading(true)
    setFilters(newFilters)
    
    // Aggiorna URL
    const newSearchParams = new URLSearchParams(searchParams)
    if (newFilters.searchTerm) {
      newSearchParams.set('search', newFilters.searchTerm)
    } else {
      newSearchParams.delete('search')
    }
    if (newFilters.squad) {
      newSearchParams.set('squad', newFilters.squad)
    } else {
      newSearchParams.delete('squad')
    }
    if (newFilters.status) {
      newSearchParams.set('status', newFilters.status)
    } else {
      newSearchParams.delete('status')
    }
    setSearchParams(newSearchParams)
    
    // Il loading si ferma immediatamente per i filtri client-side
    setLoading(false)
  }

  // Sincronizza filtri con URL quando cambia
  useEffect(() => {
    const searchTermFromUrl = searchParams.get('search')
    const squadFromUrl = searchParams.get('squad')
    const statusFromUrl = searchParams.get('status')
    
    const newFilters = {
      searchTerm: searchTermFromUrl || '',
      squad: squadFromUrl || '',
      status: statusFromUrl || '',
    }
    
    if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
      setFilters(newFilters)
    }
  }, [searchParams])

  // Resetta filtri quando cambia il ruolo (ma mantieni URL)
  useEffect(() => {
    // Salva il ruolo corrente per il prossimo confronto
    const currentRoleValue = currentRole
    
    // Aggiorna i ref per il prossimo render
    previousRole.current = currentRoleValue
    isFirstRender.current = false
  }, [currentRole])

  const handleRefresh = () => {
    fetchGiocatori()
  }

  // Callback per aggiornamento ottimistico
  const handleGiocatoreUpdated = (giocatoreAggiornato: Giocatore) => {
    setGiocatori(prevGiocatori => 
      prevGiocatori.map(g => 
        g.id === giocatoreAggiornato.id 
          ? { ...g, ...giocatoreAggiornato }
          : g
      )
    )
  }


  // Apply client-side filters only (search and squad)
  const filteredGiocatori = giocatori.filter(giocatore => {
    // Apply search filter
    if (filters.searchTerm &&
      !giocatore.nome.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false
    }

    // Apply squad filter (multiple squads separated by comma)
    if (filters.squad) {
      const selectedSquads = filters.squad.split(',').map(s => s.trim()).filter(s => s)
      if (selectedSquads.length > 0 && !selectedSquads.includes(giocatore.squadra)) {
        return false
      }
    }

    // Apply status filter (multiple statuses separated by comma)
    if (filters.status) {
      const selectedStatuses = filters.status.split(',').map(s => s.trim()).filter(s => s)
      if (selectedStatuses.length > 0) {
        const matchesStatus = selectedStatuses.some(status => {
          switch (status) {
            case 'disponibile':
              return giocatore.status === 'disponibile'
            case 'acquistato':
              return giocatore.status === 'acquistato'
            case 'inWishlist':
              return giocatore.inWishlist === true
            case 'preferito':
              return giocatore.preferito === 1
            default:
              return false
          }
        })
        if (!matchesStatus) {
          return false
        }
      }
    }

    return true
  })


  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
        Gestione Giocatori
        {currentRole !== 'tutti' && (
          <Typography component="span" variant="h6" color="text.secondary" sx={{ ml: { xs: 1, md: 2 } }}>
            - {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}
          </Typography>
        )}
      </Typography>

      {/* Role selection buttons */}
      <RoleSelector
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        isLoading={loading}
      />

      {/* Filters */}
      <GiocatoriFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        isLoading={loading}
      />

      {/* Show loading indicator for role changes */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress size={24} />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <GiocatoriDataGrid
          giocatori={filteredGiocatori}
          squadre={squadre}
          onRefresh={handleRefresh}
          onGiocatoreUpdated={handleGiocatoreUpdated}
        />
      )}


    </Box>
  )
}

export default GiocatoriPage
