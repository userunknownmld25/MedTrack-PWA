import React from 'react'

export function Taskbar({ onToggleStart, onToggleTheme }:{ onToggleStart:()=>void, onToggleTheme:()=>void }){
  return (
    <div className="taskbar">
      <button className="start-button" onClick={onToggleStart}>Start</button>
      <div style={{position:'absolute',right:12}}>
        <button onClick={onToggleTheme}>Toggle Theme</button>
      </div>
    </div>
  )
}
