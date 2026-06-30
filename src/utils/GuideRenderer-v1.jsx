import React from 'react'
import SectionContent from './SectionContent.jsx'
import styles from '../css/GuideRenderer.module.css'

const GuideRenderer = ({ data, error }) => {
  if (!data || data.length === 0) {
    console.log('Aucune donnée à afficher:', data)
    //return <div className={styles.guideContainer}>Aucun chapitre trouvé.</div>
  }

  return (
    <div style={{ fontFamily: 'SF Pro Display, sans-serif' }}>
      {error && <div className='error-message'>{error}</div>}

      {/* Titre principal */}
      <h1 style={{ color: '#2c3e50' }}>{data.title}</h1>

      {/* SOMMAIRE */}
      <div
        style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '30px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <h2 style={{ color: '#2c3e50', marginTop: 0 }}>Sommaire</h2>

        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          {data.sections?.map((section) => (
            <li key={section.id} style={{ marginBottom: '15px' }}>
              <a
                href={`#${section.anchor}`}
                style={{
                  textDecoration: 'none',
                  color: '#3498db',
                  fontWeight: 'bold',
                  fontSize: '1.1em',
                }}
              >
                {section.title}
              </a>

              {/* Contenu de la section (passe la section entière) */}
              {section.description && <SectionContent content={section} />}

              {/* Sous-sections */}
              {section.subsections?.length > 0 && (
                <ul
                  style={{
                    listStyleType: 'none',
                    paddingLeft: '20px',
                    marginTop: '5px',
                  }}
                >
                  {section.subsections.map((sub) => (
                    <li key={sub.id} style={{ marginBottom: '8px' }}>
                      <a
                        href={`#${sub.anchor}`}
                        style={{
                          textDecoration: 'none',
                          color: '#7f8c8d',
                          fontSize: '0.95em',
                        }}
                      >
                        {sub.title}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* CONTENU PRINCIPAL */}
      <main>
        {data.sections?.map((section) => (
          <div key={section.id} style={{ marginBottom: '40px' }}>
            {/* Titre de section */}
            <h2
              id={section.anchor}
              style={{
                color: '#2c3e50',
                paddingBottom: '10px',
                borderBottom: '2px solid #eee',
                marginTop: '30px',
              }}
            >
              {section.title}
            </h2>

            {/* Contenu de la section (si description existe) */}
            {section.description && <SectionContent content={section} />}

            {/* Sous-sections */}
            {section.subsections?.map((sub) => (
              <div
                key={sub.id}
                style={{
                  marginTop: '25px',
                  paddingLeft: '15px',
                  borderLeft: '3px solid #3498db',
                }}
              >
                <h3 id={sub.anchor} style={{ color: '#3498db', marginTop: 0 }}>
                  {sub.title}
                </h3>
                <SectionContent content={sub} />
              </div>
            ))}
          </div>
        ))}
      </main>
    </div>
  )
}

export default GuideRenderer
