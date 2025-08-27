import React from 'react'
import {
  Box,
  Typography,
  Paper,
} from '@mui/material'
import QuotazioniUpload from './components/QuotazioniUpload'

const StatistichePage: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestione Quotazioni
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 3 }}>
        Carica i file CSV delle quotazioni per aggiornare il database dei giocatori.
      </Typography>

      <Paper sx={{ p: 3 }}>
        <QuotazioniUpload />
      </Paper>
    </Box>
  )
}

export default StatistichePage
