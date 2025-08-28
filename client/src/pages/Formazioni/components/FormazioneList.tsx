import React, { useState, useEffect } from 'react';
import { Paper, Grid, Typography } from '@mui/material';
import { Giocatore } from '../../../types';
import RuoloSection from './RuoloSection';
import PlayerModal from './PlayerModal';

interface FormazioneListProps {
  formazione: Giocatore[];
  onSquadRefresh?: () => void; // Callback per rifetchare i dati della squadra
}

const FormazioneList: React.FC<FormazioneListProps> = ({ formazione, onSquadRefresh }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Giocatore | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [localFormazione, setLocalFormazione] = useState<Giocatore[]>(formazione);

  // Sincronizza la formazione locale quando cambia la prop
  useEffect(() => {
    setLocalFormazione(formazione);
  }, [formazione]);

  const handlePlayerClick = (giocatore: Giocatore) => {
    setSelectedPlayer(giocatore);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPlayer(null);
  };

  const handlePlayerUpdated = (updatedPlayer: Giocatore) => {
    console.log('Aggiornamento giocatore in FormazioneList:', updatedPlayer);
    // Aggiorna il giocatore nella formazione locale
    setLocalFormazione(prev => 
      prev.map(p => p.id === updatedPlayer.id ? updatedPlayer : p)
    );
  };

  // Controlli di sicurezza
  if (!formazione || formazione.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Nessuna formazione disponibile
        </Typography>
      </Paper>
    );
  }

  // Raggruppa i giocatori per ruolo
  const giocatoriPerRuolo = localFormazione.reduce((acc, giocatore) => {
    const ruolo = giocatore.ruolo || 'Sconosciuto';
    if (!acc[ruolo]) {
      acc[ruolo] = [];
    }
    acc[ruolo].push(giocatore);
    return acc;
  }, {} as Record<string, Giocatore[]>);

  return (
    <>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {Object.entries(giocatoriPerRuolo).map(([ruolo, giocatori]) => (
            <RuoloSection
              key={ruolo}
              ruolo={ruolo}
              giocatori={giocatori}
              onPlayerClick={handlePlayerClick}
              onPlayerUpdated={handlePlayerUpdated}
            />
          ))}
        </Grid>
      </Paper>

      <PlayerModal 
        open={modalOpen} 
        onClose={handleCloseModal} 
        giocatore={selectedPlayer}
        onPlayerUpdated={handlePlayerUpdated}
        onSquadRefresh={onSquadRefresh}
      />
    </>
  );
};

export default FormazioneList;
