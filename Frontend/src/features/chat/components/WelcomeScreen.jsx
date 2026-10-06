import React from 'react'
import { Logo, FileInput, FilePreview } from './SmallParts.jsx'

const STARTER_CARDS = [
  { icon: 'security', title: 'Audit Smart Contract', desc: 'Detect re-entrancy vectors and gas optimizations in Solidity.' },
  { icon: 'psychology', title: 'Explain a Concept', desc: 'Deep-dive into any topic with clear, structured explanations.' },
  { icon: 'edit_note', title: 'Write & Refine', desc: 'Draft emails, essays, or copy with AI-powered suggestions.' },
]

const WelcomeScreen = ({
  userName,
  chatList,
  onOpenChat,
  chatInput,
  setChatInput,
  onSubmit,
  textareaRef,
  drop, // object returned by useFileDrop()
  audio,
  onMic,
}) => {
  const hour = new Date().getHours()
  const timeGreeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening'

  return (
    <div className="vx-welcome">
      {/* Orb */}
      <div className="vx-orb-wrap vu0">
        <div className="vx-orb-bloom" style={{ width: 200, height: 200 }} />
        <div className="vx-orb" style={{ width: 100, height: 100 }}>
          <Logo size={65} />
        </div>
      </div>

      {/* Greeting */}
      <h1 className="vx-greeting vu1" style={{ fontSize: 34 }}>
        {timeGreeting}, {userName}.
      </h1>
      <p className="vx-subtitle vu1">Can I help you with anything?</p>

      {/* Composer */}
      <div
        className={`vx-composer vu2${drop.isDragging ? ' vx-drag-over' : ''}`}
        style={{ maxWidth: 700, position: 'relative' }}
        onDragOver={drop.handleDragOver}
        onDragLeave={drop.handleDragLeave}
        onDrop={drop.handleDrop}
      >
        {drop.isDragging && (
          <div className="vx-drop-overlay">
            <span className="material-symbols-outlined" style={{ fontSize: 36 }}>upload_file</span>
            <span>Drop your file here</span>
          </div>
        )}
        <FilePreview file={drop.selectedFile} onClear={drop.clearFile} />
        <textarea
          ref={textareaRef}
          className="vx-textarea"
          placeholder="Ask anything… or type / for commands"
          value={chatInput}
          rows={3}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              onSubmit()
            }
          }}
        />
        <FileInput inputRef={drop.fileInputRef} onChange={drop.handleFileChange} />
        <div className="vx-composer-actions">
          <div className="vx-composer-left">
            <button type="button" className="vx-ghost-btn" onClick={() => drop.fileInputRef.current?.click()}>
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>attach_file</span>
              <span>{drop.selectedFile ? 'Change' : 'Attach'}</span>
            </button>
          </div>
          <div className="vx-composer-right">
            <button
              type="button"
              className={`vx-icon-btn ${audio.isRecording ? 'vx-mic-active' : ''}`}
              onClick={onMic}
              title={audio.isRecording ? 'Stop recording' : 'Ask by voice'}
              disabled={audio.isTranscribing}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 19 }}>
                {audio.isTranscribing ? 'progress_activity' : audio.isRecording ? 'stop_circle' : 'mic'}
              </span>
            </button>
            <button
              className="vx-send-btn"
              onClick={onSubmit}
              disabled={!chatInput.trim() && !drop.selectedFile}
            >
              <span>Send</span>
              <span className="material-symbols-outlined" style={{ fontSize: 17 }}>arrow_upward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Starter Cards */}
      <div className="vx-starter-grid vu3" style={{ maxWidth: 700 }}>
        {STARTER_CARDS.map(({ icon, title, desc }) => (
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
            <button key={i} className="vx-quick-link" onClick={() => onOpenChat(c.id)}>
              <span className="vx-quick-link-dot" />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {c.title || 'Untitled'}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default WelcomeScreen