import React, { useMemo, useState } from 'react'
import { Desktop } from './desktop/Desktop'
import { Taskbar } from './shell/Taskbar'
import { StartMenu } from './shell/StartMenu'

export function App(){
  const [showStart, setShowStart] = useState(false)
  const [theme, setTheme] = useState<'light'|'dark'>('light')

  return (
    <div className="app-root" data-theme={theme}>
      <Desktop />
      <Taskbar onToggleStart={()=>setShowStart(v=>!v)} onToggleTheme={()=>setTheme(t=>t==='light'?'dark':'light')} />
      <StartMenu open={showStart} onClose={()=>setShowStart(false)} />
    </div>
  )
}
