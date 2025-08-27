# Deploy Fantacalcio Asta Frontend

## 🚀 Build di Produzione

### 1. Build Standard
```bash
npm run build
```

### 2. Build Ottimizzata per Produzione
```bash
npm run build:prod
```

## 📁 Output

I file compilati saranno disponibili nella cartella `dist/`:
- `index.html` - File HTML principale
- `assets/` - CSS, JS e altri asset ottimizzati
- `*.js` - Bundle JavaScript ottimizzati
- `*.css` - Stili CSS ottimizzati

## 🌐 Deploy su Server Web

### Apache
1. Copia i file dalla cartella `dist/` nella root del web server
2. Crea un file `.htaccess` per il routing SPA:

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### Nginx
1. Copia i file dalla cartella `dist/` nella root del web server
2. Configura il routing SPA:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### Node.js/Express
1. Copia i file dalla cartella `dist/` nella cartella `public/`
2. Configura il middleware static:

```javascript
app.use(express.static('public'));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
```

## 🔧 Variabili d'Ambiente

Per la produzione, configura le seguenti variabili:

```bash
# URL dell'API backend
VITE_API_URL=https://tuo-backend.com

# Titolo dell'applicazione
VITE_APP_TITLE=Fantacalcio Asta
```

## 📱 PWA (Progressive Web App)

Per abilitare le funzionalità PWA:

1. Installa `vite-plugin-pwa`:
```bash
npm install vite-plugin-pwa --save-dev
```

2. Configura il plugin in `vite.config.ts`
3. Crea il file `manifest.json`
4. Configura il service worker

## 🔒 Sicurezza

### Headers di Sicurezza
Configura i seguenti headers sul server:

```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### HTTPS
Assicurati che l'applicazione sia servita su HTTPS in produzione.

## 📊 Monitoraggio

### Analytics
Integra Google Analytics o altri servizi di monitoraggio:

```typescript
// In main.tsx
import { Analytics } from './analytics';

if (import.meta.env.PROD) {
  Analytics.init();
}
```

### Error Tracking
Integra servizi come Sentry per il tracking degli errori:

```typescript
// In main.tsx
import * as Sentry from '@sentry/react';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: 'YOUR_SENTRY_DSN',
    environment: 'production'
  });
}
```

## 🧪 Testing

### Test di Produzione
Prima del deploy finale:

1. Esegui i test:
```bash
npm run test
```

2. Controlla il linting:
```bash
npm run lint
```

3. Verifica i tipi TypeScript:
```bash
npm run type-check
```

4. Testa la build localmente:
```bash
npm run preview
```

## 📈 Performance

### Bundle Analysis
Analizza la dimensione del bundle:

```bash
npm install --save-dev vite-bundle-analyzer
```

### Ottimizzazioni
- Code splitting automatico
- Tree shaking
- Minificazione CSS/JS
- Compressione Gzip/Brotli
- Cache busting con hash dei file

## 🔄 CI/CD

### GitHub Actions
Esempio di workflow per deploy automatico:

```yaml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run build:prod
      - name: Deploy to Server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.KEY }}
          script: |
            cd /var/www/fantacalcio
            git pull origin main
            npm ci
            npm run build:prod
            sudo systemctl reload nginx
```
