import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Grid,
  Autocomplete,
} from '@mui/material'

import { Giocatore, Squadra } from '../../../types'

interface AssegnaGiocatoreDialogProps {
  open: boolean
  onClose: () => void
  onAssegna: (giocatoreId: string, squadraId: number, prezzo: number) => Promise<boolean>
  giocatori: Giocatore[]
  squadre: Squadra[]
  selectedSquadra?: Squadra | null
  loading?: boolean
}

const AssegnaGiocatoreDialog: React.FC<AssegnaGiocatoreDialogProps> = ({
  open,
  onClose,
  onAssegna,
  giocatori,
  squadre,
  selectedSquadra: propSelectedSquadra,
  loading = false,
}) => {
  const [selectedGiocatore, setSelectedGiocatore] = useState('')
  const [selectedSquadraId, setSelectedSquadraId] = useState('')
  const [prezzo, setPrezzo] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [successMessage, setSuccessMessage] = useState('')

  // Memoizza i calcoli per evitare re-render
  const giocatoreSelezionato = React.useMemo(() =>
    giocatori.find(g => g.id === selectedGiocatore),
    [giocatori, selectedGiocatore]
  )

  const squadraSelezionata = React.useMemo(() =>
    squadre.find(s => s.id === parseInt(selectedSquadraId)),
    [squadre, selectedSquadraId]
  )

  useEffect(() => {
    if (open) {
      setSelectedGiocatore('')
      setSelectedSquadraId(propSelectedSquadra ? propSelectedSquadra.id.toString() : '')
      setPrezzo('')
      setErrors({})
      setSuccessMessage('')
    }
  }, [open, propSelectedSquadra])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!selectedGiocatore) {
      newErrors.giocatore = 'Seleziona un giocatore'
    }

    if (!selectedSquadraId) {
      newErrors.squadra = 'Seleziona una squadra'
    }

    if (!prezzo || parseInt(prezzo) <= 0) {
      newErrors.prezzo = 'Inserisci un prezzo valido'
    }

    if (squadraSelezionata && parseInt(prezzo) > squadraSelezionata.budget) {
      newErrors.prezzo = `La squadra ha solo €${squadraSelezionata.budget} di budget`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAssegna = async () => {
    if (validateForm()) {
      const success = await onAssegna(selectedGiocatore, parseInt(selectedSquadraId), parseInt(prezzo))
      if (success) {
        // Reset del form in caso di successo
        setSelectedGiocatore('')
        setSelectedSquadraId('')
        setPrezzo('')
        setErrors({})
        setSuccessMessage('Giocatore assegnato con successo!')

        // Nascondi il messaggio di successo dopo 3 secondi
        setTimeout(() => {
          setSuccessMessage('')
        }, 3000)
      }
    }
  }

  const handleClose = () => {
    setErrors({})
    setSuccessMessage('')
    onClose()
  }

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
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            {/* Selezione Giocatore - Utilizza API /api/giocatori filtrata per disponibilità */}
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={giocatori}
                getOptionLabel={(option) => option.nome}
                value={giocatori.find(g => g.id === selectedGiocatore) || null}
                onChange={(_, newValue) => {
                  setSelectedGiocatore(newValue ? newValue.id : '')
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Seleziona Giocatore Disponibile"
                    error={!!errors.giocatore}
                    helperText={errors.giocatore || `${giocatori.length} giocatori disponibili`}
                    variant="outlined"
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props} sx={{ py: 1 }}>
                    <Typography variant="body1" fontWeight="bold">
                      {option.nome}
                    </Typography>
                    <Typography marginLeft={1} variant="body2" color="text.secondary">
                      {option.squadra} - {option.ruolo}
                    </Typography>
                  </Box>
                )}
                filterOptions={(options, { inputValue }) => {
                  if (!inputValue) return options.slice(0, 50) // Limita risultati iniziali
                  const searchTerm = inputValue.toLowerCase()
                  return options
                    .filter(option =>
                      option.nome.toLowerCase().includes(searchTerm) ||
                      option.ruolo.toLowerCase().includes(searchTerm)
                    )
                    .slice(0, 20) // Limita risultati di ricerca
                }}
                disableListWrap
                blurOnSelect
                clearOnBlur={false}
              />
            </Grid>

            {/* Selezione Squadra */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.squadra}>
                <InputLabel>Seleziona Squadra</InputLabel>
                <Select
                  value={selectedSquadraId}
                  label="Seleziona Squadra"
                  onChange={(e) => setSelectedSquadraId(e.target.value)}
                >
                  {squadre.map((squadra) => (
                    <MenuItem key={squadra.id} value={squadra.id}>
                      <Typography  variant="body1">
                        {squadra.nome} - {squadra.proprietario}
                      </Typography>
                      <Typography marginLeft={1}
                       variant="caption" color="success.main">
                        Budget: €{squadra.budget}
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
                {errors.squadra && (
                  <Typography color="error" variant="caption">
                    {errors.squadra}
                  </Typography>
                )}
              </FormControl>
              {propSelectedSquadra && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Squadra Pre-selezionata:</strong> {propSelectedSquadra.nome} ({propSelectedSquadra.proprietario})
                  </Typography>
                </Alert>
              )}
            </Grid>

            {/* Prezzo */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Prezzo di Acquisto (€)"
                type="number"
                value={prezzo}
                onChange={(e) => setPrezzo(e.target.value)}
                error={!!errors.prezzo}
                helperText={errors.prezzo}
                inputProps={{ min: 0, step: 1 }}
              />
            </Grid>

            {/* Informazioni Riepilogo */}
            {giocatoreSelezionato && squadraSelezionata && (
              <Grid item xs={12}>
                <Box sx={{ p: 2, borderRadius: 1, border: '1px solid', borderColor: 'info.main' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Riepilogo Assegnazione
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Giocatore: {giocatoreSelezionato.nome} ({giocatoreSelezionato.ruolo})
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Squadra: {squadraSelezionata.nome} ({squadraSelezionata.proprietario})
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Budget: €{squadraSelezionata.budget} | Prezzo: €{prezzo || 0}
                  </Typography>
                  <Typography variant="body2" color="success.main" fontWeight="bold">
                    Rimanente: €{squadraSelezionata.budget - (parseInt(prezzo) || 0)}
                  </Typography>
                </Box>
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
          onClick={handleAssegna}
          variant="contained"
          disabled={loading || !selectedGiocatore || !selectedSquadraId || !prezzo}
        >
          {loading ? 'Assegnazione...' : 'Assegna Giocatore'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AssegnaGiocatoreDialog
