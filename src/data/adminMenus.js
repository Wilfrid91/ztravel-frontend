import { FaUsers, FaExchangeAlt, FaUndo, FaEye } from 'react-icons/fa'

export const adminMenus = [
  {
    id: 'users',
    label: 'Utilisateurs',
    short: 'Utilisateurs',
    icon: FaUsers,
    children: [
      { id: 'user-accounts', label: 'Comptes utilisateurs', short: 'Comptes' },
      {
        id: 'user-account',
        label: 'Rechercher un utilisateur',
        short: 'Rechercher',
      },
      { id: 'user-cgu', label: 'CGU', short: 'CGU' },
    ],
  },
  {
    id: 'transactions',
    label: 'Transactions',
    short: 'Transactions',
    icon: FaExchangeAlt,
    children: [
      { id: 'payments', label: 'Paiement', short: 'Paiement' },
      { id: 'refund-all', label: 'Remboursement', short: 'Remboursement' },
    ],
  },
  {
    id: 'refund',
    label: 'Rembourser',
    short: 'Rembourser',
    icon: FaUndo,
    children: [
      { id: 'refund-mtn', label: 'MTN momo', short: 'MTN momo' },
      { id: 'refund-fedapay', label: 'FedaPay', short: 'FedaPay' },
    ],
  },
  {
    id: 'visitors',
    label: 'Visiteurs',
    short: 'Visiteurs',
    icon: FaEye,
    children: [
      {
        id: 'visit-tracker',
        label: 'Anylitique utilisateurs',
        short: 'Analytics',
      },
    ],
  },
]
