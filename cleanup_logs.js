const fs = require('fs');
const path = require('path');

// Function to clean up console.error statements
function cleanupConsoleErrors(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove console.error statements that are just logging errors
  content = content.replace(/console\.error\(['"`][^'"`]*Errore[^'"`]*['"`],\s*error\);\s*/g, '');
  content = content.replace(/console\.error\(['"`]❌\s*Errore[^'"`]*['"`],\s*error\);\s*/g, '');
  
  fs.writeFileSync(filePath, content);
  console.log(`Cleaned up: ${filePath}`);
}

// Clean up all controller files
const controllersDir = path.join(__dirname, 'server/src/controllers');
const controllerFiles = [
  'astaController.js',
  'quotazioniController.js', 
  'statisticheController.js',
  'squadreController.js'
];

controllerFiles.forEach(file => {
  const filePath = path.join(controllersDir, file);
  if (fs.existsSync(filePath)) {
    cleanupConsoleErrors(filePath);
  }
});

console.log('Log cleanup completed!');
