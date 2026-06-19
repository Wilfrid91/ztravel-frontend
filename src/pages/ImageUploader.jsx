import React, { useState } from 'react'
import axios from 'axios'

function ImageUploader() {
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState('')
  const [imageId, setImageId] = useState(null)

  // Quand l'utilisateur choisit un fichier
  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  // Upload vers ton API
  const handleUpload = async () => {
    if (!file) {
      setMessage('⚠️ Veuillez sélectionner une image !')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/upload/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            // si ta route est protégée par JWT :
            //"x-access-token": localStorage.getItem("token"),
          },
        }
      )

      setMessage('✅ Image uploadée avec succès !')
      setImageId(res.data.fileId) // récupère l'ID MongoDB
    } catch (err) {
      console.error(err)
      setMessage("❌ Erreur lors de l'upload")
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Uploader une image vers MongoDB</h2>
      <input type='file' accept='image/*' onChange={handleFileChange} />
      <button onClick={handleUpload}>Uploader</button>
      <p>{message}</p>
    </div>
  )
}

export default ImageUploader
