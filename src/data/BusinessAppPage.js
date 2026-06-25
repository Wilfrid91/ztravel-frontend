import {
  MdTravelExplore,
  MdFlightTakeoff,
  MdGavel,
  MdStorefront,
  MdSupportAgent,
  MdCalculate,
  MdPayments,
  MdReceiptLong,
  MdToken,
  MdDownload,
} from 'react-icons/md'

export const MENU_ITEMS_DDAY = [
  {
    id: 'TAB1',
    title: 'Voyager seul en Chine : Tout ce qu’il faut savoir',
    short: 'Voyager seul',
    icon: MdTravelExplore,
  },
  {
    id: 'TAB2',
    title: 'Départ pour la Chine : Guide minute‑par‑minute',
    short: 'Jour du départ',
    icon: MdFlightTakeoff,
  },
  {
    id: 'TAB3',
    title: 'Dédouanement au Bénin : Tout comprendre avant d’acheter en Chine',
    short: 'Douane & AVD',
    icon: MdGavel,
  },
  {
    id: 'TAB4',
    title: 'Produits Chine 2026 : Sélection de fournisseurs fiables',
    short: 'Fournisseurs',
    icon: MdStorefront,
  },
  {
    id: 'TAB5',
    title: 'Demander un accompagnement pour vos achats en Chine',
    short: 'Me contacter',
    icon: MdSupportAgent,
  },
  {
    id: 'TAB6',
    title: 'Estimer vos frais avant d’acheter en Chine',
    short: "Conditions d'utilisation",
    icon: MdCalculate,
  },
  {
    id: 'TAB7',
    title: 'Espace Paiements & Jetons',
    short: 'Mon espace paiement',
    icon: MdPayments,
    children: [
      { id: 'TAB7-TRANSACTIONS', title: 'Transactions', icon: MdReceiptLong },
      { id: 'TAB7-JETONS', title: 'Jetons', icon: MdToken },
      { id: 'TAB7-METHODES', title: 'Télécharger mes reçus', icon: MdDownload },
    ],
  },
  {
    id: 'TAB8',
    title: 'Accéder au simulateur|^/avd-simulator',
    short: 'Simulateur (lien)',
    icon: MdCalculate,
  },
]
