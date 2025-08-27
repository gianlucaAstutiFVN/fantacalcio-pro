import React from 'react'
import { Box, Button, ButtonGroup } from '@mui/material'

interface RoleSelectorProps {
  currentRole: string
  onRoleChange: (role: string) => void
  isLoading?: boolean
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ currentRole, onRoleChange, isLoading = false }) => {
  const roles = [
    { key: 'tutti', label: 'Tutti' },
    { key: 'portiere', label: 'Portieri' },
    { key: 'difensore', label: 'Difensori' },
    { key: 'centrocampista', label: 'Centrocampisti' },
    { key: 'attaccante', label: 'Attaccanti' }
  ]

  return (
    <Box sx={{ mb: 3 }}>
      <ButtonGroup variant="outlined" aria-label="selezione ruolo">
        {roles.map((role) => (
          <Button
            key={role.key}
            onClick={async () => await onRoleChange(role.key)}
            variant={currentRole === role.key ? 'contained' : 'outlined'}
            sx={{ minWidth: 120 }}
            disabled={isLoading}
          >
            {role.label}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  )
}

export default RoleSelector
