import React, { useRef, useState } from 'react'

export function BrowserApp(){
  const [url, setUrl] = useState('https://example.org')
  const iframeRef = useRef<HTMLIFrameElement|null>(null)
  const go = () => {
    if(!/^https?:\/\//i.test(url)) setUrl('https://'+url)
  }
  return (
    <div className="window" style={{position:'absolute', left:120, top:140, width:900, height:560}}>
      <div className="titlebar">
        <div>Web Browser</div>
        <div className="controls"/>
      </div>
      <div style={{display:'flex', gap:8, padding:8}}>
        <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="Enter URL" style={{flex:1, padding:8, borderRadius:8, border:'1px solid #ddd'}} />
        <button onClick={go}>Go</button>
      </div>
      <iframe ref={iframeRef} src={url} style={{border:'none', width:'100%', height:'calc(100% - 100px)'}} />
    </div>
  )
}
