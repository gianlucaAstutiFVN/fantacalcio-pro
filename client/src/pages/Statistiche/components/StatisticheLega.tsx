import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import {
  ExpandMore as ExpandMoreIcon,
  TrendingUp as TrendingUpIcon,
  Euro as EuroIcon,
  Group as GroupIcon,
} from '@mui/icons-material'
import axios from 'axios'

interface TopGiocatore {
  nome: string
  squadra: string
  ruolo: string
  valore: number
  squadraAcquirente: string
}

interface StatisticheRuolo {
  ruolo: string
  spesaTotale: number
  numeroAcquisti: number
  prezzoMedio: number
  topGiocatori: TopGiocatore[]
}

interface StatisticheSquadra {
  squadra: string
  spesaTotale: number
  budgetRimanente: number
  distribuzioneRuoli: { [ruolo: string]: number }
  spesaPerRuolo: { [ruolo: string]: number }
}

interface StatisticheLega {
  topGiocatoriPerRuolo: { [ruolo: string]: TopGiocatore[] }
  statisticheRuoli: StatisticheRuolo[]
  statisticheSquadre: StatisticheSquadra[]
  spesaTotaleLega: number
  numeroTotaleAcquisti: number
  prezzoMedioLega: number
}

const StatisticheLega: React.FC = () => {
  const [statistiche, setStatistiche] = useState<StatisticheLega | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStatisticheLega()
  }, [])

  const fetchStatisticheLega = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/statistiche/lega')
      setStatistiche(response.data)
      setError(null)
    } catch (err) {
      setError('Errore nel caricamento delle statistiche della lega')
      console.error('Errore fetch statistiche lega:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
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
        <Alert severity="info">Nessuna statistica della lega disponibile</Alert>
      </Box>
    )
  }

  const ruoli = ['portiere', 'difensore', 'centrocampista', 'attaccante']
  const coloriRuoli = {
    portiere: 'primary',
    difensore: 'success',
    centrocampista: 'warning',
    attaccante: 'error'
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Header con statistiche generali */}
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUpIcon /> Statistiche Generali Lega
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                €{statistiche.spesaTotaleLega.toLocaleString()}
              </Typography>
              <Typography variant="body2">Spesa Totale Lega</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {statistiche.numeroTotaleAcquisti}
              </Typography>
              <Typography variant="body2">Acquisti Totali</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                €{statistiche.prezzoMedioLega.toFixed(0)}
              </Typography>
              <Typography variant="body2">Prezzo Medio</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {statistiche.statisticheSquadre.length}
              </Typography>
              <Typography variant="body2">Squadre Attive</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Top Giocatori per Reparto */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EuroIcon /> Top Giocatori per Reparto
        </Typography>
        <Grid container spacing={2}>
          {ruoli.map((ruolo) => (
            <Grid item xs={12} md={6} key={ruolo}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip 
                      label={ruolo.charAt(0).toUpperCase() + ruolo.slice(1)} 
                      color={coloriRuoli[ruolo as keyof typeof coloriRuoli]} 
                      size="small" 
                    />
                    Top 5
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Giocatore</TableCell>
                          <TableCell>Squadra</TableCell>
                          <TableCell align="right">Valore</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {statistiche.topGiocatoriPerRuolo[ruolo]?.slice(0, 5).map((giocatore, index) => (
                          <TableRow key={index} hover>
                            <TableCell>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                  {giocatore.nome}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {giocatore.squadraAcquirente}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>{giocatore.squadra}</TableCell>
                            <TableCell align="right">
                              <Chip 
                                label={`€${giocatore.valore}`} 
                                color="success" 
                                size="small" 
                                variant="outlined"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Statistiche per Ruolo */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <GroupIcon /> Analisi per Reparto
        </Typography>
        <Grid container spacing={2}>
          {statistiche.statisticheRuoli.map((statRuolo) => (
            <Grid item xs={12} md={6} lg={3} key={statRuolo.ruolo}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <Chip 
                      label={statRuolo.ruolo.charAt(0).toUpperCase() + statRuolo.ruolo.slice(1)} 
                      color={coloriRuoli[statRuolo.ruolo as keyof typeof coloriRuoli]} 
                      size="small" 
                    />
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h4" color="success.main" gutterBottom>
                      €{statRuolo.spesaTotale.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Spesa Totale
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Acquisti
                      </Typography>
                      <Typography variant="h6">
                        {statRuolo.numeroAcquisti}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Prezzo Medio
                      </Typography>
                      <Typography variant="h6">
                        €{statRuolo.prezzoMedio.toFixed(0)}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Statistiche per Squadra */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <GroupIcon /> Analisi per Squadra
        </Typography>
        {statistiche.statisticheSquadre.map((statSquadra) => (
          <Accordion key={statSquadra.squadra} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {statSquadra.squadra}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Chip 
                    label={`Spesa: €${statSquadra.spesaTotale.toLocaleString()}`} 
                    color="error" 
                    size="small" 
                  />
                  <Chip 
                    label={`Budget: €${statSquadra.budgetRimanente.toLocaleString()}`} 
                    color="success" 
                    size="small" 
                  />
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Distribuzione Acquisti per Ruolo</Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Ruolo</TableCell>
                          <TableCell align="right">Numero</TableCell>
                          <TableCell align="right">Spesa</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {ruoli.map((ruolo) => {
                          const numAcquisti = statSquadra.distribuzioneRuoli[ruolo] || 0
                          const spesa = statSquadra.spesaPerRuolo[ruolo] || 0
                          if (numAcquisti === 0) return null
                          
                          return (
                            <TableRow key={ruolo}>
                              <TableCell>
                                <Chip 
                                  label={ruolo.charAt(0).toUpperCase() + ruolo.slice(1)} 
                                  color={coloriRuoli[ruolo as keyof typeof coloriRuoli]} 
                                  size="small" 
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell align="right">{numAcquisti}</TableCell>
                              <TableCell align="right">€{spesa.toLocaleString()}</TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Riepilogo Finanziario</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Spesa Totale:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                        €{statSquadra.spesaTotale.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Budget Rimanente:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                        €{statSquadra.budgetRimanente.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Prezzo Medio:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        €{statSquadra.spesaTotale > 0 ? (statSquadra.spesaTotale / Object.values(statSquadra.distribuzioneRuoli).reduce((a, b) => a + b, 0)).toFixed(0) : 0}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>
    </Box>
  )
}

export default StatisticheLega
