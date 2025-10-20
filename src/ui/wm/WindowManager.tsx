import React, { ReactNode, useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

export type AppWindow = {
  id: string
  title: string
  content: ReactNode
}

export function useWindowManager(){
  const [windows, setWindows] = useState<AppWindow[]>([])
  const open = (title: string, content: ReactNode) => {
    const w: AppWindow = { id: uuidv4(), title, content }
    setWindows(prev => [...prev, w])
  }
  const close = (id: string) => setWindows(prev => prev.filter(w => w.id!==id))
  return { windows, open, close }
}

export function WindowLayer({ windows, onClose }:{ windows: AppWindow[], onClose:(id:string)=>void }){
  return (
    <>
      {windows.map(w => {
        if (React.isValidElement(w.content)) {
          const el = React.cloneElement(w.content as any, { onClose: () => onClose(w.id) })
          return <React.Fragment key={w.id}>{el}</React.Fragment>
        }
        return <React.Fragment key={w.id}>{w.content}</React.Fragment>
      })}
    </>
  )
}
