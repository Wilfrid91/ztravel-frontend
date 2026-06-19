export function TableBlock({ headers = [], rows = [] }) {
  return (
    <div style={{ overflowX: 'auto', margin: '20px 0' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',

          fontSize: '15px',
          letterSpacing: '0.2px',
          color: '#1d1d1f',
          background: 'white',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        <thead style={{ background: '#f5f5f7' }}>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                style={{
                  padding: '12px 16px',
                  fontWeight: 600,
                  textAlign: 'left',
                  borderBottom: '1px solid #e5e5e7',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, rIndex) => (
            <tr key={rIndex}>
              {row.map((cell, cIndex) => (
                <td
                  key={cIndex}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #f0f0f2',
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
