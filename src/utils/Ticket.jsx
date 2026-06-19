const Ticket = ({ data }) => {
  if (!data || !data.transaction) {
    return <p>Chargement du reçu…</p>
  }
  const { transaction, raw, status } = data

  return (
    <div id='print-area' style={{ fontFamily: 'monospace', width: '300px' }}>
      <h3 style={{ textAlign: 'center' }}>Zinsou Travel Consulting SRL</h3>

      <p>
        31 Avenue du president Allende
        <br />
        +33 0559040100
        <br />
        Tax Id: 06466570485
      </p>

      <p>
        Date: {new Date().toLocaleDateString()}
        <br />
        Time: {new Date().toLocaleTimeString()}
        <br />
        Customer: {transaction.user}
        <br />
        Item: 100
        <br />
        Qty: 1<br />
        Price: {transaction.amount} XOF
        <br />
      </p>

      <h4>Total: {transaction.amount} XOF</h4>

      <hr />

      <p>
        Wallet: {raw.payer?.partyId}
        <br />
        Auth code: 123456
        <br />
        External ID: {transaction.externalId}
        <br />
        Financial ID: {transaction.financialTransactionId}
        <br />
        Reference: {transaction.referenceId}
        <br />
        Status: {status}
      </p>

      <hr />

      <p style={{ fontSize: '11px' }}>
        Achat d'un forfait de 6 mois pour la génération d'attestation de
        vérification documentaire (AVD)…
      </p>
    </div>
  )
}
export default Ticket
