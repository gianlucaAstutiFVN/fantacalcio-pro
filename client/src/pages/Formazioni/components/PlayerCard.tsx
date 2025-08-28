import React, { useState } from 'react';
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  Chip,
  Tooltip,
  IconButton,
  CircularProgress
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material';
import { Giocatore } from '../../../types';
import { wishlistAPI } from '../../../services/api';

interface PlayerCardProps {
  giocatore: Giocatore;
  index: number;
  onClick: (giocatore: Giocatore) => void;
  onPlayerUpdated?: (giocatore: Giocatore) => void;
}

const getRuoloIcon = (ruolo: string | undefined) => {
  if (!ruolo) return '👤';
  
  switch (ruolo.toLowerCase()) {
    case 'portiere':
      return '🛡️';
    case 'difensore':
      return '🛡️';
    case 'centrocampista':
      return '⚽';
    case 'attaccante':
      return '🏆';
    default:
      return '👤';
  }
};

const getRuoloColor = (ruolo: string | undefined) => {
  if (!ruolo) return 'default';
  
  switch (ruolo.toLowerCase()) {
    case 'portiere':
      return 'primary';
    case 'difensore':
      return 'success';
    case 'centrocampista':
      return 'warning';
    case 'attaccante':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusColor = (status: string | undefined) => {
  if (!status) return 'default';
  
  switch (status) {
    case 'disponibile':
      return 'success';
    case 'acquistato':
      return 'primary';
    case 'venduto':
      return 'error';
    default:
      return 'default';
  }
};

const PlayerCard: React.FC<PlayerCardProps> = ({ giocatore, index, onClick, onPlayerUpdated }) => {
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [optimisticWishlist, setOptimisticWishlist] = useState<boolean | null>(null);

  // Determina lo stato corrente della wishlist (ottimistico o reale)
  const currentWishlistState = optimisticWishlist !== null ? optimisticWishlist : (giocatore.inWishlist || false);

  // Controlli di sicurezza per i dati del giocatore
  if (!giocatore || !giocatore.nome) {
    return null;
  }

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Previene l'apertura del modal
    
    if (!giocatore.id) return;
    
    // Salva lo stato precedente per il rollback in caso di errore
    const previousState = giocatore.inWishlist || false;
    
    // Aggiornamento ottimistico immediato
    setOptimisticWishlist(!currentWishlistState);
    setWishlistLoading(true);

    try {
      if (currentWishlistState) {
        await wishlistAPI.remove(giocatore.id);
      } else {
        await wishlistAPI.add(giocatore.id);
      }
      
      // Se l'API ha successo, mantieni lo stato ottimistico e aggiorna il giocatore
      if (onPlayerUpdated) {
        const updatedGiocatore = {
          ...giocatore,
          inWishlist: !currentWishlistState
        };
        onPlayerUpdated(updatedGiocatore);
      }
      
    } catch (error) {
      console.error('Errore nella gestione wishlist:', error);
      
      // Rollback in caso di errore
      setOptimisticWishlist(previousState);
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <ListItem 
      button
      onClick={() => onClick(giocatore)}
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        mb: 1,
        backgroundColor: 'background.paper',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'action.hover',
          transform: 'translateX(4px)',
          transition: 'all 0.2s ease-in-out',
          boxShadow: 2
        }
      }}
    >
      <ListItemAvatar>
        <Avatar 
          sx={{ 
            bgcolor: `${getRuoloColor(giocatore.ruolo)}.main`,
            width: 45,
            height: 45
          }}
        >
          {getRuoloIcon(giocatore.ruolo)}
        </Avatar>
      </ListItemAvatar>
      
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold" color="primary">
              {giocatore.nome}
            </Typography>
            <Chip 
              label={`#${index + 1}`} 
              size="small" 
              color={getRuoloColor(giocatore.ruolo)}
              variant="outlined"
              sx={{ minWidth: 35 }}
            />
            {/* Wishlist Button */}
            <Tooltip title={`${currentWishlistState ? 'Rimuovi da' : 'Aggiungi a'} wishlist`}>
              <IconButton
                size="small"
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
                sx={{ 
                  minWidth: 32, 
                  height: 32,
                  color: currentWishlistState ? 'error.main' : 'action.active',
                  '&:hover': {
                    backgroundColor: currentWishlistState ? 'error.light' : 'action.hover'
                  }
                }}
              >
                {wishlistLoading ? (
                  <CircularProgress size={16} />
                ) : currentWishlistState ? (
                  <FavoriteIcon fontSize="small" />
                ) : (
                  <FavoriteBorderIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        }
        secondary={
          <Typography component="div" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {/* Squadra e Status */}
            <Typography component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="caption" color="text.secondary" fontWeight="medium">
                {giocatore.squadra}
              </Typography>
              <Chip 
                label={giocatore.status} 
                size="small" 
                color={getStatusColor(giocatore.status)}
                variant="outlined"
              />
            </Typography>

            {/* Valutazioni principali */}
            <Typography component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              {giocatore.mia_valutazione && (
                <Chip 
                  label={`Val: ${giocatore.mia_valutazione}`} 
                  size="small" 
                  color="primary"
                  variant="outlined"
                />
              )}
              {giocatore.gazzetta && (
                <Chip 
                  label={`Gaz: ${giocatore.gazzetta}`} 
                  size="small" 
                  color="info"
                  variant="outlined"
                />
              )}
              {giocatore.quotazione && (
                <Chip 
                  label={`Quot: ${giocatore.quotazione}`} 
                  size="small" 
                  color="success"
                  variant="outlined"
                />
              )}
            </Typography>

            {/* Fantasquadra */}
            {giocatore.fantasquadra && (
              <Typography variant="caption" color="primary" fontWeight="bold">
                {giocatore.fantasquadra}
              </Typography>
            )}

            {/* Prezzo acquisto */}
            {giocatore.prezzo_acquisto && (
              <Typography variant="caption" color="success.main" fontWeight="bold">
                €{giocatore.prezzo_acquisto}
              </Typography>
            )}
          </Typography>
        }
      />
    </ListItem>
  );
};

export default PlayerCard;
