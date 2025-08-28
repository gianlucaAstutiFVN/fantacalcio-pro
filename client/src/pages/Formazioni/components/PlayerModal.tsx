import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
  Box,
  Typography,
  Chip,
  Stack,
  Avatar,
  Alert,
  Snackbar,
  CircularProgress,
  LinearProgress,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  Tooltip
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material';
import { Giocatore } from '../../../types';
import { giocatoriAPI, wishlistAPI } from '../../../services/api';

interface PlayerModalProps {
  open: boolean;
  onClose: () => void;
  giocatore: Giocatore | null;
  onPlayerUpdated?: (giocatore: Giocatore) => void;
  onSquadRefresh?: () => void; // Callback per rifetchare i dati della squadra
}

const getRuoloIcon = (ruolo: string | undefined) => {
  if (!ruolo) return '👤';
  
  switch (ruolo.toLowerCase()) {
    case 'portiere':
      return '🛡️';
    case 'difensore':
      return '🛡️';
    case 'centrocampista':
      return '⚽';
    case 'attaccante':
      return '🏆';
    default:
      return '👤';
  }
};

const getRuoloColor = (ruolo: string | undefined) => {
  if (!ruolo) return 'default';
  
  switch (ruolo.toLowerCase()) {
    case 'portiere':
      return 'primary';
    case 'difensore':
      return 'success';
    case 'centrocampista':
      return 'warning';
    case 'attaccante':
      return 'error';
    default:
      return 'default';
  }
};


const PlayerModal: React.FC<PlayerModalProps> = ({ 
  open, 
  onClose, 
  giocatore, 
  onPlayerUpdated,
  onSquadRefresh
}) => {
  const [formData, setFormData] = useState({
    mia_valutazione: '',
    note: '',
    consiglio: '',
    fascia: ''
  });
  const [inWishlist, setInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'success' });

  // Precompila i campi quando il giocatore cambia
  useEffect(() => {
    if (giocatore) {
      setFormData({
        mia_valutazione: giocatore.mia_valutazione?.toString() || '',
        note: giocatore.note || '',
        consiglio: giocatore.consiglio || '',
        fascia: giocatore.fascia || ''
      });
      setInWishlist(giocatore.inWishlist || false);
      setErrors({});
    }
  }, [giocatore]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (formData.mia_valutazione && (parseInt(formData.mia_valutazione) < 1 || parseInt(formData.mia_valutazione) > 10)) {
      newErrors.mia_valutazione = 'La valutazione deve essere tra 1 e 10';
    }

    if (formData.note.trim().length > 500) {
      newErrors.note = 'Le note non possono superare i 500 caratteri';
    }

    if (formData.consiglio.trim().length > 200) {
      newErrors.consiglio = 'Il consiglio non può superare i 200 caratteri';
    }

    if (formData.fascia.trim().length > 100) {
      newErrors.fascia = 'La fascia non può superare i 100 caratteri';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!giocatore?.id) return;
    
    if (validateForm()) {
      setIsLoading(true);
      
      try {
        // Prepare the fields to update (only non-empty ones)
        const fieldsToUpdate: any = {};
        
        if (formData.mia_valutazione !== '') {
          fieldsToUpdate.mia_valutazione = parseInt(formData.mia_valutazione);
        } else if (formData.mia_valutazione === '') {
          fieldsToUpdate.mia_valutazione = null;
        }
        
        if (formData.note !== '') {
          fieldsToUpdate.note = formData.note.trim();
        } else if (formData.note === '') {
          fieldsToUpdate.note = null;
        }
        
        if (formData.consiglio !== '') {
          fieldsToUpdate.consiglio = formData.consiglio.trim();
        } else if (formData.consiglio === '') {
          fieldsToUpdate.consiglio = null;
        }
        
        if (formData.fascia !== '') {
          fieldsToUpdate.fascia = formData.fascia.trim();
        } else if (formData.fascia === '') {
          fieldsToUpdate.fascia = null;
        }

        if (Object.keys(fieldsToUpdate).length > 0) {
          const response = await giocatoriAPI.updateFields(giocatore.id, fieldsToUpdate);
          
          if (response.success && onPlayerUpdated) {
            // Aggiorna immediatamente il giocatore locale
            const updatedGiocatore = {
              ...giocatore,
              ...fieldsToUpdate
            };
            onPlayerUpdated(updatedGiocatore);
          }
          
          setSnackbar({
            open: true,
            message: '✅ Giocatore aggiornato con successo!',
            severity: 'success'
          });

          // Rifetchare i dati della squadra
          if (onSquadRefresh) {
            onSquadRefresh();
          }

          // Chiudi la modale dopo il salvataggio
          setTimeout(() => {
            onClose();
          }, 1500);
        } else {
          setSnackbar({
            open: true,
            message: 'ℹ️ Nessuna modifica da salvare',
            severity: 'info'
          });
          
          // Chiudi la modale anche se non ci sono modifiche
          setTimeout(() => {
            onClose();
          }, 1500);
        }
      } catch (error: any) {
        console.error('Errore nel salvataggio:', error);
        setSnackbar({
          open: true,
          message: `❌ Errore: ${error.response?.data?.error || error.message}`,
          severity: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancel = () => {
    // Chiudi direttamente la modale
    onClose();
  };

  const handleWishlistToggle = async () => {
    if (!giocatore?.id) return;
    
    setWishlistLoading(true);
    try {
      if (inWishlist) {
        await wishlistAPI.remove(giocatore.id);
        setInWishlist(false);
        setSnackbar({
          open: true,
          message: '💔 Rimosso dalla wishlist',
          severity: 'success'
        });
      } else {
        await wishlistAPI.add(giocatore.id);
        setInWishlist(true);
        setSnackbar({
          open: true,
          message: '❤️ Aggiunto alla wishlist',
          severity: 'success'
        });
      }
      
      // Aggiorna immediatamente il giocatore locale
      if (onPlayerUpdated) {
        const updatedGiocatore = {
          ...giocatore,
          inWishlist: !inWishlist
        };
        onPlayerUpdated(updatedGiocatore);
      }

      // Rifetchare i dati della squadra
      if (onSquadRefresh) {
        onSquadRefresh();
      }
    } catch (error: any) {
      console.error('Errore nella gestione wishlist:', error);
      setSnackbar({
        open: true,
        message: `❌ Errore wishlist: ${error.response?.data?.error || error.message}`,
        severity: 'error'
      });
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (!giocatore) return null;

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            maxHeight: '90vh'
          }
        }}
      >
        {/* Loading indicator */}
        {(isLoading || wishlistLoading) && (
          <LinearProgress 
            sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              zIndex: 1000 
            }} 
          />
        )}

        {/* Header compatto con nome, voto, chip e wishlist */}
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          color: 'text.primary',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 3,
          borderBottom: '1px solid #e2e8f0'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <Avatar 
              sx={{ 
                bgcolor: `${getRuoloColor(giocatore.ruolo)}.main`,
                color: 'white',
                width: 50,
                height: 50,
                fontSize: '1.5rem'
              }}
            >
              {getRuoloIcon(giocatore.ruolo)}
            </Avatar>
            
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" fontWeight="bold" color="text.primary">
                {giocatore.nome}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                {giocatore.gazzetta && (
                  <Typography variant="h6" color="info.main" fontWeight="bold">
                    {giocatore.gazzetta}
                  </Typography>
                )}
                <Chip 
                  label={giocatore.ruolo} 
                  size="small" 
                  color={getRuoloColor(giocatore.ruolo)}
                  sx={{ fontWeight: 600 }}
                />
                <Chip 
                  label={giocatore.squadra} 
                  size="small" 
                  variant="outlined"
                  sx={{ fontWeight: 500 }}
                />
              </Box>
            </Box>
          </Box>

          {/* Wishlist button a destra */}
          <Tooltip title={`${inWishlist ? 'Rimuovi da' : 'Aggiungi a'} wishlist`}>
            <IconButton
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
              sx={{ 
                color: inWishlist ? 'error.main' : 'action.active',
                bgcolor: inWishlist ? 'error.light' : 'transparent',
                '&:hover': {
                  bgcolor: inWishlist ? 'error.main' : 'action.hover',
                  color: inWishlist ? 'white' : 'action.active'
                }
              }}
            >
              {wishlistLoading ? (
                <CircularProgress size={20} />
              ) : inWishlist ? (
                <FavoriteIcon />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
          </Tooltip>

          <IconButton 
            onClick={onClose} 
            sx={{ 
              color: 'text.secondary',
              '&:hover': {
                bgcolor: 'action.hover',
                transform: 'rotate(90deg)',
                transition: 'all 0.3s ease'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, overflow: 'auto' }}>
          {/* Form in una colonna */}
          <Box sx={{ p: 3 }}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold" color="primary.main" sx={{ mb: 3 }}>
                ✏️ Modifica Dati Personali
              </Typography>

              <Stack spacing={3}>
                {/* Mia Valutazione */}
                <Box>
                  <Typography variant="body1" color="text.primary" gutterBottom fontWeight="600">
                    Mia Valutazione
                  </Typography>
                  <TextField
                    type="number"
                    value={formData.mia_valutazione}
                    onChange={(e) => setFormData({ ...formData, mia_valutazione: e.target.value })}
                    size="medium"
                    fullWidth
                    placeholder="1-10 (lasciare vuoto per rimuovere)"
                    inputProps={{ min: 1, max: 10 }}
                    error={!!errors.mia_valutazione}
                    helperText={errors.mia_valutazione || 'Valore da 1 a 10 basato sulle prestazioni e potenziale'}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main'
                        }
                      }
                    }}
                  />
                </Box>

                {/* Fascia */}
                <Box>
                  <Typography variant="body1" color="text.primary" gutterBottom fontWeight="600">
                    Fascia
                  </Typography>
                  <FormControl fullWidth error={!!errors.fascia}>
                    <Select
                      value={formData.fascia}
                      onChange={(e) => setFormData({ ...formData, fascia: e.target.value })}
                      size="medium"
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="">Nessuna fascia</MenuItem>
                      <MenuItem value="Alta">Alta</MenuItem>
                      <MenuItem value="Media">Media</MenuItem>
                      <MenuItem value="Bassa">Bassa</MenuItem>
                    </Select>
                    {errors.fascia && <FormHelperText>{errors.fascia}</FormHelperText>}
                    {!errors.fascia && (
                      <FormHelperText>Classifica del giocatore (Alta, Media, Bassa)</FormHelperText>
                    )}
                  </FormControl>
                </Box>

                {/* Consiglio */}
                <Box>
                  <Typography variant="body1" color="text.primary" gutterBottom fontWeight="600">
                    Consiglio
                  </Typography>
                  <TextField
                    multiline
                    rows={3}
                    value={formData.consiglio}
                    onChange={(e) => setFormData({ ...formData, consiglio: e.target.value })}
                    size="medium"
                    fullWidth
                    placeholder="Inserisci il tuo consiglio sul giocatore..."
                    error={!!errors.consiglio}
                    helperText={errors.consiglio || `Caratteri: ${formData.consiglio.length}/200`}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main'
                        }
                      }
                    }}
                  />
                </Box>

                {/* Note */}
                <Box>
                  <Typography variant="body1" color="text.primary" gutterBottom fontWeight="600">
                    Note Personali
                  </Typography>
                  <TextField
                    multiline
                    rows={4}
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    size="medium"
                    fullWidth
                    placeholder="Inserisci le tue note personali sul giocatore..."
                    error={!!errors.note}
                    helperText={
                      errors.note || 
                      `Caratteri: ${formData.note.length}/500${formData.note.length > 400 ? ' (quasi al limite)' : ''}`
                    }
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main'
                        }
                      }
                    }}
                  />
                </Box>
              </Stack>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ 
          p: 3, 
          pt: 0,
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          borderTop: '1px solid #e2e8f0',
          gap: 2
        }}>
          <Button 
            onClick={handleCancel} 
            variant="outlined" 
            startIcon={<CancelIcon />}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1.5
            }}
          >
            Annulla
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={isLoading}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1.5,
              boxShadow: '0 4px 12px rgba(59,130,246,0.3)'
            }}
          >
            {isLoading ? 'Salvando...' : 'Salva Modifiche'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PlayerModal;
