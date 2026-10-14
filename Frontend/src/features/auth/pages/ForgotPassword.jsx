import React, { useState } from 'react'
import { Link } from 'react-router'
import { forgotPassword } from '../service/auth.api.js'
import '../auth.css'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      const data = await forgotPassword({ email })
      
      if (data.code === "GOOGLE_ONLY_ACCOUNT") {
        
        setError("")
        setMessage("")
        window.alert("This account uses Google Sign-In. Password reset isn't available. Please continue with Google.")
        
        return
      }

      setMessage(data.message)

    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page auth-page-login">
      <div className="auth-bg" aria-hidden="true" />
      <div className="auth-vignette" aria-hidden="true" />

      <section className="auth-shell">
        <header className="auth-brand-block">
          <div className="auth-brand-lockup">
            <img src="/Veltrix2.png" alt="Veltrix" width={52} height={52} className="auth-brand-logo" />
            <span>Veltrix</span>
          </div>
        </header>

        <div className="auth-card auth-fade-in">
          <div className="auth-card-heading">
            <h1>Forgot <span>password?</span></h1>
            <p>Enter your email and we'll send you a reset link</p>
            {error && <p className="auth-error">{error}</p>}
            {message && <p className="auth-success">{message}</p>}
          </div>

          <form onSubmit={onSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="fp-email" className="auth-label">Email address</label>
              <div className="auth-input-wrap">
                <span className="material-symbols-outlined auth-input-icon">mail</span>
                <input
                  id="fp-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="auth-input"
                />
              </div>
            </div>
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send reset link'} <span>→</span>
            </button>
          </form>

          <p className="auth-switch">Remembered it? <Link to="/login">Back to login</Link></p>
        </div>
      </section>
    </main>
  )
}