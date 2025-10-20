import React, { useState } from 'react'

export function TextEditor(){
  const [text, setText] = useState('')
  const handleSave = () => {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.txt'
    a.click()
    URL.revokeObjectURL(url)
  }
  return (
    <div className="window" style={{position:'absolute', inset:'80px 80px auto auto', width:600, height:400}}>
      <div className="titlebar">
        <div>Text Editor</div>
        <div className="controls"><button onClick={handleSave}>Save</button></div>
      </div>
      <textarea value={text} onChange={e=>setText(e.target.value)} style={{width:'100%', height:'calc(100% - 40px)', border:'none', outline:'none', padding:12, fontFamily:'JetBrains Mono, monospace'}}/>
    </div>
  )
}
