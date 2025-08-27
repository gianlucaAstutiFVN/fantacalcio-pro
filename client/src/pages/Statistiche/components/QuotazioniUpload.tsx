import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import api from '../../../services/api';

interface UploadResult {
  giocatore: string;
  action: 'created' | 'updated';
  data: any;
  wishlistAdded?: boolean;
  wishlistRemoved?: boolean;
}

interface UploadError {
  row: any;
  error: string;
}

interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    results: UploadResult[];
    errors: UploadError[];
    summary: {
      total: number;
      successful: number;
      failed: number;
    };
  };
}

const QuotazioniUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      setAlert({ type: 'success', message: `File selezionato: ${file.name}` });
    } else {
      setAlert({ type: 'error', message: 'Seleziona un file CSV valido' });
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      setAlert({ type: 'success', message: `File selezionato: ${file.name}` });
    } else {
      setAlert({ type: 'error', message: 'Trascina un file CSV valido' });
    }
  };

  const uploadCSV = async () => {
    if (!selectedFile) {
      setAlert({ type: 'error', message: 'Seleziona un file CSV' });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('csv', selectedFile);

    try {
      const response = await api.post('/quotazioni/upload-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadResult(response.data);
             // Conta le modifiche alla wishlist
       const wishlistAdded = response.data.data.results.filter((r: any) => r.wishlistAdded).length;
       const wishlistRemoved = response.data.data.results.filter((r: any) => r.wishlistRemoved).length;
       
       let message = `Importazione completata: ${response.data.data.summary.successful} operazioni, ${response.data.data.summary.failed} errori`;
       if (wishlistAdded > 0 || wishlistRemoved > 0) {
         message += `. Wishlist: ${wishlistAdded > 0 ? `+${wishlistAdded} aggiunti` : ''}${wishlistAdded > 0 && wishlistRemoved > 0 ? ', ' : ''}${wishlistRemoved > 0 ? `-${wishlistRemoved} rimossi` : ''}`;
       }
       
       setAlert({ 
         type: 'success', 
         message: message
       });
      
      // Reset file selection
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      setAlert({ 
        type: 'error', 
        message: `Errore di caricamento: ${error.response?.data?.error || error.message}` 
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'Nome,Squadra,Fantacalciopedia,PazzidiFanta,Stadiosport,Unveil,Gazzetta,Mia_Valutazione,Note,Preferito\nSommer,Inter,85,Top,87,90,1,95,Portiere affidabile,true';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_quotazioni.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearResults = () => {
    setUploadResult(null);
    setAlert(null);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        📁 Importa Quotazioni da CSV
      </Typography>

      {/* Alert Messages */}
      {alert && (
        <Alert 
          severity={alert.type} 
          sx={{ mb: 2 }}
          onClose={() => setAlert(null)}
        >
          {alert.message}
        </Alert>
      )}

      {/* Upload Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Carica File CSV
        </Typography>
        
        <Box
          sx={{
            border: '2px dashed #ccc',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'action.hover',
            },
          }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body1" gutterBottom>
            Trascina qui il file CSV o clicca per selezionare
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Formato CSV: Nome, Squadra, Fantacalciopedia, PazzidiFanta, Stadiosport, Unveil, Gazzetta, Mia_Valutazione, Note, Preferito
          </Typography>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </Box>

        {selectedFile && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
            <Typography variant="body2" color="success.contrastText">
              File selezionato: <strong>{selectedFile.name}</strong>
            </Typography>
          </Box>
        )}

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={uploadCSV}
            disabled={!selectedFile || isUploading}
            startIcon={isUploading ? <CircularProgress size={20} /> : <UploadIcon />}
          >
            {isUploading ? 'Caricamento...' : '📤 Carica CSV'}
          </Button>
          
          <Button
            variant="outlined"
            onClick={downloadTemplate}
            startIcon={<DownloadIcon />}
          >
            📥 Scarica Template
          </Button>

          {uploadResult && (
            <Button
              variant="outlined"
              onClick={clearResults}
              startIcon={<RefreshIcon />}
            >
              Pulisci Risultati
            </Button>
          )}
        </Box>
      </Paper>

      {/* Results Section */}
      {uploadResult && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Risultati Importazione
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" gutterBottom>
              {uploadResult.message}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip 
                icon={<SuccessIcon />} 
                label={`Successi: ${uploadResult.data.summary.successful}`} 
                color="success" 
              />
              <Chip 
                icon={<ErrorIcon />} 
                label={`Errori: ${uploadResult.data.summary.failed}`} 
                color="error" 
              />
              <Chip 
                label={`Totale: ${uploadResult.data.summary.total}`} 
                variant="outlined" 
              />
            </Box>
          </Box>

          {/* Successful Operations */}
          {uploadResult.data.results.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Operazioni Completate ({uploadResult.data.results.length})
              </Typography>
              <TableContainer>
                <Table size="small">
                                       <TableHead>
                       <TableRow>
                         <TableCell>Giocatore</TableCell>
                         <TableCell>Azione</TableCell>
                         <TableCell>Wishlist</TableCell>
                         <TableCell>Dettagli</TableCell>
                       </TableRow>
                     </TableHead>
                  <TableBody>
                    {uploadResult.data.results.map((result, index) => (
                                             <TableRow key={index}>
                         <TableCell>{result.giocatore}</TableCell>
                         <TableCell>
                           <Chip 
                             label={result.action === 'created' ? 'Creato' : 'Aggiornato'} 
                             color={result.action === 'created' ? 'success' : 'info'}
                             size="small"
                           />
                         </TableCell>
                         <TableCell>
                           {result.wishlistAdded && (
                             <Chip 
                               label="❤️ Aggiunto" 
                               color="success" 
                               size="small"
                             />
                           )}
                           {result.wishlistRemoved && (
                             <Chip 
                               label="🤍 Rimosso" 
                               color="warning" 
                               size="small"
                             />
                           )}
                           {!result.wishlistAdded && !result.wishlistRemoved && (
                             <Typography variant="body2" color="text.secondary">
                               Nessuna modifica
                             </Typography>
                           )}
                         </TableCell>
                         <TableCell>
                           <Typography variant="body2" color="text.secondary">
                             {JSON.stringify(result.data, null, 2)}
                           </Typography>
                         </TableCell>
                       </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Errors */}
          {uploadResult.data.errors.length > 0 && (
            <Box>
              <Typography variant="subtitle1" gutterBottom color="error">
                Errori ({uploadResult.data.errors.length})
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Riga</TableCell>
                      <TableCell>Errore</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {uploadResult.data.errors.map((error, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="body2" fontFamily="monospace">
                            {JSON.stringify(error.row, null, 2)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="error">
                            {error.error}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default QuotazioniUpload;
