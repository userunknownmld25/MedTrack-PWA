import React, { useRef, useState } from 'react'
import Editor from '@monaco-editor/react'

export function CodeEditor(){
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState('// Start coding...')
  const editorRef = useRef<any>(null)
  return (
    <div className="window" style={{position:'absolute', left:80, top:80, width:800, height:520}}>
      <div className="titlebar">
        <div>Code Editor</div>
        <div className="controls">
          <select value={language} onChange={e=>setLanguage(e.target.value)}>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="python">Python</option>
          </select>
        </div>
      </div>
      <div style={{height:'calc(100% - 40px)'}}>
        <Editor
          height="100%"
          defaultLanguage="javascript"
          language={language}
          value={code}
          onChange={(v)=>setCode(v || '')}
          onMount={(editor)=> (editorRef.current = editor)}
          options={{fontLigatures:true, fontFamily:'JetBrains Mono, monospace', minimap:{enabled:false}}}
        />
      </div>
    </div>
  )
}
