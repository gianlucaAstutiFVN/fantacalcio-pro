import React from 'react'
import HomeIcon from '@mui/icons-material/Home'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'
import GroupIcon from '@mui/icons-material/Group'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'

export interface RouteConfig {
  path: string
  name: string
  icon: React.ReactNode
  description: string
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'Home',
    icon: <HomeIcon />,
    description: 'Pagina principale dell\'applicazione'
  },
  {
    path: '/giocatori',
    name: 'Giocatori',
    icon: <SportsSoccerIcon />,
    description: 'Gestione e visualizzazione giocatori'
  },
  {
    path: '/squadre',
    name: 'Squadre',
    icon: <GroupIcon />,
    description: 'Gestione squadre fantacalcio'
  },
  {
    path: '/statistiche',
    name: 'Statistiche',
    icon: <TrendingUpIcon />,
    description: 'Analisi e statistiche'
  }
]

export default routes
