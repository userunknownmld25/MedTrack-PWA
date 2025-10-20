import React, { useEffect, useRef, useState } from 'react'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'

export function VideoEditor(){
  const [ready, setReady] = useState(false)
  const [log, setLog] = useState<string>('')
  const [src, setSrc] = useState<string>('')
  const [outputUrl, setOutputUrl] = useState<string>('')
  const ffmpegRef = useRef(createFFmpeg({ log: true }))

  useEffect(()=>{
    (async ()=>{
      try{
        await ffmpegRef.current.load()
        setReady(true)
      }catch(err){ setLog('Failed to load FFmpeg: '+String(err)) }
    })()
  },[])

  const onSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if(!file) return
    setSrc(URL.createObjectURL(file))
    ffmpegRef.current.FS('writeFile', 'input.mp4', await fetchFile(file))
  }

  const trim = async () => {
    if(!ready) return
    setLog('Trimming 0-5s…')
    await ffmpegRef.current.run('-ss','0','-i','input.mp4','-t','5','-c','copy','out.mp4')
    const data = ffmpegRef.current.FS('readFile','out.mp4')
    const blob = new Blob([data.buffer], {type:'video/mp4'})
    setOutputUrl(URL.createObjectURL(blob))
    setLog('Done')
  }

  return (
    <div className="window" style={{position:'absolute', right:240, top:220, width:820, height:520}}>
      <div className="titlebar">
        <div>Video Editor</div>
        <div className="controls">
          <input type="file" accept="video/*" onChange={onSelect} />
          <button onClick={trim} disabled={!ready}>Trim 0-5s</button>
        </div>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, padding:12}}>
        <div>
          <div>Source</div>
          {src ? <video src={src} controls style={{width:'100%'}}/> : <div>Select a video…</div>}
        </div>
        <div>
          <div>Output</div>
          {outputUrl ? <video src={outputUrl} controls style={{width:'100%'}}/> : <div>Run an operation…</div>}
        </div>
      </div>
      {log && <div style={{padding:12, fontFamily:'JetBrains Mono, monospace', fontSize:12, opacity:0.7}}>{log}</div>}
    </div>
  )
}
