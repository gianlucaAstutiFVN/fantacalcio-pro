import React, { useState } from 'react'
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material'
import GroupIcon from '@mui/icons-material/Group'
import { Squadra } from '../../types'
import SquadraForm from './components/SquadraForm'
import AssegnaGiocatoreDialog from './components/AssegnaGiocatoreDialog'
import SquadreGrid from './components/SquadreGrid'
import SquadraDrawer from './components/SquadraDrawer'
import { useSquadre } from './hooks/useSquadre'
import { useGiocatori } from './hooks/useGiocatori'


const SquadrePage: React.FC = () => {
  const [openFormDialog, setOpenFormDialog] = useState(false)
  const [openAssegnaDialog, setOpenAssegnaDialog] = useState(false)
  const [editingSquadra, setEditingSquadra] = useState<Squadra | null>(null)
  const [selectedSquadra, setSelectedSquadra] = useState<Squadra | null>(null)
  const [openDrawer, setOpenDrawer] = useState(false)
  const [drawerSquadra, setDrawerSquadra] = useState<Squadra | null>(null)

  // Hook personalizzati per gestire i dati
  const {
    squadre,
    loading,
    error,
    formLoading,
    createSquadra,
    updateSquadra,
    deleteSquadra,
    assegnaGiocatore,
    svincolaGiocatore
  } = useSquadre()

  const {
    getGiocatoriDisponibili,
    fetchGiocatori
  } = useGiocatori()

  const handleOpenFormDialog = (squadra?: Squadra) => {
    if (squadra) {
      setEditingSquadra(squadra)
    } else {
      setEditingSquadra(null)
    }
    setOpenFormDialog(true)
  }

  const handleCloseFormDialog = () => {
    setOpenFormDialog(false)
    setEditingSquadra(null)
  }

  const handleSubmitForm = async (formData: any) => {
    let success = false
    
    if (editingSquadra) {
      success = await updateSquadra(editingSquadra.id, formData)
    } else {
      success = await createSquadra(formData)
    }
    
    if (success) {
      handleCloseFormDialog()
    }
  }

  const handleDeleteSquadra = async (id: number) => {
    if (window.confirm('Sei sicuro di voler eliminare questa squadra? I giocatori assegnati torneranno disponibili.')) {
      const success = await deleteSquadra(id)
      if (success) {
        // Ricarica anche i giocatori per aggiornare la lista dei disponibili
        await fetchGiocatori()
      }
    }
  }

  const handleOpenAssegnaDialog = (squadra: Squadra) => {
    setSelectedSquadra(squadra)
    setOpenAssegnaDialog(true)
  }

  const handleCloseAssegnaDialog = () => {
    setOpenAssegnaDialog(false)
    setSelectedSquadra(null)
  }

  const handleOpenDrawer = (squadra: Squadra) => {
    setDrawerSquadra(squadra)
    setOpenDrawer(true)
  }

  const handleCloseDrawer = () => {
    setOpenDrawer(false)
    setDrawerSquadra(null)
  }

  const handleAssegnaGiocatore = async (giocatoreId: string, squadraId: number, prezzo: number) => {
    const success = await assegnaGiocatore(giocatoreId, squadraId, prezzo)
    if (success) {
      // Refetch la lista dei giocatori disponibili dopo l'assegnazione
      await fetchGiocatori()
      handleCloseAssegnaDialog()
    }
    return success
  }

  const handleSvincolaGiocatore = async (giocatoreId: string, squadraId: number) => {
    const success = await svincolaGiocatore(giocatoreId, squadraId)
    if (success) {
      // Refetch la lista dei giocatori disponibili dopo lo svincolo
      await fetchGiocatori()
    }
    return success
  }



  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          <GroupIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Gestione Squadre
        </Typography>
      </Box>

      {/* Griglia squadre */}
             <SquadreGrid
         squadre={squadre}
         onEdit={handleOpenFormDialog}
         onDelete={handleDeleteSquadra}
         onAssegnaGiocatore={handleOpenAssegnaDialog}
         onViewDetails={handleOpenDrawer}
         onCreateNew={() => handleOpenFormDialog()}
         loading={loading}
       />

      {/* Dialog per creare/modificare squadra */}
      <SquadraForm
        open={openFormDialog}
        onClose={handleCloseFormDialog}
        onSubmit={handleSubmitForm}
        editingSquadra={editingSquadra || undefined}
        loading={formLoading}
      />

             {/* Dialog per assegnare giocatore */}
       <AssegnaGiocatoreDialog
         open={openAssegnaDialog}
         onClose={handleCloseAssegnaDialog}
         onAssegna={handleAssegnaGiocatore}
         giocatori={getGiocatoriDisponibili()}
         squadre={squadre}
         selectedSquadra={selectedSquadra}
         loading={formLoading}
       />

       {/* Drawer per dettagli squadra */}
       <SquadraDrawer
         open={openDrawer}
         squadra={drawerSquadra}
         onClose={handleCloseDrawer}
         onAssegnaGiocatore={() => {
           if (drawerSquadra) {
             handleOpenAssegnaDialog(drawerSquadra)
             handleCloseDrawer()
           }
         }}
         onSvincolaGiocatore={handleSvincolaGiocatore}
       />

     </Box>
   )
 }

export default SquadrePage
