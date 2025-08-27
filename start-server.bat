@echo off
echo Avvio del server backend per Fantacalcio...
echo.
cd server
echo Installazione dipendenze...
npm install
echo.
echo Avvio del server in modalita' sviluppo...
npm run dev
pause
