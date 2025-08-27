import {
  Box,
  Chip,
  Typography,
  IconButton,
} from '@mui/material'
import { Edit as EditIcon } from '@mui/icons-material'
import { GridColDef } from '@mui/x-data-grid'
import { Giocatore } from '../../../types'
import ActionButtons from './ActionDataGrid/ActionButtons'
import WishlistManager from './ActionDataGrid/WishlistManager'

interface GiocatoriColumnsProps {
  onWishlistToggle: (giocatoreId: string, isInWishlist: boolean) => Promise<void>
  onRefresh?: () => void
  onAssegnaGiocatore: (giocatore: Giocatore) => void
  onSvincolaGiocatore: (giocatore: Giocatore) => void
  onEditNote: (giocatore: Giocatore) => void
  onEditValutazione: (giocatore: Giocatore) => void
}

export const useGiocatoriColumns = ({
  onWishlistToggle,
  onRefresh,
  onAssegnaGiocatore,
  onSvincolaGiocatore,
  onEditNote,
  onEditValutazione,
}: GiocatoriColumnsProps): GridColDef[] => {
  

  
  const getRuoloColor = (ruolo: string) => {
    switch (ruolo.toLowerCase()) {
      case 'portiere': return 'error'
      case 'difensore': return 'primary'
      case 'centrocampista': return 'warning'
      case 'attaccante': return 'success'
      default: return 'default'
    }
  }

  const isGiocatoreAcquistato = (giocatore: Giocatore) => {
    return giocatore.status === 'acquistato' 
  }

  const isGiocatoreInWishlist = (giocatore: Giocatore) => {
    return giocatore.inWishlist
  }

  return [
    {
      field: 'nome',
      headerName: 'Nome',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'squadra',
      headerName: 'Squadra',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          variant="outlined"
        />
      ),
    },
    {
      field: 'ruolo',
      headerName: 'Ruolo',
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <Chip 
          label={params.value.charAt(0).toUpperCase() + params.value.slice(1)} 
          size="small" 
          color={getRuoloColor(params.value)}
        />
      ),
    },
    {
      field: 'unveil_fvm',
      headerName: 'Unveil FVM',
      flex: 0.8,
      minWidth: 100,
      type: 'number',
      renderCell: (params) => (
        <Typography variant="body2" color="primary">
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'gazzetta',
      headerName: 'Gazzetta',
      flex: 0.8,
      minWidth: 100,
      type: 'number',
      renderCell: (params) => (
        <Typography variant="body2" color="primary" fontWeight="bold">
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'gazzetta_fascia',
      headerName: 'Gazzetta Fascia',
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={params.value || '-'}
          size="small"
          color={params.value === '1' ? 'error' : params.value === '2' ? 'warning' : params.value === '3' ? 'info' : 'success'}
          variant="outlined"
        />
      ),
    },
    {
      field: 'pazzidifanta',
      headerName: 'Pazzi di Fanta',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="body2" color="secondary">
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'mia_valutazione',
      headerName: 'Mia Valutazione',
      flex: 0.8,
      minWidth: 100,
      type: 'number',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography 
            variant="body2" 
            color="success.main"
            sx={{ 
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#f5f5f5', borderRadius: 1, px: 1 }
            }}
            onClick={() => onEditValutazione(params.row)}
          >
            {params.value || '-'}
          </Typography>
          <IconButton
            size="small"
            onClick={() => onEditValutazione(params.row)}
            sx={{ p: 0.5 }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
    {
      field: 'note',
      headerName: 'Note',
      flex: 1,
      minWidth: 250,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              maxWidth: 150, 
              overflow: 'hidden', 
              textOverflow: 'ellipsis',
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#f5f5f5', borderRadius: 1, px: 1 }
            }}
            onClick={() => onEditNote(params.row)}
          >
            {params.value || '-'}
          </Typography>
          <IconButton
            size="small"
            onClick={() => onEditNote(params.row)}
            sx={{ p: 0.5 }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={params.value || 'disponibile'}
          color={params.value === 'acquistato' ? 'error' : params.value === 'asta' ? 'warning' : 'success'}
          size="small"
        />
      ),
    },
    {
      field: 'acquisto_info',
      headerName: 'Info Acquisto',
      flex: 1.2,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => {
        const giocatore = params.row
        if (giocatore.status === 'acquistato' && giocatore.prezzo_acquisto && giocatore.nome_squadra_acquirente) {
          return (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" display="block" color="success.main" fontWeight="bold">
                €{giocatore.prezzo_acquisto}
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary">
                {giocatore.nome_squadra_acquirente}
              </Typography>
            </Box>
          )
        }
        return (
          <Typography variant="caption" color="text.disabled">
            -
          </Typography>
        )
      },
    },
    {
      field: 'wishlist',
      headerName: 'Wishlist',
      flex: 0.6,
      minWidth: 80,
      sortable: false,
      renderCell: (params) => {
        const isInWishlist = isGiocatoreInWishlist(params.row)
        return (
          <WishlistManager
            giocatore={params.row}
            isInWishlist={isInWishlist || false}
            onWishlistToggle={onWishlistToggle}
            onRefresh={onRefresh}
          />
        )
      },
    },
    {
      field: 'azioni',
      headerName: 'Azioni',
      flex: 1.5,
      minWidth: 120,
      sortable: false,
      renderCell: (params) => (
        <ActionButtons
          giocatore={params.row}
          isAcquistato={isGiocatoreAcquistato(params.row)}
          onAssegnaGiocatore={onAssegnaGiocatore}
          onSvincolaGiocatore={onSvincolaGiocatore}
        />
      ),
    },
  ]
}
