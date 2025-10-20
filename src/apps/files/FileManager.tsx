import React, { useEffect, useState } from 'react'
import { get, set, del, keys } from 'idb-keyval'

export function FileManager(){
  const [fileKeys, setFileKeys] = useState<string[]>([])
  const [selected, setSelected] = useState<string|null>(null)

  const refresh = async () => {
    const k = await keys()
    setFileKeys(k as string[])
  }

  useEffect(()=>{ refresh() },[])

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if(!file) return
    const buf = await file.arrayBuffer()
    await set('file:'+file.name, new Uint8Array(buf))
    await refresh()
  }

  const onDownload = async () => {
    if(!selected) return
    const data = await get<Uint8Array>('file:'+selected)
    if(!data) return
    const blob = new Blob([data])
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = selected
    a.click()
    URL.revokeObjectURL(url)
  }

  const onDelete = async () => {
    if(!selected) return
    await del('file:'+selected)
    setSelected(null)
    await refresh()
  }

  return (
    <div className="window" style={{position:'absolute', left:60, top:60, width:640}}>
      <div className="titlebar">
        <div>File Manager</div>
        <div className="controls">
          <input type="file" onChange={onUpload} />
          <button onClick={onDownload} disabled={!selected}>Download</button>
          <button onClick={onDelete} disabled={!selected}>Delete</button>
        </div>
      </div>
      <div style={{padding:12}}>
        <ul>
          {fileKeys.filter(k=>String(k).startsWith('file:')).map(k=>String(k).slice(5)).map(name => (
            <li key={name} style={{cursor:'pointer', padding:6, borderRadius:6, background: selected===name ? 'rgba(0,120,212,0.1)' : 'transparent'}} onClick={()=>setSelected(name)}>
              {name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
