import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useChat } from '../hooks/useChat'
import { useAudio } from '../hooks/useAudio'
import { useFileDrop } from '../hooks/UseFileDrop.js'
import { setCurrentChatId, setLimitNotice } from '../chat.slice'

import Sidebar from '../components/Sidebar.jsx'
import TopBar from '../components/Topbar.jsx'
import WelcomeScreen from '../components/WelcomeScreen.jsx'
import ChatThread from '../components/ChatThread.jsx'
import FloatingInput from '../components/FloatingInput.jsx'
import '../chat.css'

const BLOBS = [
  { cls: 'vx-blob-1', pos: { top: '-12%', left: '22%' }, size: 520, color: 'rgba(99,102,241,.28)', blur: 110 },
  { cls: 'vx-blob-2', pos: { top: '30%', right: '-10%' }, size: 580, color: 'rgba(139,92,246,.24)', blur: 130 },
  { cls: 'vx-blob-3', pos: { bottom: '-14%', left: '35%' }, size: 500, color: 'rgba(192,132,252,.18)', blur: 100 },
]

const Dashboard = () => {
  const chat = useChat()
  const audio = useAudio()
  const drop = useFileDrop()
  const dispatch = useDispatch()

  const [chatInput, setChatInput] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const chatBottomRef = useRef(null)
  const textareaRef = useRef(null)

  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const limitNotice = useSelector((state) => state.chat.limitNotice)
  const user = useSelector((state) => state.auth.user)

  const userName = user?.username || user?.name || 'User'

  const chatList = Object.values(chats).sort(
    (a, b) => new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0)
  )
  const filteredChats = searchQuery
    ? chatList.filter((c) => c.title?.toLowerCase().includes(searchQuery.toLowerCase()))
    : chatList

  const hasMessages = currentChatId && chats[currentChatId]?.messages?.length > 0

  useEffect(() => {
    chat.initializeSocketConnection()
    chat.handleGetChats()
  }, [])

  // Scroll to bottom when switching chats
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'auto' })
  }, [currentChatId])

  // Auto-hide limit toast
  useEffect(() => {
    if (!limitNotice) return
    const t = setTimeout(() => dispatch(setLimitNotice(null)), 6000)
    return () => clearTimeout(t)
  }, [limitNotice, dispatch])

  const handleSubmit = (e) => {
    e?.preventDefault()
    const trimmed = chatInput.trim()
    if (!trimmed && !drop.selectedFile) return
    chat.handleSendMessage({
      message: trimmed || 'Please read the attached file.',
      chatId: currentChatId,
      file: drop.selectedFile,
    })
    setChatInput('')
    drop.clearFile()
    textareaRef.current?.focus()
  }

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats)
    setSidebarOpen(false)
  }

  const handleMicToggle = async () => {
    if (audio.isRecording) {
      const text = await audio.stopRecording()
      if (text?.trim()) chat.handleSendMessage({ message: text.trim(), chatId: currentChatId })
      return
    }
    await audio.startRecording()
  }

  return (
    <div className="fixed inset-0 flex overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {limitNotice && (
        <div className="vx-limit-toast" role="alert">
          <div>
            <strong>{limitNotice.feature === 'image' ? 'Daily image limit reached' : 'Daily voice limit reached'}</strong>
            <p>{limitNotice.message}</p>
          </div>
          <button onClick={() => dispatch(setLimitNotice(null))}>✕</button>
        </div>
      )}

      {/* Mobile overlay */}
      <div className={`vx-overlay ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)} />

      <Sidebar
        open={sidebarOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        chats={filteredChats}
        currentChatId={currentChatId}
        onOpenChat={openChat}
        onNewChat={() => dispatch(setCurrentChatId(null))}
        userName={userName}
      />

      <main className="vx-main">
        {/* Atmospheric background blobs */}
        <div className="vx-atm">
          {BLOBS.map((b) => (
            <div
              key={b.cls}
              className={`vx-atm-blob ${b.cls}`}
              style={{ ...b.pos, width: b.size, height: b.size, background: b.color, filter: `blur(${b.blur}px)` }}
            />
          ))}
          <div className="vx-grid-bg" />
        </div>

        <TopBar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((p) => !p)} />

        <div className="vx-content vx-scroll" style={{ justifyContent: hasMessages ? 'flex-start' : 'center' }}>
          {!hasMessages ? (
            <WelcomeScreen
              userName={userName}
              chatList={chatList}
              onOpenChat={openChat}
              chatInput={chatInput}
              setChatInput={setChatInput}
              onSubmit={handleSubmit}
              textareaRef={textareaRef}
              drop={drop}
              audio={audio}
              onMic={handleMicToggle}
            />
          ) : (
            <>
              <ChatThread
                messages={chats[currentChatId]?.messages}
                audio={audio}
                bottomRef={chatBottomRef}
              />
              <FloatingInput
                chatInput={chatInput}
                setChatInput={setChatInput}
                onSubmit={handleSubmit}
                drop={drop}
                audio={audio}
                onMic={handleMicToggle}
              />
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard