import React from 'react'
// Start menu opens apps via a global event the Desktop listens to
import { FileManager } from '../../apps/files/FileManager'
import { TextEditor } from '../../apps/text/TextEditor'
import { CodeEditor } from '../../apps/code/CodeEditor'
import { TerminalApp } from '../../apps/terminal/TerminalApp'
import { BrowserApp } from '../../apps/browser/BrowserApp'
import { PaintApp } from '../../apps/paint/PaintApp'
import { MediaPlayer } from '../../apps/media/MediaPlayer'
import { VideoEditor } from '../../apps/video/VideoEditor'
import { GamesHub } from '../../apps/games/GamesHub'

export function StartMenu({ open, onClose }:{ open:boolean, onClose:()=>void }){
  if(!open) return null
  const apps = [
    { name:'File Manager', open: () => <FileManager/> },
    { name:'Text Editor', open: () => <TextEditor/> },
    { name:'Code Editor', open: () => <CodeEditor/> },
    { name:'Terminal', open: () => <TerminalApp/> },
    { name:'Browser', open: () => <BrowserApp/> },
    { name:'Paint', open: () => <PaintApp/> },
    { name:'Media Player', open: () => <MediaPlayer/> },
    { name:'Video Editor', open: () => <VideoEditor/> },
    { name:'Games', open: () => <GamesHub/> },
  ]

  const openApp = (name: string, element: JSX.Element) => {
    window.dispatchEvent(new CustomEvent('webos-open-app', { detail: { name, element } }))
    onClose()
  }

  return (
    <div style={{
      position:'fixed', left:'50%', transform:'translateX(-50%)', bottom:60,
      width:680, maxWidth:'90vw', background:'rgba(255,255,255,0.7)',
      backdropFilter:'blur(16px)', borderRadius:16, boxShadow:'0 8px 24px rgba(0,0,0,0.18)',
      border:'1px solid rgba(0,0,0,0.08)', padding:16
    }}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <strong>Start</strong>
        <button onClick={onClose}>Close</button>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:12, marginTop:12}}>
        {apps.map(app=> (
          <button key={app.name} onClick={()=>openApp(app.name, app.open())} style={{
            background:'rgba(255,255,255,0.6)', border:'1px solid rgba(0,0,0,0.06)',
            borderRadius:12, padding:'16px 10px', cursor:'pointer'
          }}>
            {app.name}
          </button>
        ))}
      </div>
    </div>
  )
}
