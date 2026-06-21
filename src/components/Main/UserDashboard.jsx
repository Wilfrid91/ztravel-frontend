const UserDashboard = ({ tx }) => {
  if (!tx) return null
  return (
    <>
      <td>
        {new Date(tx.createdAt).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </td>
      <td>{tx.transactionId}</td>
      <td>{tx.amount}</td>
      <td>{tx.status}</td>
      <td>{tx.brand}</td>
      <td>{tx.country}</td>
      <td>{tx.method}</td>
      <td>{tx.number}</td>
      <td>{tx.customerEmail}</td>
      <td>{tx.ip}</td>
      <td>{tx.region}</td>
    </>
  )
}
export default UserDashboard
