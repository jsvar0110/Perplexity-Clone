import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { resetPassword } from '../service/auth.api.js'
import '../auth.css'

export default function ResetPassword() {
  const [params] = useSearchParams()
  const token = params.get('token')

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState(token ? '' : 'Invalid or missing reset link.')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) return setError('Passwords do not match.')
    setLoading(true)
    try {
      const data = await resetPassword({ token, password })
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
            <h1>Reset <span>password</span></h1>
            <p>Choose a new password for your account</p>
            {error && <p className="auth-error">{error}</p>}
            {message && <p className="auth-success">{message}</p>}
          </div>

          {!message && token && (
            <form onSubmit={onSubmit} className="auth-form">
              <div className="auth-field">
                <label htmlFor="rp-password" className="auth-label">New password</label>
                <div className="auth-input-wrap">
                  <span className="material-symbols-outlined auth-input-icon">lock</span>
                  <input
                    id="rp-password"
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                    className="auth-input"
                  />
                  <div className="auth-input-extra">
                    <button type="button" className="auth-eye" onClick={() => setShowPass((p) => !p)} aria-label="Toggle password visibility">
                      <span className="material-symbols-outlined">{showPass ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="auth-field">
                <label htmlFor="rp-confirm" className="auth-label">Confirm password</label>
                <div className="auth-input-wrap">
                  <span className="material-symbols-outlined auth-input-icon">lock</span>
                  <input
                    id="rp-confirm"
                    type={showPass ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Re-enter your password"
                    required
                    className="auth-input"
                  />
                </div>
              </div>
              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? 'Saving...' : 'Reset password'} <span>→</span>
              </button>
            </form>
          )}

          <p className="auth-switch">
            {message ? <Link to="/login">Go to login</Link> : <>Link expired? <Link to="/forgot-password">Request a new one</Link></>}
          </p>
        </div>
      </section>
    </main>
  )
}