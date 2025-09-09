import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  IconButton,
  Card,
  CardMedia,
  Typography,
  Paper
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { squadreSerieA } from '../data/squadreData';
import formazioniData from '../data/formazioniData';

interface ImageCarouselProps {
  // Props opzionali per override delle immagini
  customImages?: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ customImages }) => {
  const { squadraId } = useParams<{ squadraId: string }>();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Trova la squadra dai parametri URL
  const squadra = useMemo(() => {
    return squadreSerieA.find(s => s.id === squadraId);
  }, [squadraId]);

  // Genera le immagini per la squadra selezionata
  const images = useMemo(() => {
    if (customImages) {
      return customImages;
    }

    if (!squadra) {
      return [];
    }

    // Mappa delle squadre con le loro immagini disponibili
 

    // Restituisce le immagini per la squadra selezionata
    return formazioniData.find(f => f.squadra === squadra.nome)?.images || [];
  }, [squadra, customImages]);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Reset index quando cambiano le immagini
  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  if (!squadra) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Squadra non trovata
        </Typography>
      </Paper>
    );
  }

  if (!images || images.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Nessuna immagine disponibile per {squadra.nome}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Le immagini per questa squadra non sono ancora state caricate
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      {/* Immagine principale */}
      <Card sx={{ width: '100%', height: 900, position: 'relative' }}>
        <CardMedia
          component="img"
          image={images[currentIndex]}
          alt={`${squadra.nome} - Immagine ${currentIndex + 1}`}
          sx={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain'
          }}
          onError={() => {
            console.warn(`Errore nel caricamento dell'immagine: ${images[currentIndex]}`);
            // Potremmo implementare un fallback qui
          }}
        />
        
        {/* Overlay con indicatore */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            px: 2,
            py: 1,
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Typography variant="body2">
            {currentIndex + 1} / {images.length}
          </Typography>
        </Box>
      </Card>

      {/* Pulsanti di navigazione */}
      {images.length > 1 && (
        <>
          <IconButton
            onClick={handlePrevious}
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
              },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          
          <IconButton
            onClick={handleNext}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
              },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </>
      )}

      {/* Indicatori di posizione */}
      {images.length > 1 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
            mt: 2
          }}
        >
          {images.map((image: string, index: number) => (
            <Box
              key={`image-${index}-${image}`}
              onClick={() => setCurrentIndex(index)}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: index === currentIndex ? 'primary.main' : 'grey.300',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                '&:hover': {
                  backgroundColor: index === currentIndex ? 'primary.dark' : 'grey.400',
                }
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ImageCarousel;
