/**
 * Afficher une ou plusieurs vidéos selon le format de data.video.
 * @param {*} param0
 * @returns
 */

export function CodeBlock({ code }) {
  return (
    <pre
      style={{
        background: '#f5f5f7',
        padding: '16px 20px',
        borderRadius: '10px',

        fontSize: '14px',
        lineHeight: 1.55,
        color: '#1d1d1f',
        overflowX: 'auto',
        border: '1px solid #e5e5e7',
        letterSpacing: '0.3px',
        margin: '20px 0',
      }}
    >
      <code style={{ whiteSpace: 'pre' }}>{code}</code>
    </pre>
  )
}
