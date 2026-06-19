export function QuoteBlock({ children }) {
  return (
    <div
      style={{
        padding: '16px 20px',
        borderLeft: '4px solid #6e6e73',
        background: '#fafafa',
        borderRadius: '8px',

        fontSize: '17px',
        lineHeight: 1.6,
        color: '#1d1d1f',
        margin: '20px 0',
        letterSpacing: '0.2px',
      }}
    >
      {children}
    </div>
  )
}
