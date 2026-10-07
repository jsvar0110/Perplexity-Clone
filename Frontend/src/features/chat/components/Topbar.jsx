import React from 'react'
import { Logo } from './SmallParts.jsx'

const TopBar = ({ sidebarOpen, collapsed, hasMessages, userName = 'User', onToggleSidebar }) => (
  <header className={`vx-topbar ${hasMessages ? 'is-chat' : 'is-home'}${collapsed ? ' sb-collapsed' : ''}`}>
    <div className="vx-topbar-left">
      {/* Sidebar toggle (mobile always, desktop when collapsed) */}
      <button className="vx-menu-toggle" onClick={onToggleSidebar} aria-label="Toggle sidebar">
        <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
          {sidebarOpen ? 'close' : 'menu'}
        </span>
      </button>

      {/* Model indicator (desktop chat view) */}
      <div className="vx-model-pill">
        <span className="vx-model-dot" />
        <span className="vx-model-name">Veltrix AI</span>
      </div>
    </div>

    {/* Centered brand (mobile) */}
    <div className="vx-topbar-brand">
      <Logo size={34} />
      <span className="vx-brand-name">Veltrix</span>
    </div>

    {/* Right side */}
    <div className="vx-topbar-right">
      <button className="vx-more-btn" title="More">
        <span className="material-symbols-outlined">more_horiz</span>
      </button>
      <div className="vx-topbar-avatar">{userName.charAt(0).toUpperCase()}</div>
    </div>
  </header>
)

export default TopBar
