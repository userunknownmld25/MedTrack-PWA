import React from 'react'
import { WindowLayer, useWindowManager } from '../wm/WindowManager'
import { FileManager } from '../../apps/files/FileManager'
import { TextEditor } from '../../apps/text/TextEditor'
import { CodeEditor } from '../../apps/code/CodeEditor'
import { TerminalApp } from '../../apps/terminal/TerminalApp'
import { BrowserApp } from '../../apps/browser/BrowserApp'
import { PaintApp } from '../../apps/paint/PaintApp'
import { MediaPlayer } from '../../apps/media/MediaPlayer'
import { VideoEditor } from '../../apps/video/VideoEditor'
import { GamesHub } from '../../apps/games/GamesHub'

export function Desktop(){
  const wm = useWindowManager()

  // Open a couple demo windows on load
  React.useEffect(()=>{
    wm.open('File Manager', <FileManager />)
    wm.open('Browser', <BrowserApp />)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  React.useEffect(()=>{
    const handler = (e: any) => {
      const detail = e?.detail as { name: string, element: JSX.Element } | undefined
      if (!detail) return
      wm.open(detail.name, detail.element)
    }
    window.addEventListener('webos-open-app', handler)
    return () => window.removeEventListener('webos-open-app', handler)
  }, [wm])

  return (
    <div className="desktop">
      <WindowLayer windows={wm.windows} onClose={wm.close} />
    </div>
  )
}
