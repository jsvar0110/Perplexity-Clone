import { useState } from 'react'

export const PILLS = [
  { id: 'deep', icon: 'keyboard_command_key', label: 'Deep Research', prefix: 'Do deep research on: ' },
  { id: 'web', icon: 'language', label: 'Web Search', prefix: 'Search the web for: ' },
  { id: 'file', icon: 'attach_file', label: 'Analyze File', prefix: null },
  { id: 'image', icon: 'image', label: 'Image Generation', prefix: 'Generate an image of: ' },
]

export function usePills({ chatInput, setChatInput, onAttach, focus }) {
  const [active, setActive] = useState('deep') // set to null for "nothing highlighted" at start

  const pick = (id) => {
    const pill = PILLS.find((p) => p.id === id)
    setActive(id)
    if (!pill.prefix) {
      onAttach?.()
      return
    }
    const rest = PILLS.reduce(
      (t, p) => (p.prefix && t.startsWith(p.prefix) ? t.slice(p.prefix.length) : t),
      chatInput
    )
    setChatInput(pill.prefix + rest)
    focus?.()
  }

  return { active, pick }
}

