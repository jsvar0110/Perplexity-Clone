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
import MobileTabs from '../components/MobileTabs.jsx'
import '../chat.css'

const Dashboard = () => {
  const chat = useChat()
  const audio = useAudio()
  const drop = useFileDrop()
  const dispatch = useDispatch()

  const [chatInput, setChatInput] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
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

  // mobile: open/close drawer · desktop: collapse/expand sidebar
  const toggleSidebar = () =>
    window.matchMedia('(max-width: 768px)').matches
      ? setSidebarOpen((p) => !p)
      : setCollapsed((p) => !p)

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
    <div className="fixed inset-0 flex overflow-hidden vx-root">
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
        collapsed={collapsed}
        onToggle={toggleSidebar}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        chats={filteredChats}
        currentChatId={currentChatId}
        onOpenChat={openChat}
        onNewChat={() => dispatch(setCurrentChatId(null))}
        userName={userName}
      />

      <main className={`vx-main ${hasMessages ? 'is-chat' : 'is-home'}`}>
        <div className="vx-bg" />

        <TopBar
          sidebarOpen={sidebarOpen}
          collapsed={collapsed}
          hasMessages={!!hasMessages}
          userName={userName}
          onToggleSidebar={toggleSidebar}
        />

        <div className="vx-content vx-scroll" style={{ justifyContent: hasMessages ? 'flex-start' : 'center' }}>
          {!hasMessages ? (
            <WelcomeScreen
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
                onEdit={setChatInput}
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

        {!hasMessages && (
          <MobileTabs
            onHome={() => dispatch(setCurrentChatId(null))}
            onHistory={() => setSidebarOpen(true)}
          />
        )}
      </main>
    </div>
  )
}

export default Dashboard