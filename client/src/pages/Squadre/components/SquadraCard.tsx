import React, { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Divider,
  Button,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Squadra } from '../../../types'

const TeamCard = styled(Card)(() => ({
  backgroundColor: '#e3f2fd',
  border: '2px solid #2196f3',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: '#1976d2',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
}))

interface SquadraCardProps {
  squadra: Squadra
  onEdit: (squadra: Squadra) => void
  onDelete: (id: number) => void
  onAssegnaGiocatore: () => void
  onViewDetails: (squadra: Squadra) => void
}

const SquadraCard: React.FC<SquadraCardProps> = ({
  squadra,
  onEdit,
  onDelete,
  onAssegnaGiocatore,
  onViewDetails,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    onEdit(squadra)
    handleClose()
  }

  const handleDelete = () => {
    if (window.confirm(`Sei sicuro di voler eliminare la squadra "${squadra.nome}"?`)) {
      onDelete(squadra.id)
    }
    handleClose()
  }

  const calculateSquadraValue = () => {
    return (squadra.giocatori || []).reduce((total, g) => total + (g.valore || 0), 0)
  }

  const getRuoloCount = (ruolo: string) => {
    return (squadra.giocatori || []).filter(g => g.ruolo.toLowerCase() === ruolo.toLowerCase()).length
  }

  return (
    <TeamCard>
      <CardContent>
        {/* Header della squadra */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h5" color="primary" gutterBottom>
              {squadra.nome}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Proprietario: {squadra.proprietario}
            </Typography>
            
            {/* Statistiche principali */}
            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={`Budget: €${squadra.budget}`}
                color="primary"
                size="small"
                variant="outlined"
              />
              <Chip 
                label={`Rimanente: €${squadra.budget_residuo || squadra.budget - calculateSquadraValue()}`}
                color="success"
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

          {/* Menu con tre pallini */}
          <Box>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                handleClick(e)
              }}
              aria-controls={open ? 'squadra-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="squadra-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'squadra-menu-button',
              }}
            >
              <MenuItem onClick={handleEdit}>
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Modifica</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleDelete}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Elimina</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Distribuzione ruoli */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Giocatori ({(squadra.giocatori || []).length}):
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <Chip label={`P: ${getRuoloCount('Portiere')}`} size="small" color="error" variant="outlined" />
            <Chip label={`D: ${getRuoloCount('Difensore')}`} size="small" color="primary" variant="outlined" />
            <Chip label={`C: ${getRuoloCount('Centrocampista')}`} size="small" color="warning" variant="outlined" />
            <Chip label={`A: ${getRuoloCount('Attaccante')}`} size="small" color="success" variant="outlined" />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Sezione giocatori */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Giocatori ({(squadra.giocatori || []).length})
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={onAssegnaGiocatore}
              disabled={(squadra.giocatori || []).length >= 25}
            >
              Aggiungi
            </Button>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() => onViewDetails(squadra)}
            >
              Dettagli
            </Button>
          </Box>
        </Box>

        {/* Messaggio limite giocatori */}
        {(squadra.giocatori || []).length >= 25 && (
          <Alert severity="warning" sx={{ mt: 1 }}>
            Squadra al completo (25 giocatori)
          </Alert>
        )}
      </CardContent>
    </TeamCard>
  )
}

export default SquadraCard
