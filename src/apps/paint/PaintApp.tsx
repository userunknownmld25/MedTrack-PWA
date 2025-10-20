import React, { useEffect, useRef, useState } from 'react'

export function PaintApp(){
  const canvasRef = useRef<HTMLCanvasElement|null>(null)
  const [drawing, setDrawing] = useState(false)
  const [color, setColor] = useState('#0078D4')
  const [size, setSize] = useState(6)

  useEffect(()=>{
    const canvas = canvasRef.current
    if(!canvas) return
    const ctx = canvas.getContext('2d')!
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }
    resize()
    window.addEventListener('resize', resize)
    return ()=> window.removeEventListener('resize', resize)
  },[])

  const onMouse = (e: React.MouseEvent) => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    if(e.type==='mousedown'){ setDrawing(true) }
    if(e.type==='mouseup'){ setDrawing(false) }
    if(e.type==='mousemove' && drawing){
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y, size/2, 0, Math.PI*2)
      ctx.fill()
    }
  }

  return (
    <div className="window" style={{position:'absolute', right:120, top:160, width:720, height:480}}>
      <div className="titlebar">
        <div>Paint</div>
        <div className="controls" style={{display:'flex', gap:8}}>
          <input type="color" value={color} onChange={e=>setColor(e.target.value)} />
          <input type="range" min={2} max={40} value={size} onChange={e=>setSize(parseInt(e.target.value))} />
        </div>
      </div>
      <div style={{height:'calc(100% - 40px)'}}>
        <canvas ref={canvasRef} style={{width:'100%', height:'100%', background:'#fff', cursor:'crosshair'}}
          onMouseDown={onMouse} onMouseUp={onMouse} onMouseMove={onMouse}
        />
      </div>
    </div>
  )
}
