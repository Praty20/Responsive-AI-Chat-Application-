import React, { useState, useRef } from 'react'
export default function ChatInput({ onSend, disabled }){
  const [text, setText] = useState('')
  const textareaRef = useRef(null)
  function handleKeyDown(e){ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); if(text.trim()){ onSend(text); setText('') } } }
  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <textarea ref={textareaRef} className="w-full rounded-md p-3 resize-none h-24 md:h-28 focus:outline-none focus:ring" placeholder="Type a message — Enter to send, Shift+Enter for newline" value={text} onKeyDown={handleKeyDown} onChange={(e)=>setText(e.target.value)} disabled={disabled} />
      <div className="flex justify-end mt-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50" onClick={()=>{ if(text.trim()){ onSend(text); setText('') } }} disabled={disabled||!text.trim()}>Send</button>
      </div>
    </div>
  )
}
