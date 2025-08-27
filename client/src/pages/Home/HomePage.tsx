import React from 'react'
import { Box } from '@mui/material'
import HeroSection from './components/HeroSection'
import FeaturesGrid from './components/FeaturesGrid'

const HomePage: React.FC = () => {
  return (
    <Box>
      <HeroSection />
      <FeaturesGrid />
    </Box>
  )
}

export default HomePage
