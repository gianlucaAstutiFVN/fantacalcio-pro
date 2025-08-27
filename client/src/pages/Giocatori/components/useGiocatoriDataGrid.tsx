import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Giocatore } from '../../../types'
import axios from 'axios'

interface UseGiocatoriDataGridProps {
  onRefresh?: () => void
  onGiocatoreUpdated?: (giocatore: Giocatore) => void
}

export const useGiocatoriDataGrid = ({ onRefresh, onGiocatoreUpdated }: UseGiocatoriDataGridProps) => {
  const [searchParams, setSearchParams] = useSearchParams()
  
  // Recupera paginazione da URL o default
  const getInitialPagination = () => {
    const pageFromUrl = searchParams.get('page')
    const pageSizeFromUrl = searchParams.get('pageSize')
    
    if (pageFromUrl && pageSizeFromUrl) {
      return {
        page: parseInt(pageFromUrl, 10),
        pageSize: parseInt(pageSizeFromUrl, 10)
      }
    }
    
    return { page: 0, pageSize: 25 }
  }

  // Recupera sorting da URL o default
  const getInitialSorting = () => {
    const sortField = searchParams.get('sortField')
    const sortDirection = searchParams.get('sortDirection')
    
    if (sortField && sortDirection) {
      return [{ field: sortField, sort: sortDirection }]
    }
    
    return []
  }

  const [paginationModel, setPaginationModel] = useState(getInitialPagination)
  const [sortingModel, setSortingModel] = useState(getInitialSorting)

  const [selectedGiocatore, setSelectedGiocatore] = useState<Giocatore | null>(null)
  const [openAcquistaDialog, setOpenAcquistaDialog] = useState(false)
  const [openSvincolaDialog, setOpenSvincolaDialog] = useState(false)
  const [giocatoreDaSvincolare, setGiocatoreDaSvincolare] = useState<Giocatore | null>(null)
  const [openEditNoteDialog, setOpenEditNoteDialog] = useState(false)
  const [giocatorePerNote, setGiocatorePerNote] = useState<Giocatore | null>(null)
  const [openEditValutazioneDialog, setOpenEditValutazioneDialog] = useState(false)
  const [giocatorePerValutazione, setGiocatorePerValutazione] = useState<Giocatore | null>(null)

  // Determina se un giocatore è stato acquistato
  const isGiocatoreAcquistato = (giocatore: Giocatore) => {
    return giocatore.status === 'acquistato' 
  }

  // Determina se un giocatore è nella wishlist globale
  const isGiocatoreInWishlist = (giocatore: Giocatore) => {
    return giocatore.inWishlist
  }

  // Funzione per assegnare classi CSS alle righe
  const getRowClassName = (params: any) => {
    const giocatore = params.row
    let className = ''
    
    if (isGiocatoreAcquistato(giocatore)) {
      className += 'row-acquistato '
    }
    
    if (isGiocatoreInWishlist(giocatore)) {
      className += 'row-wishlist '
    }
    
    return className.trim()
  }

  const handleAssegnaGiocatore = (giocatore: Giocatore) => {
    setSelectedGiocatore(giocatore)
    setOpenAcquistaDialog(true)
  }

  const handleAcquistaGiocatore = async (squadraId: number, prezzo: number) => {
    if (selectedGiocatore) {
      try {
        // Usa l'endpoint corretto per assegnare giocatori
        await axios.post('/api/squadre/assegna-giocatore', {
          giocatoreId: selectedGiocatore.id,
          squadraId: squadraId,
          prezzo: prezzo
        })
        
        if (onRefresh) onRefresh()
        alert('Giocatore assegnato con successo!')
        setOpenAcquistaDialog(false) // Chiudi il dialog dopo il successo
      } catch (error: any) {
        console.error('Errore nell\'assegnazione:', error)
        
        // Gestione errori più dettagliata
        let errorMessage = 'Errore nell\'assegnazione del giocatore'
        
        if (error.response?.data?.error) {
          errorMessage = error.response.data.error
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        }
        
        alert(errorMessage)
        throw error
      }
    }
  }

  const handleSvincolaGiocatore = (giocatore: Giocatore) => {
    setGiocatoreDaSvincolare(giocatore)
    setOpenSvincolaDialog(true)
  }

  const handleSvincolaConfirm = async (giocatore: Giocatore) => {
    try {
      // Chiama l'API per svincolare il giocatore
      // Per ora usiamo fantasquadra, ma in futuro potremmo usare un campo squadra_id specifico
      await axios.post(`/api/squadre/svincola-giocatore`, {
        giocatoreId: giocatore.id,
        squadraId: giocatore.fantasquadra // Usa la fantasquadra del giocatore
      })
      
      if (onRefresh) onRefresh()
      alert('Giocatore svincolato con successo!')
      setOpenSvincolaDialog(false) // Chiudi il dialog dopo il successo
    } catch (error: any) {
      console.error('Errore nello svincolo:', error)
      
      // Gestione errori più dettagliata
      let errorMessage = 'Errore nello svincolo del giocatore'
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      
      alert(errorMessage)
      throw error
    }
  }

  const handleWishlistToggle = async (giocatoreId: string, isInWishlist: boolean) => {
    try {
      if (isInWishlist) {
        // Rimuovi dalla wishlist globale
        await axios.delete(`/api/squadre/wishlist/${giocatoreId}`)
      } else {
        // Aggiungi alla wishlist globale
        await axios.post(`/api/squadre/wishlist`, { giocatoreId })
      }
      
      // NON aggiornare i dati - l'UI è già aggiornata ottimisticamente
      // Il refresh verrà fatto solo in caso di errore dal WishlistManager
    } catch (error) {
      console.error('Errore nella gestione wishlist:', error)
      // Rilancia l'errore per permettere al componente WishlistManager di gestire il rollback
      throw error
    }
  }

  const handleEditNote = (giocatore: Giocatore) => {
    setGiocatorePerNote(giocatore)
    setOpenEditNoteDialog(true)
  }

  const handleNoteUpdated = (giocatore: Giocatore) => {
    // Aggiornamento ottimistico
    if (onGiocatoreUpdated) {
      onGiocatoreUpdated(giocatore)
    }
    setOpenEditNoteDialog(false)
    setGiocatorePerNote(null)
  }

  const handleEditValutazione = (giocatore: Giocatore) => {
    setGiocatorePerValutazione(giocatore)
    setOpenEditValutazioneDialog(true)
  }

  const handleValutazioneUpdated = (giocatore: Giocatore) => {
    // Aggiornamento ottimistico
    if (onGiocatoreUpdated) {
      onGiocatoreUpdated(giocatore)
    }
    setOpenEditValutazioneDialog(false)
    setGiocatorePerValutazione(null)
  }



  // Aggiorna paginazione e salva in URL
  const handlePaginationModelChange = (newModel: { page: number; pageSize: number }) => {
    setPaginationModel(newModel)
    
    // Aggiorna URL
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('page', newModel.page.toString())
    newSearchParams.set('pageSize', newModel.pageSize.toString())
    setSearchParams(newSearchParams)
  }

  // Aggiorna sorting e salva in URL
  const handleSortingModelChange = (newModel: any[]) => {
    setSortingModel(newModel)
    
    // Aggiorna URL
    const newSearchParams = new URLSearchParams(searchParams)
    if (newModel.length > 0) {
      newSearchParams.set('sortField', newModel[0].field)
      newSearchParams.set('sortDirection', newModel[0].sort)
    } else {
      newSearchParams.delete('sortField')
      newSearchParams.delete('sortDirection')
    }
    setSearchParams(newSearchParams)
  }

  // Sincronizza con URL quando cambia
  useEffect(() => {
    const pageFromUrl = searchParams.get('page')
    const pageSizeFromUrl = searchParams.get('pageSize')
    const sortField = searchParams.get('sortField')
    const sortDirection = searchParams.get('sortDirection')
    
    if (pageFromUrl && pageSizeFromUrl) {
      const newPagination = {
        page: parseInt(pageFromUrl, 10),
        pageSize: parseInt(pageSizeFromUrl, 10)
      }
      if (newPagination.page !== paginationModel.page || newPagination.pageSize !== paginationModel.pageSize) {
        setPaginationModel(newPagination)
      }
    }
    
    if (sortField && sortDirection) {
      const newSorting = [{ field: sortField, sort: sortDirection }]
      if (JSON.stringify(newSorting) !== JSON.stringify(sortingModel)) {
        setSortingModel(newSorting)
      }
    }
  }, [searchParams])

  return {
    // Stati
    paginationModel,
    sortingModel,
    selectedGiocatore,
    openAcquistaDialog,
    openSvincolaDialog,
    giocatoreDaSvincolare,
    openEditNoteDialog,
    giocatorePerNote,
    openEditValutazioneDialog,
    giocatorePerValutazione,
    
    // Funzioni
    setPaginationModel: handlePaginationModelChange,
    setSortingModel: handleSortingModelChange,
    setOpenAcquistaDialog,
    setOpenSvincolaDialog,
    setOpenEditNoteDialog,
    setOpenEditValutazioneDialog,
    
    // Logica
    isGiocatoreAcquistato,
    isGiocatoreInWishlist,
    getRowClassName,
    handleAssegnaGiocatore,
    handleAcquistaGiocatore,
    handleSvincolaGiocatore,
    handleSvincolaConfirm,
    handleEditNote,
    handleNoteUpdated,
    handleEditValutazione,
    handleValutazioneUpdated,
    handleWishlistToggle,
    
    // Callback per refresh
    onRefresh,
  }
}
