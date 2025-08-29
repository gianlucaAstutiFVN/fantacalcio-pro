import React, { useState, useEffect, useMemo } from 'react';
import { 
  Paper, 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Chip, 
  Button,
} from '@mui/material';
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
  const [selectedRuolo, setSelectedRuolo] = useState<string>('portiere');

  // Sincronizza la formazione locale quando cambia la prop
  useEffect(() => {
    setLocalFormazione(formazione);
  }, [formazione]);

  // Ordina i giocatori per punteggio Gazzetta (decrescente) e poi per nome
  const sortedFormazione = useMemo(() => {
    return [...localFormazione].sort((a, b) => {
      // Prima ordina per punteggio Gazzetta (decrescente)
      const gazzettaA = a.gazzetta || 0;
      const gazzettaB = b.gazzetta || 0;
      
      if (gazzettaA !== gazzettaB) {
        return gazzettaB - gazzettaA;
      }
      
      // Se stesso punteggio, ordina per nome
      return a.nome.localeCompare(b.nome);
    });
  }, [localFormazione]);

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

  // Raggruppa i giocatori per ruolo (già ordinati)
  const giocatoriPerRuolo = useMemo(() => {
    return sortedFormazione.reduce((acc, giocatore) => {
      const ruolo = giocatore.ruolo || 'Sconosciuto';
      if (!acc[ruolo]) {
        acc[ruolo] = [];
      }
      acc[ruolo].push(giocatore);
      return acc;
    }, {} as Record<string, Giocatore[]>);
  }, [sortedFormazione]);

  // Ordine dei ruoli per i tab
  const ruoliOrder = ['portiere', 'difensore', 'centrocampista', 'attaccante'];
  const availableRuoli = ruoliOrder.filter(ruolo => giocatoriPerRuolo[ruolo]?.length > 0);

  // Se non c'è un ruolo selezionato valido, seleziona il primo disponibile
  useEffect(() => {
    if (availableRuoli.length > 0 && !availableRuoli.includes(selectedRuolo)) {
      setSelectedRuolo(availableRuoli[0]);
    }
  }, [availableRuoli, selectedRuolo]);

  const getRuoloIcon = (ruolo: string) => {
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

  return (
    <>
      <Paper sx={{ p: 3 }}>
        {/* Header con statistiche */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
            Formazione Squadra
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            {Object.entries(giocatoriPerRuolo).map(([ruolo, giocatori]) => (
              <Chip
                key={ruolo}
                icon={<span>{getRuoloIcon(ruolo)}</span>}
                label={`${ruolo}s: ${giocatori.length}`}
                color={getRuoloColor(ruolo) as any}
                variant="outlined"
                sx={{ fontWeight: 'bold' }}
              />
            ))}
            <Chip
              label={`Totale: ${localFormazione.length}`}
              color="primary"
              variant="filled"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
        </Box>

        {/* Tabs per i ruoli - Desktop */}
        <Box sx={{ 
          display: { xs: 'none', md: 'block' },
          borderBottom: 1, 
          borderColor: 'divider', 
          mb: 3 
        }}>
          <Tabs 
            value={selectedRuolo} 
            onChange={(_, newValue) => setSelectedRuolo(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile={true}
            sx={{
              overflowX: "auto", // forza lo scroll
              '& .MuiTabs-scroller': { overflowX: "auto !important" }, 
              '& .MuiTab-root': {
                minWidth: 120,
                fontSize: '1rem',
                fontWeight: 'bold'
              }
            }}
          >
            {availableRuoli.map((ruolo) => (
              <Tab
                key={ruolo}
                value={ruolo}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{getRuoloIcon(ruolo)}</span>
                    <span>{ruolo}s</span>
                    <Chip 
                      label={giocatoriPerRuolo[ruolo].length} 
                      size="small" 
                      color={getRuoloColor(ruolo) as any}
                      sx={{ minWidth: 20, height: 20, fontSize: '0.75rem' }}
                    />
                  </Box>
                }
                sx={{
                  color: `${getRuoloColor(ruolo)}.main`,
                  '&.Mui-selected': {
                    color: `${getRuoloColor(ruolo)}.dark`,
                    fontWeight: 'bold'
                  }
                }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Selezione ruoli per Mobile - Layout a griglia */}
        <Box sx={{ 
          display: { xs: 'block', md: 'none' },
          mb: 3 
        }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2, textAlign: 'center' }}>
            Seleziona Ruolo
          </Typography>
          
          {/* Griglia di bottoni per i ruoli */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: 2,
            mb: 2
          }}>
            {availableRuoli.map((ruolo) => (
              <Button
                key={ruolo}
                variant={selectedRuolo === ruolo ? 'contained' : 'outlined'}
                onClick={() => setSelectedRuolo(ruolo)}
                sx={{
                  py: 2,
                  px: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  borderWidth: 2,
                  '&.MuiButton-contained': {
                    backgroundColor: `${getRuoloColor(ruolo)}.main`,
                    '&:hover': {
                      backgroundColor: `${getRuoloColor(ruolo)}.dark`,
                    }
                  },
                  '&.MuiButton-outlined': {
                    borderColor: `${getRuoloColor(ruolo)}.main`,
                    color: `${getRuoloColor(ruolo)}.main`,
                    '&:hover': {
                      borderColor: `${getRuoloColor(ruolo)}.dark`,
                      backgroundColor: `${getRuoloColor(ruolo)}.light`,
                    }
                  }
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: 1 
                }}>
                  <span style={{ fontSize: '1.5rem' }}>{getRuoloIcon(ruolo)}</span>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {ruolo}s
                  </Typography>
                  <Chip 
                    label={giocatoriPerRuolo[ruolo].length} 
                    size="small" 
                    color={getRuoloColor(ruolo) as any}
                    sx={{ 
                      minWidth: 24, 
                      height: 24, 
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
              </Button>
            ))}
          </Box>

          {/* Indicatore del ruolo selezionato */}
          {selectedRuolo && (
            <Box sx={{ 
              textAlign: 'center', 
              p: 2, 
              borderRadius: 2, 
              backgroundColor: `${getRuoloColor(selectedRuolo)}.light`,
              border: `2px solid ${getRuoloColor(selectedRuolo)}.main`
            }}>
              <Typography variant="h6" sx={{ 
                color: `${getRuoloColor(selectedRuolo)}.dark`,
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}>
                <span>{getRuoloIcon(selectedRuolo)}</span>
                {selectedRuolo}s selezionati
                <Chip 
                  label={giocatoriPerRuolo[selectedRuolo].length} 
                  size="small" 
                  color={getRuoloColor(selectedRuolo) as any}
                  sx={{ fontWeight: 'bold' }}
                />
              </Typography>
            </Box>
          )}
        </Box>

        {/* Contenuto del ruolo selezionato */}
        <Box sx={{ minHeight: 400 }}>
          {selectedRuolo && giocatoriPerRuolo[selectedRuolo] && (
            <RuoloSection
              ruolo={selectedRuolo}
              giocatori={giocatoriPerRuolo[selectedRuolo]}
              onPlayerClick={handlePlayerClick}
              onPlayerUpdated={handlePlayerUpdated}
              isHorizontal={true}
            />
          )}
        </Box>
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
