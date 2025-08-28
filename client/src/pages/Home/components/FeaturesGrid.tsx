import React from 'react'
import { Grid, Typography, Box } from '@mui/material'
import FeatureCard from './FeatureCard'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import AnalyticsIcon from '@mui/icons-material/Analytics'

const FeaturesGrid: React.FC = () => {
  const features = [
    {
      title: 'Gestione Giocatori',
      description: 'Visualizza e gestisci tutti i giocatori disponibili per l\'asta',
      icon: <SportsSoccerIcon sx={{ fontSize: 40,color:'primary.main' }} />,
      color: 'primary' as const
    },
    {
      title: 'Gestione Squadre',
      description: 'Crea e gestisci le tue squadre fantacalcio',
      icon: <EmojiEventsIcon sx={{ fontSize: 40,color:'secondary.main' }} />,
      color: 'secondary' as const
    },
    {
      title: 'Statistiche',
      description: 'Analizza le performance e le statistiche dei giocatori',
      icon: <AnalyticsIcon sx={{ fontSize: 40,color:'info.main'
        
       }} />,
      color: 'info' as const
    }
  ]

  return (
    <Box sx={{ py: 8, px: 3 }}>
      <Typography variant="h3" component="h2" align="center" gutterBottom>
        Funzionalità Principali
      </Typography>
      <Typography variant="h6" align="center" color="text.secondary" paragraph>
        Scopri tutto quello che puoi fare con la nostra piattaforma di fantacalcio
      </Typography>
      
      <Grid container spacing={4} sx={{ mt: 4 }}>
        {features.map((feature) => (
          <Grid item xs={12} sm={6} md={4} key={feature.title}>
            <FeatureCard feature={feature} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default FeaturesGrid
