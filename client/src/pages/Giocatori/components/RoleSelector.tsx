import React from 'react'
import { Box, Button, ButtonGroup, useTheme, useMediaQuery } from '@mui/material'

interface RoleSelectorProps {
  currentRole: string
  onRoleChange: (role: string) => void
  isLoading?: boolean
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ currentRole, onRoleChange, isLoading = false }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  const roles = [
    { key: 'tutti', label: 'Tutti' },
    { key: 'portiere', label: 'Portieri' },
    { key: 'difensore', label: 'Difensori' },
    { key: 'centrocampista', label: 'Centrocampisti' },
    { key: 'attaccante', label: 'Attaccanti' }
  ]

  return (
    <Box sx={{ mb: 3 }}>
      <ButtonGroup 
        variant="outlined" 
        aria-label="selezione ruolo"
        orientation={isMobile ? 'vertical' : 'horizontal'}
        sx={{
          width: isMobile ? '100%' : 'auto',
          '& .MuiButtonGroup-grouped': {
            minWidth: isMobile ? '100%' : 120,
            border: isMobile ? '1px solid' : undefined,
            '&:not(:last-of-type)': {
              borderBottom: isMobile ? '1px solid' : undefined,
              borderRight: isMobile ? undefined : '1px solid',
            }
          }
        }}
      >
        {roles.map((role) => (
          <Button
            key={role.key}
            onClick={async () => await onRoleChange(role.key)}
            variant={currentRole === role.key ? 'contained' : 'outlined'}
            disabled={isLoading}
            sx={{
              minWidth: isMobile ? '100%' : 120,
              textAlign: 'center',
              py: isMobile ? 1.5 : 1,
              px: isMobile ? 2 : 2,
              fontSize: isMobile ? '0.875rem' : '0.875rem',
              fontWeight: currentRole === role.key ? 600 : 400,
            }}
          >
            {role.label}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  )
}

export default RoleSelector
