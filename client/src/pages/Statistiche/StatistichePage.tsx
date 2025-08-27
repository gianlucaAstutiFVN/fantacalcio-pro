import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material'
import axios from 'axios'
import QuotazioniUpload from './components/QuotazioniUpload'
import StatisticheLega from './components/StatisticheLega'
import StatisticheComparative from './components/StatisticheComparative'

interface Statistiche {
  totaleAcquisti: number
  spesaTotale: number
  prezzoMedio: number
  distribuzioneRuolo: { [key: string]: number }
  distribuzioneSquadra: { [key: string]: number }
  giocatoriDisponibili: number
  giocatoriVenduti: number
}

const StatistichePage: React.FC = () => {
  const [statistiche, setStatistiche] = useState<Statistiche | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState(1)

  useEffect(() => {
    fetchStatistiche()
  }, [])

  const fetchStatistiche = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/statistiche')
      setStatistiche(response.data)
      setError(null)
    } catch (err) {
      setError('Errore nel caricamento delle statistiche')
      console.error('Errore fetch statistiche:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  if (!statistiche) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">Nessuna statistica disponibile</Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Statistiche Generali
      </Typography>

      {/* Tabs per navigazione */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_e, newValue) => setActiveTab(newValue)}>
          <Tab label="📊 Statistiche" />
          <Tab label="🏆 Statistiche Lega" />
          <Tab label="📈 Analisi Comparativa" />
          <Tab label="📁 Upload CSV Quotazioni" />
        </Tabs>
      </Box>

      {/* Tab Statistiche */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
        {/* Statistiche principali */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Totale Acquisti
              </Typography>
              <Typography variant="h4">
                {statistiche.totaleAcquisti}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main" gutterBottom>
                Spesa Totale
              </Typography>
              <Typography variant="h4">
                €{statistiche.spesaTotale}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="warning.main" gutterBottom>
                Prezzo Medio
              </Typography>
              <Typography variant="h4">
                €{statistiche.prezzoMedio}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="info.main" gutterBottom>
                Giocatori Disponibili
              </Typography>
              <Typography variant="h4">
                {statistiche.giocatoriDisponibili}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Distribuzione per ruolo */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Distribuzione Acquisti per Ruolo
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {Object.entries(statistiche.distribuzioneRuolo).map(([ruolo, count]) => (
                <Box key={ruolo} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip label={ruolo} size="small" />
                  <Typography variant="body2">
                    {count} acquisti
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Distribuzione per squadra */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Distribuzione Acquisti per Squadra
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {Object.entries(statistiche.distribuzioneSquadra).map(([squadra, count]) => (
                <Box key={squadra} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip label={squadra} size="small" variant="outlined" />
                  <Typography variant="body2">
                    {count} acquisti
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Riepilogo generale */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Riepilogo Generale
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {statistiche.totaleAcquisti}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Giocatori Acquistati
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    €{statistiche.spesaTotale}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Spesa Totale
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main">
                    €{statistiche.prezzoMedio}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Prezzo Medio per Giocatore
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      )}

      {/* Tab Statistiche Lega */}
      {activeTab === 1 && (
        <StatisticheLega />
      )}

      {/* Tab Analisi Comparativa */}
      {activeTab === 2 && (
        <StatisticheComparative />
      )}

      {/* Tab Upload CSV */}
      {activeTab === 3 && (
        <QuotazioniUpload />
      )}
    </Box>
  )
}

export default StatistichePage
