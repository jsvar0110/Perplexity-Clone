import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams, Navigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useAuth } from '../hook/useAuth.js'
import ContinueWithGoogle from '../components/ContinueWithGoogle'
import '../auth.css'

const VeltrixLogo = ({ size = 40 }) => (
  <img src="/Veltrix2.png" alt="Veltrix" width={size} height={size} className="auth-brand-logo" />
)

const AuthInput = ({ label, id, type, value, onChange, placeholder, icon, extra }) => (
  <div className="auth-field">
    <label htmlFor={id} className="auth-label">{label}</label>
    <div className="auth-input-wrap">
      {icon && <span className="material-symbols-outlined auth-input-icon">{icon}</span>}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="auth-input"
      />
      {extra && <div className="auth-input-extra">{extra}</div>}
    </div>
  </div>
)

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const user = useSelector((s) => s.auth.user)
  const loading = useSelector((s) => s.auth.loading)
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
    <main className="auth-page auth-page-login">
      <div className="auth-bg" aria-hidden="true" />
      <div className="auth-vignette" aria-hidden="true" />

      <section className="auth-shell">
        <header className="auth-brand-block">
          <div className="auth-brand-lockup">
            <VeltrixLogo size={52} />
            <span>Veltrix</span>
          </div>
          <p>Think&nbsp;&nbsp;·&nbsp;&nbsp;Explore&nbsp;&nbsp;·&nbsp;&nbsp;Create</p>
        </header>

        <div className="auth-card auth-fade-in">
          <div className="auth-card-heading">
            <h1>Welcome <span>back</span></h1>
            <p>Sign in to continue your journey</p>
            {err && <p className="auth-error">Google sign-in failed. Try again or use email.</p>}
          </div>

          <form onSubmit={onSubmit} className="auth-form">
            <AuthInput
              label="Email address"
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              icon="mail"
            />
            <AuthInput
              label="Password"
              id="login-password"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              icon="lock"
              extra={(
                <button type="button" className="auth-eye" onClick={() => setShowPass((p) => !p)} aria-label="Toggle password visibility">
                  <span className="material-symbols-outlined">{showPass ? 'visibility_off' : 'visibility'}</span>
                </button>
              )}
            />
            <button type="submit" className="auth-submit-btn">Sign In <span>→</span></button>
          </form>

          <div className="auth-divider"><span /> <b>OR</b> <span /></div>
          <ContinueWithGoogle />

          <p className="auth-switch">Don't have an account? <Link to="/register">Sign up</Link></p>
        </div>
      </section>
    </main>
  )
}
