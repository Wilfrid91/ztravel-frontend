export const MENU_ITEMS = [
  {
    id: 'avant le départ',
    title: 'Checklist avant le départ',
    cards: [
      {
        title: 'Débuter',
        icon: '📶',
        color: '#4CAF50',
        content: [
          'VPN & connexion Internet - Installer et tester un VPN',
          'Communiquer sans Internet',
        ],
        link: '/login',
      },
      {
        title: 'Payer',
        icon: '💳',
        color: '#2196F3',
        content: [
          'Les applications indispensables pour payer',
          'Informer sa banque de son séjour en Chine',
          'Argent liquide',
        ],
        link: '/login',
      },
      {
        title: 'Smartphone',
        icon: '📱',
        color: '#F44336',
        content: ['Smartphone et batterie de téléphone'],
        link: '/login',
      },
      {
        title: 'Communiquer',
        icon: '💬',
        color: '#009688',
        content: ['Apps indispensable'],
        link: '/login',
      },
      {
        title: 'Hotel & Trains',
        icon: '🏨',
        color: '#2196F3',
        content: ['Resvervation'],
        link: '/login',
      },
      {
        title: 'Formalités douanières',
        icon: '📋',
        color: '#4CAF50',
        content: ['Préparer passeport et visa', 'Préparer le motif du séjour'],
        link: '/login',
      },
      {
        title: 'Smartphone',
        icon: '📱',
        color: '#9C27B0',
        content: [
          "Il est préférable d'avoir 2 téléphones sur soi : un pour le VPN, un pour les applis locales.",
        ],
        link: '/login',
      },
    ],
  },
  {
    id: 'avion',
    title: 'Douane & formalités',
    cards: [
      {
        title: 'Formalités',
        icon: '🛂',
        color: '#FF9800',
        content: ['Remplir la fiche d’arrivée distribuée dans l’avion'],
        link: '/login',
      },
      {
        title: 'Taxi(Uber) DiDi',
        icon: '🚕',
        color: '#009688',
        content: [
          "Installer l'application DiDi",
          'Trouver la zone de prise en charge DiDi',
          'Commander un taxi',
        ],
        link: '/login',
      },
      {
        title: 'Se deplacer en train',
        icon: '🚉',
        color: '#009688',
        content: [
          'Acheter un billet de train',
          "S'orienter à la gare de train",
        ],
        link: '/login',
      },
    ],
  },
  {
    id: 'Produits',
    title: 'Fournisseurs & Transitaires',
    subtitle:
      'Nous pouvons vous accompagner pour vos achats, vous mettre en contact avec les forunisseurs, accompagner pour le transport jusque dans votre pays.',
    cards: [
      {
        title: 'Materiaux de constructions',
        icon: '🛂',
        color: '#FF9800',
        content: [
          'Menuiseries Portes & Fenêtres',
          'Sanitaires',
          'Eviers',
          'Clims & Electroménagers',
          'Meubles de salons & salle à manger',
        ],
        link: '/login',
      },
      {
        title: 'Machines de construction & Agricoles',
        icon: '🚜',
        color: '#009688',
        content: [
          'Achat de bétonnières',
          'Achat de machines pour férailleurs',
          'Achat de machines agricoles',
        ],
        link: '/login',
      },
      {
        title: 'Véhicules',
        icon: '🚗',
        color: '#009688',
        content: [
          'Achat de vehicules neufs',
          "Achat de vehicules d'occasions",
          'Achat de machines agricoles',
        ],
        link: '/login',
      },
      {
        title: 'Transitaires',
        icon: '🚚',
        color: '#e3f0ee',
        content: [
          'Vehicules neufs',
          "Vehicules d'occasions",
          'Machines agricoles',
        ],
        link: '/login',
      },
    ],
  },
  {
    id: 'Simulateur',
    title: 'Simulateurs des droits de douane',
    subtitle:
      "Nous vous fournissons un outil pour générer la liste des produits et simuler l'attestation de verification documentaire(AVD) afin d'évaluer si votre décision d'achéter à l'étranger est rentable.",
    cards: [
      {
        title: 'Simulateur de douane pour véhicules et marchandises',
        icon: '📊',
        color: '#FF9800',
        content: ['Simulateurs des droits de douane'],
        link: '/login',
      },
    ],
  },
]
