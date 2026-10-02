'use client';

import { useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Chatbot from '../components/Chatbot';
import { useTheme } from '@/contexts/ThemeContext';

const EMAIL_ADDRESS = 'info@amoriaglobal.com';
const EMAIL_SUBJECT = 'Job Application - Amoria Global Tech';
const EMAIL_BODY = `Dear Amoria Global Tech Team,

I am writing to express my interest in joining your team. Please find attached my CV/Resume for your review.

Full Name: 
Position / Role of Interest: 
Portfolio / LinkedIn / GitHub: 

Thank you,
`;

const MAILTO_LINK = `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(EMAIL_BODY)}`;

export default function CareersPage() {
  const { resolvedTheme } = useTheme();
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <>
      <Navbar />

      <main className={`main-content ${resolvedTheme === 'light' ? 'light' : ''}`}>
        {/* Careers Hero Section */}
        <section className="careers-hero-section">
          <div className="container">
            <div className="careers-hero-content">
              <span className="page-hero-badge">
                <i className="bi bi-briefcase-fill"></i> Careers at Amoria
              </span>
              <h1 className="page-hero-title">
                Build the Future of Technology With Us
              </h1>
              <p className="page-hero-description">
                We are always looking for passionate engineers, designers, and innovators to join our team. Send us your CV directly via email and let&apos;s build impactful solutions together.
              </p>
              <div className="careers-hero-actions">
                <a href={MAILTO_LINK} className="action-btn member-btn">
                  <i className="bi bi-envelope-fill me-2"></i> Send Us Your CV
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="container">
          {/* Direct Email Application Card */}
          <section className="careers-form-section" id="apply">
            <div className="careers-email-card">
              <div className="careers-form-header">
                <span className="careers-badge">
                  <i className="bi bi-send-fill"></i> Direct Email Application
                </span>
                <h2 className="careers-form-title">Send Your CV to Our Team</h2>
                <p className="careers-form-subtitle">
                  We review applications directly. Click the button below to open your email client with your CV and details, or send your email directly to <strong>{EMAIL_ADDRESS}</strong>.
                </p>
              </div>

              <div className="careers-email-action-box">
                <a href={MAILTO_LINK} className="careers-email-main-btn">
                  <i className="bi bi-envelope-arrow-up-fill"></i>
                  <span>Send Us Your CV via Email</span>
                  <i className="bi bi-arrow-right"></i>
                </a>

                <div className="careers-copy-email-bar">
                  <span className="careers-email-label">Recruitment Inbox:</span>
                  <span className="careers-email-text">{EMAIL_ADDRESS}</span>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="careers-copy-btn"
                    aria-label="Copy recruitment email address"
                  >
                    {copied ? (
                      <>
                        <i className="bi bi-check2"></i> Copied!
                      </>
                    ) : (
                      <>
                        <i className="bi bi-clipboard"></i> Copy Email
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="careers-email-guidelines">
                <h4 className="careers-guidelines-title">
                  <i className="bi bi-info-circle-fill"></i> What to include in your email:
                </h4>
                <ul className="careers-guidelines-list">
                  <li>
                    <i className="bi bi-file-earmark-pdf-fill"></i>
                    <span><strong>Your CV or Resume</strong> (PDF or Word format)</span>
                  </li>
                  <li>
                    <i className="bi bi-person-badge-fill"></i>
                    <span><strong>Target Role or Expertise</strong> (e.g. Full-Stack, Mobile, UI/UX, Cloud, etc.)</span>
                  </li>
                  <li>
                    <i className="bi bi-link-45deg"></i>
                    <span><strong>Links to Your Work</strong> (GitHub, Portfolio, LinkedIn, or live projects)</span>
                  </li>
                  <li>
                    <i className="bi bi-chat-left-text-fill"></i>
                    <span><strong>A Brief Introduction</strong> telling us what you love to build</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
      <Chatbot />
    </>
  );
}
