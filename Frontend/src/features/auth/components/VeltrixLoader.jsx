import React, { useEffect, useState, useRef } from 'react'
import '../veltrix-loader.css'

const STAGES = [
  { at: 0, label: 'Starting up' },
  { at: 22, label: 'Securing session' },
  { at: 50, label: 'Loading your data' },
  { at: 78, label: 'Almost there' },
  { at: 98, label: 'Ready' },
]

function getLabel(pct) {
  let label = STAGES[0].label
  for (const s of STAGES) { if (pct >= s.at) label = s.label }
  return label
}

export default function VeltrixLoader() {
  const [pct, setPct] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const raf = useRef(null)
  const start = useRef(null)
  const DURATION = 2000

  // Logo reveals first, THEN bar starts filling
  useEffect(() => {
    const revealTimer = setTimeout(() => setRevealed(true), 250)
    return () => clearTimeout(revealTimer)
  }, [])

  useEffect(() => {
    if (!revealed) return
    function tick(ts) {
      if (!start.current) start.current = ts
      const elapsed = ts - start.current
      const next = Math.min(Math.floor((elapsed / DURATION) * 100), 100)
      setPct(next)
      if (next < 100) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [revealed])

  return (
    <main className="vl-page" role="status" aria-live="polite" aria-label="Loading Veltrix">
      <div className="vl-center">

        {/* Logo — Netflix-style dramatic reveal */}
        <div className={`vl-logo-wrap ${revealed ? 'vl-revealed' : ''}`}>
          <img src="/Veltrix2.png" alt="Veltrix" className="vl-logo" />
          {/* Bloom flare that fires once */}
          <span className="vl-flare" aria-hidden="true" />
        </div>

        {/* Brand name — sweeps in after logo */}
        <h1 className={`vl-title ${revealed ? 'vl-title-in' : ''}`}>
          VELTRIX
        </h1>

        {/* Progress bar group — fades in after reveal */}
        <div className={`vl-bar-group ${revealed ? 'vl-bar-visible' : ''}`}>
          <div className="vl-track">
            <div className="vl-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="vl-meta">
            <span className="vl-label" key={getLabel(pct)}>{getLabel(pct)}</span>
            <span className="vl-pct">{pct}<em>%</em></span>
          </div>
        </div>

      </div>
    </main>
  )
}