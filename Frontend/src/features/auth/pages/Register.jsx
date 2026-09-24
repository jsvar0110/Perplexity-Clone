import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hook/useAuth'
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


const AuthInput = ({ label, id, type, name, value, onChange, placeholder, icon, extra }) => (
  <div>
    <label htmlFor={id} className="auth-label">{label}</label>
    <div className="relative">
      {icon && (
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px]" style={{ color: '#938e9f', pointerEvents: 'none' }}>
          {icon}
        </span>
      )}
      <input
        id={id} type={type} name={name} value={value}
        onChange={onChange} placeholder={placeholder} required
        className={`auth-input${icon ? '' : ' no-icon'}`}
        style={extra ? { paddingRight: '2.75rem' } : {}}
      />
      {extra && <div className="absolute right-3 top-1/2 -translate-y-1/2">{extra}</div>}
    </div>
  </div>
)

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const navigate = useNavigate()
  const { handleRegister } = useAuth()

  const onChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await handleRegister(form)
      alert('Registration successful! Please verify your email before logging in.')
      navigate('/login')
    } catch (err) {
      alert(err?.response?.data?.message || 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="auth-page">

      {/* ── Blobs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="auth-blob-1 absolute rounded-full" style={{ top: '-10%', right: '15%', width: 500, height: 500, background: 'rgba(140,60,220,.32)', filter: 'blur(120px)', mixBlendMode: 'screen' }} />
        <div className="auth-blob-2 absolute rounded-full" style={{ bottom: '10%', left: '-5%', width: 540, height: 540, background: 'rgba(91,140,246,.28)', filter: 'blur(130px)', mixBlendMode: 'screen' }} />
        <div className="auth-blob-3 absolute rounded-full" style={{ top: '40%', right: '40%', width: 400, height: 400, background: 'rgba(50,130,255,.22)', filter: 'blur(110px)', mixBlendMode: 'screen' }} />
        <div className="absolute inset-0 auth-grid-bg" />
      </div>

      {/* ── Hero ── */}
      <div className="auth-hero">
        {/* Brand */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="auth-logo-box" style={{ width: 40, height: 40 }}>
              <div className="auth-logo-inner w-full h-full p-1.5"><VeltrixLogo size={27} /></div>
            </div>
            <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15, color: '#e4e1ea' }}>Veltrix AI</span>
          </div>
          <span style={{ padding: '3px 10px', borderRadius: 9999, fontSize: 10, fontWeight: 700, letterSpacing: '.06em', background: 'rgba(52,211,153,.15)', color: '#6ee7b7', border: '1px solid rgba(52,211,153,.3)' }}>
            REGISTRATION ACTIVE
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8 py-8 px-8">
          <div className="auth-telemetry">
            <div className="flex flex-wrap gap-2 mb-5">
              {['QUANTUM ENCLAVE', 'FP16 PRECISION', 'NODE US-EAST-01'].map(c => (
                <span key={c} className="auth-chip">{c}</span>
              ))}
            </div>
            {/* Concentric ring orb */}
            <div className="flex items-center justify-center my-5 relative" style={{ height: 160 }}>
              {[160, 120, 80].map((s, i) => (
                <div key={i} className="absolute rounded-full" style={{ width: s, height: s, border: `1px solid rgba(124,92,232,${.15 + i * .1})`, animation: `auth-pulse ${3 + i}s ease infinite` }} />
              ))}
              <div className="relative flex items-center justify-center rounded-full" style={{ width: 80, height: 80, background: 'linear-gradient(135deg,rgba(91,140,247,.25),rgba(124,92,232,.3))', border: '1px solid rgba(124,92,232,.4)' }}>
                <VeltrixLogo size={44} />
              </div>
            </div>
            {/* Feature cells */}
            <div className="grid grid-cols-2 gap-3">
              {[
                ['memory', '4096-D Continuous Latent'], ['speed', '142 t/s Sub-token Pipeline'],
                ['shield', 'Zero-Knowledge Enclave'], ['hub', 'FP16 Precision Inferencing'],
              ].map(([icon, text]) => (
                <div key={text} className="auth-metric flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px]" style={{ color: '#7c5ce8', flexShrink: 0 }}>{icon}</span>
                  <span style={{ fontSize: 11, color: '#cac4d6', lineHeight: 1.4 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center" style={{ maxWidth: 400 }}>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 28, fontWeight: 700, letterSpacing: '-.02em', color: '#fff', marginBottom: 16 }}>
              Join the Future of{' '}
              <span style={{ background: 'linear-gradient(135deg,#5b8cf7,#ccbeff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Intelligence.</span>
            </h2>
            <div className="flex flex-col gap-3 text-left">
              {[
                ['psychology', 'Multi-modal Autonomous Reasoning'],
                ['verified_user', 'Deterministic Sandboxing & Verifiable Execution'],
                ['bolt', 'Sub-20ms Global Latency & Sovereign Enclaves'],
              ].map(([icon, text]) => (
                <div key={text} className="auth-feature-item">
                  <span className="material-symbols-outlined text-[18px]" style={{ color: '#ccbeff', flexShrink: 0 }}>{icon}</span>
                  <span style={{ fontSize: 13, color: '#cac4d6', lineHeight: 1.4 }}>{text}</span>
                </div>
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
            <div className="flex items-center justify-center flex-shrink-0 rounded-xl" style={{ width: 44, height: 44, background: 'linear-gradient(135deg,#5b8cf7,#7c5ce8)', boxShadow: '0 0 20px rgba(124,92,232,.45)', fontSize: 20 }}>
              🚀
            </div>
            <div>
              <h1 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 22, color: '#fff', letterSpacing: '-.01em' }}>Create Account</h1>
              <p style={{ fontSize: 13, color: '#938e9f', marginTop: 2 }}>Register to start your Veltrix journey.</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <AuthInput label="Operator Handle" id="reg-username" type="text" name="username"
              value={form.username} onChange={onChange} placeholder="Enter username" icon="person" />
            <AuthInput label="Email Address" id="reg-email" type="email" name="email"
              value={form.email} onChange={onChange} placeholder="operator@veltrix.ai" icon="mail" />
            <AuthInput label="Passphrase" id="reg-password" type={showPass ? 'text' : 'password'} name="password"
              value={form.password} onChange={onChange} placeholder="Create a secure passphrase" icon="lock"
              extra={
                <button type="button" onClick={() => setShowPass(p => !p)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#938e9f', display: 'flex' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    {showPass ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              }
            />
            <button type="submit" className="auth-submit-btn mt-1">
              <span>Create Account</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </form>

          <p className="text-center mt-5" style={{ fontSize: 13, color: '#938e9f' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#ccbeff', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
          </p>
          <p className="text-center mt-3" style={{ fontSize: 11, color: '#484554', letterSpacing: '.04em' }}>
            SECURE ENCLAVE REGISTRATION • TLS 1.3 • AES-256-GCM
          </p>
        </div>
      </div>
    </div>
  )
}