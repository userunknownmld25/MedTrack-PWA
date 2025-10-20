import React, { useRef, useState } from 'react'

export function MediaPlayer(){
  const videoRef = useRef<HTMLVideoElement|null>(null)
  const [src, setSrc] = useState<string>('')

  const onSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if(!file) return
    const url = URL.createObjectURL(file)
    setSrc(url)
  }

  return (
    <div className="window" style={{position:'absolute', left:240, top:220, width:720, height:420}}>
      <div className="titlebar">
        <div>Media Player</div>
        <div className="controls">
          <input type="file" accept="video/*,audio/*" onChange={onSelect} />
        </div>
      </div>
      <div style={{padding:8}}>
        {src ? (
          <video ref={videoRef} src={src} controls style={{width:'100%', height:'calc(100% - 60px)'}} />
        ) : (
          <div style={{padding:24, opacity:0.7}}>Select a media file…</div>
        )}
      </div>
    </div>
  )
}
