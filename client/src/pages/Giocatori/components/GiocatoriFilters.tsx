import React, { useState } from 'react'
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Chip,
  OutlinedInput,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material'
import {  Filters } from '../../../types'

interface GiocatoriFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  isLoading?: boolean
}

const GiocatoriFilters: React.FC<GiocatoriFiltersProps> = ({
  filters,
  onFiltersChange,
  isLoading = false,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  // Local state for filters before applying
  const [localFilters, setLocalFilters] = useState({
    searchTerm: filters.searchTerm,
    squad: filters.squad,
    status: filters.status,
  })

  // Sync local filters with external filters when they change
  React.useEffect(() => {
    setLocalFilters({
      searchTerm: filters.searchTerm,
      squad: filters.squad,
      status: filters.status,
    })
  }, [filters.searchTerm, filters.squad, filters.status])

  const handleSearchChange = (value: string) => {
    setLocalFilters(prev => ({ ...prev, searchTerm: value }))
  }

  const handleSquadChange = (value: string[]) => {
    const squadString = value.join(',')
    setLocalFilters(prev => ({ ...prev, squad: squadString }))
  }

  const handleFilterChange = (value: string[]) => {
    const filterString = value.join(',')
    setLocalFilters(prev => ({ ...prev, status: filterString }))
  }

  const handleApplyFilters = () => {
    onFiltersChange({ 
      ...filters, 
      searchTerm: localFilters.searchTerm, 
      squad: localFilters.squad,
      status: localFilters.status
    })
  }

  const handleReset = () => {
    const resetFilters = { searchTerm: '', squad: '', status: '' }
    setLocalFilters(resetFilters)
    onFiltersChange({ ...filters, ...resetFilters })
  }

  // Squadre disponibili
  const squadreOptions = [
    'Napoli', 'Inter', 'Milan', 'Juventus', 'Roma', 'Bologna', 'Fiorentina', 
    'Atalanta', 'Lazio', 'Como', 'Torino', 'Sassuolo', 'Genoa', 'Udinese', 
    'Cagliari', 'Lecce', 'Parma', 'Pisa', 'Cremonese', 'Verona'
  ]

  // Filtri disponibili
  const filterOptions = [
    { value: 'disponibile', label: 'Disponibili' },
    { value: 'acquistato', label: 'Acquistati' },
    { value: 'inWishlist', label: 'In Wishlist' }
  ]

  // Get current selected squads from local filters for immediate UI updates
  const selectedSquads = localFilters.squad ? localFilters.squad.split(',').filter(s => s.trim()) : []
  
  // Get current selected filters from local filters for immediate UI updates
  const selectedFilters = localFilters.status ? localFilters.status.split(',').filter(s => s.trim()) : []

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={isMobile ? 2 : 2} alignItems="flex-start">
        {/* Search field - full width on mobile */}
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Cerca giocatore"
            value={localFilters.searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Inserisci nome giocatore..."
            disabled={isLoading}
            size={isMobile ? 'small' : 'medium'}
          />
        </Grid>
        
        {/* Squadre filter - full width on mobile */}
        <Grid item xs={12} md={3}>
          <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
            <InputLabel>Squadre</InputLabel>
            <Select
              multiple
              value={selectedSquads}
              onChange={(e) => handleSquadChange(e.target.value as string[])}
              input={<OutlinedInput label="Squadre" />}
              disabled={isLoading}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {squadreOptions.map((squadra) => (
                <MenuItem key={squadra} value={squadra}>
                  {squadra}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        {/* Status filter - full width on mobile */}
        <Grid item xs={12} md={3}>
          <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
            <InputLabel>Filtri</InputLabel>
            <Select
              multiple
              value={selectedFilters}
              onChange={(e) => handleFilterChange(e.target.value as string[])}
              input={<OutlinedInput label="Filtri" />}
              disabled={isLoading}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={filterOptions.find(opt => opt.value === value)?.label || value} size="small" />
                  ))}
                </Box>
              )}
            >
              {filterOptions.map((filter) => (
                <MenuItem key={filter.value} value={filter.value}>
                  {filter.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        {/* Buttons - full width on mobile, side by side on desktop */}
        <Grid item xs={12} md={3}>
          <Stack 
            direction={isMobile ? 'column' : 'row'} 
            spacing={isMobile ? 1 : 1}
            sx={{ width: '100%' }}
          >
            <Button
              variant="contained"
              onClick={handleApplyFilters}
              size={isMobile ? 'medium' : 'small'}
              disabled={isLoading}
              fullWidth={isMobile}
              sx={{ minWidth: isMobile ? '100%' : 'auto' }}
            >
              Applica Filtri
            </Button>
            <Button
              variant="outlined"
              onClick={handleReset}
              size={isMobile ? 'medium' : 'small'}
              disabled={isLoading}
              fullWidth={isMobile}
              sx={{ minWidth: isMobile ? '100%' : 'auto' }}
            >
              Reset
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}

export default GiocatoriFilters
