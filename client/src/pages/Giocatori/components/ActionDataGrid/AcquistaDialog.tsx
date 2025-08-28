import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  Grid,
} from '@mui/material'
import { Giocatore, Squadra } from '../../../../types'

interface AcquistaDialogProps {
  open: boolean
  onClose: () => void
  giocatore: Giocatore | null
  squadre?: Squadra[]
  onAcquista: (squadraId: number, prezzo: number) => Promise<void>
}

const AcquistaDialog: React.FC<AcquistaDialogProps> = ({
  open,
  onClose,
  giocatore,
  squadre,
  onAcquista,
}) => {
  const [selectedSquadra, setSelectedSquadra] = useState('')
  const [prezzo, setPrezzo] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [successMessage, setSuccessMessage] = useState('')

  // Memoizza i calcoli per evitare re-render
  const squadraSelezionata = React.useMemo(() =>
    squadre?.find(s => s.id === parseInt(selectedSquadra)),
    [squadre, selectedSquadra]
  )

  useEffect(() => {
    if (open) {
      setSelectedSquadra('')
      setPrezzo('')
      setErrors({})
      setSuccessMessage('')
    }
  }, [open])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!selectedSquadra || !parseInt(selectedSquadra)) {
      newErrors.squadra = 'Seleziona una squadra'
    }

    if (!prezzo || parseFloat(prezzo) <= 0) {
      newErrors.prezzo = 'Inserisci un prezzo valido'
    }

    if (squadraSelezionata && parseFloat(prezzo) > squadraSelezionata.budget_residuo) {
      newErrors.prezzo = `La squadra ha solo €${squadraSelezionata.budget_residuo} di budget residuo`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAcquista = async () => {
    if (validateForm()) {
      setLoading(true)
      try {
        await onAcquista(parseInt(selectedSquadra), parseFloat(prezzo))
        setSuccessMessage('Giocatore assegnato con successo!')
        
        // Reset del form in caso di successo
        setSelectedSquadra('')
        setPrezzo('')
        setErrors({})

        // Nascondi il messaggio di successo dopo 3 secondi e chiudi il dialog
        setTimeout(() => {
          setSuccessMessage('')
          onClose()
        }, 3000)
      } catch (error) {
        console.error('Errore nell\'assegnazione:', error)
        setErrors({ submit: 'Errore nell\'assegnazione del giocatore' })
      } finally {
        setLoading(false)
      }
    }
  }

  const handleClose = () => {
    setErrors({})
    setSuccessMessage('')
    onClose()
  }

  if (!giocatore) return null

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      TransitionProps={{ timeout: 200 }}
      keepMounted={false}
    >
      <DialogTitle>
        <Typography variant="h6" gutterBottom>
          Assegna Giocatore
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Assegna {giocatore.nome} ({giocatore.ruolo}) a una squadra
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            {/* Informazioni Giocatore */}
            <Grid item xs={12}>
              <Box sx={{ p: 2, borderRadius: 1, border: '1px solid', borderColor: 'primary.main', bgcolor: 'primary.50' }}>
                <Typography variant="subtitle2" gutterBottom color="primary">
                  Giocatore Selezionato
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {giocatore.nome} ({giocatore.ruolo})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Squadra Attuale: {giocatore.squadra}
                </Typography>
                {giocatore.fascia && (
                  <Typography variant="body2" color="primary">
                    Fascia: {giocatore.fascia}
                  </Typography>
                )}
                {giocatore.consiglio && (
                  <Typography variant="body2" color="secondary">
                    Consiglio: {giocatore.consiglio}
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Selezione Squadra */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.squadra}>
                <InputLabel>Seleziona Squadra</InputLabel>
                <Select
                  value={selectedSquadra}
                  label="Seleziona Squadra"
                  onChange={(e) => setSelectedSquadra(e.target.value)}
                  disabled={loading}
                >
                  {squadre && squadre.length > 0 ? squadre.map((squadra) => (
                    <MenuItem key={squadra.id} value={squadra.id}>
                      <Typography variant="body1">
                        {squadra.nome} - {squadra.proprietario}
                      </Typography>
                      <Typography marginLeft={1} variant="caption" color="success.main">
                        Budget Residuo: €{squadra.budget_residuo}
                      </Typography>
                    </MenuItem>
                  )) : (
                    <MenuItem disabled>Nessuna squadra disponibile</MenuItem>
                  )}
                </Select>
                {errors.squadra && (
                  <Typography color="error" variant="caption">
                    {errors.squadra}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Prezzo */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Prezzo di Assegnazione (€)"
                type="number"
                value={prezzo}
                onChange={(e) => setPrezzo(e.target.value)}
                error={!!errors.prezzo}
                helperText={errors.prezzo}
                inputProps={{ min: 0, step: 1 }}
                disabled={loading}
              />
            </Grid>

            {/* Informazioni Riepilogo */}
            {squadraSelezionata && (
              <Grid item xs={12}>
                <Box sx={{ p: 2, borderRadius: 1, border: '1px solid', borderColor: 'info.main' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Riepilogo Assegnazione
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Giocatore: {giocatore.nome} ({giocatore.ruolo})
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Squadra: {squadraSelezionata.nome} ({squadraSelezionata.proprietario})
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Budget Residuo: €{squadraSelezionata.budget_residuo} | Prezzo: €{prezzo || 0}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color={parseFloat(prezzo) > squadraSelezionata.budget_residuo ? 'error.main' : 'success.main'} 
                    fontWeight="bold"
                  >
                    Rimanente: €{squadraSelezionata.budget_residuo - (parseFloat(prezzo) || 0)}
                  </Typography>
                </Box>
              </Grid>
            )}

            {/* Messaggio di Errore */}
            {errors.submit && (
              <Grid item xs={12}>
                <Alert severity="error">
                  {errors.submit}
                </Alert>
              </Grid>
            )}

            {/* Messaggio di Successo */}
            {successMessage && (
              <Grid item xs={12}>
                <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1, border: '1px solid', borderColor: 'success.main' }}>
                  <Typography variant="body2" color="success.dark" align="center">
                    ✅ {successMessage}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Annulla
        </Button>
        <Button 
          onClick={handleAcquista} 
          variant="contained"
          disabled={loading || !selectedSquadra || !prezzo || !squadre || squadre.length === 0}
        >
          {loading ? 'Assegnando...' : 'Assegna Giocatore'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AcquistaDialog
