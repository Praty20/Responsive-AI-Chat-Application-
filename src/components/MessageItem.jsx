import React from 'react'
export default function MessageItem({ m }){
  const isUser = m.role==='user'
  return (
    <div className={`max-w-[85%] ${isUser?'ml-auto text-right':'mr-auto text-left'} my-2`}>
      <div className={`${isUser?'bg-blue-600 text-white rounded-tl-2xl rounded-bl-2xl rounded-tr-lg p-3':'bg-gray-100 text-gray-900 rounded-tr-2xl rounded-br-2xl rounded-tl-lg p-3'}`}>
        <div className="whitespace-pre-wrap">{m.text}</div>
        <div className="text-xs mt-2 opacity-60">{new Date(m.ts).toLocaleString()}</div>
      </div>
    </div>
  )
}
