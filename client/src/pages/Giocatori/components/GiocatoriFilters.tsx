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
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Cerca giocatore"
            value={localFilters.searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Inserisci nome giocatore..."
            disabled={isLoading}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
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
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
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
        <Grid item xs={12} md={3}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              onClick={handleApplyFilters}
              size="small"
              disabled={isLoading}
            >
              Applica Filtri
            </Button>
            <Button
              variant="outlined"
              onClick={handleReset}
              size="small"
              disabled={isLoading}
            >
              Reset
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default GiocatoriFilters
