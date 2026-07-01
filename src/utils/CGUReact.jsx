export default function CGUReact({
  accepted,
  setAccepted,
  onSubmit,
  onSkipSubmit,
}) {
  return (
    <div
      style={{
        padding: '16px',
        borderRadius: '8px',
        background: '#F5F7FF',
        border: '1px solid #DDE3FF',
        marginBottom: '16px',
        fontSize: '16px',
        lineHeight: '1.6',
      }}
    >
      <h1 style={{ textAlign: 'left', marginBottom: 18 }}>
        1. Mentions légales – Simulateur Douanier Ztravel Consulting
      </h1>
      <h2 style={{ textAlign: 'left', marginBottom: 18 }}>
        1.1 Éditeur du service
      </h2>
      <div>
        <p>
          Le simulateur douanier « Ztravel Consulting » est édité par : Ztravel
          Consulting, société spécialisée dans les services numériques et
          l’analyse des valeurs en douane. Adresse : [à compléter] Contact : [à
          compléter] Email : [à compléter]
        </p>
      </div>
      <h2 style={{ textAlign: 'left', marginBottom: 18 }}>
        1.2 Objet du simulateur
      </h2>
      <div>
        <p>
          Le simulateur permet d’estimer, à titre strictement indicatif, la
          valeur en douane de produits importés ainsi que les droits et taxes
          susceptibles d’être appliqués selon les barèmes en vigueur au moment
          du calcul.
        </p>
      </div>
      <h2 style={{ textAlign: 'left', marginBottom: 18 }}>
        1.3 Responsabilité
      </h2>
      <div>
        <p>
          Les résultats fournis reposent sur les données saisies par
          l’utilisateur et les barèmes disponibles au moment du calcul. Ztravel
          Consulting ne garantit ni l’exactitude exhaustive, ni l’actualité
          permanente des taux, classifications tarifaires ou règles douanières.
        </p>
      </div>

      <h2 style={{ textAlign: 'left', marginBottom: 18 }}>
        1.4 Absence de valeur officielle
      </h2>
      <div>
        <p>
          Les montants issus des simulations ne constituent pas une validation
          officielle. Seul Bénin Control SA est habilité à déterminer les
          montants définitifs des droits et taxes..
        </p>
      </div>

      <h2 style={{ textAlign: 'left', marginBottom: 18 }}>
        1.5 Propriété intellectuelle
      </h2>
      <div>
        <p>
          L’ensemble des contenus, interfaces, textes, images, algorithmes et
          bases de données du simulateur sont protégés. Toute reproduction ou
          exploitation non autorisée est interdite.
        </p>
      </div>

      <h2 style={{ textAlign: 'left', marginBottom: 18 }}>
        1.6 Données personnelles
      </h2>
      <div>
        <p>
          Ztravel Consulting s’engage à protéger les données personnelles
          conformément aux réglementations applicables.
        </p>
      </div>

      <h1 style={{ textAlign: 'left', marginBottom: 18 }}>
        2. Conditions générales d'utilisation(CGU)
      </h1>

      <h2 style={{ textAlign: 'left', marginBottom: 18 }}>2.1 Objet</h2>
      <div>
        <p>
          Les présentes CGU définissent les règles d’utilisation du simulateur
          douanier Ztravel Consulting.
        </p>
      </div>

      <h2 style={{ textAlign: 'left', marginBottom: 18 }}>
        2.2 Accès au service
      </h2>
      <div>
        <p>
          L’accès au simulateur est subordonné au paiement d’un montant
          forfaitaire de <strong>5 999 FCFA</strong>, donnant droit à :
        </p>
        <ul>
          <li>
            <strong> trois (3) </strong> listes de produits,
          </li>
          <li>
            <strong>trois (3) </strong>simulations AVD.
          </li>
        </ul>
      </div>

      <h2 style={{ textAlign: 'left', marginBottom: 18 }}>2.3 Jetons</h2>
      <div>
        <p>
          Chaque achat crédite <strong>trois (3)</strong> jetons. Chaque
          impression consomme un <strong>(1)</strong> jeton. L’utilisateur peut
          consulter son solde et son historique dans l’espace « Paiements &
          Jetons ».
        </p>
      </div>
      <h2 style={{ textAlign: 'left', marginBottom: 18 }}>
        2.4 Nature des résultats
      </h2>
      <div>
        <p>
          Les résultats sont fournis à titre indicatif et reposent sur les
          données saisies par l’utilisateur. Ils ne présentent aucun caractère
          contractuel.
        </p>
      </div>

      <h2 style={{ textAlign: 'left', marginBottom: 18 }}>
        2.5 Limitation de responsabilité
      </h2>
      <div>
        <p>
          Ztravel Consulting ne pourra être tenue responsable d’un préjudice
          direct ou indirect résultant :
        </p>
        <ul>
          <li>d’une erreur de saisie,</li>
          <li>d’une interprétation,</li>
          <li>d’une omission,</li>
          <li>d’une mise à jour réglementaire,</li>
          <li>d’une erreur de saisie,</li>
          <li>
            d’une divergence entre l’estimation fournie et les montants liquidés
            par l’administration douanière,
          </li>
        </ul>
      </div>

      <h2 style={{ textAlign: 'left', marginBottom: 18 }}>
        2.6 Absence de conseil douanier
      </h2>
      <div>
        <p>
          Les résultats ne constituent ni un conseil douanier, ni une garantie
          de conformité, ni une décision administrative.
        </p>
      </div>

      <h2 style={{ textAlign: 'left', marginBottom: 18 }}>
        2.7 Obligations de l’utilisateur
      </h2>
      <div>
        <p>
          L’utilisateur s’engage à fournir des informations exactes et à
          utiliser le simulateur conformément aux CGU.
        </p>
      </div>

      <h2 style={{ textAlign: 'left', marginBottom: 18 }}>2.8 Acceptation</h2>
      <div>
        <p>
          En cochant « J’accepte », l’utilisateur reconnaît avoir pris
          connaissance des CGU et les accepter sans réserve.
        </p>
      </div>

      <h1 style={{ textAlign: 'left', marginBottom: 18 }}>
        3. Politique de confidentialité – Simulateur Douanier
      </h1>

      <h2 style={{ textAlign: 'left', marginBottom: 18 }}>
        3.1 Données collectées
      </h2>
      <div>
        <p>Le simulateur peut collecter :</p>
      </div>
      <ul>
        <li>nom, email, téléphone (si fournis),</li>
        <li>données de paiement,</li>
        <li>historique des simulations,</li>
        <li>informations saisies dans les formulaires.</li>
      </ul>

      <h2 style={{ textAlign: 'left', marginBottom: 18 }}>3.2 Finalités</h2>
      <div>
        <p>Les données sont utilisées pour :</p>
      </div>
      <ul>
        <li>fournir le service de simulation,</li>
        <li>gérer les paiements et jetons,</li>
        <li>améliorer le service,</li>
        <li>assurer la sécurité du système.</li>
      </ul>

      <h2 style={{ textAlign: 'left', marginBottom: 18 }}>3.3 Conservation</h2>
      <div>
        <p>
          Les données sont conservées pour la durée nécessaire à la fourniture
          du service et au respect des obligations légales.
        </p>
      </div>

      <h2 style={{ textAlign: 'left', marginBottom: 18 }}>3.4 Partage</h2>
      <div>
        <p>
          Les données ne sont jamais vendues. Elles peuvent être partagées
          uniquement avec :
        </p>
      </div>

      <ul>
        <li>les prestataires techniques,</li>
        <li>les services de paiement,</li>
        <li>les autorités en cas d’obligation légale.</li>
      </ul>

      <h2 style={{ textAlign: 'left', marginBottom: 18 }}>3.5 Sécurité</h2>
      <div>
        <p>
          Ztravel Consulting met en œuvre des mesures techniques et
          organisationnelles pour protéger les données contre tout accès non
          autorisé.
        </p>
      </div>

      <h2 style={{ textAlign: 'left', marginBottom: 18 }}>
        3.6 Droits de l’utilisateur
      </h2>
      <div>
        <p>L’utilisateur dispose des droits :</p>
      </div>
      <ul>
        <li>d’accès,</li>
        <li>de rectification,</li>
        <li>de suppression,</li>
        <li>d'opposition,</li>
        <li>de portabilité,</li>
      </ul>

      <h2 style={{ textAlign: 'left', marginBottom: 18 }}>3.7 Contact</h2>
      <div>
        <p>
          Pour toute demande relative aux données personnelles : Email : [à
          compléter] :
        </p>
      </div>

      <p>
        En cochant « J’accepte », vous reconnaissez avoir pris connaissance et
        acceptez les conditions générales d’utilisation.
      </p>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          marginTop: '20px',
        }}
      >
        <label
          style={{
            fontSize: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
          }}
        >
          <input
            type='checkbox'
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
          />
          J’accepte
        </label>
        <button
          onClick={onSubmit}
          disabled={!accepted}
          style={{
            padding: '14px 32px', // ⬅️ plus haut + plus large
            borderRadius: 4,
            border: 'none',
            background: accepted ? '#087246' : '#0b0c0c',
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
            cursor: accepted ? 'pointer' : 'not-allowed',
          }}
        >
          Accepter et continuer vers la page de paiement
        </button>
      </div>
    </div>
  )
}
