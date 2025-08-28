import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  Divider
} from '@mui/material';
import { Giocatore } from '../../../types';
import PlayerCard from './PlayerCard';

interface RuoloSectionProps {
  ruolo: string;
  giocatori: Giocatore[];
  onPlayerClick: (giocatore: Giocatore) => void;
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

const RuoloSection: React.FC<RuoloSectionProps> = ({ ruolo, giocatori, onPlayerClick, onPlayerUpdated }) => {
  // Controlli di sicurezza
  if (!ruolo || !giocatori || giocatori.length === 0) {
    return null;
  }

  return (
    <Grid item xs={12} md={6} lg={4}>
      <Card 
        variant="outlined" 
        sx={{ 
          height: '100%',
          borderColor: `${getRuoloColor(ruolo)}.main`,
          '&:hover': {
            boxShadow: 3,
            borderColor: `${getRuoloColor(ruolo)}.dark`
          }
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              mb: 2,
              color: `${getRuoloColor(ruolo)}.main`,
              borderBottom: `2px solid ${getRuoloColor(ruolo)}.main`,
              pb: 1
            }}
          >
            {getRuoloIcon(ruolo)}
            {ruolo}s ({giocatori.length})
          </Typography>
          
          <List dense sx={{ p: 0 }}>
            {giocatori.map((giocatore, index) => (
              <React.Fragment key={giocatore.id}>
                <PlayerCard 
                  giocatore={giocatore}
                  index={index}
                  onClick={onPlayerClick}
                  onPlayerUpdated={onPlayerUpdated}
                />
                {index < giocatori.length - 1 && <Divider sx={{ my: 1 }} />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default RuoloSection;
