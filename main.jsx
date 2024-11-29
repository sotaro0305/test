import React from 'react'
import ReactDOM from 'react-dom/client'
import SeamlessAudioPlayer from './components/SeamlessAudioPlayer'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">シームレス音楽プレイヤー</h1>
      <SeamlessAudioPlayer />
    </div>
  </React.StrictMode>
)