import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'
import {
  HomePage,
  GiocatoriPage,
  SquadrePage,
  StatistichePage
} from '../pages'
import { FormazioniPage, DettaglioSquadraPage } from '../pages/Formazioni'
import { routes } from '../config/routes'

const drawerWidth = 240

const StyledAppBar = styled(AppBar)(() => ({
  backgroundColor: '#1e3a8a',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
}))

const StyledDrawer = styled(Drawer)(() => ({
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: '#f8f9fa',
    borderRight: '1px solid #e9ecef',
  },
}))

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const location = useLocation()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleNavigation = (path: string) => {
    navigate(path)
    if (isMobile) {
      setMobileOpen(false)
    }
  }

  const isActiveRoute = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" color="primary">
          Fantacalcio
        </Typography>
      </Toolbar>
      <List>
        {routes.map((route) => (
          <ListItem key={route.path} disablePadding>
            <ListItemButton
              selected={isActiveRoute(route.path)}
              onClick={() => handleNavigation(route.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActiveRoute(route.path) ? 'primary.contrastText' : 'inherit',
                }}
              >
                {route.icon}
              </ListItemIcon>
              <ListItemText primary={route.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <StyledAppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Fantacalcio Pro
          </Typography>
        </Toolbar>
      </StyledAppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <StyledDrawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </StyledDrawer>
        
        {/* Desktop drawer */}
        <StyledDrawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </StyledDrawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '64px', // AppBar height
        }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/giocatori" element={<GiocatoriPage />} />
          <Route path="/squadre" element={<SquadrePage />} />
          <Route path="/statistiche" element={<StatistichePage />} />
          <Route path="/formazioni" element={<FormazioniPage />} />
          <Route path="/formazioni/:squadraId" element={<DettaglioSquadraPage />} />
        </Routes>
      </Box>
    </Box>
  )
}

export default Layout
