import React from 'react'
import { FileInput, FilePreview, ToolPills, ComposerTools } from './SmallParts.jsx'
import { usePills } from '../hooks/usePills.js'

const WelcomeScreen = ({
  chatInput,
  setChatInput,
  onSubmit,
  textareaRef,
  drop, // object returned by useFileDrop()
  audio,
  onMic,
}) => {
  const pills = usePills({
    chatInput,
    setChatInput,
    onAttach: () => drop.fileInputRef.current?.click(),
    focus: () => textareaRef.current?.focus(),
  })
  const canSend = chatInput.trim() || drop.selectedFile

  return (
    <div className="vx-welcome">
      <div className="vx-eyebrow">
        <span>Think</span><i>·</i><span>Explore</span><i>·</i><span>Create</span>
      </div>

      <h1 className="vx-headline">
        What do you want to <em>know?</em>
      </h1>

      {/* Composer */}
      <div
        className={`vx-composer${drop.isDragging ? ' vx-drag-over' : ''}`}
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
          placeholder="Ask anything..."
          value={chatInput}
          rows={2}
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
          <ToolPills pills={pills} variant="inline" />
          <ComposerTools
            pills={pills}
            drop={drop}
            audio={audio}
            onMic={onMic}
            canSend={canSend}
            onSubmit={onSubmit}
          />
        </div>
      </div>

      {/* Remaining pills sit under the box on mobile */}
      <ToolPills pills={pills} variant="below" />
    </div>
  )
}

export default WelcomeScreen
