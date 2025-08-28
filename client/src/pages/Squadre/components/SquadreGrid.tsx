import React from 'react'
import {
  Box,
  Grid,
  Typography,
  Button,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import GroupIcon from '@mui/icons-material/Group'
import AddIcon from '@mui/icons-material/Add'
import { Squadra } from '../../../types'
import SquadraCard from './SquadraCard'

const EmptyStateBox = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: 300,
  backgroundColor: '#f8f9fa',
  border: '2px dashed #dee2e6',
  borderRadius: '8px',
  padding: '32px',
}))

interface SquadreGridProps {
  squadre: Squadra[]
  onEdit: (squadra: Squadra) => void
  onDelete: (id: number) => void
  onAssegnaGiocatore: (squadra: Squadra) => void
  onViewDetails: (squadra: Squadra) => void
  onCreateNew: () => void
  loading?: boolean
}

const SquadreGrid: React.FC<SquadreGridProps> = ({
  squadre,
  onEdit,
  onDelete,
  onAssegnaGiocatore,
  onViewDetails,
  onCreateNew,
  loading = false,

}) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <Typography variant="h6" color="text.secondary">
          Caricamento squadre...
        </Typography>
      </Box>
    )
  }

  if (!squadre || squadre.length === 0) {
    return (
      <EmptyStateBox>
        <GroupIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Nessuna squadra trovata
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Crea la tua prima squadra per iniziare a gestire la tua rosa fantacalcio!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<AddIcon />}
          onClick={onCreateNew}
        >
          Crea Prima Squadra
        </Button>
      </EmptyStateBox>
    )
  }

  return (
    <Box>
      {/* Header con conteggio */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" color="text.secondary">
          {squadre.length} squadra{squadre.length !== 1 ? 'e' : ''} trovata{squadre.length !== 1 ? 'e' : ''}
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onCreateNew}
        >
          Nuova Squadra
        </Button>
      </Box>

      {/* Griglia squadre */}
      <Grid container spacing={3}>
        {squadre.map((squadra) => (
          <Grid key={squadra.id} item xs={12} md={6} lg={4}>
            <SquadraCard
              squadra={squadra}
              onEdit={onEdit}
              onDelete={onDelete}
              onAssegnaGiocatore={() => onAssegnaGiocatore(squadra)}
              onViewDetails={onViewDetails}
            />
          </Grid>
        ))}
      </Grid>

     
    </Box>
  )
}

export default SquadreGrid
