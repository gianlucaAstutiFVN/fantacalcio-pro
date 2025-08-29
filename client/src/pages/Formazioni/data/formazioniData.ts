// Import all formation images
import AtalantaFantaImg from "../../../assets/formazioni/Atalanta_fanta.jpeg";
import AtalantaLabImg from "../../../assets/formazioni/Atalanta_lab.jpeg";
import AtalantaPazImg from "../../../assets/formazioni/Atalanta_paz.jpeg";
import BolognaFantaImg from "../../../assets/formazioni/Bologna_fanta.jpeg";
import BolognaLabImg from "../../../assets/formazioni/Bologna_lab.jpeg";
import BolognaPazImg from "../../../assets/formazioni/Bologna_paz.jpeg";
import CagliariFantaImg from "../../../assets/formazioni/Cagliari_fanta.jpeg";
import CagliariLabImg from "../../../assets/formazioni/Cagliari_lab.jpeg";
import CagliariPazImg from "../../../assets/formazioni/Cagliari_paz.jpeg";
import ComoFantaImg from "../../../assets/formazioni/Como_fanta.jpeg";
import ComoLabImg from "../../../assets/formazioni/Como_lab.jpeg";
import ComoPazImg from "../../../assets/formazioni/Como_paz.jpeg";
import CremoneseFantaImg from "../../../assets/formazioni/Cremonese_fanta.jpeg";
import CremoneseLabImg from "../../../assets/formazioni/Cremonese_lab.jpeg";
import CremonesePazImg from "../../../assets/formazioni/Cremonese_paz.jpeg";
import FiorentinaFantaImg from "../../../assets/formazioni/Fiorentina_fanta.jpeg";
import FiorentinaLabImg from "../../../assets/formazioni/Fiorentina_lab.jpeg";
import FiorentinaPazImg from "../../../assets/formazioni/Fiorentina_paz.jpeg";
import GenoaFantaImg from "../../../assets/formazioni/Genoa_fanta.jpeg";
import GenoaLabImg from "../../../assets/formazioni/Genoa_lab.jpeg";
import GenoaPazImg from "../../../assets/formazioni/Genoa_paz.jpeg";
import InterFantaImg from "../../../assets/formazioni/Inter_fanta.jpeg";
import InterLabImg from "../../../assets/formazioni/Inter_lab.jpeg";
import InterPazImg from "../../../assets/formazioni/inter_paz.jpeg";
import JuventusLabImg from "../../../assets/formazioni/Juventus_lab.jpeg";
import JuventusFantaImg from "../../../assets/formazioni/Juve_fanta.jpeg";
import JuventusPazImg from "../../../assets/formazioni/Juve_paz.jpeg";
import LazioFantaImg from "../../../assets/formazioni/Lazio_fanta.jpeg";
import LazioLabImg from "../../../assets/formazioni/Lazio_lab.jpeg";
import LazioPazImg from "../../../assets/formazioni/Lazio_paz.jpeg";
import LecceFantaImg from "../../../assets/formazioni/Lecce_fanta.jpeg";
import LecceLabImg from "../../../assets/formazioni/Lecce_lab.jpeg";
import LeccePazImg from "../../../assets/formazioni/lecce_paz.jpeg";
import MilanFantaImg from "../../../assets/formazioni/Milan_fanta.jpeg";
import MilanPazImg from "../../../assets/formazioni/Milan_paz.jpeg";
import NapoliFantaImg from "../../../assets/formazioni/Napoli_fanta.jpeg";
import NapoliLabImg from "../../../assets/formazioni/Napoli_lab.jpeg";
import NapoliPazImg from "../../../assets/formazioni/Napoli_paz.jpeg";
import ParmaFantaImg from "../../../assets/formazioni/Parma_fanta.jpeg";
import ParmaLabImg from "../../../assets/formazioni/Parma_lab.jpeg";
import ParmaPazImg from "../../../assets/formazioni/Parma_paz.jpeg";
import PisaFantaImg from "../../../assets/formazioni/Pisa_fanta.jpeg";
import PisaLabImg from "../../../assets/formazioni/Pisa_lab.jpeg";
import PisaPazImg from "../../../assets/formazioni/Pisa_paz.jpeg";
import RomaFantaImg from "../../../assets/formazioni/Roma_fanta.jpeg";
import RomaLabImg from "../../../assets/formazioni/Roma_lab.jpeg";
import RomaPazImg from "../../../assets/formazioni/Roma_paz.jpeg";
import SassuoloFantaImg from "../../../assets/formazioni/Sassuolo_fanta.jpeg";
import SassuoloLabImg from "../../../assets/formazioni/Sassuolo_lab.jpeg";
import SassuoloPazImg from "../../../assets/formazioni/Sassuolo_paz.jpeg";
import TorinoFantaImg from "../../../assets/formazioni/Torino_fanta.jpeg";
import TorinoLabImg from "../../../assets/formazioni/Torino_lab.jpeg";
import TorinoPazImg from "../../../assets/formazioni/Torino_paz.jpeg";
import UdineseFantaImg from "../../../assets/formazioni/Udinese_fanta.jpeg";
import UdinesePazImg from "../../../assets/formazioni/Udinese_paz.jpeg";
import VeronaFantaImg from "../../../assets/formazioni/Verona_fanta.jpeg";
import VeronaLabImg from "../../../assets/formazioni/Verona_lab.jpeg";
import VeronaPazImg from "../../../assets/formazioni/Verona_paz.jpeg";

export interface FormazioneData {
  squadra: string;
  images: string[];
}

export const formazioniData: FormazioneData[] = [
  {
    squadra: "Atalanta",
    images: [
      AtalantaFantaImg,
      AtalantaLabImg,
      AtalantaPazImg
    ]
  },
  {
    squadra: "Bologna",
    images: [
      BolognaFantaImg,
      BolognaLabImg,
      BolognaPazImg
    ]
  },
  {
    squadra: "Cagliari",
    images: [
      CagliariFantaImg,
      CagliariLabImg,
      CagliariPazImg
    ]
  },
  {
    squadra: "Como",
    images: [
      ComoFantaImg,
      ComoLabImg,
      ComoPazImg
    ]
  },
  {
    squadra: "Cremonese",
    images: [
      CremoneseFantaImg,
      CremoneseLabImg,
      CremonesePazImg
    ]
  },
  {
    squadra: "Fiorentina",
    images: [
      FiorentinaFantaImg,
      FiorentinaLabImg,
      FiorentinaPazImg
    ]
  },
  {
    squadra: "Genoa",
    images: [
      GenoaFantaImg,
      GenoaLabImg,
      GenoaPazImg
    ]
  },
  {
    squadra: "Inter",
    images: [
      InterFantaImg,
      InterLabImg,
      InterPazImg
    ]
  },
  {
    squadra: "Juventus",
    images: [
      JuventusFantaImg,
      JuventusLabImg,
      JuventusPazImg
    ]
  },
  {
    squadra: "Lazio",
    images: [
      LazioFantaImg,
      LazioLabImg,
      LazioPazImg
    ]
  },
  {
    squadra: "Lecce",
    images: [
      LecceFantaImg,
      LecceLabImg,
      LeccePazImg
    ]
  },
  {
    squadra: "Milan",
    images: [
      MilanFantaImg,
      MilanPazImg
    ]
  },
  {
    squadra: "Napoli",
    images: [
      NapoliFantaImg,
      NapoliLabImg,
      NapoliPazImg
    ]
  },
  {
    squadra: "Parma",
    images: [
      ParmaFantaImg,
      ParmaLabImg,
      ParmaPazImg
    ]
  },
  {
    squadra: "Pisa",
    images: [
      PisaFantaImg,
      PisaLabImg,
      PisaPazImg
    ]
  },
  {
    squadra: "Roma",
    images: [
      RomaFantaImg,
      RomaLabImg,
      RomaPazImg
    ]
  },
  {
    squadra: "Sassuolo",
    images: [
      SassuoloFantaImg,
      SassuoloLabImg,
      SassuoloPazImg
    ]
  },
  {
    squadra: "Torino",
    images: [
      TorinoFantaImg,
      TorinoLabImg,
      TorinoPazImg
    ]
  },
  {
    squadra: "Udinese",
    images: [
      UdineseFantaImg,
      UdinesePazImg
    ]
  },
  {
    squadra: "Verona",
    images: [
      VeronaFantaImg,
      VeronaLabImg,
      VeronaPazImg
    ]
  }
];

export default formazioniData;
