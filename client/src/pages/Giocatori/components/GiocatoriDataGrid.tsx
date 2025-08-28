import React from 'react'
import { Giocatore, Squadra } from '../../../types'
import { useGiocatoriColumns } from './GiocatoriColumns'
import { useGiocatoriDataGrid } from './useGiocatoriDataGrid'
import GiocatoriGrid from './GiocatoriGrid'
import AcquistaDialog from './ActionDataGrid/AcquistaDialog'
import SvincolaDialog from './ActionDataGrid/SvincolaDialog'
import EditGiocatoreFieldsDialog from './ActionDataGrid/EditGiocatoreFieldsDialog'

interface GiocatoriDataGridProps {
  giocatori: Giocatore[]
  squadre?: Squadra[]
  onRefresh?: () => void
  onGiocatoreUpdated?: (giocatore: Giocatore) => void
}

const GiocatoriDataGrid: React.FC<GiocatoriDataGridProps> = ({
  giocatori,
  squadre,
  onRefresh,
  onGiocatoreUpdated,
}) => {
  // Hook personalizzato per gestire tutta la logica
  const {
    paginationModel,
    sortingModel,
    selectedGiocatore,
    openAcquistaDialog,
    openSvincolaDialog,
    giocatoreDaSvincolare,
    openEditFieldsDialog,
    giocatorePerEdit,
    setPaginationModel,
    setSortingModel,
    setOpenAcquistaDialog,
    setOpenSvincolaDialog,
    setOpenEditFieldsDialog,
    getRowClassName,
    handleAssegnaGiocatore,
    handleAcquistaGiocatore,
    handleSvincolaGiocatore,
    handleSvincolaConfirm,
    handleEditAllFields,
    handleFieldsUpdated,
    handleWishlistToggle,
    onRefresh: onRefreshFromHook,
  } = useGiocatoriDataGrid({ onRefresh, onGiocatoreUpdated })

  // Hook per le colonne
  const columns = useGiocatoriColumns({
    onWishlistToggle: handleWishlistToggle,
    onRefresh: onRefreshFromHook,
    onAssegnaGiocatore: handleAssegnaGiocatore,
    onSvincolaGiocatore: handleSvincolaGiocatore,
    onEditAllFields: handleEditAllFields,
  })

  return (
    <>
      <GiocatoriGrid
        giocatori={giocatori}
        columns={columns}
        paginationModel={paginationModel}
        sortingModel={sortingModel}
        onPaginationModelChange={setPaginationModel}
        onSortingModelChange={setSortingModel}
        getRowClassName={getRowClassName}
      />
      
      <AcquistaDialog
        open={openAcquistaDialog}
        onClose={() => setOpenAcquistaDialog(false)}
        giocatore={selectedGiocatore}
        squadre={squadre}
        onAcquista={handleAcquistaGiocatore}
      />

      <SvincolaDialog
        open={openSvincolaDialog}
        onClose={() => setOpenSvincolaDialog(false)}
        giocatore={giocatoreDaSvincolare}
        onSvincola={handleSvincolaConfirm}
      />

      <EditGiocatoreFieldsDialog
        open={openEditFieldsDialog}
        onClose={() => setOpenEditFieldsDialog(false)}
        giocatore={giocatorePerEdit}
        onFieldsUpdated={handleFieldsUpdated}
      />
    </>
  )
}

export default GiocatoriDataGrid
