import React from 'react'
import {
  Drawer,
  Box,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import CloseIcon from '@mui/icons-material/Close'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import { Squadra } from '../../../types'

interface SquadraDrawerProps {
  open: boolean
  squadra: Squadra | null
  onClose: () => void
  onAssegnaGiocatore: () => void
  onSvincolaGiocatore: (giocatoreId: string, squadraId: number) => Promise<boolean>
}

const SquadraDrawer: React.FC<SquadraDrawerProps> = ({
  open,
  squadra,
  onClose,
  onSvincolaGiocatore,
}) => {
  const [svincolaDialog, setSvincolaDialog] = React.useState<{
    open: boolean
    giocatore: any | null
  }>({
    open: false,
    giocatore: null
  })

  const handleSvincolaClick = (giocatore: any) => {
    setSvincolaDialog({
      open: true,
      giocatore
    })
  }

  const handleSvincolaConfirm = async () => {
    if (svincolaDialog.giocatore && squadra) {
      try {
        const success = await onSvincolaGiocatore(svincolaDialog.giocatore.id, squadra.id)
        if (success) {
          setSvincolaDialog({ open: false, giocatore: null })
          onClose() // Chiudi il drawer dopo lo svincolo
        }
      } catch (error) {
        console.error('Errore durante lo svincolo:', error)
      }
    }
  }

  const handleSvincolaCancel = () => {
    setSvincolaDialog({ open: false, giocatore: null })
  }
  // Debug: log per verificare i dati della squadra
  React.useEffect(() => {
    if (squadra) {
      console.log('🔍 SquadraDrawer - Squadra ricevuta:', squadra)
      console.log(`📊 Giocatori: ${(squadra.giocatori || []).length}`)
      if (squadra.giocatori && squadra.giocatori.length > 0) {
        squadra.giocatori.forEach(g => {
          console.log(`  - ${g.nome} (${g.ruolo}) - €${g.valore}`)
        })
      }
    }
  }, [squadra])

  if (!squadra) return null



  const calculateSquadraValue = () => {
    return (squadra.giocatori || []).reduce((total, g) => total + (g.valore || 0), 0)
  }

  const getRuoloCount = (ruolo: string) => {
    return (squadra.giocatori || []).filter(g => g.ruolo.toLowerCase() === ruolo.toLowerCase()).length
  }

  const getGiocatoriPerRuolo = (ruolo: string) => {
    return (squadra.giocatori || []).filter(g => g.ruolo.toLowerCase() === ruolo.toLowerCase())
  }

  const getTotaleSpesoPerRuolo = (ruolo: string) => {
    return getGiocatoriPerRuolo(ruolo).reduce((total, g) => total + (g.valore || 0), 0)
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 600 } }
      }}
    >
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" color="primary">
            {squadra.nome}
          </Typography>
          <IconButton onClick={onClose} size="large">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Informazioni squadra */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Informazioni Squadra
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Proprietario: {squadra.proprietario}
          </Typography>
          
          {/* Statistiche principali */}
          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              label={`Budget: €${squadra.budget_residuo || squadra.budget}`}
              color="primary"
              size="small"
              variant="outlined"
            />
            <Chip 
              label={`Giocatori: ${(squadra.giocatori || []).length}`}
              color="info"
              size="small"
              variant="outlined"
            />
            <Chip 
              label={`Valore: €${calculateSquadraValue()}`}
              color="secondary"
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Distribuzione ruoli */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Distribuzione Ruoli
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label={`P: ${getRuoloCount('portiere')}`} size="small" color="error" variant="outlined" />
            <Chip label={`D: ${getRuoloCount('difensore')}`} size="small" color="primary" variant="outlined" />
            <Chip label={`C: ${getRuoloCount('centrocampista')}`} size="small" color="warning" variant="outlined" />
            <Chip label={`A: ${getRuoloCount('attaccante')}`} size="small" color="success" variant="outlined" />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Sezione giocatori */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">
            Giocatori ({(squadra.giocatori || []).length})
          </Typography>
        </Box>

        {/* Lista giocatori organizzata per ruolo */}
        {(squadra.giocatori || []).length > 0 ? (
          <Box>
            {/* Portieri */}
            {getGiocatoriPerRuolo('portiere').length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" color="error.main" gutterBottom>
                  Portieri ({getGiocatoriPerRuolo('portiere').length})
                </Typography>
                <List dense>
                  {getGiocatoriPerRuolo('portiere').map((giocatore) => (
                    <ListItem key={giocatore.id} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'error.main' }}>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={giocatore.nome}
                        secondary={giocatore.squadra_giocatore}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="success.main">
                          €{giocatore.valore || giocatore.mia_valutazione || 0}
                        </Typography>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleSvincolaClick(giocatore)}
                          title="Svincola giocatore"
                        >
                          <PersonRemoveIcon />
                        </IconButton>
                      </Box>
                    </ListItem>
                  ))}
                </List>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Chip 
                    label={`Totale speso: €${getTotaleSpesoPerRuolo('portiere')}`}
                    color="error"
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </Box>
            )}

            {/* Difensori */}
            {getGiocatoriPerRuolo('difensore').length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" color="primary.main" gutterBottom>
                  Difensori ({getGiocatoriPerRuolo('difensore').length})
                </Typography>
                <List dense>
                  {getGiocatoriPerRuolo('difensore').map((giocatore) => (
                    <ListItem key={giocatore.id} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={giocatore.nome}
                        secondary={giocatore.squadra_giocatore}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="success.main">
                          €{giocatore.valore || giocatore.mia_valutazione || 0}
                        </Typography>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleSvincolaClick(giocatore)}
                          title="Svincola giocatore"
                        >
                          <PersonRemoveIcon />
                        </IconButton>
                      </Box>
                    </ListItem>
                  ))}
                </List>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Chip 
                    label={`Totale speso: €${getTotaleSpesoPerRuolo('difensore')}`}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </Box>
            )}

            {/* Centrocampisti */}
            {getGiocatoriPerRuolo('centrocampista').length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" color="warning.main" gutterBottom>
                  Centrocampisti ({getGiocatoriPerRuolo('centrocampista').length})
                </Typography>
                <List dense>
                  {getGiocatoriPerRuolo('centrocampista').map((giocatore) => (
                    <ListItem key={giocatore.id} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'warning.main' }}>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={giocatore.nome}
                        secondary={giocatore.squadra_giocatore}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="success.main">
                          €{giocatore.valore || giocatore.mia_valutazione || 0}
                        </Typography>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleSvincolaClick(giocatore)}
                          title="Svincola giocatore"
                        >
                          <PersonRemoveIcon />
                        </IconButton>
                      </Box>
                    </ListItem>
                  ))}
                </List>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Chip 
                    label={`Totale speso: €${getTotaleSpesoPerRuolo('centrocampista')}`}
                    color="warning"
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </Box>
            )}

            {/* Attaccanti */}
            {getGiocatoriPerRuolo('attaccante').length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" color="success.main" gutterBottom>
                  Attaccanti ({getGiocatoriPerRuolo('attaccante').length})
                </Typography>
                <List dense>
                  {getGiocatoriPerRuolo('attaccante').map((giocatore) => (
                    <ListItem key={giocatore.id} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'success.main' }}>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={giocatore.nome}
                        secondary={giocatore.squadra_giocatore}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="success.main">
                          €{giocatore.valore || giocatore.mia_valutazione || 0}
                        </Typography>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleSvincolaClick(giocatore)}
                          title="Svincola giocatore"
                        >
                          <PersonRemoveIcon />
                        </IconButton>
                      </Box>
                    </ListItem>
                  ))}
                </List>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Chip 
                    label={`Totale speso: €${getTotaleSpesoPerRuolo('attaccante')}`}
                    color="success"
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </Box>
            )}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Nessun giocatore acquistato
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Inizia ad aggiungere giocatori alla tua squadra!
            </Typography>
          </Box>
        )}

        {/* Dialog di conferma svincolo */}
        <Dialog open={svincolaDialog.open} onClose={handleSvincolaCancel}>
          <DialogTitle>Conferma Svincolo</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Sei sicuro di voler svincolare il giocatore{' '}
              <strong>{svincolaDialog.giocatore?.nome}</strong>?
            </Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                Il giocatore tornerà disponibile e la squadra recupererà{' '}
                <strong>€{svincolaDialog.giocatore?.valore || 0}</strong> di budget.
              </Typography>
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSvincolaCancel}>Annulla</Button>
            <Button 
              onClick={handleSvincolaConfirm} 
              color="error" 
              variant="contained"
            >
              Svincola
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Drawer>
  )
}

export default SquadraDrawer
