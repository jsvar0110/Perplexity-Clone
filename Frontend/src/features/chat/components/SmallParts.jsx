import React, { useState } from 'react'

/* ─── Generated image with download button ─── */
export function GeneratedImage({ src, alt }) {
  const [busy, setBusy] = useState(false)

  const handleDownload = async () => {
    try {
      setBusy(true)
      const res = await fetch(src)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `veltrix-image-${Date.now()}.jpg`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {
      window.open(src, '_blank') // fallback: open in new tab
    } finally {
      setBusy(false)
    }
  }

  return (
    <span className="vx-img-wrap">
      <img src={src} alt={alt} />
      <button
        type="button"
        className="vx-img-dl"
        onClick={handleDownload}
        disabled={busy}
        title="Download image"
      >
        <span
          className={`material-symbols-outlined ${busy ? 'vx-spin' : ''}`}
          style={{ fontSize: 18 }}
        >
          {busy ? 'progress_activity' : (
            <svg xmlns="http://www.w3.org/2000/svg" height="34px" viewBox="0 -960 960 960" width="34px" fill="#e3e3e3"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" /></svg>
          )}
        </span>
      </button>
    </span>
  )
}

/* ─── Logo image component ─── */
export const Logo = ({ size = 28 }) => (
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
export const SmallLogo = () => (
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

/* ─── AI status indicator (thinking / searching / ...) ─── */
const STATUS_MAP = {
  thinking: { icon: 'psychology', text: 'Understanding your question...' },
  searching: { icon: 'travel_explore', text: 'Searching the web...' },
  researching: { icon: 'menu_book', text: 'Reviewing search results...' },
  writing: { icon: 'edit_note', text: 'Writing response...' },
  imagining: { icon: 'image', text: 'Generating image...' },
}

export const AIActivity = ({ status }) => {
  const current = STATUS_MAP[status] || STATUS_MAP.thinking
  return (
    <div className="vx-ai-activity">
      <span className="material-symbols-outlined vx-activity-icon">{current.icon}</span>
      <span className="vx-activity-text">{current.text}</span>
      <span className="vx-activity-dots">
        <span />
        <span />
        <span />
      </span>
    </div>
  )
}

/* ─── Hidden file input ─── */
export const FileInput = ({ inputRef, onChange }) => (
  <input
    ref={inputRef}
    type="file"
    hidden
    accept=".pdf,.docx,.txt,.md,.csv,.json,image/png,image/jpeg,image/webp"
    onChange={onChange}
  />
)

/* ─── Selected-file chip ─── */
export const FilePreview = ({ file, onClear }) =>
  file ? (
    <div className="vx-file-preview">
      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>description</span>
      <span className="vx-file-name">{file.name}</span>
      <button type="button" onClick={onClear}>×</button>
    </div>
  ) : null