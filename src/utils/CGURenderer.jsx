import { ParagraphBlock } from './RenderingEngine/ParagraphBlock'
import { CalloutBlock } from './RenderingEngine/CalloutBlock'

function renderWithNewLines(text) {
  if (!text) return null
  return text.split('\n').map((line, i) => (
    <span key={i}>
      {line}
      {i < text.split('\n').length - 1 && <br />}
    </span>
  ))
}

export default function CGURenderer({ data, onClick, onChange }) {
  if (!data || data.length === 0) return null

  return (
    <div className='guide-container'>
      {data.map((item, index) => {
        const html = (item.cgu || '').trim()

        if (!html) return null

        // Si c’est du HTML → on l’affiche dans un CalloutBlock
        if (html.startsWith('<')) {
          return (
            <CalloutBlock onClick={onClick} onChange={onChange} key={index}>
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </CalloutBlock>
          )
        }

        // Sinon → texte simple
        return (
          <ParagraphBlock key={index}>
            {renderWithNewLines(html)}
          </ParagraphBlock>
        )
      })}
    </div>
  )
}
