import { MdPeople, MdPerson, MdOutlinePayment, MdReplay } from 'react-icons/md'

export const ADM_DASHBOARD = {
  adminMenus: [
    {
      id: 'account',
      label: 'Account',
      icon: MdPeople, // icône du menu parent
      children: [
        {
          id: 'user-accounts',
          label: 'User accounts',
          endpoint: `${process.env.REACT_APP_BASE_URL}/api/v1/auth/admin/users`,
          route: 'user-accounts',
          icon: MdPeople, // icône du sous-menu
        },
        {
          id: 'user-account',
          label: 'User account',
          route: 'user-account', // ROUTE POUR REACT ROUTER
          icon: MdPerson,
        },
        {
          id: 'user-account',
          label: 'CGU',
          route: 'user-cgu', // ROUTE POUR REACT ROUTER
          icon: MdPerson,
        },
      ],
    },

    {
      id: 'transactions',
      label: 'Transactions',
      icon: MdOutlinePayment,
      children: [
        {
          id: 'payments',
          label: 'Paiement',
          endpoint: `${process.env.REACT_APP_BASE_URL}/api/v1/auth/admin/transactions`,
          route: 'user-data',
          icon: MdOutlinePayment,
        },
        {
          id: 'payments',
          label: 'Remboursement',
          endpoint: `${process.env.REACT_APP_BASE_URL}/api/v1/auth/admin/refund`,
          route: 'refund-all',
          icon: MdOutlinePayment,
        },
      ],
    },
    {
      id: 'Remboursement',
      label: 'Rembourser',
      icon: MdReplay,
      children: [
        {
          id: 'Remboursement',
          label: 'MTN momo',
          route: 'refund-mtn', // ROUTE POUR REACT ROUTER
          icon: MdReplay,
        },
        {
          id: 'Remboursement',
          label: 'Fedapay',
          route: 'refund-fedapay', // ROUTE POUR REACT ROUTER
          icon: MdReplay,
        },
      ],
    },
  ],
}
