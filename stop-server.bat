@echo off
echo Arresto del server backend...
echo.
echo Cercando processi Node.js in esecuzione sulla porta 5000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do (
    echo Terminando processo PID: %%a
    taskkill /PID %%a /F
)
echo.
echo Server arrestato.
pause
