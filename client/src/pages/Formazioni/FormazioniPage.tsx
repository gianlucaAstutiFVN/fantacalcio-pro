import React from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Card,
  CardContent,
  CardMedia,
  CardActionArea
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { squadreSerieA } from './data/squadreData';

const FormazioniPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSquadraClick = (squadraId: string) => {
    navigate(`/formazioni/${squadraId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Formazioni Serie A
      </Typography>
      
      <Grid container spacing={3}>
        {squadreSerieA.map((squadra) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={squadra.id}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 4
                }
              }}
            >
              <CardActionArea 
                onClick={() => handleSquadraClick(squadra.id)}
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={squadra.logo}
                  alt={squadra.nome}
                  sx={{ objectFit: 'contain', p: 2, backgroundColor: '#f5f5f5' }}
                />
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {squadra.nome}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {squadra.citta}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default FormazioniPage;
