import React, { useState } from 'react';
import {
  Avatar,
  Typography,
  Box,
  Chip,
  Tooltip,
  IconButton,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Divider
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Star as StarIcon,
  SportsSoccer as SoccerIcon,
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


const getCardBorderColor = (giocatore: Giocatore) => {
  // Rosso se nei preferiti/wishlist
  if (giocatore.inWishlist || giocatore.preferito) {
    return 'red';
  }
};

const PlayerCard: React.FC<PlayerCardProps> = ({
  giocatore,
  onClick,
  onPlayerUpdated,
}) => {
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
    <Card
      onClick={() => onClick(giocatore)}
      sx={{
        height: '100%',
        cursor: 'pointer',
        border: `2px solid ${getCardBorderColor(giocatore)}`,
        backgroundColor: giocatore.status === 'acquistato' && giocatore.inWishlist ? '#957272'
         : giocatore.inWishlist ? '#fb9898' 
         : giocatore.status === 'acquistato' ? 'grey.400' 
         : 'background.paper',

        transition: 'all 0.3s ease-in-out',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 8,
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header con avatar e nome */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, position: 'relative' }}>
          <Avatar
            sx={{
              bgcolor: `${getRuoloColor(giocatore.ruolo)}.main`,
              width: 60,
              height: 60,
              fontSize: '1.5rem'
            }}
          >
            {getRuoloIcon(giocatore.ruolo)}
          </Avatar>
          <Chip
            icon={<StarIcon fontSize="small" />}
            label={`${giocatore.gazzetta || 0}`}
            color={'primary'}
            variant="filled"
            sx={{ fontWeight: 'bold', fontSize: '1.2rem', position: 'absolute', top: -20, left: -20, zIndex: 1000 }}
          />


          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
              {giocatore.nome}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {giocatore.status === 'acquistato' && giocatore.fantasquadra ? (
                <Chip
                  label={`${giocatore.nome_squadra_acquirente} €${giocatore.prezzo_acquisto}`}
                  size="small"
                  color="error"
                  variant="filled"
                  icon={<SoccerIcon fontSize="small" />}
                  sx={{ fontWeight: 'bold' }}
                />
              ) : (
                <Chip
                  label={giocatore.status}
                  size="small"
                  // color={getStatusColor(giocatore.status) as any}
                  variant="outlined"
                />
              )}
            </Box>
          </Box>

        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Valutazioni principali */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mb: 1 }}>
            {giocatore.fascia && (
              <Chip
                label={`Fascia: ${giocatore.fascia}`}
                size="small"
                color="warning"
                variant="outlined"
              />
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>

            {giocatore.mia_valutazione && (
              <Chip
                icon={<StarIcon />}
                label={`mia Valutazione: ${giocatore.mia_valutazione} `}
                size="medium"
                color="primary"
                variant="filled"
              />
            )}

            {giocatore.fvm && (
              <Chip
                label={`FVM: ${giocatore.fvm}`}
                size="small"
                color="info"
                variant="outlined"
              />
            )}

            {giocatore.fvm_m && (
              <Chip
                label={`FVM M: ${giocatore.fvm_m}`}
                size="small"
                color="warning"
                variant="outlined"
              />
            )}

          </Box>
        </Box>

        {/* Valutazioni aggiuntive */}
        {(giocatore.consiglio) && (
          <Box sx={{ mb: 2 }}>

            {giocatore.consiglio && (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                <b>Consiglio:</b>      {` ${giocatore.consiglio}`}
              </Typography>

            )}

          </Box>
        )}

        {/* Informazioni aggiuntive */}
        {giocatore.note && (
          <Box sx={{ mb: 2 }}>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {giocatore.note && (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  <b>Note:</b>    {giocatore.note}
                </Typography>
              )}
            </Box>
          </Box>
        )}

      </CardContent>

      <CardActions sx={{ p: 2, pt: 0, position: 'absolute', bottom: 0, right: 0 }}>
        <Tooltip title={`${currentWishlistState ? 'Rimuovi da' : 'Aggiungi a'} wishlist`}>
          <IconButton
            onClick={handleWishlistToggle}
            disabled={wishlistLoading}
            sx={{
              color: currentWishlistState ? 'error.main' : 'action.active',
              alignSelf: 'flex-end',
              '&:hover': {
                backgroundColor: currentWishlistState ? 'error.light' : 'action.hover'
              }
            }}
          >
            {wishlistLoading ? (
              <CircularProgress size={20} />
            ) : currentWishlistState ? (
              <FavoriteIcon />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );

};


export default PlayerCard;
