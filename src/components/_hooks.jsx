import { useContext } from 'react'
import { createContext } from 'react'
// This hook proxies to App's ChatContext by importing window.ChatContext if available.
// Simpler approach: consume context via React import path; however to avoid circular imports,
// we expose helper that reads from window.__CHAT_CTX if set by App during render.
export function useChatsLocal(){
  // Try to read context object attached to window by App for simplicity.
  // App passes context through React Context normally; components import this hook to get values.
  if (typeof window !== 'undefined' && window.__CHAT_CTX) return window.__CHAT_CTX
  // fallback safe defaults
  return {
    sessions: [], setSessions: ()=>{}, activeId: null, setActiveId: ()=>{},
    createNewSession: ()=>{}, deleteSession: ()=>{}, renameSession: ()=>{},
    activeSession: null, apiKey: '', setApiKey: ()=>{}
  }
}
