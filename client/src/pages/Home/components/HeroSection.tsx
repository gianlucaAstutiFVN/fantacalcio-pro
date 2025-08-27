import React from 'react'
import { Box, Typography, Button, Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const HeroSection: React.FC = () => {
  const navigate = useNavigate()

  const handleExplore = () => {
    navigate('/giocatori')
  }

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 12,
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              mb: 3,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            Fantacalcio Pro
          </Typography>
          
          <Typography
            variant="h5"
            component="h2"
            sx={{
              mb: 4,
              maxWidth: '800px',
              mx: 'auto',
              opacity: 0.9,
              lineHeight: 1.6
            }}
          >
            La piattaforma definitiva per gestire il tuo fantacalcio. 
            Scopri giocatori, partecipa alle aste e costruisci la squadra dei tuoi sogni.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleExplore}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                backgroundColor: 'white',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'grey.100',
                }
              }}
            >
              Esplora Giocatori
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/squadre')}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'grey.300',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                }
              }}
            >
              Crea Squadra
            </Button>
          </Box>
          
          <Typography
            variant="body1"
            sx={{
              mt: 4,
              opacity: 0.8,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Gestisci roster, partecipa alle aste e analizza statistiche avanzate. 
            Tutto quello che serve per dominare il fantacalcio.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default HeroSection
