@echo off
echo Test delle nuove API del backend Fantacalcio
echo ===========================================
echo.

echo 1. Test creazione nuova squadra...
curl -X POST http://localhost:5000/api/squadre -H "Content-Type: application/json" -d "{\"nome\":\"Test Team\",\"proprietario\":\"Test User\",\"budget\":1000}"
echo.
echo.

echo 2. Test ottenere tutte le squadre...
curl http://localhost:5000/api/squadre
echo.
echo.

echo 3. Test ottenere statistiche squadra 1...
curl http://localhost:5000/api/squadre/1/stats
echo.
echo.

echo 4. Test aggiungere giocatore alla wishlist...
curl -X POST http://localhost:5000/api/squadre/1/wishlist -H "Content-Type: application/json" -d "{\"giocatoreId\":\"dumfries_inter\"}"
echo.
echo.

echo 5. Test ottenere wishlist squadra 1...
curl http://localhost:5000/api/squadre/1/wishlist
echo.
echo.

echo 6. Test acquistare giocatore...
curl -X POST http://localhost:5000/api/squadre/1/acquista -H "Content-Type: application/json" -d "{\"giocatore\":{\"id\":\"dumfries_inter\",\"nome\":\"Dumfries\",\"squadra\":\"Inter\",\"ruolo\":\"difensore\",\"unveil_fvm\":\"100\",\"gazzetta_fascia\":\"1\",\"pazzidifanta\":\"Top\",\"mia_valutazione\":\"98\",\"note\":\"Esterno offensivo, 1° difensore\"},\"prezzoPagato\":80}"
echo.
echo.

echo 7. Test statistiche squadra dopo acquisto...
curl http://localhost:5000/api/squadre/1/stats
echo.
echo.

echo Test completati! Controlla i risultati sopra.
pause
