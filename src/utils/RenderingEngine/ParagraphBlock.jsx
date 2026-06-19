import React from 'react'

export const ParagraphBlock = ({ html }) => {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      style={{ marginBottom: '15px', lineHeight: '1.6' }}
    />
  )
}
