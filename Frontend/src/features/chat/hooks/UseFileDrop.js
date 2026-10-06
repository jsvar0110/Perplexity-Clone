import { useRef, useState } from 'react'

const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/markdown',
  'text/csv',
  'application/json',
  'image/png',
  'image/jpeg',
  'image/webp',
]

/**
 * Handles everything about attaching a file:
 * selected file state, file-picker input, drag & drop.
 */
export function useFileDrop() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragCounterRef = useRef(0)
  const fileInputRef = useRef(null)

  const clearFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleFileChange = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > MAX_SIZE) {
      alert('File is too large (max 10 MB)')
      e.target.value = ''
      return
    }
    setSelectedFile(f)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current += 1
    if (dragCounterRef.current === 1) setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current -= 1
    if (dragCounterRef.current === 0) setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current = 0
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert(`Unsupported file type: ${file.type || file.name}`)
      return
    }
    if (file.size > MAX_SIZE) {
      alert('File is too large (max 10 MB)')
      return
    }
    setSelectedFile(file)
  }

  return {
    selectedFile,
    isDragging,
    fileInputRef,
    clearFile,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  }
}