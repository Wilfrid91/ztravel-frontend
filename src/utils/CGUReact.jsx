export default function CGUReact({
  accepted,
  setAccepted,
  alreadyAccepted,
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
      <h2 style={{ textAlign: 'left', marginBottom: 18 }}>
        Conditions générales d'utilisation
      </h2>
      <div>
        <p>
          Le présent simulateur a pour objet de permettre à l’utilisateur
          d’estimer, à titre purement indicatif, la valeur en douane de ses
          produits.
        </p>

        <p>
          L’accès au service de simulation est subordonné au paiement d’un
          montant forfaitaire de
          <strong> 5 999 FCFA</strong>, ouvrant droit à la génération de
          <strong> trois (3) listes de produits</strong> et à la réalisation de
          <strong> trois (3) simulations AVD</strong>. À l’issue de ces droits
          d’usage, l’utilisateur devra procéder à un nouveau paiement s’il
          souhaite bénéficier de nouvelles générations ou simulations.
        </p>

        <p>
          Les résultats fournis par le simulateur reposent exclusivement sur les
          informations renseignées par l’utilisateur. En conséquence, les
          estimations peuvent varier d’un AVD à un autre et ne présentent
          <strong> aucun caractère contractuel</strong>. L’utilisateur reconnaît
          que la qualité, la précision et la complétude des données saisies
          conditionnent la pertinence des résultats obtenus.
        </p>

        <p>
          Chaque utilisateur dispose d’un tableau de bord au sein de l’espace
          <strong> « Paiements &amp; Jetons »</strong>, lui permettant de
          consulter notamment :
        </p>

        <ul>
          <li>
            le <strong>nombre total de jetons</strong>, crédité de
            <strong> trois (3) jetons</strong> à chaque achat ou rechargement ;
          </li>
          <li>
            le <strong>nombre de jetons restants</strong>, décrémenté d’
            <strong>un (1) jeton</strong> à chaque impression ;
          </li>
          <li>
            le <strong>nombre total d’impressions</strong> réalisées depuis son
            inscription à l’application
            <strong> « Chine : Achetez malin, rentrez serein ! »</strong>.
          </li>
        </ul>

        <p>
          L’utilisateur dispose également, dans le même espace, d’un menu
          <strong> « Paiements »</strong> lui permettant de consulter
          l’historique de ses transactions, incluant notamment les montants
          réglés, les dates des opérations, les canaux de paiement utilisés
          ainsi que le statut de chaque transaction.
        </p>

        <p>
          <strong>
            Les montants issus des simulations sont fournis à titre strictement
            indicatif et ne sauraient, en aucun cas, engager la responsabilité
            de l’éditeur de l’application, ni être assimilés à une quelconque
            validation officielle des droits et taxes applicables.
          </strong>
        </p>

        <p>
          <strong>
            Seul Bénin Control SA est habilité à déterminer et à communiquer les
            montants définitifs des droits et taxes dus au titre des opérations
            d’importation concernées.
          </strong>
        </p>
      </div>

      <p>
        En cochant « J’accepte », vous reconnaissez avoir pris connaissance et
        acceptez {''}
        <a href='/cgu' target='_blank' rel='noopener noreferrer'>
          les conditions générales d’utilisation
        </a>
        .
      </p>
      <p>
        <strong>Nous nous engageons à protéger vos données personnelles</strong>{' '}
        et à respecter votre vie privée.
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
            cursor: alreadyAccepted ? 'not-allowed' : 'pointer',
          }}
        >
          <input
            type='checkbox'
            checked={accepted}
            disabled={alreadyAccepted}
            onChange={(e) => setAccepted(e.target.checked)}
          />
          J’accepte
        </label>
        <button
          onClick={alreadyAccepted ? onSkipSubmit : onSubmit}
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
