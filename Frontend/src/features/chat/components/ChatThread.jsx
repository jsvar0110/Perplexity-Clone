import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { Logo, AIActivity, GeneratedImage } from './SmallParts.jsx'

const mdComponents = {
  p: ({ children }) => <p>{children}</p>,
  ul: ({ children }) => <ul>{children}</ul>,
  ol: ({ children }) => <ol>{children}</ol>,
  strong: ({ children }) => <strong>{children}</strong>,
  code: ({ children }) => <code>{children}</code>,
  pre: ({ children }) => <pre>{children}</pre>,
  img: ({ src, alt }) => <GeneratedImage src={src} alt={alt} />,
}

const ChatThread = ({ messages = [], audio, bottomRef, onEdit }) => {
  const [copiedIdx, setCopiedIdx] = useState(null)

  const handleCopy = async (text, idx) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIdx(idx)
      setTimeout(() => setCopiedIdx(null), 1500)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  const DOCK = [
    { icon: 'content_copy', title: 'Copy' },
    { icon: 'thumb_up', title: 'Good response' },
    { icon: 'thumb_down', title: 'Bad response' },
    { icon: 'refresh', title: 'Regenerate' },
  ]

  return (
    <div className="vx-thread">
      {messages.map((msg, idx) => (
        <div key={idx}>
          {msg.role === 'user' ? (
            <div className="vx-msg-user-row">
              <div className="vx-msg-user">
                <p style={{ margin: 0 }}>{msg.content}</p>
              </div>
              <button
                className="vx-icon-btn vx-edit-btn"
                title="Edit"
                onClick={() => onEdit?.(msg.content)}
              >
                <span className="material-symbols-outlined">edit</span>
              </button>
            </div>
          ) : (
            <div className="vx-msg-ai">
              <div className="vx-ai-avatar"><Logo size={24} /></div>

              <div className="vx-ai-card">
                {/* Markdown content */}
                <div className="vx-prose">
                  {msg.isStreaming && <AIActivity status={msg.status} />}
                  {msg.content && (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                      components={mdComponents}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </div>

                {/* Action dock */}
                <div className="vx-dock">
                  {DOCK.map(({ icon, title }) => (
                    <button
                      key={icon}
                      className="vx-icon-btn"
                      title={title}
                      onClick={icon === 'content_copy' ? () => handleCopy(msg.content, idx) : undefined}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                        {icon === 'content_copy' && copiedIdx === idx ? 'check' : icon}
                      </span>
                    </button>
                  ))}
                  <button
                    className="vx-icon-btn"
                    title={audio.speakingMsgId === idx ? 'Stop' : 'Listen'}
                    onClick={() => audio.playText(msg.content, idx)}
                    disabled={!msg.content || msg.isStreaming}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                      {audio.speakingMsgId === idx ? 'stop_circle' : 'volume_up'}
                    </span>
                  </button>
                  <button className="vx-icon-btn" title="More">
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>more_vert</span>
                  </button>

                  {audio.isGenerating && audio.speakingMsgId === idx && (
                    <span className="flex items-center gap-1 text-xs" style={{ marginLeft: 'auto', opacity: 0.8 }}>
                      <span className="material-symbols-outlined vx-spin" style={{ fontSize: 14 }}>
                        progress_activity
                      </span>
                      Generating audio… {audio.countdown}s
                    </span>
                  )}

                  {audio.speakingMsgId === idx && !audio.isGenerating && (
                    <img src="./audio-active-2.webp" alt="Audio playing" className="vx-audio-gif" />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}

export default ChatThread
