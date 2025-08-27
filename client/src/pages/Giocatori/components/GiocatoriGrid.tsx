import React from 'react'
import { Paper } from '@mui/material'
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
  return (
    <Paper sx={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={giocatori}
        columns={columns}
        page={paginationModel.page}
        pageSize={paginationModel.pageSize}
        sortModel={sortingModel}
        onPageChange={(newPage) => onPaginationModelChange({ ...paginationModel, page: newPage })}
        onPageSizeChange={(newPageSize) => onPaginationModelChange({ ...paginationModel, pageSize: newPageSize })}
        onSortModelChange={onSortingModelChange}
        rowsPerPageOptions={[10, 25, 50, 100]}
        disableSelectionOnClick
        density="standard"
        paginationMode="client"
        sortingMode="client"
        rowCount={giocatori.length}
        getRowClassName={getRowClassName}
        rowHeight={52}
        
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
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f5f5f5',
            borderBottom: '2px solid #e0e0e0',
            transition: 'none !important',
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '2px solid #e0e0e0',
            backgroundColor: '#f5f5f5',
            transition: 'none !important',
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
