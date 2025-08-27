import React from 'react'
import {
  Box,
  IconButton,
  Tooltip,
} from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import { Giocatore } from '../../../../types'

interface ActionButtonsProps {
  giocatore: Giocatore
  isAcquistato: boolean
  onAssegnaGiocatore: (giocatore: Giocatore) => void
  onSvincolaGiocatore: (giocatore: Giocatore) => void
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  giocatore,
  isAcquistato,
  onAssegnaGiocatore,
  onSvincolaGiocatore,
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
      {isAcquistato ? (
        /* Bottone Svincola se il giocatore è acquistato */
        <Tooltip title="Svincola Giocatore">
          <IconButton
            size="small"
            color="error"
            onClick={() => onSvincolaGiocatore(giocatore)}
            sx={{ 
              minWidth: 32, 
              height: 32,
              '&:hover': {
                backgroundColor: 'error.light'
              }
            }}
          >
            <PersonRemoveIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ) : (
        /* Bottone Assegna se il giocatore è disponibile */
        <Tooltip title="Assegna Giocatore">
          <IconButton
            size="small"
            color="primary"
            onClick={() => onAssegnaGiocatore(giocatore)}
            sx={{ 
              minWidth: 32, 
              height: 32,
              '&:hover': {
                backgroundColor: 'primary.light'
              }
            }}
          >
            <PersonAddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  )
}

export default ActionButtons
