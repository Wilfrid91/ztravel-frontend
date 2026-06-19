//Étapes numérotées

/**
 * 
 * @param {"steps": [
  { "number": 1, "title": "Télécharge Astrill", "instructions": [...] }
]
} param0 
 * @returns 
 */
export function NumberedSteps({ steps }) {
  return (
    <ol
      style={{
        paddingLeft: '20px',
        marginBottom: '20px',

        lineHeight: '1.6',
      }}
    >
      {steps.map((step) => (
        <li key={step.number} style={{ marginBottom: '12px' }}>
          <strong>{step.title}</strong>
          <div style={{ marginTop: '4px' }}>
            {Array.isArray(step.instructions) ? (
              step.instructions.map((i, idx) => <p key={idx}>{i}</p>)
            ) : (
              <p>{step.instructions}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}
