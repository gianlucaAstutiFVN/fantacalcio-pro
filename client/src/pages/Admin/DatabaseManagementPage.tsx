import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  Stack,
  Chip,
  Tabs,
  Tab
} from '@mui/material';
import {
  Download as DownloadIcon,
  Upload as UploadIcon,
  Storage as StorageIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { config } from '../../config/config';
import QuotazioniUpload from './components/QuotazioniUpload';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`database-tabpanel-${index}`}
      aria-labelledby={`database-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `database-tab-${index}`,
    'aria-controls': `database-tabpanel-${index}`,
  };
}

interface BackupStatus {
  lastBackup?: string;
  totalRecords?: number;
  tables?: string[];
}

const DatabaseManagementPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [backupStatus, setBackupStatus] = useState<BackupStatus>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Scarica backup del database
  const downloadBackup = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const response = await fetch(`${config.API_BASE_URL}/backup/download`);
      
      if (!response.ok) {
        throw new Error('Errore durante il download del backup');
      }
      
      // Crea blob e scarica
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fantacalcio-backup-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setMessage({
        type: 'success',
        text: 'Backup scaricato con successo!'
      });
      
      // Aggiorna lo stato
      await checkDatabaseStatus();
      
    } catch (error) {
      console.error('Errore download backup:', error);
      setMessage({
        type: 'error',
        text: `Errore durante il download: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`
      });
    } finally {
      setLoading(false);
    }
  };

  // Carica file di backup
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      setMessage(null);
    } else {
      setMessage({
        type: 'error',
        text: 'Seleziona un file CSV valido'
      });
    }
  };

  // Ripristina da backup
  const restoreBackup = async () => {
    if (!selectedFile) {
      setMessage({
        type: 'error',
        text: 'Seleziona prima un file di backup'
      });
      return;
    }

    setLoading(true);
    setMessage(null);
    
    try {
      const formData = new FormData();
      formData.append('backup', selectedFile);
      
      const response = await fetch(`${config.API_BASE_URL}/backup/restore`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Errore durante il ripristino');
      }
      
      await response.json();
      
      setMessage({
        type: 'success',
        text: 'Database ripristinato con successo dal backup!'
      });
      
      // Reset file selezionato
      setSelectedFile(null);
      
      // Aggiorna lo stato
      await checkDatabaseStatus();
      
    } catch (error) {
      console.error('Errore ripristino backup:', error);
      setMessage({
        type: 'error',
        text: `Errore durante il ripristino: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`
      });
    } finally {
      setLoading(false);
    }
  };

  // Controlla stato database
  const checkDatabaseStatus = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/health`);
      if (response.ok) {
        await response.json();
        setBackupStatus({
          lastBackup: new Date().toISOString(),
          totalRecords: 0, // TODO: implementare conteggio record
          tables: ['giocatori', 'quotazioni', 'squadre', 'acquisti', 'wishlist']
        });
      }
    } catch (error) {
      console.error('Errore controllo stato database:', error);
    }
  };

  // Controlla stato al caricamento
  React.useEffect(() => {
    checkDatabaseStatus();
  }, []);

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <StorageIcon color="primary" />
        Gestione Database
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Gestisci backup, restore e quotazioni del database. I backup contengono tutti i dati inclusi giocatori, quotazioni, squadre e acquisti.
      </Typography>

      {/* Messaggi */}
      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      {/* Tab Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="database tabs">
          <Tab 
            label="Database" 
            icon={<StorageIcon />} 
            iconPosition="start"
            {...a11yProps(0)} 
          />
          <Tab 
            label="Quotazioni" 
            icon={<TrendingUpIcon />} 
            iconPosition="start"
            {...a11yProps(1)} 
          />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <TabPanel value={tabValue} index={0}>
        {/* Stato Database */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Stato Database
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 2 }}>
              {backupStatus.tables?.map((table) => (
                <Chip key={table} label={table} color="primary" variant="outlined" />
              ))}
            </Stack>
            {backupStatus.lastBackup && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Ultimo backup: {new Date(backupStatus.lastBackup).toLocaleString('it-IT')}
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Operazioni Database */}
        <Stack spacing={3}>
          {/* Download Backup */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Scarica Backup
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Scarica un backup completo del database in formato CSV. Il file conterrà tutti i dati organizzati per tabelle.
              </Typography>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={downloadBackup}
                disabled={loading}
                sx={{ minWidth: 200 }}
              >
                {loading ? <CircularProgress size={20} /> : 'Scarica Backup'}
              </Button>
            </CardContent>
          </Card>

          {/* Upload e Restore */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ripristina da Backup
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Carica un file di backup CSV per ripristinare il database. ATTENZIONE: questa operazione sovrascriverà tutti i dati esistenti.
              </Typography>
              
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadIcon />}
                  disabled={loading}
                >
                  Seleziona File CSV
                  <input
                    type="file"
                    hidden
                    accept=".csv"
                    onChange={handleFileSelect}
                  />
                </Button>
                
                {selectedFile && (
                  <Typography variant="body2" color="primary">
                    {selectedFile.name}
                  </Typography>
                )}
              </Stack>
              
              <Button
                variant="contained"
                color="warning"
                onClick={restoreBackup}
                disabled={!selectedFile || loading}
                sx={{ minWidth: 200 }}
              >
                {loading ? <CircularProgress size={20} /> : 'Ripristina Database'}
              </Button>
            </CardContent>
          </Card>
        </Stack>

        {/* Informazioni */}
        <Card sx={{ mt: 3, bgcolor: 'grey.50' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              ℹ️ Informazioni
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              • I backup contengono tutti i dati del database organizzati per tabelle
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              • Il restore sovrascrive completamente il database esistente
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Su Render, il database si resetta ad ogni deployment
            </Typography>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Tab Quotazioni */}
      <TabPanel value={tabValue} index={1}>
        <QuotazioniUpload />
      </TabPanel>
    </Box>
  );
};

export default DatabaseManagementPage;
