//Liste à puces façon Notion
export function BulletList({ items }) {
  return (
    <ul
      style={{
        paddingLeft: '24px', // ← OBLIGATOIRE
        marginLeft: '0',
        listStyleType: 'disc',
        listStylePosition: 'outside',
        lineHeight: '1.6',
      }}
    >
      {items.map((item, i) => (
        <li key={i} style={{ marginBottom: '8px' }}>
          {item}
        </li>
      ))}
    </ul>
  )
}
