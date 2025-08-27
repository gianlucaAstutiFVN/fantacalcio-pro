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
} from '@mui/material'
import { Giocatore } from '../../../../types'
import { giocatoriAPI } from '../../../../services/api'

interface EditValutazioneDialogProps {
  open: boolean
  onClose: () => void
  giocatore: Giocatore | null
  onValutazioneUpdated: (giocatore: Giocatore) => void
}

const EditValutazioneDialog: React.FC<EditValutazioneDialogProps> = ({
  open,
  onClose,
  giocatore,
  onValutazioneUpdated,
}) => {
  const [valutazione, setValutazione] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (open && giocatore) {
      setValutazione(giocatore.mia_valutazione?.toString() || '')
      setErrors({})
      setSuccessMessage('')
    }
  }, [open, giocatore])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (valutazione && (parseInt(valutazione) < 1 || parseInt(valutazione) > 10)) {
      newErrors.valutazione = 'La valutazione deve essere tra 1 e 10'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (validateForm()) {
      setLoading(true)
      
      // Aggiornamento ottimistico immediato
      const giocatoreAggiornato = {
        ...giocatore!,
        mia_valutazione: valutazione ? parseInt(valutazione) : null
      }
      
      onValutazioneUpdated(giocatoreAggiornato)
      
      try {
        // Chiama l'API per aggiornare la valutazione
        const response = await giocatoriAPI.updateValutazione(
          giocatore!.id, 
          valutazione ? parseInt(valutazione) : null
        )
        
        if (response.success) {
          setSuccessMessage('Valutazione aggiornata con successo!')
          
          // Chiudi il dialog dopo 2 secondi
          setTimeout(() => {
            setSuccessMessage('')
            onClose()
          }, 2000)
        } else {
          // Rollback in caso di errore
          onValutazioneUpdated(giocatore!)
          setErrors({ submit: response.error || 'Errore nell\'aggiornamento della valutazione' })
        }
      } catch (error: any) {
        console.error('Errore nell\'aggiornamento della valutazione:', error)
        // Rollback in caso di errore
        onValutazioneUpdated(giocatore!)
        const errorMessage = error.response?.data?.error || 'Errore nell\'aggiornamento della valutazione'
        setErrors({ submit: errorMessage })
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
      maxWidth="sm"
      fullWidth
      TransitionProps={{ timeout: 200 }}
      keepMounted={false}
    >
      <DialogTitle>
        <Typography variant="h6" gutterBottom>
          Modifica Valutazione
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Modifica la valutazione per {giocatore.nome} ({giocatore.ruolo})
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {/* Informazioni Giocatore */}
          <Box sx={{ p: 2, borderRadius: 1, border: '1px solid', borderColor: 'primary.main', bgcolor: 'primary.50', mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom color="primary">
              Giocatore Selezionato
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {giocatore.nome} ({giocatore.ruolo})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Squadra: {giocatore.squadra}
            </Typography>
          </Box>

          {/* Campo Valutazione */}
          <TextField
            fullWidth
            label="Mia Valutazione (1-10)"
            type="number"
            value={valutazione}
            onChange={(e) => setValutazione(e.target.value)}
            error={!!errors.valutazione}
            helperText={errors.valutazione || 'Inserisci una valutazione da 1 a 10 (opzionale)'}
            inputProps={{ min: 1, max: 10, step: 1 }}
            disabled={loading}
            sx={{ mb: 2 }}
          />

          {/* Messaggio di Errore */}
          {errors.submit && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.submit}
            </Alert>
          )}

          {/* Messaggio di Successo */}
          {successMessage && (
            <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1, border: '1px solid', borderColor: 'success.main' }}>
              <Typography variant="body2" color="success.dark" align="center">
                ✅ {successMessage}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Annulla
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Salvando...' : 'Salva Valutazione'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditValutazioneDialog

