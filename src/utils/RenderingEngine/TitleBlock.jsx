import React from 'react'

export const TitleBlock = ({ text, level = 2, id }) => {
  const Tag = `h${level}`
  return (
    <Tag id={id} style={{ color: '#2c3e50' }}>
      {text}
    </Tag>
  )
}
