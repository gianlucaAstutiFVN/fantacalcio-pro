import React, { useState, useEffect } from 'react'
import {
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { Giocatore } from '../../../../types'

interface WishlistManagerProps {
  giocatore: Giocatore
  isInWishlist: boolean
  onWishlistToggle: (giocatoreId: string, isInWishlist: boolean) => Promise<void>
  onRefresh?: () => void // Callback per refresh solo in caso di errore
}

const WishlistManager: React.FC<WishlistManagerProps> = ({
  giocatore,
  isInWishlist,
  onWishlistToggle,
  onRefresh,
}) => {
  // Stato locale per gestire l'aggiornamento ottimistico
  const [optimisticWishlist, setOptimisticWishlist] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Determina lo stato corrente della wishlist (ottimistico o reale)
  const currentWishlistState = optimisticWishlist !== null ? optimisticWishlist : isInWishlist

  // Reset dello stato ottimistico quando i dati cambiano
  useEffect(() => {
    setOptimisticWishlist(null)
  }, [isInWishlist])

  const handleWishlistToggle = async () => {
    // Se è già in corso un aggiornamento, non fare nulla
    if (isLoading) return

    // Salva lo stato precedente per il rollback in caso di errore
    const previousState = isInWishlist
    
    // Aggiornamento ottimistico immediato
    setOptimisticWishlist(!currentWishlistState)
    setIsLoading(true)

    try {
      // Chiama l'API
      await onWishlistToggle(giocatore.id, currentWishlistState)
      
      // Se l'API ha successo, mantieni lo stato ottimistico
      // NON fare refresh - l'UI è già aggiornata ottimisticamente
      console.log('Wishlist aggiornata con successo - nessun refresh necessario')
      
    } catch (error) {
      console.error('Errore nella gestione wishlist:', error)
      
      // Rollback in caso di errore
      setOptimisticWishlist(previousState)
      
      // Refresh dei dati per sincronizzare con lo stato reale del server
      if (onRefresh) {
        console.log('Errore wishlist - refresh dati per sincronizzazione')
        onRefresh()
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Tooltip 
      title={`${currentWishlistState ? 'Rimuovi da' : 'Aggiungi a'} wishlist`}
      enterDelay={500}
      leaveDelay={0}
      disableHoverListener={isLoading}
      placement="top"
    >
      <IconButton
        size="small"
        color={currentWishlistState ? "error" : "default"}
        onClick={handleWishlistToggle}
        disabled={isLoading}
        sx={{ 
          minWidth: 32, 
          height: 32,
          position: 'relative',
          '&:hover': {
            backgroundColor: currentWishlistState ? 'error.light' : 'action.hover'
          }
        }}
      >
        {isLoading ? (
          <CircularProgress 
            size={16} 
            color={currentWishlistState ? "error" : "primary"}
            thickness={4}
            sx={{ 
              transition: 'none',
              animation: 'none'
            }}
          />
        ) : currentWishlistState ? (
          <FavoriteIcon fontSize="small" />
        ) : (
          <FavoriteBorderIcon fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  )
}

export default WishlistManager
