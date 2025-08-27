import React from 'react';
import { 
  Container, 
  Typography, 
  Box,
  Avatar,
  IconButton,
  Paper
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { squadreSerieA } from './data/squadreData';
import { formazioniSquadre } from './data/formazioniData';
import ImageCarousel from './components/ImageCarousel';
import FormazioneList from './components/FormazioneList';

const DettaglioSquadraPage: React.FC = () => {
  const { squadraId } = useParams<{ squadraId: string }>();
  const navigate = useNavigate();
  
  const squadra = squadreSerieA.find(s => s.id === squadraId);
  const formazione = formazioniSquadre[squadraId || ''];

  if (!squadra || !formazione) {
    return (
      <Container>
        <Typography variant="h4" color="error">
          Squadra non trovata
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header con pulsante back */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton 
          onClick={() => navigate('/formazioni')}
          sx={{ mr: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            src={squadra.logo} 
            sx={{ width: 60, height: 60, mr: 2 }}
          />
          <Box>
            <Typography variant="h4" component="h1">
              {squadra.nome}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {squadra.citta}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Carousel di immagini */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Galleria Squadra
        </Typography>
        <ImageCarousel images={formazione.immagini} />
      </Box>

      {/* Formazione */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Formazione Titolare
        </Typography>
        <FormazioneList formazione={formazione.formazione} />
      </Box>

      {/* Statistiche squadra */}
      <Box>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Statistiche Stagione
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              {formazione.statistiche.partiteGiocate}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Partite Giocate
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              {formazione.statistiche.vittorie}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Vittorie
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              {formazione.statistiche.pareggi}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pareggi
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              {formazione.statistiche.sconfitte}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sconfitte
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              {formazione.statistiche.punti}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Punti
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default DettaglioSquadraPage;
