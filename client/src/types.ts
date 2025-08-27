export interface Giocatore {
  id: string
  nome: string
  squadra: string,
  squadra_giocatore?: string,
  ruolo: 'portiere' | 'difensore' | 'centrocampista' | 'attaccante'
  fantacalciopedia?: number | null
  pazzidifanta?: number | null
  stadiosport?: number | null
  unveil?: number | null
  gazzetta?: number | null
  mia_valutazione?: number | null
  note?: string | null
  preferito?: number
  fantasquadra?: string | null
  status: 'disponibile' | 'acquistato' | 'venduto'
  inWishlist?: boolean
  wishlistIcon?: string
  // Nuovi campi per giocatori acquistati
  prezzo_acquisto?: number | null
  nome_squadra_acquirente?: string | null
  // Proprietà aggiuntive per compatibilità
  quotazione?: number
  valore?: number
  unveil_fvm?: number
  gazzetta_fascia?: string
}

export interface Squadra {
  id: number
  nome: string
  proprietario: string
  budget: number
  budget_residuo: number
  created_at: string
  giocatori?: Giocatore[]
}

export interface WishlistItem {
  id: number
  giocatore_id: string
  squadra_id: number | null
  created_at: string
  nome?: string
  squadra?: string
  ruolo?: string
  squadra_nome?: string
}

export interface Acquisto {
  id: number
  giocatore_id: string
  prezzo: number
  data_acquisto: string
  nome?: string
  squadra?: string
  ruolo?: string
}

export interface Filters {
  searchTerm: string
  squad: string
  status: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  count?: number
  message?: string
  error?: string
}
