# 📊 **Setup CSV per Fantacalcio Backend**

## 🎯 **Struttura Richiesta**

Il backend si aspetta che i file CSV nella cartella `data/` abbiano la seguente struttura:

```csv
Nome,Squadra,Unveil FVM (0-100),Gazzetta Fascia (1-4),PazzidiFanta (Qualitativo),Mia_Valutazione (0-100),Ruolo_note
```

## 📁 **File Richiesti**

Crea i seguenti file nella cartella `data/`:

- `portieri.csv` - Lista dei portieri
- `difensori.csv` - Lista dei difensori  
- `centrocampisti.csv` - Lista dei centrocampisti
- `attaccanti.csv` - Lista degli attaccanti

## 📋 **Descrizione Campi**

| Campo | Descrizione | Esempio |
|-------|-------------|---------|
| **Nome** | Nome completo del giocatore | `Dumfries` |
| **Squadra** | Squadra di appartenenza | `Inter` |
| **Unveil FVM (0-100)** | Valutazione FVM (0-100) | `100` |
| **Gazzetta Fascia (1-4)** | Fascia Gazzetta dello Sport (1-4) | `1` |
| **PazzidiFanta (Qualitativo)** | Valutazione Pazzi di Fanta | `Top`, `Semitop`, `LowCost` |
| **Mia_Valutazione (0-100)** | Valutazione personale (0-100) | `98` |
| **Ruolo_note** | Note aggiuntive sul ruolo | `"Esterno offensivo, 1° difensore"` |

## 🔧 **Esempio File CSV**

### `portieri.csv` (esempio reale)
```csv
Nome,Squadra,Unveil FVM (0-100),Gazzetta Fascia (1-4),PazzidiFanta (Qualitativo),Mia_Valutazione (0-100),Ruolo_note
Dumfries,Inter,100,1,Top,98,"Esterno offensivo, 1° difensore"
Dimarco,Inter,96,1,Top,95,"Esterno con bonus, 2° difensore"
Gosens,Fiorentina,86,1,Top,90,"Terzino offensivo, 3° difensore"
Bastoni,Inter,78,1,Top,92,"Centrale moderno, Top per modificatore"
Bremer,Juventus,44,1,Top,85,"Centrale titolare, affidabile"
Cambiaso,Juventus,63,2,Semitop,80,"Esterno ibrido, 4° difensore"
Buongiorno,Napoli,n/d,2,Semitop,82,"Centrale costante, 5° difensore"
Miranda,Bologna,n/d,2,Semitop,78,"Centrale con bonus (assist), 6° difensore"
```

### `centrocampisti.csv`
```csv
Nome,Squadra,Unveil FVM (0-100),Gazzetta Fascia (1-4),PazzidiFanta (Qualitativo),Mia_Valutazione (0-100),Ruolo_note
Jude Bellingham,Real Madrid,86,1,Top,87,Centrocampista offensivo
Federico Valverde,Real Madrid,84,1,Top,85,Centrocampista centrale
Nicolò Barella,Inter,83,1,Top,84,Centrocampista dinamico
Sandro Tonali,Milan,80,1,Top,81,Regista
```

### `attaccanti.csv`
```csv
Nome,Squadra,Unveil FVM (0-100),Gazzetta Fascia (1-4),PazzidiFanta (Qualitativo),Mia_Valutazione (0-100),Ruolo_note
Lautaro Martinez,Inter,85,1,Top,86,Capocannoniere Serie A
Federico Chiesa,Juventus,78,1,Top,79,Ex Fiorentina
Erling Haaland,Manchester City,95,1,Top,96,Capocannoniere Premier
Kylian Mbappé,Real Madrid,93,1,Top,94,Ex PSG
```

## ⚠️ **Regole Importanti**

1. **Intestazioni esatte**: Usa esattamente i nomi dei campi mostrati sopra
2. **Separatore virgola**: Usa la virgola (`,`) come separatore
3. **Valori numerici**: Per i campi di valutazione, usa solo numeri
4. **Valori "n/d"**: Puoi usare "n/d" per valori non disponibili
5. **Encoding**: Salva i file in formato UTF-8
6. **Nessuna riga vuota**: Rimuovi tutte le righe vuote dal file
7. **Virgolette**: Usa le virgolette per le note se contengono virgole

## 🔍 **Gestione Valori Speciali**

- **"n/d"**: Valore non disponibile (verrà convertito in `null`)
- **Valori numerici**: Per valutazioni (0-100 per FVM e Mia_Valutazione, 1-4 per Gazzetta)
- **Valori qualitativi**: Top, Semitop, LowCost per PazzidiFanta
- **Note con virgole**: Usa le virgolette per racchiudere il testo

## 🚀 **Come Procedere**

1. **Crea i 4 file CSV** nella cartella `data/`
2. **Usa la struttura esatta** mostrata negli esempi
3. **Inserisci i tuoi giocatori** con le valutazioni corrette
4. **Avvia il backend** con `start-server.bat`
5. **Testa le API** con `test-api.bat`

## 🔍 **Verifica Struttura**

Dopo aver creato i CSV, puoi verificare che la struttura sia corretta:

```bash
# Verifica che i file esistano
dir data\*.csv

# Controlla le prime righe di ogni file
type data\portieri.csv | head -5
```

## 📊 **Gestione Dati**

- **Backup**: Mantieni sempre una copia dei tuoi CSV originali
- **Aggiornamenti**: Puoi aggiornare i CSV anche mentre il server è in esecuzione
- **Validazione**: Il backend validerà automaticamente la struttura dei CSV
- **Valori "n/d"**: Verranno gestiti automaticamente dal backend

## 🆘 **Risoluzione Problemi**

### Errore "Ruolo non trovato"
- Verifica che i nomi dei file CSV siano esatti
- Controlla che i file siano nella cartella `data/`

### Errore "Errore nel leggere i giocatori"
- Verifica la struttura dei CSV
- Controlla che non ci siano caratteri speciali
- Assicurati che i file siano salvati in UTF-8

### Giocatori non visualizzati
- Controlla che i CSV non siano vuoti
- Verifica che le intestazioni siano corrette
- Controlla che non ci siano spazi extra nei nomi dei campi

### Valori "n/d" non gestiti
- Il backend gestisce automaticamente i valori "n/d"
- Verranno convertiti in `null` nelle API
- Non causano errori nel sistema
