import React, { useRef, useState } from 'react'
import { useChatsLocal } from './_hooks'
import MessageList from './MessageList'
import ChatInput from './ChatInput'

export default function ChatWindow({ callLLM }){
  const { sessions, activeSession, setSessions, setActiveId } = useChatsLocal()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  if(!activeSession) return <div className="flex-1 flex flex-col"><div className="p-8 text-center text-gray-500">Select a chat or create a new one to start messaging.</div></div>

  const messages = activeSession.messages || []

  async function handleSend(text){
    setError(null)
    const userMsg = { id: 'm_'+Math.random().toString(36).slice(2,9), role:'user', text, ts: new Date().toISOString(), status:'sent' }
    const newSessions = sessions.map(s=> s.id===activeSession.id? {...s, messages:[...s.messages, userMsg], updatedAt: new Date().toISOString(), lastMessage:text } : s)
    setSessions(newSessions)
    setLoading(true)
    abortRef.current = new AbortController()
    try{
      // build prompt
      const prompt = messages.concat(userMsg).map(m => `${m.role==='user'?'User':(m.role==='system'?'System':'Assistant')}: ${m.text}`).join('\n')
      // use same callLLM function defined in App via window fallback
      const call = callLLM || window.callLLM
      const responseText = await call(prompt, abortRef.current.signal)
      const aiMsg = { id: 'm_'+Math.random().toString(36).slice(2,9), role:'ai', text: responseText, ts: new Date().toISOString(), status:'received' }
      const after = newSessions.map(s=> s.id===activeSession.id? {...s, messages:[...s.messages, aiMsg], updatedAt: new Date().toISOString(), lastMessage: responseText } : s)
      setSessions(after)
    }catch(err){
      console.error(err)
      setError(err.message)
      const failMsg = { id: 'm_'+Math.random().toString(36).slice(2,9), role:'ai', text:`Error: ${err.message}`, ts: new Date().toISOString(), status:'failed' }
      const after = newSessions.map(s=> s.id===activeSession.id? {...s, messages:[...s.messages, failMsg], updatedAt: new Date().toISOString(), lastMessage:'Error' } : s)
      setSessions(after)
    }finally{
      setLoading(false)
    }
  }

  function handleDownload(){
    const payload = { id: activeSession.id, title: activeSession.title, createdAt: activeSession.createdAt, updatedAt: activeSession.updatedAt, messages: activeSession.messages }
    const blob = new Blob([JSON.stringify(payload,null,2)], { type:'application/json' })
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download=`${(activeSession.title||'chat').replace(/\s+/g,'_')}_${activeSession.id}.json`; a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="text-lg font-semibold">{activeSession.title}</div>
        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded" onClick={handleDownload}>Export JSON</button>
          <button className="px-3 py-1 border rounded" onClick={()=>{ setActiveId(null); localStorage.removeItem('ai_chat_active_v1') }}>Close</button>
        </div>
      </div>
      <MessageList messages={messages} loading={loading} />
      {error && <div className="p-2 text-red-600">Error: {error}</div>}
      <ChatInput onSend={handleSend} disabled={loading} />
    </div>
  )
}
