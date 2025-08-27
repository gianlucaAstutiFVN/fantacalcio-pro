import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
} from '@mui/material'
import { Squadra } from '../../../types'

interface SquadraFormData {
  nome: string
  proprietario: string
  budget: number
}

interface SquadraFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: SquadraFormData) => void
  editingSquadra?: Squadra
  loading?: boolean
}

const SquadraForm: React.FC<SquadraFormProps> = ({
  open,
  onClose,
  onSubmit,
  editingSquadra,
  loading = false,
}) => {
  const [formData, setFormData] = useState<SquadraFormData>({
    nome: editingSquadra?.nome || '',
    proprietario: editingSquadra?.proprietario || '',
    budget: editingSquadra?.budget ? Number(editingSquadra.budget) : 500,
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  React.useEffect(() => {
    if (editingSquadra) {
      setFormData({
        nome: editingSquadra.nome,
        proprietario: editingSquadra.proprietario,
        budget: Number(editingSquadra.budget) || 500,
      })
    } else {
      setFormData({
        nome: '',
        proprietario: '',
        budget: 500,
      })
    }
    setErrors({})
  }, [editingSquadra, open])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.nome.trim()) {
      newErrors.nome = 'Il nome della squadra è obbligatorio'
    }

    if (!formData.proprietario.trim()) {
      newErrors.proprietario = 'Il proprietario è obbligatorio'
    }

    if (formData.budget < 0) {
      newErrors.budget = 'Il budget non può essere negativo'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleClose = () => {
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editingSquadra ? 'Modifica Squadra' : 'Nuova Squadra'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Nome Squadra"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            error={!!errors.nome}
            helperText={errors.nome}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Proprietario"
            value={formData.proprietario}
            onChange={(e) => setFormData({ ...formData, proprietario: e.target.value })}
            error={!!errors.proprietario}
            helperText={errors.proprietario}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Budget Iniziale (€)"
            type="number"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) || 0 })}
            error={!!errors.budget}
            helperText={errors.budget}
            inputProps={{ min: 0 }}
          />
          
          {editingSquadra && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Budget Attuale:</strong> €{Number(editingSquadra.budget) || 0}<br />
                <strong>Giocatori Acquistati:</strong> {editingSquadra.giocatori?.length || 0}<br />
                <strong>Spesa Totale:</strong> €{editingSquadra.giocatori?.reduce((sum: number, g: any) => sum + (g.valore || 0), 0) || 0}
              </Typography>
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Annulla
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={loading || !formData.nome || !formData.proprietario}
        >
          {loading ? 'Salvataggio...' : (editingSquadra ? 'Aggiorna' : 'Crea')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SquadraForm
