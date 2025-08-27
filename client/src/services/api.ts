import axios from 'axios'
import { Giocatore, Squadra, WishlistItem, Acquisto, ApiResponse } from '../types'
import config from '../config/config'

// Configure axios base URL
const API_BASE_URL = config.API_BASE_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Giocatori API
export const giocatoriAPI = {
  // Get all giocatori
  getAll: async (withWishlist: boolean = false): Promise<ApiResponse<Giocatore[]>> => {
    const response = await api.get(`/giocatori?withWishlist=${withWishlist}`)
    return response.data
  },

  // Get giocatori by role
  getByRole: async (ruolo: string, withWishlist: boolean = false): Promise<ApiResponse<Giocatore[]>> => {
    const response = await api.get(`/giocatori/${ruolo}?withWishlist=${withWishlist}`)
    return response.data
  },

  // Get giocatori in wishlist
  getInWishlist: async (): Promise<ApiResponse<Giocatore[]>> => {
    const response = await api.get('/giocatori/wishlist')
    return response.data
  },

  // Get specific giocatore
  getById: async (id: string): Promise<ApiResponse<Giocatore>> => {
    const response = await api.get(`/giocatori/${id}`)
    return response.data
  },

  // Update giocatore notes
  updateNotes: async (id: string, note: string): Promise<ApiResponse<Giocatore>> => {
    const response = await api.patch(`/giocatori/${id}/note`, { note })
    return response.data
  },

  // Update giocatore fantasquadra
  updateFantasquadra: async (id: string, fantasquadra: string): Promise<ApiResponse<Giocatore>> => {
    const response = await api.patch(`/giocatori/${id}/fantasquadra`, { fantasquadra })
    return response.data
  },

  // Update giocatore valutazione
  updateValutazione: async (id: string, valutazione: number | null): Promise<ApiResponse<Giocatore>> => {
    const response = await api.patch(`/giocatori/${id}/valutazione`, { valutazione })
    return response.data
  },
}

// Squadre API
export const squadreAPI = {
  // Get all squadre
  getAll: async (): Promise<ApiResponse<Squadra[]>> => {
    const response = await api.get('/squadre')
    return response.data
  },

  // Get specific squadra
  getById: async (id: number): Promise<ApiResponse<Squadra>> => {
    const response = await api.get(`/squadre/${id}`)
    return response.data
  },

  // Create new squadra
  create: async (squadra: { nome: string; proprietario: string; budget?: number }): Promise<ApiResponse<Squadra>> => {
    const response = await api.post('/squadre', squadra)
    return response.data
  },

  // Update squadra
  update: async (id: number, squadra: Partial<Squadra>): Promise<ApiResponse<Squadra>> => {
    const response = await api.put(`/squadre/${id}`, squadra)
    return response.data
  },

  // Delete squadra
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/squadre/${id}`)
    return response.data
  },

  // Get squadra acquisti
  getAcquisti: async (id: number): Promise<ApiResponse<Acquisto[]>> => {
    const response = await api.get(`/squadre/${id}/acquisti`)
    return response.data
  },
}

// Wishlist API
export const wishlistAPI = {
  // Add to wishlist
  add: async (giocatoreId: string, squadraId?: number): Promise<ApiResponse<WishlistItem>> => {
    const response = await api.post('/squadre/wishlist', { giocatoreId, squadraId })
    return response.data
  },

  // Get wishlist
  getAll: async (): Promise<ApiResponse<WishlistItem[]>> => {
    const response = await api.get('/squadre/wishlist')
    return response.data
  },

  // Remove from wishlist
  remove: async (giocatoreId: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/squadre/wishlist/${giocatoreId}`)
    return response.data
  },
}

// Acquisti API
export const acquistiAPI = {
  // Acquire giocatore
  acquire: async (squadraId: number, giocatoreId: string, prezzo: number): Promise<ApiResponse<Acquisto>> => {
    const response = await api.post(`/squadre/${squadraId}/acquista`, { giocatoreId, prezzo })
    return response.data
  },
}

export default api
