const ImageDisplay = ({ imageId }) => {
  if (!imageId) {
    return <p>Aucune image n’a encore été uploadée.</p>
  }
  const imageUrl = `http://localhost:5000/api/auth/images/${imageId}`
  console.log({ imageId })
  return (
    <img
      src={imageUrl}
      alt='Capture'
      style={{ maxWidth: '300px' }}
      onError={(e) => {
        e.target.src = '/placeholder.png' // image par défaut
      }}
    />
  )
}

export default ImageDisplay
