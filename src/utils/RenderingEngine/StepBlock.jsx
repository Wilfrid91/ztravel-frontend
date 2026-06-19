import React from 'react'
import { TitleBlock } from './TitleBlock'
import { ParagraphBlock } from './ParagraphBlock'

export const StepBlock = ({ steps }) => {
  return (
    <div style={{ margin: '20px 0' }}>
      <TitleBlock text='Étapes :' level={4} />
      <ol style={{ paddingLeft: '20px' }}>
        {steps.map((step) => (
          <li key={step.number} style={{ marginBottom: '15px' }}>
            <TitleBlock text={step.title} level={5} />
            {step.instructions && (
              <ul style={{ paddingLeft: '20px', marginTop: '0' }}>
                {step.instructions.map((instruction, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}>
                    {typeof instruction === 'string' ? (
                      instruction
                    ) : (
                      <>
                        {instruction.item}
                        {instruction.subItems?.length > 0 && (
                          <ul
                            style={{
                              paddingLeft: '20px',
                              marginTop: '6px',
                              fontSize: '15px',
                              color: '#666',
                            }}
                          >
                            {instruction.subItems.map((subItem, subIndex) => (
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
              </ul>
            )}
            {step.description && (
              <div style={{ marginTop: '10px' }}>
                {typeof step.description === 'string' ? (
                  <ParagraphBlock html={step.description} />
                ) : (
                  step.description.map((desc, index) => (
                    <div key={index} style={{ marginBottom: '5px' }}>
                      {typeof desc === 'string' ? (
                        desc
                      ) : (
                        <>
                          {desc.item}
                          {desc.subItems?.length > 0 && (
                            <ul
                              style={{
                                paddingLeft: '20px',
                                marginTop: '6px',
                                fontSize: '15px',
                                color: '#666',
                              }}
                            >
                              {desc.subItems.map((subItem, subIndex) => (
                                <li
                                  key={subIndex}
                                  dangerouslySetInnerHTML={{ __html: subItem }}
                                />
                              ))}
                            </ul>
                          )}
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}
