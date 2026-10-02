'use client';

import { useState, useEffect } from 'react';
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

export type EmailClientKey = 'gmail' | 'outlook' | 'yahoo' | 'default';

export interface EmailClientOption {
  key: EmailClientKey;
  name: string;
  subtitle: string;
  icon: string;
  iconColor: string;
  getUrl: () => string;
  isExternal: boolean;
}

const EMAIL_CLIENTS: EmailClientOption[] = [
  {
    key: 'gmail',
    name: 'Gmail',
    subtitle: 'Open directly in Gmail web composer',
    icon: 'bi-google',
    iconColor: '#ea4335',
    getUrl: () =>
      `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL_ADDRESS)}&su=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(EMAIL_BODY)}`,
    isExternal: true,
  },
  {
    key: 'outlook',
    name: 'Outlook / Office 365',
    subtitle: 'Open in Outlook.com web composer',
    icon: 'bi-microsoft',
    iconColor: '#0078d4',
    getUrl: () =>
      `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(EMAIL_ADDRESS)}&subject=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(EMAIL_BODY)}`,
    isExternal: true,
  },
  {
    key: 'yahoo',
    name: 'Yahoo Mail',
    subtitle: 'Open in Yahoo Mail web composer',
    icon: 'bi-envelope-at-fill',
    iconColor: '#7b16ff',
    getUrl: () =>
      `https://compose.mail.yahoo.com/?to=${encodeURIComponent(EMAIL_ADDRESS)}&subj=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(EMAIL_BODY)}`,
    isExternal: true,
  },
  {
    key: 'default',
    name: 'Default Mail App',
    subtitle: 'Apple Mail, Windows Mail, Thunderbird',
    icon: 'bi-laptop',
    iconColor: '#2ba268',
    getUrl: () =>
      `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(EMAIL_BODY)}`,
    isExternal: false,
  },
];

const PREF_STORAGE_KEY = 'amoria_email_client_pref';

export default function CareersPage() {
  const { resolvedTheme } = useTheme();
  const [preferredClient, setPreferredClient] = useState<EmailClientKey | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rememberPreference, setRememberPreference] = useState(true);
  const [copied, setCopied] = useState(false);

  // Load saved preference from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PREF_STORAGE_KEY) as EmailClientKey | null;
      if (saved && EMAIL_CLIENTS.some((c) => c.key === saved)) {
        setPreferredClient(saved);
      }
    } catch {
      // Ignore errors in environments where localStorage is restricted
    }
  }, []);

  // Handle body scroll locking and Escape key when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsModalOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isModalOpen]);

  const handleLaunchClient = (clientKey: EmailClientKey) => {
    const client = EMAIL_CLIENTS.find((c) => c.key === clientKey);
    if (!client) return;

    if (rememberPreference) {
      try {
        localStorage.setItem(PREF_STORAGE_KEY, clientKey);
        setPreferredClient(clientKey);
      } catch {
        // Ignore
      }
    }

    setIsModalOpen(false);

    const url = client.getUrl();
    if (client.isExternal) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = url;
    }
  };

  const handlePrimaryClick = () => {
    if (preferredClient) {
      handleLaunchClient(preferredClient);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleClearPreference = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      localStorage.removeItem(PREF_STORAGE_KEY);
    } catch {
      // Ignore
    }
    setPreferredClient(null);
    setIsModalOpen(true);
  };

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

  const activeClientInfo = preferredClient
    ? EMAIL_CLIENTS.find((c) => c.key === preferredClient)
    : null;

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
                <button
                  type="button"
                  onClick={handlePrimaryClick}
                  className="careers-email-main-btn"
                >
                  {activeClientInfo ? (
                    <>
                      <i className={`bi ${activeClientInfo.icon}`}></i>
                      <span>Send Us Your CV via {activeClientInfo.name}</span>
                      <i className="bi bi-box-arrow-up-right"></i>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-envelope-arrow-up-fill"></i>
                      <span>Send Us Your CV</span>
                      <i className="bi bi-arrow-right"></i>
                    </>
                  )}
                </button>
              </div>

              {activeClientInfo && (
                <div className="careers-pref-active-bar" style={{ marginTop: '1.25rem' }}>
                  <span>
                    Current preference: <strong>{activeClientInfo.name}</strong>
                  </span>
                  <span>&bull;</span>
                  <button
                    type="button"
                    onClick={handleClearPreference}
                    className="careers-change-pref-btn"
                  >
                    Change preference
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Email Preferences Modal */}
      {isModalOpen && (
        <div
          className="email-pref-backdrop"
          onClick={() => setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="email-pref-title"
        >
          <div
            className="email-pref-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="email-pref-header">
              <div>
                <span className="careers-badge">
                  <i className="bi bi-sliders"></i> Email Preferences
                </span>
                <h3 id="email-pref-title" className="email-pref-title">
                  Choose How to Send Your CV
                </h3>
                <p className="email-pref-subtitle">
                  Select your preferred email client to compose to {EMAIL_ADDRESS}
                </p>
              </div>
              <button
                type="button"
                className="email-pref-close-btn"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close dialog"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="email-pref-body">
              {EMAIL_CLIENTS.map((client) => {
                const isCurrent = preferredClient === client.key;
                return (
                  <button
                    key={client.key}
                    type="button"
                    className={`email-client-btn ${isCurrent ? 'active' : ''}`}
                    onClick={() => handleLaunchClient(client.key)}
                  >
                    <div
                      className="email-client-icon-wrap"
                      style={{ color: client.iconColor }}
                    >
                      <i className={`bi ${client.icon}`}></i>
                    </div>
                    <div className="email-client-details">
                      <span className="email-client-name">
                        {client.name}
                        {isCurrent && (
                          <span className="email-client-badge">Current</span>
                        )}
                      </span>
                      <span className="email-client-sub">{client.subtitle}</span>
                    </div>
                    <i className="bi bi-arrow-right email-client-arrow"></i>
                  </button>
                );
              })}
            </div>

            <div className="email-pref-footer">
              <label className="email-pref-remember">
                <input
                  type="checkbox"
                  checked={rememberPreference}
                  onChange={(e) => setRememberPreference(e.target.checked)}
                />
                <span>Remember this preference for next time</span>
              </label>

              <div className="email-pref-footer-actions">
                {preferredClient ? (
                  <button
                    type="button"
                    onClick={handleClearPreference}
                    className="email-pref-reset-btn"
                  >
                    Reset saved preference
                  </button>
                ) : (
                  <span style={{ fontSize: 'var(--fs-xs)', color: 'rgba(255, 255, 255, 0.45)' }}>
                    You can change your preference anytime
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="careers-copy-btn"
                >
                  {copied ? (
                    <>
                      <i className="bi bi-check2"></i> Copied {EMAIL_ADDRESS}
                    </>
                  ) : (
                    <>
                      <i className="bi bi-clipboard"></i> Copy Email
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <Chatbot />
    </>
  );
}
