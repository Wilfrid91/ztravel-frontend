import React from 'react'
import './InfoCard.css' // fichier CSS séparé

export default function InfoCard({ title, icon, color, content, link }) {
  return (
    <div className='info-card' style={{ borderLeft: `6px solid ${color}` }}>
      <div className='info-card-header'>
        <span className='info-card-icon' style={{ backgroundColor: color }}>
          {icon}
        </span>
        <h3>{title}</h3>
      </div>
      <div className='info-card-body'>
        {Array.isArray(content) ? (
          <ul>
            {content.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        ) : (
          <p>{content}</p>
        )}
      </div>
      {link && (
        <div className='info-card-footer'>
          <a href={link} target='_blank' rel='noopener noreferrer'>
            En savoir plus →
          </a>
        </div>
      )}
    </div>
  )
}
