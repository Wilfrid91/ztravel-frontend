export default function PaymentTable({ payments }) {
  return (
    <table border='1' cellPadding='8'>
      <thead>
        <tr>
          <th>Date de paiement</th>
          <th>Statut</th>
          <th>Région</th>
          <th>Adresse IP</th>
        </tr>
      </thead>

      <tbody>
        {payments.map((p) => (
          <tr key={p._id}>
            <td>{new Date(p.paymentDate).toLocaleString()}</td>
            <td>{p.paymentStatus}</td>
            <td>{p.region}</td>
            <td>{p.ipAddress}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
