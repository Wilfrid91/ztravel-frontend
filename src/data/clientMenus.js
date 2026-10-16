import {
  FaSearchLocation,
  FaPlaneDeparture,
  FaStamp,
  FaStore,
  FaHandsHelping,
  FaCalculator,
  FaWallet,
  FaMoneyCheckAlt,
  FaCoins,
  FaDownload,
} from 'react-icons/fa'

export const clientMenus = [
  {
    id: 'TAB1',
    title: 'Voyager seul en Chine',
    short: 'Voyager seul',
    icon: FaSearchLocation,
  },
  {
    id: 'TAB2',
    title: 'Départ pour la Chine',
    short: 'Jour du départ',
    icon: FaPlaneDeparture,
  },
  {
    id: 'TAB3',
    title: 'Dédouanement au Bénin',
    short: 'Douane & AVD',
    icon: FaStamp,
  },
  {
    id: 'TAB4',
    title: 'Produits Chine 2026',
    short: 'Fournisseurs',
    icon: FaStore,
  },
  {
    id: 'TAB5',
    title: 'Demander un accompagnement',
    short: 'Me contacter',
    icon: FaHandsHelping,
  },
  {
    id: 'TAB6',
    title: 'Estimer vos frais',
    short: 'Simulateur',
    icon: FaCalculator,
  },
  {
    id: 'TAB7',
    title: 'Espace Paiements & Jetons',
    short: 'Espace client',
    icon: FaWallet,
    children: [
      {
        id: 'TAB7-TRANSACTIONS',
        title: 'Mes operations',
        short: 'Transactions',
        icon: FaMoneyCheckAlt,
      },
      {
        id: 'TAB7-JETONS',
        title: "Mes jetons d'impressions",
        short: 'Jetons',
        icon: FaCoins,
      },
      {
        id: 'TAB7-RECUS',
        title: 'Télécharger mes reçus',
        short: 'Reçus de paiement',
        icon: FaDownload,
      },
    ],
  },
]
