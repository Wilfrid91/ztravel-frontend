/**
 *
 * @param {"remarque": "⚠️ Si vous choisissez d'utiliser un VPN…"}
 *  param0
 * @returns
 */

export function WarningBlock({ items = [] }) {
  if (!items || items.length === 0) return null

  return (
    <div style={{ margin: '8px 0' }}>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            fontSize: '15px',
            lineHeight: '1.6',
            color: '#1d1d1f',

            letterSpacing: '0.2px',
            padding: '4px 0',
          }}
        >
          <span style={{ fontSize: '18px' }}>⚠️</span>
          <span>{item}</span>
        </div>
      ))}
    </div>
  )
}

/*
export function WarningBlock({ items }) {
  return (
    <div
      style={{
        background: '#fffbe6',
        borderLeft: '4px solid #f0c200',
        padding: '12px 16px',
        borderRadius: '6px',
        marginBottom: '20px',
        fontFamily: 'SF Pro Text',
      }}
    >
      {items.map((item, i) => (
        <p key={i} style={{ margin: 0 }}>
          {item}
        </p>
      ))}
    </div>
  )
}
*/
