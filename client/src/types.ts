export enum Fascia {
  TOP = "1-TOP",
  SEMI_TOP = "2-SEMI-TOP",
  SOTTO_SEMI_TOP = "3-Sotto ai semi top",
  JOLLY_1_FASCIA = "5-Jolly 1 Fascia",
  FASCIA_ALTA = "4-Fascia alta",
  FASCIA_MEDIA = "6-Fascia Media",
  LOW_COST_1_FASCIA = "7-Low Cost 1 fascia",
  LOW_COST_2_FASCIA = "8-LowCost 2 fascia",
  SCOMMESSE = "9-Scommesse"
}

export interface Giocatore {
  id: string
  nome: string
  squadra: string,
  squadra_giocatore?: string,
  ruolo: 'portiere' | 'difensore' | 'centrocampista' | 'attaccante'
  gazzetta?: number | null
  fascia?: Fascia | null
  consiglio?: string | null
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
