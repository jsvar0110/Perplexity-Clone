import React from 'react'
import { FileInput, FilePreview } from './SmallParts.jsx'

const FloatingInput = ({ chatInput, setChatInput, onSubmit, drop, audio, onMic }) => {
  const canSend = chatInput.trim() || drop.selectedFile

  return (
    <div
      className={`vx-float-bar${drop.isDragging ? ' vx-drag-over' : ''}`}
      style={{ alignSelf: 'center', position: 'relative' }}
      onDragOver={drop.handleDragOver}
      onDragLeave={drop.handleDragLeave}
      onDrop={drop.handleDrop}
    >
      {drop.isDragging && (
        <div className="vx-drop-overlay">
          <span className="material-symbols-outlined" style={{ fontSize: 28 }}>upload_file</span>
          <span>Drop your file here</span>
        </div>
      )}
      <FileInput inputRef={drop.fileInputRef} onChange={drop.handleFileChange} />
      <FilePreview file={drop.selectedFile} onClear={drop.clearFile} />
      <form onSubmit={onSubmit} className="vx-float-inner">
        <button
          type="button"
          className="vx-icon-btn"
          onClick={() => drop.fileInputRef.current?.click()}
          title="Attach file"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>add_circle</span>
        </button>
        <input
          type="text"
          className="vx-input"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Type a follow-up message…"
        />
        <button
          type="button"
          className={`vx-icon-btn ${audio.isRecording ? 'vx-mic-active' : ''}`}
          onClick={onMic}
          title={audio.isRecording ? 'Stop recording' : 'Ask by voice'}
          disabled={audio.isTranscribing}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
            {audio.isTranscribing ? 'progress_activity' : audio.isRecording ? 'stop_circle' : 'mic'}
          </span>
        </button>
        <button
          type="submit"
          className={`vx-circle-send ${canSend ? 'active' : 'inactive'}`}
          disabled={!canSend}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 17, color: 'white' }}>
            arrow_upward
          </span>
        </button>
      </form>
    </div>
  )
}

export default FloatingInput