import React from 'react'
import { Giocatore, Squadra } from '../../../types'
import { useGiocatoriColumns } from './GiocatoriColumns'
import { useGiocatoriDataGrid } from './useGiocatoriDataGrid'
import GiocatoriGrid from './GiocatoriGrid'
import AcquistaDialog from './ActionDataGrid/AcquistaDialog'
import SvincolaDialog from './ActionDataGrid/SvincolaDialog'
import EditNoteDialog from './ActionDataGrid/EditNoteDialog'
import EditValutazioneDialog from './ActionDataGrid/EditValutazioneDialog'

interface GiocatoriDataGridProps {
  giocatori: Giocatore[]
  squadre?: Squadra[]
  onRefresh?: () => void
}

const GiocatoriDataGrid: React.FC<GiocatoriDataGridProps> = ({
  giocatori,
  squadre,
  onRefresh,
}) => {
  // Hook personalizzato per gestire tutta la logica
  const {
    paginationModel,
    sortingModel,
    selectedGiocatore,
    openAcquistaDialog,
    openSvincolaDialog,
    giocatoreDaSvincolare,
    openEditNoteDialog,
    giocatorePerNote,
    openEditValutazioneDialog,
    giocatorePerValutazione,
    setPaginationModel,
    setSortingModel,
    setOpenAcquistaDialog,
    setOpenSvincolaDialog,
    setOpenEditNoteDialog,
    setOpenEditValutazioneDialog,
    getRowClassName,
    handleAssegnaGiocatore,
    handleAcquistaGiocatore,
    handleSvincolaGiocatore,
    handleSvincolaConfirm,
    handleEditNote,
    handleNoteUpdated,
    handleEditValutazione,
    handleValutazioneUpdated,
    handleWishlistToggle,
    onRefresh: onRefreshFromHook,
  } = useGiocatoriDataGrid({ onRefresh })

  // Hook per le colonne
  const columns = useGiocatoriColumns({
    onWishlistToggle: handleWishlistToggle,
    onRefresh: onRefreshFromHook,
    onAssegnaGiocatore: handleAssegnaGiocatore,
    onSvincolaGiocatore: handleSvincolaGiocatore,
    onEditNote: handleEditNote,
    onEditValutazione: handleEditValutazione,
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

      <EditNoteDialog
        open={openEditNoteDialog}
        onClose={() => setOpenEditNoteDialog(false)}
        giocatore={giocatorePerNote}
        onNoteUpdated={handleNoteUpdated}
      />

      <EditValutazioneDialog
        open={openEditValutazioneDialog}
        onClose={() => setOpenEditValutazioneDialog(false)}
        giocatore={giocatorePerValutazione}
        onValutazioneUpdated={handleValutazioneUpdated}
      />
    </>
  )
}

export default GiocatoriDataGrid
