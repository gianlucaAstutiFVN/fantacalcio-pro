import React from 'react'
import { Paper, useTheme, useMediaQuery } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { Giocatore } from '../../../types'

interface GiocatoriGridProps {
  giocatori: Giocatore[]
  columns: any[]
  paginationModel: { page: number; pageSize: number }
  sortingModel: any[]
  onPaginationModelChange: (model: { page: number; pageSize: number }) => void
  onSortingModelChange: (model: any[]) => void
  getRowClassName: (params: any) => string
}

const GiocatoriGrid: React.FC<GiocatoriGridProps> = ({
  giocatori,
  columns,
  paginationModel,
  sortingModel,
  onPaginationModelChange,
  onSortingModelChange,
  getRowClassName,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  return (
    <Paper sx={{ 
      height: isMobile ? 500 : 600, 
      width: '100%',
      '& .MuiDataGrid-root': {
        fontSize: isMobile ? '0.75rem' : '0.875rem',
      }
    }}>
      <DataGrid
        rows={giocatori}
        columns={columns}
        page={paginationModel.page}
        pageSize={paginationModel.pageSize}
        sortModel={sortingModel}
        onPageChange={(newPage) => onPaginationModelChange({ ...paginationModel, page: newPage })}
        onPageSizeChange={(newPageSize) => onPaginationModelChange({ ...paginationModel, pageSize: newPageSize })}
        onSortModelChange={onSortingModelChange}
        rowsPerPageOptions={isMobile ? [10, 25] : [10, 25, 50, 100]}
        disableSelectionOnClick
        density={'comfortable'}
        paginationMode="client"
        sortingMode="client"
        rowCount={giocatori.length}
        getRowClassName={getRowClassName}
        rowHeight={60}
        
        // Performance optimizations
        disableColumnMenu
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        
        // Disable animations for better performance
        componentsProps={{
          basePopper: {
            sx: {
              '& .MuiTooltip-tooltip': {
                fontSize: '0.75rem',
                maxWidth: 200,
              }
            }
          }
        }}
        
        sx={{
          // Disable transitions and animations
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #e0e0e0',
            transition: 'none !important',
            animation: 'none !important',
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            padding: isMobile ? '4px 8px' : '8px 16px',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f5f5f5',
            borderBottom: '2px solid #e0e0e0',
            transition: 'none !important',
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            padding: isMobile ? '4px 8px' : '8px 16px',
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '2px solid #e0e0e0',
            backgroundColor: '#f5f5f5',
            transition: 'none !important',
            fontSize: isMobile ? '0.75rem' : '0.875rem',
          },
          '& .MuiDataGrid-row': {
            transition: 'none !important',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              transition: 'none !important',
            },
          },
          // Stili per righe colorate (senza transizioni)
          '& .row-wishlist': {
            backgroundColor: '#ffcdd2 !important',
            transition: 'none !important',
            '&:hover': {
              backgroundColor: '#ffcdd2 !important',
              transition: 'none !important',
            },
          },
          '& .row-acquistato': {
            backgroundColor: '#e8e8e8 !important',
            color: '#666 !important',
            opacity: '0.8 !important',
            transition: 'none !important',
            '&:hover': {
              backgroundColor: '#d0d0d0 !important',
              transition: 'none !important',
            },
          },
          // Combinazione di entrambi gli stati
          '& .row-acquistato.row-wishlist': {
            backgroundColor: '#f0e0e8 !important',
            color: '#666 !important',
            opacity: '0.8 !important',
            transition: 'none !important',
            '&:hover': {
              backgroundColor: '#e0c0d0 !important',
              transition: 'none !important',
            },
          },
          // Disable all transitions globally
          '& *': {
            transition: 'none !important',
            animation: 'none !important',
          },
          // Optimize scroll performance
          '& .MuiDataGrid-virtualScroller': {
            scrollbarWidth: 'thin',
            scrollbarColor: '#c1c1c1 #f1f1f1',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#c1c1c1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#a8a8a8',
            },
          },
        }}
      />
    </Paper>
  )
}

export default GiocatoriGrid
