import React, { useEffect, useState, useRef, createContext, useContext } from 'react'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'

const ChatContext = createContext(null)
function useChats() {
  const ctx = useContext(ChatContext)
  if (!ctx) {
    console.warn('ChatContext not found — using safe defaults. Wrap App with provider.')
    return {
      sessions: [], setSessions: () => {}, activeId: null, setActiveId: () => {},
      createNewSession: () => {}, deleteSession: () => {}, renameSession: () => {},
      activeSession: null, apiKey: '', setApiKey: () => {}
    }
  }
  return ctx
}

const STORAGE_KEY = 'ai_chat_sessions_v1'
const STORAGE_ACTIVE = 'ai_chat_active_v1'
const API_KEY_STORAGE = 'ai_llm_api_key'

function saveToStorage(sessions){ try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions)) }catch(e){console.error(e)} }
function loadFromStorage(){ try{ const raw = localStorage.getItem(STORAGE_KEY); return raw?JSON.parse(raw):null }catch(e){return null} }
function saveActiveSession(id){ try{ if(id===null)localStorage.removeItem(STORAGE_ACTIVE); else localStorage.setItem(STORAGE_ACTIVE,id) }catch(e){} }
function loadActiveSession(){ try{ return localStorage.getItem(STORAGE_ACTIVE) }catch(e){return null} }
function uid(prefix=''){ return prefix + Math.random().toString(36).slice(2,9) }
function nowISO(){ return new Date().toISOString() }

async function callLLM(prompt, signal) {
  // Load key from localStorage or .env
  const storedKey = (() => {
    try { return localStorage.getItem(API_KEY_STORAGE) } catch(e) { return null }
  })();

  const API_KEY = storedKey || import.meta.env.VITE_GEMINI_API_KEY || '';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  if (!API_KEY) {
    const demo = `💡 Demo reply — no API key configured.\n\nPrompt preview:\n${prompt.slice(0,800)}`;
    return new Promise(res => setTimeout(() => res(demo), 600));
  }

  // Gemini API expects a specific JSON shape
  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  };

  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`LLM error: ${resp.status} ${text}`);
    }

    const data = await resp.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No response text found.";
    return text;
  } catch (err) {
    console.error("LLM error", err);
    throw new Error("Network error calling LLM: " + err.message);
  }
}


function createDefaultSession(n=1){
  const id = uid('s_'); const now = nowISO()
  return { id, title:`New Chat ${n}`, createdAt:now, updatedAt:now, lastMessage:'', messages:[{ id: uid('m_'), role:'system', text:'You are chatting with an AI assistant.', ts: now }] }
}

export default function App(){
  const [sessions, setSessionsRaw] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [apiKey, setApiKey] = useState(()=>{ try{ return localStorage.getItem(API_KEY_STORAGE) || '' }catch(e){return ''} })

  useEffect(()=>{
    const loaded = loadFromStorage()
    if(loaded && Array.isArray(loaded) && loaded.length>0){
      setSessionsRaw(loaded)
      const savedActive = loadActiveSession()
      if(savedActive && loaded.some(s=>s.id===savedActive)) setActiveId(savedActive)
      else setActiveId(loaded[0].id)
    } else {
      const first = createDefaultSession(1)
      setSessionsRaw([first])
      setActiveId(first.id)
    }
  },[])

  useEffect(()=>{ saveToStorage(sessions) },[sessions])
  useEffect(()=>{ saveActiveSession(activeId) },[activeId])

  function setSessions(next){ setSessionsRaw(next) }
  function createNewSession(){ const index = sessions.length+1; const s = createDefaultSession(index); const next=[s,...sessions]; setSessions(next); setActiveId(s.id) }
  function deleteSession(id){ if(!confirm('Delete this chat session?')) return; const next = sessions.filter(s=>s.id!==id); setSessions(next); if(activeId===id) setActiveId(next.length?next[0].id:null) }
  function renameSession(id){ const name = prompt('Enter new name for this chat'); if(!name) return; const next = sessions.map(s=> s.id===id?{...s, title:name, updatedAt:nowISO()}:s); setSessions(next) }

  const activeSession = sessions.find(s=>s.id===activeId) || null

  const ctx = { sessions, setSessions, activeId, setActiveId, createNewSession, deleteSession, renameSession, activeSession, apiKey, setApiKey }
// Expose context on window to simplify component imports (used by _hooks.jsx)
try { if (typeof window !== 'undefined') window.__CHAT_CTX = ctx } catch(e){}


  return (
    <ChatContext.Provider value={ctx}>
      <div className="min-h-screen flex flex-col md:flex-row bg-white text-slate-900">
        <aside className="hidden md:block md:w-72 lg:w-80 fixed inset-y-0 left-0 bg-gray-800 text-white z-20">
  <Sidebar />
</aside>

        <main className="flex-1 flex flex-col md:ml-72 lg:ml-80 min-h-screen">
          <div className="md:hidden p-2 border-b flex items-center justify-between">
            <div className="font-semibold">AI Chat</div>
            <div className="flex gap-2"><button className="px-3 py-1 border rounded" onClick={()=>createNewSession()}>New</button></div>
          </div>
          <div className="flex-1 flex"><ChatWindow callLLM={callLLM} /></div>
        </main>
      </div>
    </ChatContext.Provider>
  )
}
