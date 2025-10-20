import React, { useState } from 'react'

function Snake(){
  const [score,setScore] = useState(0)
  return <div style={{padding:16}}>Snake (placeholder) — Score: {score}</div>
}

function TicTacToe(){
  const [cells, setCells] = useState<(null|'X'|'O')[]>(Array(9).fill(null))
  const [xTurn, setXTurn] = useState(true)
  const winner = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ].map(([a,b,c])=> cells[a] && cells[a]===cells[b] && cells[b]===cells[c] ? cells[a] : null).find(Boolean)
  return (
    <div style={{padding:16}}>
      <div style={{display:'grid', gridTemplateColumns:'repeat(3, 80px)', gap:6}}>
        {cells.map((v,i)=> (
          <button key={i} onClick={()=>{
            if(cells[i]||winner) return
            const next = cells.slice(); next[i]= xTurn?'X':'O'; setCells(next); setXTurn(!xTurn)
          }} style={{width:80,height:80,fontSize:24}}>{v}</button>
        ))}
      </div>
      <div style={{marginTop:12}}>{winner? `Winner: ${winner}`: `Turn: ${xTurn?'X':'O'}`}</div>
    </div>
  )
}

export function GamesHub(){
  const [tab, setTab] = useState<'snake'|'tictactoe'>('tictactoe')
  return (
    <div className="window" style={{position:'absolute', left:420, top:260, width:440}}>
      <div className="titlebar">
        <div>Games</div>
        <div className="controls">
          <button onClick={()=>setTab('tictactoe')}>TicTacToe</button>
          <button onClick={()=>setTab('snake')}>Snake</button>
        </div>
      </div>
      {tab==='tictactoe'? <TicTacToe/> : <Snake/>}
    </div>
  )
}
