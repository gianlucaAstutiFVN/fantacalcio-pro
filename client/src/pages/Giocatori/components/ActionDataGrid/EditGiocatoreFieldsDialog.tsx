import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Alert,
  Grid,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material'
import { Edit as EditIcon } from '@mui/icons-material'
import { Giocatore, Fascia } from '../../../../types'
import { giocatoriAPI } from '../../../../services/api'

interface EditGiocatoreFieldsDialogProps {
  open: boolean
  onClose: () => void
  giocatore: Giocatore | null
  onFieldsUpdated?: (giocatore: Giocatore) => void
}

const EditGiocatoreFieldsDialog: React.FC<EditGiocatoreFieldsDialogProps> = ({
  open,
  onClose,
  giocatore,
  onFieldsUpdated,
}) => {
  const [fields, setFields] = useState({
    mia_valutazione: '',
    note: '',
    consiglio: '',
    fascia: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (open && giocatore) {
      setFields({
        mia_valutazione: giocatore.mia_valutazione?.toString() || '',
        note: giocatore.note || '',
        consiglio: giocatore.consiglio || '',
        fascia: giocatore.fascia || ''
      })
      setErrors({})
      setSuccessMessage('')
    }
  }, [open, giocatore])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (fields.mia_valutazione && (parseInt(fields.mia_valutazione) < 1 || parseInt(fields.mia_valutazione) > 10)) {
      newErrors.mia_valutazione = 'La valutazione deve essere tra 1 e 10'
    }

    if (fields.note.trim().length > 500) {
      newErrors.note = 'Le note non possono superare i 500 caratteri'
    }

    if (fields.consiglio.trim().length > 200) {
      newErrors.consiglio = 'Il consiglio non può superare i 200 caratteri'
    }

    if (fields.fascia.trim().length > 100) {
      newErrors.fascia = 'La fascia non può superare i 100 caratteri'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!giocatore) return

    if (validateForm()) {
      setLoading(true)
      
      // Prepare the fields to update (only non-empty ones)
      const fieldsToUpdate: any = {}
      
      if (fields.mia_valutazione !== '') {
        fieldsToUpdate.mia_valutazione = parseInt(fields.mia_valutazione)
      } else if (fields.mia_valutazione === '') {
        fieldsToUpdate.mia_valutazione = null
      }
      
      if (fields.note !== '') {
        fieldsToUpdate.note = fields.note.trim()
      } else if (fields.note === '') {
        fieldsToUpdate.note = null
      }
      
      if (fields.consiglio !== '') {
        fieldsToUpdate.consiglio = fields.consiglio.trim()
      } else if (fields.consiglio === '') {
        fieldsToUpdate.consiglio = null
      }
      
      if (fields.fascia !== '') {
        fieldsToUpdate.fascia = fields.fascia.trim()
      } else if (fields.fascia === '') {
        fieldsToUpdate.fascia = null
      }
      
      // Aggiornamento ottimistico immediato
      const giocatoreAggiornato = {
        ...giocatore,
        ...fieldsToUpdate
      }
      
      if (onFieldsUpdated) {
        onFieldsUpdated(giocatoreAggiornato)
      }
      
      try {
        const response = await giocatoriAPI.updateFields(giocatore.id, fieldsToUpdate)
        
        if (response.success && response.data) {
          setSuccessMessage('Campi aggiornati con successo!')
          
          // Reset del form in caso di successo
          setErrors({})

          // Nascondi il messaggio di successo dopo 3 secondi e chiudi il dialog
          setTimeout(() => {
            setSuccessMessage('')
            onClose()
          }, 3000)
        } else {
          // Rollback in caso di errore
          if (onFieldsUpdated) {
            onFieldsUpdated(giocatore)
          }
          setErrors({ submit: response.error || 'Errore nell\'aggiornamento dei campi' })
        }
      } catch (error) {
        console.error('Errore nell\'aggiornamento dei campi:', error)
        // Rollback in caso di errore
        if (onFieldsUpdated) {
          onFieldsUpdated(giocatore)
        }
        setErrors({ submit: 'Errore nella comunicazione con il server' })
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

  const handleCancel = () => {
    // Ripristina i campi originali se non sono stati salvati
    if (giocatore) {
      setFields({
        mia_valutazione: giocatore.mia_valutazione?.toString() || '',
        note: giocatore.note || '',
        consiglio: giocatore.consiglio || '',
        fascia: giocatore.fascia || ''
      })
    }
    handleClose()
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
        <Box display="flex" alignItems="center" gap={1}>
          <EditIcon color="primary" />
          <Typography variant="h6" gutterBottom>
            Modifica Campi Giocatore
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Modifica i campi per {giocatore.nome} ({giocatore.ruolo})
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
                  Squadra: {giocatore.squadra}
                </Typography>
                {giocatore.fantasquadra && (
                  <Typography variant="body2" color="success.main">
                    Fantasquadra: {giocatore.fantasquadra}
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Campo Valutazione */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mia Valutazione"
                type="number"
                value={fields.mia_valutazione}
                onChange={(e) => setFields({ ...fields, mia_valutazione: e.target.value })}
                error={!!errors.mia_valutazione}
                helperText={errors.mia_valutazione || 'Valore da 1 a 10 (lasciare vuoto per rimuovere)'}
                placeholder="1-10"
                disabled={loading}
                variant="outlined"
                InputProps={{
                  inputProps: { min: 1, max: 10 }
                }}
              />
            </Grid>

            {/* Campo Fascia */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.fascia}>
                <Select
                  value={fields.fascia}
                  onChange={(e) => setFields({ ...fields, fascia: e.target.value })}
                  size="medium"
                    label="Fascia"
                  placeholder="Fascia"
                  sx={{ borderRadius: 2 }}
                  disabled={loading}
                >
                  <MenuItem value="">Nessuna fascia</MenuItem>
                  <MenuItem value={Fascia.TOP}>{Fascia.TOP}</MenuItem>
                  <MenuItem value={Fascia.SEMI_TOP}>{Fascia.SEMI_TOP}</MenuItem>
                  <MenuItem value={Fascia.SOTTO_SEMI_TOP}>{Fascia.SOTTO_SEMI_TOP}</MenuItem>
                  <MenuItem value={Fascia.JOLLY_1_FASCIA}>{Fascia.JOLLY_1_FASCIA}</MenuItem>
                  <MenuItem value={Fascia.FASCIA_ALTA}>{Fascia.FASCIA_ALTA}</MenuItem>
                  <MenuItem value={Fascia.FASCIA_MEDIA}>{Fascia.FASCIA_MEDIA}</MenuItem>
                  <MenuItem value={Fascia.LOW_COST_1_FASCIA}>{Fascia.LOW_COST_1_FASCIA}</MenuItem>
                  <MenuItem value={Fascia.LOW_COST_2_FASCIA}>{Fascia.LOW_COST_2_FASCIA}</MenuItem>
                  <MenuItem value={Fascia.SCOMMESSE}>{Fascia.SCOMMESSE}</MenuItem>
                </Select>
                {errors.fascia && <FormHelperText>{errors.fascia}</FormHelperText>}
                {!errors.fascia && (
                  <FormHelperText>Classifica del giocatore</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Campo Consiglio */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Consiglio"
                multiline
                rows={3}
                value={fields.consiglio}
                onChange={(e) => setFields({ ...fields, consiglio: e.target.value })}
                error={!!errors.consiglio}
                helperText={errors.consiglio || `Caratteri: ${fields.consiglio.length}/200`}
                placeholder="Inserisci il tuo consiglio sul giocatore..."
                disabled={loading}
                variant="outlined"
              />
            </Grid>

            {/* Campo Note */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Note"
                multiline
                rows={4}
                value={fields.note}
                onChange={(e) => setFields({ ...fields, note: e.target.value })}
                error={!!errors.note}
                helperText={
                  errors.note || 
                  `Caratteri: ${fields.note.length}/500${fields.note.length > 400 ? ' (quasi al limite)' : ''}`
                }
                placeholder="Inserisci le tue note personali sul giocatore..."
                disabled={loading}
                variant="outlined"
              />
            </Grid>

            {/* Suggerimenti */}
            <Grid item xs={12}>
              <Box sx={{ p: 2, borderRadius: 1, border: '1px solid', borderColor: 'info.main', bgcolor: 'info.50' }}>
                <Typography variant="subtitle2" gutterBottom color="info.main">
                  💡 Suggerimenti per i campi
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  • <strong>Valutazione:</strong> 1-10 basata sulle prestazioni e potenziale
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  • <strong>Fascia:</strong> Classifica del giocatore 
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  • <strong>Consiglio:</strong> Raccomandazioni per l'acquisto
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • <strong>Note:</strong> Osservazioni personali e dettagli aggiuntivi
                </Typography>
              </Box>
            </Grid>

            {/* Messaggi di errore e successo */}
            {Object.keys(errors).length > 0 && (
              <Grid item xs={12}>
                <Alert severity="error" sx={{ mt: 2 }}>
                  {Object.values(errors).map((error, index) => (
                    <Typography key={index} variant="body2">
                      {error}
                    </Typography>
                  ))}
                </Alert>
              </Grid>
            )}

            {successMessage && (
              <Grid item xs={12}>
                <Alert severity="success" sx={{ mt: 2 }}>
                  {successMessage}
                </Alert>
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={handleCancel} disabled={loading}>
          Annulla
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={loading}
          startIcon={loading ? <Box component="span" sx={{ width: 20, height: 20 }} /> : <EditIcon />}
        >
          {loading ? 'Salvando...' : 'Salva Modifiche'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditGiocatoreFieldsDialog
