export interface Giocatore {
  id: string;
  nome: string;
  ruolo: string;
  numero: number;
  eta: number;
  nazionalita: string;
}

export interface Statistiche {
  partiteGiocate: number;
  vittorie: number;
  pareggi: number;
  sconfitte: number;
  punti: number;
}

export interface FormazioneSquadra {
  formazione: Giocatore[];
  immagini: string[];
  statistiche: Statistiche;
}

export const formazioniSquadre: Record<string, FormazioneSquadra> = {
  'inter': {
    formazione: [
      { id: '1', nome: 'Yann Sommer', ruolo: 'Portiere', numero: 1, eta: 35, nazionalita: 'Svizzera' },
      { id: '2', nome: 'Benjamin Pavard', ruolo: 'Difensore', numero: 2, eta: 27, nazionalita: 'Francia' },
      { id: '3', nome: 'Stefan de Vrij', ruolo: 'Difensore', numero: 6, eta: 31, nazionalita: 'Paesi Bassi' },
      { id: '4', nome: 'Alessandro Bastoni', ruolo: 'Difensore', numero: 95, eta: 24, nazionalita: 'Italia' },
      { id: '5', nome: 'Federico Dimarco', ruolo: 'Difensore', numero: 32, eta: 26, nazionalita: 'Italia' },
      { id: '6', nome: 'Nicolò Barella', ruolo: 'Centrocampista', numero: 23, eta: 26, nazionalita: 'Italia' },
      { id: '7', nome: 'Hakan Çalhanoğlu', ruolo: 'Centrocampista', numero: 20, eta: 29, nazionalita: 'Turchia' },
      { id: '8', nome: 'Henrikh Mkhitaryan', ruolo: 'Centrocampista', numero: 22, eta: 34, nazionalita: 'Armenia' },
      { id: '9', nome: 'Marcus Thuram', ruolo: 'Attaccante', numero: 9, eta: 26, nazionalita: 'Francia' },
      { id: '10', nome: 'Lautaro Martínez', ruolo: 'Attaccante', numero: 10, eta: 26, nazionalita: 'Argentina' },
      { id: '11', nome: 'Denzel Dumfries', ruolo: 'Attaccante', numero: 2, eta: 27, nazionalita: 'Paesi Bassi' }
    ],
    immagini: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
    ],
    statistiche: {
      partiteGiocate: 15,
      vittorie: 12,
      pareggi: 2,
      sconfitte: 1,
      punti: 38
    }
  },
  'milan': {
    formazione: [
      { id: '1', nome: 'Mike Maignan', ruolo: 'Portiere', numero: 16, eta: 28, nazionalita: 'Francia' },
      { id: '2', nome: 'Davide Calabria', ruolo: 'Difensore', numero: 2, eta: 27, nazionalita: 'Italia' },
      { id: '3', nome: 'Fikayo Tomori', ruolo: 'Difensore', numero: 23, eta: 25, nazionalita: 'Inghilterra' },
      { id: '4', nome: 'Malick Thiaw', ruolo: 'Difensore', numero: 28, eta: 22, nazionalita: 'Germania' },
      { id: '5', nome: 'Theo Hernández', ruolo: 'Difensore', numero: 19, eta: 26, nazionalita: 'Francia' },
      { id: '6', nome: 'Tijjani Reijnders', ruolo: 'Centrocampista', numero: 14, eta: 25, nazionalita: 'Paesi Bassi' },
      { id: '7', nome: 'Ruben Loftus-Cheek', ruolo: 'Centrocampista', numero: 8, eta: 27, nazionalita: 'Inghilterra' },
      { id: '8', nome: 'Christian Pulisic', ruolo: 'Centrocampista', numero: 11, eta: 25, nazionalita: 'Stati Uniti' },
      { id: '9', nome: 'Rafael Leão', ruolo: 'Attaccante', numero: 10, eta: 24, nazionalita: 'Portogallo' },
      { id: '10', nome: 'Olivier Giroud', ruolo: 'Attaccante', numero: 9, eta: 37, nazionalita: 'Francia' },
      { id: '11', nome: 'Samuel Chukwueze', ruolo: 'Attaccante', numero: 21, eta: 24, nazionalita: 'Nigeria' }
    ],
    immagini: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
    ],
    statistiche: {
      partiteGiocate: 15,
      vittorie: 9,
      pareggi: 2,
      sconfitte: 4,
      punti: 29
    }
  },
  'juventus': {
    formazione: [
      { id: '1', nome: 'Wojciech Szczęsny', ruolo: 'Portiere', numero: 1, eta: 33, nazionalita: 'Polonia' },
      { id: '2', nome: 'Juan Cuadrado', ruolo: 'Difensore', numero: 11, eta: 35, nazionalita: 'Colombia' },
      { id: '3', nome: 'Gleison Bremer', ruolo: 'Difensore', numero: 3, eta: 26, nazionalita: 'Brasile' },
      { id: '4', nome: 'Daniele Rugani', ruolo: 'Difensore', numero: 24, eta: 29, nazionalita: 'Italia' },
      { id: '5', nome: 'Alex Sandro', ruolo: 'Difensore', numero: 12, eta: 32, nazionalita: 'Brasile' },
      { id: '6', nome: 'Manuel Locatelli', ruolo: 'Centrocampista', numero: 5, eta: 25, nazionalita: 'Italia' },
      { id: '7', nome: 'Adrien Rabiot', ruolo: 'Centrocampista', numero: 25, eta: 28, nazionalita: 'Francia' },
      { id: '8', nome: 'Weston McKennie', ruolo: 'Centrocampista', numero: 16, eta: 25, nazionalita: 'Stati Uniti' },
      { id: '9', nome: 'Federico Chiesa', ruolo: 'Attaccante', numero: 7, eta: 26, nazionalita: 'Italia' },
      { id: '10', nome: 'Dusan Vlahović', ruolo: 'Attaccante', numero: 9, eta: 23, nazionalita: 'Serbia' },
      { id: '11', nome: 'Moise Kean', ruolo: 'Attaccante', numero: 18, eta: 23, nazionalita: 'Italia' }
    ],
    immagini: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
    ],
    statistiche: {
      partiteGiocate: 15,
      vittorie: 11,
      pareggi: 3,
      sconfitte: 1,
      punti: 36
    }
  },
  'napoli': {
    formazione: [
      { id: '1', nome: 'Alex Meret', ruolo: 'Portiere', numero: 1, eta: 26, nazionalita: 'Italia' },
      { id: '2', nome: 'Giovanni Di Lorenzo', ruolo: 'Difensore', numero: 22, eta: 30, nazionalita: 'Italia' },
      { id: '3', nome: 'Amir Rrahmani', ruolo: 'Difensore', numero: 13, eta: 29, nazionalita: 'Kosovo' },
      { id: '4', nome: 'Juan Jesus', ruolo: 'Difensore', numero: 5, eta: 32, nazionalita: 'Brasile' },
      { id: '5', nome: 'Mathías Olivera', ruolo: 'Difensore', numero: 17, eta: 26, nazionalita: 'Uruguay' },
      { id: '6', nome: 'André-Frank Zambo Anguissa', ruolo: 'Centrocampista', numero: 99, eta: 27, nazionalita: 'Camerun' },
      { id: '7', nome: 'Stanislav Lobotka', ruolo: 'Centrocampista', numero: 68, eta: 29, nazionalita: 'Slovacchia' },
      { id: '8', nome: 'Piotr Zieliński', ruolo: 'Centrocampista', numero: 20, eta: 29, nazionalita: 'Polonia' },
      { id: '9', nome: 'Matteo Politano', ruolo: 'Attaccante', numero: 21, eta: 30, nazionalita: 'Italia' },
      { id: '10', nome: 'Victor Osimhen', ruolo: 'Attaccante', numero: 9, eta: 24, nazionalita: 'Nigeria' },
      { id: '11', nome: 'Khvicha Kvaratskhelia', ruolo: 'Attaccante', numero: 77, eta: 22, nazionalita: 'Georgia' }
    ],
    immagini: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
    ],
    statistiche: {
      partiteGiocate: 15,
      vittorie: 7,
      pareggi: 3,
      sconfitte: 5,
      punti: 24
    }
  }
};

// Aggiungi formazioni per le altre squadre (semplificate)
const altreSquadre = [
  'atalanta', 'bologna', 'cagliari', 'empoli', 'fiorentina', 'frosinone', 
  'genoa', 'lazio', 'lecce', 'monza', 'roma', 'salernitana', 
  'sassuolo', 'torino', 'udinese', 'verona'
];

altreSquadre.forEach(squadraId => {
  formazioniSquadre[squadraId] = {
    formazione: [
      { id: '1', nome: 'Portiere', ruolo: 'Portiere', numero: 1, eta: 25, nazionalita: 'Italia' },
      { id: '2', nome: 'Difensore 1', ruolo: 'Difensore', numero: 2, eta: 26, nazionalita: 'Italia' },
      { id: '3', nome: 'Difensore 2', ruolo: 'Difensore', numero: 3, eta: 27, nazionalita: 'Italia' },
      { id: '4', nome: 'Difensore 3', ruolo: 'Difensore', numero: 4, eta: 28, nazionalita: 'Italia' },
      { id: '5', nome: 'Difensore 4', ruolo: 'Difensore', numero: 5, eta: 29, nazionalita: 'Italia' },
      { id: '6', nome: 'Centrocampista 1', ruolo: 'Centrocampista', numero: 6, eta: 24, nazionalita: 'Italia' },
      { id: '7', nome: 'Centrocampista 2', ruolo: 'Centrocampista', numero: 7, eta: 25, nazionalita: 'Italia' },
      { id: '8', nome: 'Centrocampista 3', ruolo: 'Centrocampista', numero: 8, eta: 26, nazionalita: 'Italia' },
      { id: '9', nome: 'Attaccante 1', ruolo: 'Attaccante', numero: 9, eta: 23, nazionalita: 'Italia' },
      { id: '10', nome: 'Attaccante 2', ruolo: 'Attaccante', numero: 10, eta: 24, nazionalita: 'Italia' },
      { id: '11', nome: 'Attaccante 3', ruolo: 'Attaccante', numero: 11, eta: 25, nazionalita: 'Italia' }
    ],
    immagini: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
    ],
    statistiche: {
      partiteGiocate: 15,
      vittorie: 5,
      pareggi: 5,
      sconfitte: 5,
      punti: 20
    }
  };
});
