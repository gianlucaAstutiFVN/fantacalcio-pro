import React from 'react';
import {
  Grid,
  Typography,
  Box
} from '@mui/material';
import { Giocatore } from '../../../types';
import PlayerCard from './PlayerCard';

interface RuoloSectionProps {
  ruolo: string;
  giocatori: Giocatore[];
  onPlayerClick: (giocatore: Giocatore) => void;
  onPlayerUpdated?: (giocatore: Giocatore) => void;
  isHorizontal?: boolean;
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

const RuoloSection: React.FC<RuoloSectionProps> = ({ 
  ruolo, 
  giocatori, 
  onPlayerClick, 
  onPlayerUpdated, 
}) => {
  // Controlli di sicurezza
  if (!ruolo || !giocatori || giocatori.length === 0) {
    return null;
  }


    // Layout orizzontale con card più grandi
    return (
      <Box>
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            mb: 3,
            color: `${getRuoloColor(ruolo)}.main`,
            borderBottom: `3px solid ${getRuoloColor(ruolo)}.main`,
            pb: 2,
            fontWeight: 'bold'
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>{getRuoloIcon(ruolo)}</span>
          {ruolo} ({giocatori.length})
        </Typography>
        
        <Grid container spacing={3}>
          {giocatori.map((giocatore, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={giocatore.id}>
              <PlayerCard 
                giocatore={giocatore}
                index={index}
                onClick={onPlayerClick}
                onPlayerUpdated={onPlayerUpdated}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );

};

export default RuoloSection;
