export const config = {
  API_BASE_URL: (import.meta as any).env?.VITE_API_URL || (import.meta.env.MODE === 'production' 
    ? 'https://fantacalcio-pro.onrender.com/api' 
    : 'http://localhost:5000/api'),
  
  APP_NAME: 'Fantacalcio Pro',
  APP_VERSION: '1.0.0',
  
  // Default values
  DEFAULT_BUDGET: 500,
  DEFAULT_PAGE_SIZE: 10,
  
  // Roles mapping
  ROLES: {
    portiere: 'Portiere',
    difensore: 'Difensore',
    centrocampista: 'Centrocampista',
    attaccante: 'Attaccante'
  },
  
  // Status mapping
  STATUS: {
    disponibile: 'Disponibile',
    acquistato: 'Acquistato'
  }
}

export default config
