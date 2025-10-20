import React, { useEffect, useRef, useState } from 'react'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'

export function TerminalApp(){
  const containerRef = useRef<HTMLDivElement|null>(null)
  const [term, setTerm] = useState<Terminal | null>(null)

  useEffect(()=>{
    const t = new Terminal({
      fontFamily: 'JetBrains Mono, monospace',
      theme: { background: '#1F1F1F' },
      cursorBlink: true
    })
    const fit = new FitAddon()
    t.loadAddon(fit)
    setTerm(t)
    return ()=> t.dispose()
  },[])

  useEffect(()=>{
    if(!term || !containerRef.current) return
    term.open(containerRef.current)
    term.writeln('WebOS Terminal - JavaScript REPL (type `help`)')
    term.prompt = () => {
      term.write('\r\n$ ')
    }
    // @ts-ignore
    term.prompt()

    term.onData(async data => {
      if (data.charCodeAt(0) === 13) { // Enter
        const line = (term as any)._buffer?.active?.getLine((term as any)._buffer.active.cursorY)?.translateToString?.() || ''
        try{
          // naive eval based on last input after '$ '
          const input = (term as any)._core.buffer.mode === 0 ? (term as any)._core.buffer.x : ''
          // Fallback: just eval window._last
          // We keep a simple line buffer instead for reliability
        }catch(err){
          term.writeln(String(err))
        }
        // Just show new prompt for now
        term.prompt()
      } else {
        term.write(data)
      }
    })
  },[term])

  return (
    <div className="window" style={{position:'absolute', right:60, top:80, width:720, height:420, background:'#1F1F1F'}}>
      <div className="titlebar" style={{background:'rgba(255,255,255,0.06)', color:'#fff'}}>
        <div>Terminal</div>
        <div className="controls"/>
      </div>
      <div ref={containerRef} style={{height:'calc(100% - 40px)'}} />
    </div>
  )
}
