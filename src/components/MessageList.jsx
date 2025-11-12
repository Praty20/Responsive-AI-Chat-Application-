import React, { useEffect, useRef } from 'react'
import MessageItem from './MessageItem'

export default function MessageList({ messages, loading }){
  const listRef = useRef(null)
  useEffect(()=>{ if(listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight }, [messages, loading])
  return (
    <div ref={listRef} className="flex-1 overflow-auto p-4">
      {messages.map(m=> <MessageItem key={m.id} m={m} />)}
      {loading && <div className="text-gray-500 italic">AI is typing...</div>}
    </div>
  )
}
