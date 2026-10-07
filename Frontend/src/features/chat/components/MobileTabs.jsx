import React from 'react'

const TABS = [
  { id: 'home', icon: 'home', label: 'Home' },
//   { id: 'explore', icon: 'language', label: 'Explore' },
//   { id: 'library', icon: 'folder_open', label: 'Library' },
//   { id: 'files', icon: 'description', label: 'Files' },
  { id: 'history', icon: 'history', label: 'History' },
]

/* Bottom tab bar — mobile only (hidden on desktop via CSS) */
const MobileTabs = ({ onHome, onHistory }) => (
  <nav className="vx-tabbar">
    {TABS.map((t) => (
      <button
        key={t.id}
        className={`vx-tab${t.id === 'home' ? ' active' : ''}`}
        onClick={t.id === 'home' ? onHome : t.id === 'history' ? onHistory : undefined}
      >
        <span className="material-symbols-outlined">{t.icon}</span>
        <span>{t.label}</span>
      </button>
    ))}
  </nav>
)

export default MobileTabs
