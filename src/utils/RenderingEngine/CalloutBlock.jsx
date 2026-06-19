/**
 *
 * @param {un encadré doux, légèrement coloré, avec un fond pastel et une bordure subtile.} param0
 * @returns
 */
import React from 'react'
export const CalloutBlock = ({ children }) => {
  return (
    <div
      style={{
        backgroundColor: '#fff8e1',
        padding: '10px 15px',
        borderRadius: '5px',
        margin: '15px 0',
        borderLeft: '4px solid #ffc107',
      }}
    >
      {children}
    </div>
  )
}
