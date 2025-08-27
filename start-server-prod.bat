@echo off
echo Avvio del server backend per Fantacalcio in modalita' produzione...
echo.
cd server
echo Installazione dipendenze...
npm install
echo.
echo Avvio del server in modalita' produzione...
npm start
pause
