import React, { useRef } from 'react'
import { FileInput, FilePreview, ToolPills, ComposerTools } from './SmallParts.jsx'
import { usePills } from '../hooks/usePills.js'

const FloatingInput = ({ chatInput, setChatInput, onSubmit, drop, audio, onMic }) => {
  const inputRef = useRef(null)
  const canSend = chatInput.trim() || drop.selectedFile
  const pills = usePills({
    chatInput,
    setChatInput,
    onAttach: () => drop.fileInputRef.current?.click(),
    focus: () => inputRef.current?.focus(),
  })

  return (
    <div
      className={`vx-float-bar${drop.isDragging ? ' vx-drag-over' : ''}`}
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
      <form onSubmit={onSubmit} className="vx-float-inner">
        <FilePreview file={drop.selectedFile} onClear={drop.clearFile} />
        <input
          ref={inputRef}
          type="text"
          className="vx-input"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask anything..."
        />
        <div className="vx-composer-actions">
          <ToolPills pills={pills} variant="inline" />
          <ComposerTools pills={pills} drop={drop} audio={audio} onMic={onMic} canSend={canSend} />
        </div>
      </form>
    </div>
  )
}

export default FloatingInput
