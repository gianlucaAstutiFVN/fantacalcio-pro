import {
  Box,
  Chip,
  Typography,
  IconButton,
} from '@mui/material'
import { 
  EditNote as EditNoteIcon,
} from '@mui/icons-material'
import { GridColDef } from '@mui/x-data-grid'
import { useNavigate } from 'react-router-dom'
import { Giocatore } from '../../../types'
import { squadreSerieA } from '../../Formazioni/data/squadreData'
import ActionButtons from './ActionDataGrid/ActionButtons'
import WishlistManager from './ActionDataGrid/WishlistManager'

interface GiocatoriColumnsProps {
  onWishlistToggle: (giocatoreId: string, isInWishlist: boolean) => Promise<void>
  onRefresh?: () => void
  onAssegnaGiocatore: (giocatore: Giocatore) => void
  onSvincolaGiocatore: (giocatore: Giocatore) => void
  onEditAllFields: (giocatore: Giocatore) => void
}

// Componente separato per la cella delle azioni
const ActionsCell = ({ 
  giocatore, 
  isAcquistato, 
  onAssegnaGiocatore, 
  onSvincolaGiocatore, 
  onEditAllFields 
}: {
  giocatore: Giocatore
  isAcquistato: boolean
  onAssegnaGiocatore: (giocatore: Giocatore) => void
  onSvincolaGiocatore: (giocatore: Giocatore) => void
  onEditAllFields: (giocatore: Giocatore) => void
}) => {


  
  const handleEditFields = () => {
    onEditAllFields(giocatore)
  }
  
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <ActionButtons
        giocatore={giocatore}
        isAcquistato={isAcquistato}
        onAssegnaGiocatore={onAssegnaGiocatore}
        onSvincolaGiocatore={onSvincolaGiocatore}
      />
      
     
        <IconButton
          size="small"
          onClick={handleEditFields}
          sx={{ 
            p: 0.5,
            '&:hover': { 
              backgroundColor: 'primary.light',
              color: 'primary.contrastText'
            }
          }}
        >
          <EditNoteIcon fontSize="small" />
        </IconButton>
    
    </Box>
  )
}

export const useGiocatoriColumns = ({
  onWishlistToggle,
  onRefresh,
  onAssegnaGiocatore,
  onSvincolaGiocatore,
  onEditAllFields,
}: GiocatoriColumnsProps): GridColDef[] => {
  const navigate = useNavigate()
  
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

  const handleSquadraClick = (squadraNome: string) => {
    // Find the squad by name and navigate to its detail page
    const squadra = squadreSerieA.find(s => 
      s.nome.toLowerCase() === squadraNome.toLowerCase()
    )
    
    if (squadra) {
      navigate(`/formazioni/${squadra.id}`)
    } else {
      console.warn(`Squadra non trovata: ${squadraNome}`)
    }
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
          onClick={() => handleSquadraClick(params.value)}
          sx={{ 
            cursor: 'pointer',
            '&:hover': { 
              backgroundColor: 'primary.light',
              color: 'primary.contrastText'
            }
          }}
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
      field: 'fascia',
      headerName: 'Fascia',
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <Typography 
          variant="body2" 
          color="primary"
          sx={{ 
            cursor: 'pointer',
            '&:hover': { 
              backgroundColor: 'primary.light', 
              color: 'primary.contrastText',
              borderRadius: 1, 
              px: 1,
              py: 0.5
            },
            transition: 'all 0.2s ease-in-out'
          }}
          onClick={() => onEditAllFields(params.row)}
        >
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'consiglio',
      headerName: 'Consiglio',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography 
          variant="body2" 
          sx={{ 
            maxWidth: 150, 
            overflow: 'hidden', 
            textOverflow: 'ellipsis',
            cursor: 'pointer',
            '&:hover': { 
              backgroundColor: 'primary.light', 
              color: 'primary.contrastText',
              borderRadius: 1, 
              px: 1,
              py: 0.5
            },
            transition: 'all 0.2s ease-in-out'
          }}
          onClick={() => onEditAllFields(params.row)}
          title={params.value || ''}
        >
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
        <Typography 
          variant="body2" 
          color="success.main"
          sx={{ 
            cursor: 'pointer',
            '&:hover': { 
              backgroundColor: 'success.light', 
              color: 'success.contrastText',
              borderRadius: 1, 
              px: 1,
              py: 0.5
            },
            transition: 'all 0.2s ease-in-out'
          }}
          onClick={() => onEditAllFields(params.row)}
        >
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'fvm',
      headerName: 'FVM',
      flex: 0.6,
      minWidth: 80,
      type: 'number',
      renderCell: (params) => (
        <Typography 
          variant="body2" 
          color="info.main"
          sx={{ 
            cursor: 'pointer',
            '&:hover': { 
              backgroundColor: 'info.light', 
              color: 'info.contrastText',
              borderRadius: 1, 
              px: 1,
              py: 0.5
            },
            transition: 'all 0.2s ease-in-out'
          }}
          onClick={() => onEditAllFields(params.row)}
        >
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'fvm_m',
      headerName: 'FVM M',
      flex: 0.6,
      minWidth: 80,
      type: 'number',
      renderCell: (params) => (
        <Typography 
          variant="body2" 
          color="warning.main"
          sx={{ 
            cursor: 'pointer',
            '&:hover': { 
              backgroundColor: 'warning.light', 
              color: 'warning.contrastText',
              borderRadius: 1, 
              px: 1,
              py: 0.5
            },
            transition: 'all 0.2s ease-in-out'
          }}
          onClick={() => onEditAllFields(params.row)}
        >
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'note',
      headerName: 'Note',
      flex: 1,
      minWidth: 250,
      renderCell: (params) => (
        <Typography 
          variant="body2" 
          sx={{ 
            maxWidth: 150, 
            overflow: 'hidden', 
            textOverflow: 'ellipsis',
            cursor: 'pointer',
            '&:hover': { 
              backgroundColor: 'primary.light', 
              color: 'primary.contrastText',
              borderRadius: 1, 
              px: 1,
              py: 0.5
            },
            transition: 'all 0.2s ease-in-out'
          }}
          onClick={() => onEditAllFields(params.row)}
          title={params.value || ''}
        >
          {params.value || '-'}
        </Typography>
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
        <ActionsCell
          giocatore={params.row}
          isAcquistato={isGiocatoreAcquistato(params.row)}
          onAssegnaGiocatore={onAssegnaGiocatore}
          onSvincolaGiocatore={onSvincolaGiocatore}
          onEditAllFields={onEditAllFields}
        />
      ),
    },
  ]
}
