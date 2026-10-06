import React from 'react'

const TopBar = ({ sidebarOpen, onToggleSidebar }) => (
  <header className="vx-topbar">
    <div className="vx-topbar-left">
      {/* Mobile menu toggle */}
      <button className="vx-menu-toggle" onClick={onToggleSidebar} aria-label="Toggle sidebar">
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
)

export default TopBar