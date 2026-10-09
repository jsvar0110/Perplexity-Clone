import React, { useEffect } from 'react'
import { Link } from 'react-router'
import '../auth.css'
import './privacy-policy.css'

const VeltrixLogo = ({ size = 40 }) => (
  <img src="/Veltrix2.png" alt="Veltrix" width={size} height={size} className="auth-brand-logo" />
)

const Section = ({ number, title, children }) => (
  <section className="pp-section">
    <h2 className="pp-section-title">
      <span className="pp-section-num">{number}</span>
      {title}
    </h2>
    <div className="pp-section-body">{children}</div>
  </section>
)

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <main className="auth-page pp-page">
      <div className="auth-bg" aria-hidden="true" />
      <div className="auth-vignette" aria-hidden="true" />

      <div className="pp-shell auth-fade-in">
        {/* Brand Header */}
        <header className="auth-brand-block pp-header">
          <Link to="/login" className="pp-back-btn" aria-label="Back to login">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="auth-brand-lockup">
            <VeltrixLogo size={48} />
            <span>Veltrix</span>
          </div>
          <p>Think&nbsp;&nbsp;·&nbsp;&nbsp;Explore&nbsp;&nbsp;·&nbsp;&nbsp;Create</p>
        </header>

        {/* Main Card */}
        <article className="pp-card" aria-labelledby="pp-main-title">
          {/* Card Hero */}
          <div className="pp-hero">
            <div className="pp-hero-icon" aria-hidden="true">
              <span className="material-symbols-outlined">shield</span>
            </div>
            <div>
              <h1 id="pp-main-title" className="pp-title">Privacy Policy</h1>
              <p className="pp-subtitle">
                <span className="material-symbols-outlined pp-subtitle-icon">calendar_today</span>
                Last updated: <time dateTime="2026-10-09">October 9, 2026</time>
              </p>
            </div>
          </div>

          <div className="pp-divider" />

          {/* Sections */}
          <div className="pp-content">
            <Section number="1" title="Introduction">
              <p>
                Veltrix AI is an AI-powered application that helps users interact with artificial
                intelligence to obtain information and generate responses. This Privacy Policy
                explains how information may be collected, used, and protected when you use the
                application.
              </p>
            </Section>

            <Section number="2" title="Information We Collect">
              <p>Depending on the features you use, Veltrix AI may process the following information:</p>
              <ul className="pp-list">
                <li>
                  <span className="pp-list-label">Account information</span>
                  Name, email address, and authentication details used to create and access your account.
                </li>
                <li>
                  <span className="pp-list-label">Google sign-in information</span>
                  Basic profile information made available through Google authentication, subject to
                  the permissions you grant.
                </li>
                <li>
                  <span className="pp-list-label">Chat information</span>
                  Messages, prompts, conversation history, and related information you submit through
                  the application.
                </li>
                <li>
                  <span className="pp-list-label">Technical information</span>
                  Information such as request logs and error details that may be processed to
                  maintain and troubleshoot the service.
                </li>
              </ul>
            </Section>

            <Section number="3" title="How We Use Information">
              <p>Information may be used to:</p>
              <ul className="pp-list pp-list-check">
                <li>Create and authenticate user accounts.</li>
                <li>Provide AI-powered responses and application features.</li>
                <li>Save and retrieve conversation history where supported.</li>
                <li>Maintain application security, diagnose errors, and improve reliability.</li>
              </ul>
            </Section>

            <Section number="4" title="Third-Party Services">
              <p>
                Veltrix AI may use third-party services for authentication, hosting, data storage,
                and AI response generation. These services may process information as necessary to
                provide their respective functions and subject to their own policies.
              </p>
              <p>
                Examples may include Google OAuth, MongoDB, hosting providers, and AI model providers.
                The services actually used by the application should be identified and reviewed before
                publication.
              </p>
            </Section>

            <Section number="5" title="Data Storage and Security">
              <p>
                Information may be stored using the application's configured database and
                infrastructure. Reasonable measures should be implemented to protect stored
                information and prevent unauthorized access. However, no method of electronic
                storage or transmission can be guaranteed to be completely secure.
              </p>
            </Section>

            <Section number="6" title="Data Sharing">
              <p>
                Personal information is not intended to be sold. Information may be processed by
                service providers where necessary to operate the application or disclosed where
                required by applicable law.
              </p>
            </Section>

            <Section number="7" title="Data Retention and Deletion">
              <p>
                Information should be retained only for as long as necessary for the purposes
                described in this policy or as required by applicable law. Users may contact the
                application operator to request access to, correction of, or deletion of their
                information, subject to applicable requirements.
              </p>
            </Section>

            <Section number="8" title="Children's Privacy">
              <p>
                Veltrix AI is not intended to be used by children in violation of applicable age
                requirements. If you believe a child has provided personal information
                inappropriately, please contact the application operator.
              </p>
            </Section>

            <Section number="9" title="Changes to This Policy">
              <p>
                This Privacy Policy may be updated from time to time. Any updated version will be
                published on this page with a revised update date.
              </p>
            </Section>

            <Section number="10" title="Contact">
              <p>For privacy-related questions or requests, contact:</p>
              <div className="pp-contact-box">
                <span className="material-symbols-outlined pp-contact-icon">mail</span>
                <div>
                  <span className="pp-contact-label">Email</span>
                  <a href="mailto:support@veltrix.ai" className="pp-contact-email">
                    support@veltrix.ai
                  </a>
                </div>
              </div>
            </Section>
          </div>

          {/* Footer CTA */}
          <div className="pp-footer">
            <Link to="/login" className="pp-back-link">
              <span className="material-symbols-outlined">arrow_back</span>
              Back to Sign In
            </Link>
          </div>
        </article>
      </div>
    </main>
  )
}
