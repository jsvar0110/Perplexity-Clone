import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hook/useAuth'
import ContinueWithGoogle from '../components/ContinueWithGoogle'
import '../auth.css'

const VeltrixLogo = ({ size = 52 }) => (
  <img src="/Veltrix2.png" alt="Veltrix" width={size} height={size} className="auth-brand-logo" />
)

const AuthInput = ({ label, id, type, name, value, onChange, placeholder, icon, extra }) => (
  <div className="auth-field">
    <label htmlFor={id} className="auth-label">{label}</label>
    <div className="auth-input-wrap">
      {icon && <span className="material-symbols-outlined auth-input-icon">{icon}</span>}
      <input id={id} type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required className="auth-input" />
      {extra && <div className="auth-input-extra">{extra}</div>}
    </div>
  </div>
)

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const navigate = useNavigate()
  const { handleRegister } = useAuth()

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

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
    <main className="auth-page auth-page-register">
      <div className="auth-bg" aria-hidden="true" />
      <div className="auth-vignette" aria-hidden="true" />

      <section className="auth-shell">
        <header className="auth-brand-block">
          <div className="auth-brand-lockup">
            <VeltrixLogo />
            <span>Veltrix</span>
          </div>
          <p>Think&nbsp;&nbsp;·&nbsp;&nbsp;Explore&nbsp;&nbsp;·&nbsp;&nbsp;Create</p>
        </header>

        <div className="auth-card auth-fade-in auth-register-card">
          <div className="auth-card-heading">
            <h1>Create your <span>account</span></h1>
            <p>Join Veltrix and start exploring</p>
          </div>

          <form onSubmit={onSubmit} className="auth-form">
            <AuthInput label="Full name" id="reg-username" type="text" name="username" value={form.username} onChange={onChange} placeholder="John Doe" icon="person" />
            <AuthInput label="Email address" id="reg-email" type="email" name="email" value={form.email} onChange={onChange} placeholder="you@example.com" icon="mail" />
            <AuthInput
              label="Password"
              id="reg-password"
              type={showPass ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="Create a password"
              icon="lock"
              extra={(
                <button type="button" className="auth-eye" onClick={() => setShowPass((p) => !p)} aria-label="Toggle password visibility">
                  <span className="material-symbols-outlined">{showPass ? 'visibility_off' : 'visibility'}</span>
                </button>
              )}
            />
{/* 
            <div className="auth-password-rules">
              <span>○ At least 8 characters</span>
              <span>○ Include a number</span>
              <span>○ Include a special character</span>
            </div> */}

            <button type="submit" className="auth-submit-btn">Create account <span>→</span></button>
          </form>

          <div className="auth-divider"><span /> <b>OR</b> <span /></div>
          <ContinueWithGoogle />
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </section>
    </main>
  )
}
