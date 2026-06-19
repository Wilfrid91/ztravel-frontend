import React from 'react'

export const ImageGallery = ({ images }) => {
  return (
    <div
      style={{
        margin: '20px 0',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
      }}
    >
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`Illustration ${index + 1}`}
          style={{
            width: '100%',
            borderRadius: '8px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          }}
        />
      ))}
    </div>
  )
}
