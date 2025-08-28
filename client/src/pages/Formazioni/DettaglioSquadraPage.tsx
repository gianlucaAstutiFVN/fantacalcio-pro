import React from 'react';
import { 
  Container, 
  Typography, 
  Box,
  Avatar,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { squadreSerieA } from './data/squadreData';
import { useSquadraDetail } from './hooks/useSquadraDetail';
import ImageCarousel from './components/ImageCarousel';
import FormazioneList from './components/FormazioneList';

const DettaglioSquadraPage: React.FC = () => {
  const { squadraId } = useParams<{ squadraId: string }>();
  const navigate = useNavigate();
  const { formazione, loading, error, refreshFormazione } = useSquadraDetail(squadraId);
  
  const squadra = squadreSerieA.find(s => s.id === squadraId);

  const handleGoBack = () => {
    // Usa navigate(-1) per tornare alla pagina precedente mantenendo tutti i parametri URL
    navigate(-1);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Caricamento formazione...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

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
          onClick={handleGoBack}
          sx={{ mr: 2 }}
          aria-label="Torna indietro"
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
        <FormazioneList 
          formazione={formazione.formazione} 
          onSquadRefresh={refreshFormazione}
        />
      </Box>

    </Container>
  );
};

export default DettaglioSquadraPage;
