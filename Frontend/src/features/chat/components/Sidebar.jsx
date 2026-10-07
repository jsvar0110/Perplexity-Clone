import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Logo } from './SmallParts.jsx'

const NAV = [
  { id: 'home', icon: 'home', label: 'Home' },
  // { id: 'explore', icon: 'language', label: 'Explore' },
  // { id: 'library', icon: 'folder_open', label: 'Library' },
  // { id: 'files', icon: 'description', label: 'Files' },
  { id: 'history', icon: 'history', label: 'History' },
]

/* Group chats into Today / Yesterday / 7 days ago / Older by lastUpdated */
const groupChats = (chats) => {
  const dayStart = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const today = dayStart(new Date())
  const groups = [
    { label: 'Today', items: [] },
    { label: 'Yesterday', items: [] },
    { label: '7 days ago', items: [] },
    { label: 'Older', items: [] },
  ]
  chats.forEach((c) => {
    const diff = c.lastUpdated ? Math.round((today - dayStart(new Date(c.lastUpdated))) / 86400000) : 99
    if (diff <= 0) groups[0].items.push(c)
    else if (diff === 1) groups[1].items.push(c)
    else if (diff <= 7) groups[2].items.push(c)
    else groups[3].items.push(c)
  })
  return groups.filter((g) => g.items.length)
}

const Sidebar = ({
  open,
  collapsed,
  onToggle,
  searchQuery,
  setSearchQuery,
  chats,
  currentChatId,
  onOpenChat,
  onNewChat,
  userName,
}) => {
  const user = useSelector((state) => state.auth.user)
  const [showSearch, setShowSearch] = useState(false)
  const searchRef = useRef(null)

  const handleNav = (id) => {
    if (id === 'home') return onNewChat()
    if (id === 'history') {
      setShowSearch((p) => !p)
      setTimeout(() => searchRef.current?.focus(), 0)
    }
  }

  const groups = groupChats(chats)

  return (
    <aside className={`vx-sidebar${open ? ' open' : ''}${collapsed ? ' collapsed' : ''}`}>
      {/* Brand */}
      <div className="vx-brand">
        <div className="vx-brand-left">
          <Logo size={44} />
          <span className="vx-brand-name">Veltrix</span>
        </div>
        <button className="vx-collapse-btn" onClick={onToggle} title="Toggle sidebar" aria-label="Toggle sidebar">
          <span className="material-symbols-outlined vx-collapse-icon"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h320v-560H200v560Zm560 0v-560H600v560h160Z"/></svg></span>
          <span className="material-symbols-outlined vx-close-icon">close</span>
        </button>
      </div>

      {/* New chat */}
      <div className="vx-newchat-wrap">
        <button onClick={onNewChat} className="vx-newchat" title="New Chat">
          <span className="material-symbols-outlined"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen preview-icon"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg></span>
          <span>New chat</span>
        </button>
      </div>

      {/* Primary nav */}
      <nav className="vx-nav">
        {NAV.map((n) => (
          <button
            key={n.id}
            className={`vx-nav-item${n.id === 'home' && !currentChatId ? ' active' : ''}${n.id === 'history' && showSearch ? ' active' : ''}`}
            onClick={() => handleNav(n.id)}
          >
            <span className="material-symbols-outlined">{n.icon}</span>
            <span>{n.label}</span>
          </button>
        ))}
      </nav>

      {/* Search (opens from History) */}
      {showSearch && (
        <div className="vx-search-wrap">
          <div className="vx-search">
            <span className="material-symbols-outlined">search</span>
            <input
              ref={searchRef}
              type="text"
              placeholder="Search chats"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Chats grouped by date */}
      <div className="vx-chat-list vx-noscroll">
        {chats.length === 0 ? (
          <div className="vx-no-chats">No recent chats</div>
        ) : (
          groups.map((g) => (
            <div key={g.label} className="vx-chat-group">
              <div className="vx-section-label">{g.label}</div>
              {g.items.map((c) => (
                <div key={c.id} className={`vx-chat-row${currentChatId === c.id ? ' active' : ''}`}>
                  <button className="vx-chat-entry" onClick={() => onOpenChat(c.id)}>
                    <span className="material-symbols-outlined vx-chat-icon">chat_bubble_outline</span>
                    <span className="vx-chat-title">{c.title || 'Untitled Chat'}</span>
                  </button>
                  {/* <button className="vx-chat-more" title="More" onClick={(e) => e.stopPropagation()}>
                    <span className="material-symbols-outlined">more_horiz</span>
                  </button> */}
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Footer — user */}
      <div className="vx-sidebar-footer">
        <div className="vx-user-row">
          <div className="vx-user-avatar">{userName.charAt(0).toUpperCase()}</div>
          <div className="vx-user-meta">
            <span className="vx-user-name">{userName}</span>
            {user?.email && <span className="vx-user-email">{user.email}</span>}
          </div>
          {/* <button className="vx-user-gear" title="Settings">
            <span className="material-symbols-outlined">settings</span>
          </button> */}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
