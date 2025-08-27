import React from 'react'
import { Card, CardContent, Typography, Box } from '@mui/material'

interface Feature {
  title: string
  description: string
  icon: React.ReactNode
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
}

interface FeatureCardProps {
  feature: Feature
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h1" component="div" sx={{ fontSize: '3rem' }}>
            {feature.icon}
          </Typography>
        </Box>
        
        <Typography variant="h6" component="h3" gutterBottom color={`${feature.color}.main`}>
          {feature.title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          {feature.description}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default FeatureCard
