const fs = require('fs');
const path = require('path');

// Function to clean up console.error statements in service files
function cleanupServiceErrors(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove console.error statements that are just logging errors
  content = content.replace(/console\.error\(['"`][^'"`]*Errore[^'"`]*['"`],\s*error\);\s*/g, '');
  content = content.replace(/console\.error\(['"`]❌\s*Errore[^'"`]*['"`],\s*error\);\s*/g, '');
  
  fs.writeFileSync(filePath, content);
  console.log(`Cleaned up: ${filePath}`);
}

// Clean up all service files
const servicesDir = path.join(__dirname, 'server/src/services');
const serviceFiles = [
  'astaService.js',
  'quotazioniService.js', 
  'statisticheService.js'
];

serviceFiles.forEach(file => {
  const filePath = path.join(servicesDir, file);
  if (fs.existsSync(filePath)) {
    cleanupServiceErrors(filePath);
  }
});

console.log('Service log cleanup completed!');
