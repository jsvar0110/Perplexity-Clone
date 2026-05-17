import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux'
import { useChat } from "../hooks/useChat"
import remarkGfm from 'remark-gfm'

const Dashboard = () => {
  const chat = useChat()
  const [activeChat, setActiveChat] = useState(0)
  const [chatInput, setChatInput] = useState('')


  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)


  useEffect(() => {
    chat.initializeSocketConnection()
    chat.handleGetChats()
  }, [])



  const handleSubmitMessage = (event) => {
    event.preventDefault()
    const trimmedMessage = chatInput.trim()
    if (!trimmedMessage) {
      return
    }
    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId })
    setChatInput('')
  }

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats)
  }


  return (
    <main
      className="h-screen w-full flex overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 40%, #0a0f1a 70%, #080d14 100%)',
        fontFamily: "'Sora', 'DM Sans', sans-serif",
      }}
    >
      {/* Ambient background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute rounded-full opacity-20 blur-3xl"
          style={{
            width: 500,
            height: 500,
            top: '-10%',
            left: '-5%',
            background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute rounded-full opacity-10 blur-3xl"
          style={{
            width: 400,
            height: 400,
            bottom: '5%',
            right: '10%',
            background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute rounded-full opacity-10 blur-3xl"
          style={{
            width: 300,
            height: 300,
            top: '50%',
            left: '30%',
            background: 'radial-gradient(circle, #0ea5e9 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Sidebar */}
      <aside
        className="relative z-10 flex flex-col w-64 shrink-0 m-3 rounded-2xl p-4"
        style={{
          background: 'linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.09)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 32px rgba(0,0,0,0.4)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-2 mb-6 mt-1">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              boxShadow: '0 0 12px rgba(99,102,241,0.5)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span
            className="text-base font-semibold tracking-tight"
            style={{ color: 'rgba(255,255,255,0.92)' }}
          >
            Perplexity
          </span>
        </div>

        {/* Section label */}
        <p
          className="text-xs font-medium uppercase tracking-widest px-2 mb-2"
          style={{ color: 'rgba(255,255,255,0.25)' }}
        >
          Recent
        </p>

        {/* Chat list */}
        <nav className="flex flex-col gap-1 overflow-y-auto flex-1 pr-1" style={{ scrollbarWidth: 'none' }}>
          {Object.values(chats).map((chat, index) => (
            <button

              onClick={() => {

                setActiveChat(chat.id)
                openChat(chat.id)

              }}

              key={index}
              className="w-full cursor-pointer text-left px-3 py-2 rounded-xl text-sm transition-all duration-200 truncate"
              style={{
                color: activeChat === chat.id ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.45)',
                background: activeChat === chat.id
                  ? 'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(99,102,241,0.15))'
                  : 'transparent',
                border: activeChat === chat.id
                  ? '1px solid rgba(99,102,241,0.3)'
                  : '1px solid transparent',
                boxShadow: activeChat === chat.id ? '0 0 12px rgba(99,102,241,0.15)' : 'none',
                fontWeight: activeChat === chat.id ? 500 : 400,
              }}
            >
              {chat.title}
            </button>
          ))}
        </nav>

        {/* New chat button */}
        <button
          className="mt-4 w-full py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(99,102,241,0.15))',
            border: '1px solid rgba(99,102,241,0.25)',
            color: 'rgba(255,255,255,0.7)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.95)'
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59,130,246,0.35), rgba(99,102,241,0.25))'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(99,102,241,0.15))'
          }}
        >
          <span style={{ fontSize: 16 }}>+</span> New Chat
        </button>
      </aside>

      {/* Main content */}
      <div className="messages flex-1 flex flex-col p-3 pl-0 gap-3 min-w-0">
        {/* Messages */}
        <div className=" flex-1 space-y-3 overflow-y-auto pr-1 pb-30">
          {chats[currentChatId]?.messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[75%] w-fit rounded-2xl px-5 py-2.5 text-sm font-medium ${message.role === "user"
                ? "ml-auto bg-[linear-gradient(135deg,rgba(59,130,246,0.3),rgba(99,102,241,0.2))] backdrop-blur-[20px] border border-[rgba(99,102,241,0.3)] text-[rgba(255,255,255,0.88)] shadow-[0_4px_20px_rgba(99,102,241,0.2),inset_0_1px_0_rgba(255,255,255,0.12)]"
                : "mr-auto bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(99,102,241,0.08))] border border-[rgba(99,102,241,0.15)] text-[rgba(255,255,255,0.85)] shadow-[0_2px_12px_rgba(99,102,241,0.08)]"
                }`}
            >
              {message.role === "ai" ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}

                  components={{
                    p: ({ children }) => <p className='mb-2 last:mb-0'>{children}</p>,
                    ul: ({ children }) => <ul className='mb-2 list-disc pl-5'>{children}</ul>,
                    ol: ({ children }) => <ol className='mb-2 list-decimal pl-5'>{children}</ol>,
                    code: ({ children }) => <code className='rounded bg-white/10 px-1 py-0.5'>{children}</code>,
                    pre: ({ children }) => <pre className='mb-2 overflow-x-auto rounded-xl bg-black/30 p-3'>{children}</pre>
                  }}

                >

                  {message.content}
                  
                </ReactMarkdown>
              ) : (
                <p>{message.content}</p>
              )}
            </div>
          ))}
        </div>

        {/* Chat input */}
        <form
          onSubmit={handleSubmitMessage}
          className="rounded-2xl flex items-center gap-3 px-5 py-3"
          style={{
            background: 'linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 24px rgba(0,0,0,0.35)',
          }}
        >
          <input
            type="text"
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            placeholder="Ask anything…"
            className="flex-1 bg-transparent outline-none text-sm"
            style={{
              color: 'rgba(255,255,255,0.85)',
              caretColor: '#6366f1',
            }}
          />
          <button
            type="submit"
            disabled={!chatInput.trim()}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              background: chatInput.trim()
                ? 'linear-gradient(135deg, #3b82f6, #6366f1)'
                : 'rgba(255,255,255,0.05)',
              color: chatInput.trim() ? 'white' : 'rgba(255,255,255,0.3)',
              border: '1px solid',
              borderColor: chatInput.trim() ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.06)',
              boxShadow: chatInput.trim() ? '0 0 16px rgba(99,102,241,0.35)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
              <path d="M4 12H20M14 6L20 12L14 18" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
      </div>
    </main>
  )
}

export default Dashboard