import React, { useState, useEffect } from 'react'
import { useChatsLocal } from './_hooks'

export default function Sidebar() {
  const {
    sessions,
    setSessions,
    activeId,
    setActiveId,
    createNewSession,
    deleteSession,
    renameSession,
    apiKey,
    setApiKey,
  } = useChatsLocal()
  const [showSettings, setShowSettings] = useState(false)
  const [localKey, setLocalKey] = useState(apiKey || '')

  useEffect(() => {
    setLocalKey(apiKey || '')
  }, [apiKey])

  function saveKey() {
    try {
      if (localKey) localStorage.setItem('ai_llm_api_key', localKey)
      else localStorage.removeItem('ai_llm_api_key')
      setApiKey(localKey)
      alert('API key saved.')
    } catch (e) {
      alert('Failed to save key')
    }
  }

  function clearKey() {
    setLocalKey('')
    try {
      localStorage.removeItem('ai_llm_api_key')
      setApiKey('')
    } catch (e) {}
  }

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-gray-100 w-80 md:w-72 flex-shrink-0 border-r border-gray-800">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-700 bg-gray-800">
        <div className="font-semibold">Chats</div>
        <div className="flex gap-2">
          <button
            className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
            onClick={() => createNewSession()}
          >
            + New
          </button>
          <button
            className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
            onClick={() => setShowSettings((v) => !v)}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Settings section */}
      {showSettings && (
        <div className="p-3 border-b border-gray-700 bg-gray-800">
          <div className="text-xs text-gray-300 mb-2">LLM API Key (stored locally)</div>
          <input
            className="w-full p-2 rounded bg-gray-700 text-sm text-gray-100"
            placeholder="Paste API key here"
            value={localKey}
            onChange={(e) => setLocalKey(e.target.value)}
          />
          <div className="flex gap-2 mt-2">
            <button className="px-3 py-1 bg-blue-600 rounded" onClick={saveKey}>
              Save
            </button>
            <button className="px-3 py-1 bg-red-600 rounded" onClick={clearKey}>
              Clear
            </button>
          </div>
          <div className="text-xs text-gray-400 mt-2">
            You can also set <code>VITE_GEMINI_API_KEY</code> in <code>.env</code>
          </div>
        </div>
      )}

      {/* Chat list area */}
      <div className="flex-1 overflow-auto min-h-0">
        {sessions.length === 0 && (
          <div className="p-4 text-gray-400">No chats yet — create one.</div>
        )}

        <ul className="divide-y divide-gray-700">
          {sessions.map((s) => (
            <li
              key={s.id}
              className={`p-3 cursor-pointer flex items-start gap-2 hover:bg-gray-700 ${
                s.id === activeId ? 'bg-gray-700' : ''
              }`}
              onClick={() => setActiveId(s.id)}
            >
              {/* Left text area */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{s.title}</div>
                <div className="text-xs text-gray-400 truncate">
                  {s.lastMessage ? s.lastMessage.slice(0, 50) : ''}
                </div>
              </div>

              {/* Right buttons */}
              <div className="flex-none flex flex-col items-end gap-1">
                <div className="text-[10px] text-gray-400 whitespace-nowrap">
                  {new Date(s.updatedAt).toLocaleString()}
                </div>
                <div className="flex gap-1">
                  <button
                    className="text-xs px-2 py-0.5 bg-gray-600 rounded whitespace-nowrap hover:bg-gray-500"
                    onClick={(e) => {
                      e.stopPropagation()
                      renameSession(s.id)
                    }}
                  >
                    Rename
                  </button>
                  <button
                    className="text-xs px-2 py-0.5 bg-red-600 rounded whitespace-nowrap hover:bg-red-500"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteSession(s.id)
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
