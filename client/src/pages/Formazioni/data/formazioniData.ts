// Import all formation images
import AtalantaLabImg from "../../../assets/formazioni/Atalanta_lab.jpeg";
import AtalantaPazImg from "../../../assets/formazioni/Atalanta_paz.jpeg";
import BolognaLabImg from "../../../assets/formazioni/Bologna_lab.jpeg";
import BolognaPazImg from "../../../assets/formazioni/Bologna_paz.jpeg";
import CagliariLabImg from "../../../assets/formazioni/Cagliari_lab.jpeg";
import CagliariPazImg from "../../../assets/formazioni/Cagliari_paz.jpeg";
import ComoLabImg from "../../../assets/formazioni/Como_lab.jpeg";
import ComoPazImg from "../../../assets/formazioni/Como_paz.jpeg";
import CremoneseLabImg from "../../../assets/formazioni/Cremonese_lab.jpeg";
import CremonesePazImg from "../../../assets/formazioni/Cremonese_paz.jpeg";
import FiorentinaLabImg from "../../../assets/formazioni/Fiorentina_lab.jpeg";
import FiorentinaPazImg from "../../../assets/formazioni/Fiorentina_paz.jpeg";
import GenoaLabImg from "../../../assets/formazioni/Genoa_lab.jpeg";
import GenoaPazImg from "../../../assets/formazioni/Genoa_paz.jpeg";
import InterLabImg from "../../../assets/formazioni/Inter_lab.jpeg";
import InterPazImg from "../../../assets/formazioni/inter_paz.jpeg";
import JuventusLabImg from "../../../assets/formazioni/Juventus_lab.jpeg";
import JuventusPazImg from "../../../assets/formazioni/Juve_paz.jpeg";
import LazioLabImg from "../../../assets/formazioni/Lazio_lab.jpeg";
import LazioPazImg from "../../../assets/formazioni/Lazio_paz.jpeg";
import LecceLabImg from "../../../assets/formazioni/Lecce_lab.jpeg";
import LeccePazImg from "../../../assets/formazioni/lecce_paz.jpeg";
import MilanPazImg from "../../../assets/formazioni/Milan_paz.jpeg";
import NapoliLabImg from "../../../assets/formazioni/Napoli_lab.jpeg";
import NapoliPazImg from "../../../assets/formazioni/Napoli_paz.jpeg";
import ParmaLabImg from "../../../assets/formazioni/Parma_lab.jpeg";
import ParmaPazImg from "../../../assets/formazioni/Parma_paz.jpeg";
import PisaLabImg from "../../../assets/formazioni/Pisa_lab.jpeg";
import PisaPazImg from "../../../assets/formazioni/Pisa_paz.jpeg";
import RomaLabImg from "../../../assets/formazioni/Roma_lab.jpeg";
import RomaPazImg from "../../../assets/formazioni/Roma_paz.jpeg";
import SassuoloLabImg from "../../../assets/formazioni/Sassuolo_lab.jpeg";
import SassuoloPazImg from "../../../assets/formazioni/Sassuolo_paz.jpeg";
import TorinoLabImg from "../../../assets/formazioni/Torino_lab.jpeg";
import TorinoPazImg from "../../../assets/formazioni/Torino_paz.jpeg";
import UdinesePazImg from "../../../assets/formazioni/Udinese_paz.jpeg";
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
      AtalantaLabImg,
      AtalantaPazImg
    ]
  },
  {
    squadra: "Bologna",
    images: [
      BolognaLabImg,
      BolognaPazImg
    ]
  },
  {
    squadra: "Cagliari",
    images: [
      CagliariLabImg,
      CagliariPazImg
    ]
  },
  {
    squadra: "Como",
    images: [
      ComoLabImg,
      ComoPazImg
    ]
  },
  {
    squadra: "Cremonese",
    images: [
      CremoneseLabImg,
      CremonesePazImg
    ]
  },
  {
    squadra: "Fiorentina",
    images: [
      FiorentinaLabImg,
      FiorentinaPazImg
    ]
  },
  {
    squadra: "Genoa",
    images: [
      GenoaLabImg,
      GenoaPazImg
    ]
  },
  {
    squadra: "Inter",
    images: [
      InterLabImg,
      InterPazImg
    ]
  },
  {
    squadra: "Juventus",
    images: [
      JuventusLabImg,
      JuventusPazImg
    ]
  },
  {
    squadra: "Lazio",
    images: [
      LazioLabImg,
      LazioPazImg
    ]
  },
  {
    squadra: "Lecce",
    images: [
      LecceLabImg,
      LeccePazImg
    ]
  },
  {
    squadra: "Milan",
    images: [
      MilanPazImg
    ]
  },
  {
    squadra: "Napoli",
    images: [
      NapoliLabImg,
      NapoliPazImg
    ]
  },
  {
    squadra: "Parma",
    images: [
      ParmaLabImg,
      ParmaPazImg
    ]
  },
  {
    squadra: "Pisa",
    images: [
      PisaLabImg,
      PisaPazImg
    ]
  },
  {
    squadra: "Roma",
    images: [
      RomaLabImg,
      RomaPazImg
    ]
  },
  {
    squadra: "Sassuolo",
    images: [
      SassuoloPazImg,
      SassuoloLabImg
    ]
  },
  {
    squadra: "Torino",
    images: [
      TorinoLabImg,
      TorinoPazImg
    ]
  },
  {
    squadra: "Udinese",
    images: [
      UdinesePazImg
    ]
  },
  {
    squadra: "Verona",
    images: [
      VeronaLabImg,
      VeronaPazImg
    ]
  }
];

export default formazioniData;
