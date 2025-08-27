Write-Host "Avvio del server backend per Fantacalcio..." -ForegroundColor Green
Write-Host ""

# Cambia directory nel server
Set-Location -Path "server"

# Installa le dipendenze se necessario
Write-Host "Installazione dipendenze..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "Avvio del server in modalita' sviluppo..." -ForegroundColor Cyan
Write-Host "Il server sara' disponibile su: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Premi Ctrl+C per fermare il server" -ForegroundColor Red
Write-Host ""

# Avvia il server
npm run dev
