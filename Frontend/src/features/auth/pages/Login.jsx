import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { useAuth } from '../hook/useAuth'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'
import ContinueWithGoogle from '../components/ContinueWithGoogle'
import '../auth.css'

const VeltrixLogo = ({ size = 32 }) => (
  <img
    src="/Veltrix2.png"
    alt="Veltrix AI"
    width={size}
    height={size}
    style={{ width: size, height: size, objectFit: 'contain', filter: 'brightness(1.1)' }}
  />
)

const AuthInput = ({ label, id, type, value, onChange, placeholder, icon, extra }) => (
  <div>
    <label htmlFor={id} className="auth-label">{label}</label>
    <div className="relative">
      {icon && (
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px]" style={{ color: '#938e9f', pointerEvents: 'none' }}>
          {icon}
        </span>
      )}
      <input
        id={id} type={type} value={value} onChange={onChange}
        placeholder={placeholder} required
        className={`auth-input${icon ? '' : ' no-icon'}`}
        style={extra ? { paddingRight: '2.75rem' } : {}}
      />
      {extra && <div className="absolute right-3 top-1/2 -translate-y-1/2">{extra}</div>}
    </div>
  </div>
)

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)

  const user = useSelector(s => s.auth.user)
  const loading = useSelector(s => s.auth.loading)
  const { handleLogin } = useAuth()
  const navigate = useNavigate()

  const [params] = useSearchParams()
  const err = params.get('error')

  const onSubmit = async (e) => {
    e.preventDefault()
    await handleLogin({ email, password })
    navigate('/')
  }

  if (!loading && user) return <Navigate to="/" replace />

  return (
    <div className="auth-page">

      {/* ── Blobs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="auth-blob-1 absolute rounded-full" style={{ top: '-10%', left: '20%', width: 500, height: 500, background: 'rgba(91,140,246,.35)', filter: 'blur(120px)', mixBlendMode: 'screen' }} />
        <div className="auth-blob-2 absolute rounded-full" style={{ top: '30%', right: '-5%', width: 580, height: 580, background: 'rgba(140,60,220,.28)', filter: 'blur(140px)', mixBlendMode: 'screen' }} />
        <div className="auth-blob-3 absolute rounded-full" style={{ bottom: '-10%', left: '40%', width: 460, height: 460, background: 'rgba(50,130,255,.22)', filter: 'blur(110px)', mixBlendMode: 'screen' }} />
        <div className="absolute inset-0 auth-grid-bg" />
      </div>

      {/* ── Hero ── */}
      <div className="auth-hero">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="auth-logo-box" style={{ width: 40, height: 40 }}>
            <div className="auth-logo-inner w-full h-full p-1.5"><VeltrixLogo size={27} /></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15, color: '#e4e1ea' }}>Veltrix AI</span>
              <span className="auth-chip">v2.4 Cognitive Engine</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8 py-8 px-8">
          <div className="auth-telemetry">
            <div className="flex flex-wrap gap-2 mb-5">
              {['NEURAL MESH ACTIVE', '142 t/s', 'ZK ENCLAVE ONLINE'].map(c => (
                <span key={c} className="auth-chip">{c}</span>
              ))}
            </div>
            {/* Neural orb */}
            <div className="flex items-center justify-center my-5 relative" style={{ height: 160 }}>
              <div className="absolute rounded-full auth-pulse" style={{ width: 180, height: 180, background: 'radial-gradient(ellipse, rgba(124,92,232,.4) 0%, rgba(91,140,247,.3) 40%, transparent 70%)', filter: 'blur(28px)' }} />
              <div className="relative flex items-center justify-center rounded-full" style={{ width: 110, height: 110, background: 'linear-gradient(135deg,rgba(91,140,247,.2),rgba(124,92,232,.25))', border: '1px solid rgba(124,92,232,.35)' }}>
                <VeltrixLogo size={56} />
              </div>
            </div>
            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3">
              {[['Latent Space', '4096-D'], ['Throughput', '142 t/s'], ['Latency', '<20ms'], ['Enclave', 'Active']].map(([l, v]) => (
                <div key={l} className="auth-metric">
                  <div style={{ fontSize: 11, color: '#938e9f', marginBottom: 4, letterSpacing: '.04em' }}>{l}</div>
                  <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, color: '#ccbeff' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center" style={{ maxWidth: 400 }}>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 30, fontWeight: 700, letterSpacing: '-.02em', color: '#fff', marginBottom: 8 }}>
              Intelligence{' '}
              <span style={{ background: 'linear-gradient(135deg,#5b8cf7,#ccbeff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Reimagined.</span>
            </h2>
            <p style={{ color: '#cac4d6', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
              Empowering founders, researchers, and creators with autonomous reasoning.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {['Multi-modal Reasoning', 'Sub-20ms Latency', 'ZK Enclaves'].map(f => (
                <span key={f} className="auth-feature-chip">{f}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Form panel ── */}
      <div className="auth-form-panel">
        <div className="auth-card auth-fade-in">
          {/* Header */}
          <div className="flex items-center gap-3 mb-7">
            <div className="auth-logo-box flex-shrink-0" style={{ width: 44, height: 44 }}>
              <div className="auth-logo-inner w-full h-full p-2"><VeltrixLogo size={28} /></div>
            </div>
            <div>
              <h1 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 22, color: '#fff', letterSpacing: '-.01em' }}>Welcome Back</h1>
              <p style={{ fontSize: 13, color: '#938e9f', marginTop: 2 }}>Sign in to continue your journey.</p>
              {err && <p style={{ color: '#ffb4ab', fontSize: 13, marginBottom: 12 }}>Google sign-in failed. Try again or use email.</p>}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <AuthInput label="Email address" id="login-email" type="email"
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@veltrix.ai" icon="mail" />
            <AuthInput label="Password" id="login-password" type={showPass ? 'text' : 'password'}
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password" icon="lock"
              extra={
                <button type="button" onClick={() => setShowPass(p => !p)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#938e9f', display: 'flex' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    {showPass ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              }
            />
            <button type="submit" className="auth-submit-btn mt-1">Sign In</button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-gray-500">OR</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <ContinueWithGoogle />

          <p className="text-center mt-5" style={{ fontSize: 13, color: '#938e9f' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#ccbeff', fontWeight: 600, textDecoration: 'none' }}>Register</Link>
          </p>
          <p className="text-center mt-3" style={{ fontSize: 11, color: '#484554', letterSpacing: '.04em' }}>
            SECURE ENCLAVE • TLS 1.3 • AES-256-GCM
          </p>
        </div>
      </div>
    </div>
  )
}