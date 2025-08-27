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

} from '@mui/material'
import { Edit as EditIcon } from '@mui/icons-material'
import { Giocatore } from '../../../../types'
import { giocatoriAPI } from '../../../../services/api'

interface EditNoteDialogProps {
  open: boolean
  onClose: () => void
  giocatore: Giocatore | null
  onNoteUpdated?: (giocatore: Giocatore) => void
}

const EditNoteDialog: React.FC<EditNoteDialogProps> = ({
  open,
  onClose,
  giocatore,
  onNoteUpdated,
}) => {
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (open && giocatore) {
      setNote(giocatore.note || '')
      setErrors({})
      setSuccessMessage('')
    }
  }, [open, giocatore])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (note.trim().length > 500) {
      newErrors.note = 'Le note non possono superare i 500 caratteri'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!giocatore) return

    if (validateForm()) {
      setLoading(true)
      try {
        const response = await giocatoriAPI.updateNotes(giocatore.id, note.trim())
        
        if (response.success && response.data) {
          setSuccessMessage('Note aggiornate con successo!')
          
          // Notifica il componente padre dell'aggiornamento
          if (onNoteUpdated) {
            onNoteUpdated(response.data)
          }

          // Reset del form in caso di successo
          setErrors({})

          // Nascondi il messaggio di successo dopo 3 secondi e chiudi il dialog
          setTimeout(() => {
            setSuccessMessage('')
            onClose()
          }, 3000)
        } else {
          setErrors({ submit: response.error || 'Errore nell\'aggiornamento delle note' })
        }
      } catch (error) {
        console.error('Errore nell\'aggiornamento delle note:', error)
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
    // Ripristina le note originali se non sono state salvate
    if (giocatore) {
      setNote(giocatore.note || '')
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
            Modifica Note
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Modifica le note per {giocatore.nome} ({giocatore.ruolo})
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

            {/* Campo Note */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Note"
                multiline
                rows={6}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                error={!!errors.note}
                helperText={
                  errors.note || 
                  `Caratteri: ${note.length}/500${note.length > 400 ? ' (quasi al limite)' : ''}`
                }
                placeholder="Inserisci le tue note personali sul giocatore..."
                disabled={loading}
                variant="outlined"
                InputProps={{
                  style: { fontSize: '14px' }
                }}
              />
            </Grid>

            {/* Suggerimenti */}
            <Grid item xs={12}>
              <Box sx={{ p: 2, borderRadius: 1, border: '1px solid', borderColor: 'info.main', bgcolor: 'info.50' }}>
                <Typography variant="subtitle2" gutterBottom color="info.main">
                  💡 Suggerimenti per le note
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  • Prestazioni recenti e trend di forma
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  • Infortuni o problemi fisici
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  • Cambi di formazione o ruolo nella squadra
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Considerazioni personali per l'asta
                </Typography>
              </Box>
            </Grid>

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
        <Button onClick={handleCancel} disabled={loading}>
          Annulla
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={loading}
          startIcon={<EditIcon />}
        >
          {loading ? 'Salvando...' : 'Salva Note'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditNoteDialog
