import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
} from '@mui/material'
import { Giocatore } from '../../../../types'

interface SvincolaDialogProps {
  open: boolean
  onClose: () => void
  giocatore: Giocatore | null
  onSvincola: (giocatore: Giocatore) => Promise<void>
}

const SvincolaDialog: React.FC<SvincolaDialogProps> = ({
  open,
  onClose,
  giocatore,
  onSvincola,
}) => {
  const [loading, setLoading] = React.useState(false)

  const handleSvincola = async () => {
    if (!giocatore) return
    
    setLoading(true)
    try {
      await onSvincola(giocatore)
    } finally {
      setLoading(false)
    }
  }

  if (!giocatore) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionProps={{ timeout: 200 }}
      keepMounted={false}
    >
      <DialogTitle>
        <Typography variant="h6" gutterBottom>
          Conferma Svincolo
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sei sicuro di voler svincolare questo giocatore?
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {/* Informazioni Giocatore */}
          <Box sx={{ p: 2, borderRadius: 1, border: '1px solid', borderColor: 'warning.main', bgcolor: 'warning.50' }}>
            <Typography variant="subtitle2" gutterBottom color="warning.dark">
              Giocatore da Svincolare
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {giocatore.nome} ({giocatore.ruolo})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Squadra Attuale: {giocatore.squadra}
            </Typography>
          </Box>

          {/* Informazioni Acquisto - Evidenziate */}
          {(giocatore.nome_squadra_acquirente || giocatore.prezzo_acquisto) && (
            <Box sx={{ 
              p: 2, 
              mt: 2, 
              borderRadius: 1, 
              border: '1px solid', 
              borderColor: 'success.main', 
              bgcolor: 'success.50',
              textAlign: 'center'
            }}>
              <Typography variant="subtitle2" gutterBottom color="success.dark" fontWeight="bold">
                Informazioni Acquisto
              </Typography>
              {giocatore.nome_squadra_acquirente && (
                <Typography variant="body1" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Fantasquadra: {giocatore.nome_squadra_acquirente}
                </Typography>
              )}
              {giocatore.prezzo_acquisto && (
                <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold' }}>
                  Prezzo: €{giocatore.prezzo_acquisto}
                </Typography>
              )}
            </Box>
          )}

          {/* Avviso */}
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Attenzione:</strong> Lo svincolo del giocatore comporterà:
            </Typography>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li>Il giocatore tornerà disponibile per nuove assegnazioni</li>
              {giocatore.prezzo_acquisto && (
                <li>La squadra <strong>{giocatore.nome_squadra_acquirente}</strong> recupererà <strong>€{giocatore.prezzo_acquisto}</strong> di budget</li>
              )}
              <li>L'operazione non può essere annullata</li>
            </ul>
          </Alert>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Annulla
        </Button>
        <Button 
          onClick={handleSvincola} 
          variant="contained"
          color="warning"
          disabled={loading}
        >
          {loading ? 'Svincolando...' : 'Conferma Svincolo'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SvincolaDialog
