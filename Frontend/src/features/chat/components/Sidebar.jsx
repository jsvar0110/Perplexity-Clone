import React from 'react'
import { Logo } from './SmallParts.jsx'

const Sidebar = ({
  open,
  searchQuery,
  setSearchQuery,
  chats,
  currentChatId,
  onOpenChat,
  onNewChat,
  userName,
}) => (
  <aside className={`vx-sidebar ${open ? 'open' : ''}`}>
    {/* Brand */}
    <div className="vx-brand" style={{ justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <Logo size={35} />
        <span className="vx-brand-name">Veltrix AI</span>
      </div>
      <button onClick={onNewChat} className="vx-icon-btn" title="New Chat">
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
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>

    {/* Recent Chats */}
    <div className="vx-section-label">Recent Chats</div>
    <div className="vx-chat-list vx-noscroll">
      {chats.length === 0 ? (
        <div className="vx-no-chats">No recent chats</div>
      ) : (
        chats.map((c) => (
          <button
            key={c.id}
            className={`vx-chat-entry ${currentChatId === c.id ? 'active' : ''}`}
            onClick={() => onOpenChat(c.id)}
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
        <div className="vx-user-avatar">{userName.charAt(0).toUpperCase()}</div>
        <span className="vx-user-name">{userName}</span>
      </div>
    </div>
  </aside>
)

export default Sidebar