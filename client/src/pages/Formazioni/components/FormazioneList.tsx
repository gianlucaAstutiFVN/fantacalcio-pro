import React from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  Chip,
  Paper,
  Grid
} from '@mui/material';
import {
  Person as PersonIcon,
  SportsSoccer as SoccerIcon,
  Shield as ShieldIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';
import { Giocatore } from '../data/formazioniData';

interface FormazioneListProps {
  formazione: Giocatore[];
}

const getRuoloIcon = (ruolo: string) => {
  switch (ruolo.toLowerCase()) {
    case 'portiere':
      return <ShieldIcon />;
    case 'difensore':
      return <ShieldIcon />;
    case 'centrocampista':
      return <SoccerIcon />;
    case 'attaccante':
      return <TrophyIcon />;
    default:
      return <PersonIcon />;
  }
};

const getRuoloColor = (ruolo: string) => {
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

const FormazioneList: React.FC<FormazioneListProps> = ({ formazione }) => {
  // Raggruppa i giocatori per ruolo
  const giocatoriPerRuolo = formazione.reduce((acc, giocatore) => {
    const ruolo = giocatore.ruolo;
    if (!acc[ruolo]) {
      acc[ruolo] = [];
    }
    acc[ruolo].push(giocatore);
    return acc;
  }, {} as Record<string, Giocatore[]>);

  return (
    <Paper sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {Object.entries(giocatoriPerRuolo).map(([ruolo, giocatori]) => (
          <Grid item xs={12} md={6} lg={3} key={ruolo}>
            <Box>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  mb: 2,
                  color: `${getRuoloColor(ruolo)}.main`
                }}
              >
                {getRuoloIcon(ruolo)}
                {ruolo}s ({giocatori.length})
              </Typography>
              
              <List dense>
                {giocatori.map((giocatore) => (
                  <ListItem 
                    key={giocatore.id}
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 1,
                      backgroundColor: 'background.paper',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                        transform: 'translateX(4px)',
                        transition: 'all 0.2s ease-in-out'
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        sx={{ 
                          bgcolor: `${getRuoloColor(giocatore.ruolo)}.main`,
                          width: 40,
                          height: 40
                        }}
                      >
                        {getRuoloIcon(giocatore.ruolo)}
                      </Avatar>
                    </ListItemAvatar>
                    
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {giocatore.nome}
                          </Typography>
                          <Chip 
                            label={giocatore.numero} 
                            size="small" 
                            color={getRuoloColor(giocatore.ruolo)}
                            sx={{ minWidth: 30 }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            {giocatore.eta} anni
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            •
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {giocatore.nazionalita}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default FormazioneList;
