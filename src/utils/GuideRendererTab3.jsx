import React from 'react'
import { TitleBlock } from './RenderingEngine/TitleBlock'
import { ParagraphBlock } from './RenderingEngine/ParagraphBlock'
import { CalloutBlock } from './RenderingEngine/CalloutBlock'
import { StepBlock } from './RenderingEngine/StepBlock'
import { ImageGallery } from './RenderingEngine/ImageGallery'

export default function GuideRenderer({ data, error }) {
  if (!data) return null

  // Fonction pour rendre les remarques
  const renderRemark = (remark) => {
    const icons = {
      info: 'ℹ️',
      warning: '⚠️',
      success: '😄',
    }

    return (
      <div key={remark.text} style={{ marginBottom: '12px' }}>
        <span style={{ marginRight: '8px' }}>{icons[remark.type] || '💡'}</span>
        <span>{remark.text}</span>
        {remark.details && (
          <div style={{ marginTop: '12px' }}>
            {remark.details.title && (
              <TitleBlock text={remark.details.title} level={4} />
            )}
            {remark.details.list && (
              <ol
                style={{
                  lineHeight: '1.8',
                  fontSize: '16px',
                  paddingLeft: '20px',
                }}
              >
                {remark.details.list.map((item, index) => (
                  <li key={index}>
                    {typeof item === 'string' ? (
                      item
                    ) : (
                      <>
                        {item.item}
                        {item.subItems?.length > 0 && (
                          <ul
                            style={{
                              marginTop: '6px',
                              paddingLeft: '20px',
                              fontSize: '15px',
                              color: '#666',
                            }}
                          >
                            {item.subItems.map((subItem, subIndex) => (
                              <li
                                key={subIndex}
                                dangerouslySetInnerHTML={{
                                  __html: subItem.text || subItem,
                                }}
                              />
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
      </div>
    )
  }

  // Fonction pour rendre une section ou sous-section
  const renderSection = (section, level = 2) => {
    return (
      <div key={section.id || section.anchor} style={{ marginBottom: '40px' }}>
        {/* Titre de section */}
        <TitleBlock text={section.title} level={level} id={section.anchor} />

        {/* Description */}
        {section.description && <ParagraphBlock html={section.description} />}

        {/* Images */}
        {section.images?.length > 0 && <ImageGallery images={section.images} />}

        {/* Remarques */}
        {Array.isArray(section.remark) && section.remark.length > 0 && (
          <CalloutBlock>
            {/* <strong>Remarque :</strong> */}
            <div style={{ marginTop: '8px' }}>
              {section.remark.map(renderRemark)}
            </div>
          </CalloutBlock>
        )}

        {/* Étapes */}
        {Array.isArray(section.steps) && section.steps.length > 0 && (
          <StepBlock steps={section.steps} />
        )}

        {/* Sous-sections */}
        {Array.isArray(section.subsections) &&
          section.subsections.length > 0 && (
            <div
              style={{
                marginTop: '25px',
                paddingLeft: '15px',
                borderLeft: '3px solid #3498db',
              }}
            >
              {section.subsections.map((sub) => renderSection(sub, level + 1))}
            </div>
          )}
      </div>
    )
  }

  return (
    <div style={{ fontFamily: 'SF Pro Display, sans-serif' }}>
      {error && <div className='error-message'>{error}</div>}

      {/* Titre principal */}
      <TitleBlock text={data.title} level={1} id={data.anchor} />

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
        <TitleBlock text='Sommaire' level={2} />
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          {data.sections?.map((section) => (
            <li
              key={section.id || section.anchor}
              style={{ marginBottom: '15px' }}
            >
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
              {/* Sous-sections dans le sommaire */}
              {Array.isArray(section.subsections) &&
                section.subsections.length > 0 && (
                  <ul
                    style={{
                      listStyleType: 'none',
                      paddingLeft: '20px',
                      marginTop: '5px',
                    }}
                  >
                    {section.subsections.map((sub) => (
                      <li
                        key={sub.id || sub.anchor}
                        style={{ marginBottom: '8px' }}
                      >
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
      <main>{data.sections?.map((section) => renderSection(section))}</main>
    </div>
  )
}
