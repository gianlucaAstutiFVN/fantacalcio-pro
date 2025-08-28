export interface Squadra {
  id: string;
  nome: string;
  citta: string;
  logo: string;
  colori: string[];
}

export const squadreSerieA: Squadra[] = [
  {
    id: 'atalanta',
    nome: 'Atalanta',
    citta: 'Bergamo',
    logo: 'https://upload.wikimedia.org/wikipedia/it/thumb/8/81/Logo_Atalanta_Bergamo.svg/800px-Logo_Atalanta_Bergamo.svg.png',
    colori: ['#1e3a8a', '#ffffff']
  },
  {
    id: 'bologna',
    nome: 'Bologna',
    citta: 'Bologna',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Bologna_F.C._1909_logo.svg/163px-Bologna_F.C._1909_logo.svg.png?20230805170802',
    colori: ['#dc2626', '#1e40af']
  },
  {
    id: 'cagliari',
    nome: 'Cagliari',
    citta: 'Cagliari',
    logo: 'https://upload.wikimedia.org/wikipedia/it/thumb/8/88/Cagliari_calcio.svg/250px-Cagliari_calcio.svg.png',
    colori: ['#dc2626', '#1e40af']
  },
  {
    id: 'cremonese',
    nome: 'Cremonese',
    citta: 'Cremona',
    logo: 'https://upload.wikimedia.org/wikipedia/it/thumb/2/23/Unione_Sportiva_Cremonese_logo.svg/250px-Unione_Sportiva_Cremonese_logo.svg.png',
    colori: ['#dc2626', '#1e40af']
  },
  {
    id: 'fiorentina',
    nome: 'Fiorentina',
    citta: 'Firenze',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/ACF_Fiorentina_-_logo_%28Italy%2C_2022%29.svg/140px-ACF_Fiorentina_-_logo_%28Italy%2C_2022%29.svg.png',
    colori: ['#7c3aed', '#ffffff']
  },
  {
    id: 'genoa',
    nome: 'Genoa',
    citta: 'Genova',
    logo: 'https://upload.wikimedia.org/wikipedia/it/thumb/9/99/Genoa_Cricket_and_Football_Club_logo.svg/140px-Genoa_Cricket_and_Football_Club_logo.svg.png',
    colori: ['#dc2626', '#1e40af']
  },
  {
    id: 'inter',
    nome: 'Inter',
    citta: 'Milano',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg',
    colori: ['#000000', '#1e40af']
  },
  {
    id: 'juventus',
    nome: 'Juventus',
    citta: 'Torino',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Juventus_FC_-_logo_black_%28Italy%2C_2020%29.svg/140px-Juventus_FC_-_logo_black_%28Italy%2C_2020%29.svg.png',
    colori: ['#000000', '#ffffff']
  },
  {
    id: 'lazio',
    nome: 'Lazio',
    citta: 'Roma',
    logo: 'https://upload.wikimedia.org/wikipedia/it/thumb/6/62/Stemma_della_Societ%C3%A0_Sportiva_Lazio.svg/250px-Stemma_della_Societ%C3%A0_Sportiva_Lazio.svg.png',
    colori: ['#1e40af', '#ffffff']
  },
  {
    id: 'lecce',
    nome: 'Lecce',
    citta: 'Lecce',
    logo: 'https://upload.wikimedia.org/wikipedia/it/thumb/3/36/US_Lecce_Stemma.svg/250px-US_Lecce_Stemma.svg.png',
    colori: ['#dc2626', '#1e40af']
  },
  {
    id: 'milan',
    nome: 'Milan',
    citta: 'Milano',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Logo_of_AC_Milan.svg/330px-Logo_of_AC_Milan.svg.png',
    
    colori: ['#dc2626', '#000000']
  },
  {
    id: 'monza',
    nome: 'Monza',
    citta: 'Monza',
    logo: 'https://upload.wikimedia.org/wikipedia/it/thumb/6/65/Associazione_Calcio_Monza_%282019%29.svg/250px-Associazione_Calcio_Monza_%282019%29.svg.png',
    colori: ['#dc2626', '#ffffff']
  },
  {
    id: 'napoli',
    nome: 'Napoli',
    citta: 'Napoli',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/SSC_Napoli_2024_%28deep_blue_navy%29.svg/250px-SSC_Napoli_2024_%28deep_blue_navy%29.svg.png',
    colori: ['#1e40af', '#ffffff']
  },
  {
    id: 'pisa',
    nome: 'Pisa',
    citta: 'Pisa',
    logo: 'https://upload.wikimedia.org/wikipedia/it/thumb/d/d7/Logo_Pisa_SC_2017.svg/250px-Logo_Pisa_SC_2017.svg.png',
    colori: ['#1e40af', '#ffffff']
  },
  {
    id: 'roma',
    nome: 'Roma',
    citta: 'Roma',
    logo: 'https://upload.wikimedia.org/wikipedia/it/thumb/0/0e/AS_Roma_Logo_2017.svg/250px-AS_Roma_Logo_2017.svg.png',
    colori: ['#dc2626', '#1e40af']
  },
  {
    id: 'salernitana',
    nome: 'Salernitana',
    citta: 'Salerno',
    logo: 'https://upload.wikimedia.org/wikipedia/it/thumb/6/6a/US_Salernitana_1919.svg/250px-US_Salernitana_1919.svg.png',
    colori: ['#dc2626', '#1e40af']
  },
  {
    id: 'sassuolo',
    nome: 'Sassuolo',
    citta: 'Sassuolo',
    logo: 'https://upload.wikimedia.org/wikipedia/it/thumb/a/a4/Ussassuolostemma.svg/250px-Ussassuolostemma.svg.png',
    colori: ['#059669', '#000000']
  },
  {
    id: 'torino',
    nome: 'Torino',
    citta: 'Torino',
    logo: 'https://upload.wikimedia.org/wikipedia/it/thumb/0/04/Torino_FC_logo.svg/250px-Torino_FC_logo.svg.png',
    colori: ['#dc2626', '#ffffff']
  },
  {
    id: 'udinese',
    nome: 'Udinese',
    citta: 'Udine',
    logo: 'https://upload.wikimedia.org/wikipedia/it/thumb/a/ae/Logo_Udinese_Calcio_2010.svg/250px-Logo_Udinese_Calcio_2010.svg.png',
    colori: ['#000000', '#ffffff']
  },
  {
    id: 'verona',
    nome: 'Verona',
    citta: 'Verona',
    logo: 'https://upload.wikimedia.org/wikipedia/it/thumb/9/92/Hellas_Verona_FC_logo_%282020%29.svg/250px-Hellas_Verona_FC_logo_%282020%29.svg.png',
    colori: ['#dc2626', '#1e40af']
  }
];
