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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import {
  Compare as CompareIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
} from '@mui/icons-material'
import axios from 'axios'

interface StatisticaComparativa {
  squadra: string
  spesaTotale: number
  numeroGiocatori: number
  prezzoMedio: number
  distribuzioneRuoli: { [ruolo: string]: number }
  spesaPerRuolo: { [ruolo: string]: number }
  efficienzaSpesa: number // rapporto qualità/prezzo
}

interface StatisticheComparativeProps {
  onRefresh?: () => void
}

const StatisticheComparative: React.FC<StatisticheComparativeProps> = () => {
  const [statistiche, setStatistiche] = useState<StatisticaComparativa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>('spesaTotale')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')

  useEffect(() => {
    fetchStatisticheComparative()
  }, [])

  const fetchStatisticheComparative = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/statistiche/comparative')
      setStatistiche(response.data)
      setError(null)
    } catch (err) {
      setError('Errore nel caricamento delle statistiche comparative')
      console.error('Errore fetch statistiche comparative:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const sortedStatistiche = [...statistiche].sort((a, b) => {
    let aValue = a[sortBy as keyof StatisticaComparativa]
    let bValue = b[sortBy as keyof StatisticaComparativa]
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = String(bValue).toLowerCase()
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const ruoli = ['portiere', 'difensore', 'centrocampista', 'attaccante']
  const coloriRuoli: Record<string, 'primary' | 'success' | 'warning' | 'error'> = {
    portiere: 'primary',
    difensore: 'success',
    centrocampista: 'warning',
    attaccante: 'error'
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

  if (!statistiche.length) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">Nessuna statistica comparativa disponibile</Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Header con controlli */}
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CompareIcon /> Analisi Comparativa Squadre
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: 'white' }}>Ordina per</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' } }}
              >
                <MenuItem value="spesaTotale">Spesa Totale</MenuItem>
                <MenuItem value="numeroGiocatori">Numero Giocatori</MenuItem>
                <MenuItem value="prezzoMedio">Prezzo Medio</MenuItem>
                <MenuItem value="efficienzaSpesa">Efficienza Spesa</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, newMode) => newMode && setViewMode(newMode)}
              size="small"
            >
              <ToggleButton value="table" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
                <BarChartIcon />
              </ToggleButton>
              <ToggleButton value="cards" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
                <PieChartIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Chip 
              label={`${sortOrder === 'asc' ? 'Crescente' : 'Decrescente'}`}
              color="default"
              variant="outlined"
              sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Vista Tabellare */}
      {viewMode === 'table' && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BarChartIcon /> Classifica Squadre
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Squadra</TableCell>
                  <TableCell align="right">Spesa Totale</TableCell>
                  <TableCell align="right">Giocatori</TableCell>
                  <TableCell align="right">Prezzo Medio</TableCell>
                  <TableCell align="right">Efficienza</TableCell>
                  <TableCell>Distribuzione Ruoli</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedStatistiche.map((stat, index) => (
                  <TableRow key={stat.squadra} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {stat.squadra}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Posizione #{index + 1}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Chip 
                        label={`€${stat.spesaTotale.toLocaleString()}`} 
                        color="error" 
                        size="small" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {stat.numeroGiocatori}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        €{stat.prezzoMedio.toFixed(0)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Chip 
                        label={stat.efficienzaSpesa.toFixed(2)} 
                        color={stat.efficienzaSpesa > 1 ? 'success' : 'warning'} 
                        size="small" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {ruoli.map((ruolo) => {
                          const count = stat.distribuzioneRuoli[ruolo] || 0
                          if (count === 0) return null
                          
                          return (
                            <Chip
                              key={ruolo}
                              label={`${ruolo.charAt(0).toUpperCase()}${count}`}
                              color={coloriRuoli[ruolo] || 'default'}
                              size="small"
                              variant="outlined"
                            />
                          )
                        })}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Vista a Card */}
      {viewMode === 'cards' && (
        <Grid container spacing={3}>
          {sortedStatistiche.map((stat, index) => (
            <Grid item xs={12} md={6} lg={4} key={stat.squadra}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {stat.squadra}
                    </Typography>
                    <Chip 
                      label={`#${index + 1}`} 
                      color="primary" 
                      size="small" 
                    />
                  </Box>
                  
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Spesa Totale
                      </Typography>
                      <Typography variant="h6" color="error.main">
                        €{stat.spesaTotale.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Giocatori
                      </Typography>
                      <Typography variant="h6">
                        {stat.numeroGiocatori}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Prezzo Medio
                      </Typography>
                      <Typography variant="h6">
                        €{stat.prezzoMedio.toFixed(0)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Efficienza
                      </Typography>
                      <Typography variant="h6" color={stat.efficienzaSpesa > 1 ? 'success.main' : 'warning.main'}>
                        {stat.efficienzaSpesa.toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Distribuzione Ruoli
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {ruoli.map((ruolo) => {
                      const count = stat.distribuzioneRuoli[ruolo] || 0
                      const spesa = stat.spesaPerRuolo[ruolo] || 0
                      if (count === 0) return null
                      
                      return (
                        <Box key={ruolo} sx={{ textAlign: 'center' }}>
                          <Chip
                            label={`${ruolo.charAt(0).toUpperCase()}`}
                            color={coloriRuoli[ruolo] || 'default'}
                            size="small"
                            variant="outlined"
                          />
                          <Typography variant="caption" display="block">
                            {count}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            €{spesa.toLocaleString()}
                          </Typography>
                        </Box>
                      )
                    })}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Riepilogo statistiche */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Riepilogo Lega
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                €{statistiche.reduce((sum, s) => sum + s.spesaTotale, 0).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Spesa Totale Lega
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {statistiche.reduce((sum, s) => sum + s.numeroGiocatori, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Giocatori Totali
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                €{(statistiche.reduce((sum, s) => sum + s.spesaTotale, 0) / 
                    statistiche.reduce((sum, s) => sum + s.numeroGiocatori, 0)).toFixed(0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Prezzo Medio Lega
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {(statistiche.reduce((sum, s) => sum + s.efficienzaSpesa, 0) / statistiche.length).toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Efficienza Media
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default StatisticheComparative
