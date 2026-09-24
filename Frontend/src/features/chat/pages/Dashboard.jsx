import React, { useEffect, useRef, useState } from 'react'

import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import ReactMarkdown from 'react-markdown'
import { useSelector, useDispatch } from 'react-redux'
import { useChat } from '../hooks/useChat'
import { setCurrentChatId } from '../chat.slice'
import remarkGfm from 'remark-gfm'
import '../chat.css'

/* ─── Logo image component (uses the PNG from /public) ─── */
const Logo = ({ size = 28 }) => (
  <img
    src="/Veltrix2.png"
    alt="Veltrix AI Logo"
    width={size}
    height={size}
    className="vx-logo-img"
    style={{ width: size, height: size, objectFit: 'contain' }}
  />
)

/* ─── Small SVG logo for AI message header ─── */
const SmallLogo = () => (
  <svg width="18" height="18" viewBox="0 0 120 120" fill="none">
    <defs>
      <linearGradient id="smG1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c084fc" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
    </defs>
    <path d="M34 36L60 84L86 36L72 36L60 62L48 36H34Z" fill="url(#smG1)" />
    <path d="M60 84L42 48L51 48L60 68L69 48L78 48L60 84Z" fill="white" opacity="0.6" />
  </svg>
)

const Dashboard = () => {
  const chat = useChat()
  const [activeChat, setActiveChat] = useState(null)
  const [chatInput, setChatInput] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const chatBottomRef = useRef(null)
  const textareaRef = useRef(null)

  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()

  // Get user info for avatar
  const userName = user?.username || user?.name || 'User'
  const userInitial = userName.charAt(0).toUpperCase()

  // Filtered chats by search
  const chatList = Object.values(chats)
  const filteredChats = searchQuery
    ? chatList.filter(c => c.title?.toLowerCase().includes(searchQuery.toLowerCase()))
    : chatList

  useEffect(() => {
    chat.initializeSocketConnection()
    chat.handleGetChats()
  }, [])

  // Scroll to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chats, currentChatId])

  const handleSubmit = (e) => {
    e?.preventDefault()
    const trimmed = chatInput.trim()
    if (!trimmed) return
    chat.handleSendMessage({ message: trimmed, chatId: currentChatId })
    setChatInput('')
    textareaRef.current?.focus()
  }

  const openChat = (chatId) => {
    setActiveChat(chatId)
    chat.handleOpenChat(chatId, chats)
    setSidebarOpen(false) // close mobile sidebar
  }

  const closeSidebar = () => setSidebarOpen(false)

  const hasMessages = currentChatId && chats[currentChatId]?.messages?.length > 0

  // Determine time of day for greeting
  const hour = new Date().getHours()
  const timeGreeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening'

  const starterCards = [
    { icon: 'security', title: 'Audit Smart Contract', desc: 'Detect re-entrancy vectors and gas optimizations in Solidity.' },
    { icon: 'psychology', title: 'Explain a Concept', desc: 'Deep-dive into any topic with clear, structured explanations.' },
    { icon: 'edit_note', title: 'Write & Refine', desc: 'Draft emails, essays, or copy with AI-powered suggestions.' },
  ]

  return (
    <div
      className="fixed inset-0 flex overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ─── Mobile overlay ─── */}
      <div
        className={`vx-overlay ${sidebarOpen ? 'show' : ''}`}
        onClick={closeSidebar}
      />

      {/* ═══════════════════════════════════
          SIDEBAR
      ═══════════════════════════════════ */}
      <aside className={`vx-sidebar ${sidebarOpen ? 'open' : ''}`}>

        {/* Brand */}
        <div className="vx-brand" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Logo size={35} />
            <span className="vx-brand-name">Veltrix AI</span>
          </div>
          <button
            onClick={() => { setActiveChat(null); dispatch(setCurrentChatId(null)); }}
            className="vx-icon-btn"
            title="New Chat"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>edit_square</span>
          </button>
        </div>

        {/* Search */}
        <div className="vx-search-wrap">
          <div className="vx-search">
            <span className="material-symbols-outlined">search</span>
            <input
              type="text"
              placeholder="Search chats"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Recent Chats */}
        <div className="vx-section-label">Recent Chats</div>
        <div className="vx-chat-list vx-noscroll">
          {filteredChats.length === 0 ? (
            <div className="vx-no-chats">No recent chats</div>
          ) : (
            filteredChats.map((c) => (
              <button
                key={c.id}
                className={`vx-chat-entry ${activeChat === c.id ? 'active' : ''}`}
                onClick={() => openChat(c.id)}
              >
                <span className="vx-chat-dot" />
                <span className="vx-chat-title">{c.title || 'Untitled Chat'}</span>
              </button>
            ))
          )}
        </div>

        {/* Footer — User */}
        <div className="vx-sidebar-footer">
          <div className="vx-user-row">
            <div className="vx-user-avatar">{userInitial}</div>
            <span className="vx-user-name">{userName}</span>
          </div>
        </div>
      </aside>

      {/* ═══════════════════════════════════
          MAIN CONTENT
      ═══════════════════════════════════ */}
      <main className="vx-main">

        {/* Atmospheric background blobs */}
        <div className="vx-atm">
          <div
            className="vx-atm-blob vx-blob-1"
            style={{
              top: '-12%', left: '22%',
              width: 520, height: 520,
              background: 'rgba(99,102,241,.28)',
              filter: 'blur(110px)',
            }}
          />
          <div
            className="vx-atm-blob vx-blob-2"
            style={{
              top: '30%', right: '-10%',
              width: 580, height: 580,
              background: 'rgba(139,92,246,.24)',
              filter: 'blur(130px)',
            }}
          />
          <div
            className="vx-atm-blob vx-blob-3"
            style={{
              bottom: '-14%', left: '35%',
              width: 500, height: 500,
              background: 'rgba(192,132,252,.18)',
              filter: 'blur(100px)',
            }}
          />
          <div className="vx-grid-bg" />
        </div>

        {/* ── Top Bar ── */}
        <header className="vx-topbar">
          <div className="vx-topbar-left">
            {/* Mobile menu toggle */}
            <button
              className="vx-menu-toggle"
              onClick={() => setSidebarOpen(p => !p)}
              aria-label="Toggle sidebar"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                {sidebarOpen ? 'close' : 'menu'}
              </span>
            </button>

            {/* Model indicator */}
            <div className="vx-model-pill">
              <span className="vx-model-dot" />
              <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600, fontSize: 12.5 }}>
                Veltrix AI
              </span>
            </div>
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button className="vx-icon-btn" title="Settings">
              <span className="material-symbols-outlined" style={{ fontSize: 19 }}>settings</span>
            </button>
            <button className="vx-icon-btn" title="More">
              <span className="material-symbols-outlined" style={{ fontSize: 19 }}>more_vert</span>
            </button>
          </div>
        </header>

        {/* ── Content Area ── */}
        <div className="vx-content vx-scroll" style={{ justifyContent: hasMessages ? 'flex-start' : 'center' }}>

          {!hasMessages ? (

            /* ───── EMPTY / WELCOME STATE ───── */
            <div className="vx-welcome">

              {/* Orb */}
              <div className="vx-orb-wrap vu0">
                <div
                  className="vx-orb-bloom"
                  style={{ width: 200, height: 200 }}
                />
                <div
                  className="vx-orb"
                  style={{ width: 100, height: 100 }}
                >
                  <Logo size={65} />
                </div>
              </div>

              {/* Greeting */}
              <h1
                className="vx-greeting vu1"
                style={{ fontSize: 34 }}
              >
                {timeGreeting}, {userName}.
              </h1>
              <p className="vx-subtitle vu1">
                Can I help you with anything?
              </p>

              {/* Composer */}
              <div className="vx-composer vu2" style={{ maxWidth: 700 }}>
                <textarea
                  ref={textareaRef}
                  className="vx-textarea"
                  placeholder="Ask anything… or type / for commands"
                  value={chatInput}
                  rows={3}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit()
                    }
                  }}
                />
                <div className="vx-composer-actions">
                  <div className="vx-composer-left">
                    <button className="vx-ghost-btn">
                      <span className="material-symbols-outlined" style={{ fontSize: 15 }}>attach_file</span>
                      <span>Attach</span>
                    </button>
                  </div>
                  <div className="vx-composer-right">
                    <button className="vx-icon-btn">
                      <span className="material-symbols-outlined" style={{ fontSize: 19 }}>mic</span>
                    </button>
                    <button
                      className="vx-send-btn"
                      onClick={handleSubmit}
                      disabled={!chatInput.trim()}
                    >
                      <span>Send</span>
                      <span className="material-symbols-outlined" style={{ fontSize: 17 }}>arrow_upward</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Starter Cards */}
              <div className="vx-starter-grid vu3" style={{ maxWidth: 700 }}>
                {starterCards.map(({ icon, title, desc }) => (
                  <div
                    key={title}
                    className="vx-starter-card"
                    onClick={() => setChatInput(`Tell me about: ${title}`)}
                  >
                    <span className="material-symbols-outlined vx-starter-icon">{icon}</span>
                    <div className="vx-starter-title">{title}</div>
                    <div className="vx-starter-desc">{desc}</div>
                  </div>
                ))}
              </div>

              {/* Quick recent links */}
              {chatList.length > 0 && (
                <div className="vu4" style={{ width: '100%', maxWidth: 700, display: 'flex', flexDirection: 'column', gap: 2, marginTop: 6 }}>
                  {chatList.slice(0, 4).map((c, i) => (
                    <button
                      key={i}
                      className="vx-quick-link"
                      onClick={() => openChat(c.id)}
                    >
                      <span className="vx-quick-link-dot" />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.title || 'Untitled'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

          ) : (

            /* ───── CHAT STATE ───── */
            <>
              <div className="vx-thread">
                {chats[currentChatId]?.messages.map((msg, idx) => (
                  <div key={idx}>
                    {msg.role === 'user' ? (
                      <div className="vx-msg-user">
                        <p style={{ margin: 0 }}>{msg.content}</p>
                      </div>
                    ) : (
                      <div className="vx-msg-ai">
                        {/* AI header */}
                        <div className="vx-ai-header">
                          <div className="vx-ai-avatar">
                            <SmallLogo />
                          </div>
                          <span className="vx-ai-name">Veltrix AI</span>
                          <div className="vx-ai-badge">
                            <span className="vx-ai-badge-dot" />
                            Live
                          </div>
                        </div>

                        {/* Markdown content */}
                        <div className="vx-prose">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            components={{
                              p: ({ children }) => <p>{children}</p>,
                              ul: ({ children }) => <ul>{children}</ul>,
                              ol: ({ children }) => <ol>{children}</ol>,
                              strong: ({ children }) => <strong>{children}</strong>,
                              code: ({ children }) => <code>{children}</code>,
                              pre: ({ children }) => <pre>{children}</pre>,
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>

                        {/* Action dock */}
                        <div className="vx-dock">
                          {['content_copy', 'refresh', 'thumb_up', 'thumb_down'].map(icon => (
                            <button key={icon} className="vx-icon-btn" title={icon}>
                              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{icon}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={chatBottomRef} />
              </div>

              {/* Floating input bar */}
              <div className="vx-float-bar" style={{ alignSelf: 'center' }}>
                <form onSubmit={handleSubmit} className="vx-float-inner">
                  <button type="button" className="vx-icon-btn">
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>add_circle</span>
                  </button>
                  <input
                    type="text"
                    className="vx-input"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Type a follow-up message…"
                  />
                  <button type="button" className="vx-icon-btn">
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>mic</span>
                  </button>
                  <button
                    type="submit"
                    className={`vx-circle-send ${chatInput.trim() ? 'active' : 'inactive'}`}
                    disabled={!chatInput.trim()}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 17, color: 'white' }}>
                      arrow_upward
                    </span>
                  </button>
                </form>
              </div>
            </>

          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard