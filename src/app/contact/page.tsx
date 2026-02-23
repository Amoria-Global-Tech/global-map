'use client';

import { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Chatbot from '../components/Chatbot';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function ContactUsPage() {
  const { resolvedTheme } = useTheme();
  const { t } = useLanguage();

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mounted, setMounted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setError(result.message || t.contact.error);
      }
    } catch {
      setError(t.contact.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!mounted) {
    return <div></div>;
  }

  if (submitted) {
    return (
      <>
        <Navbar />
        <main className={`main-content ${resolvedTheme === 'light' ? 'light' : ''}`}>
          <div className="container">
            <div className="contact-success">
              <div className="success-icon">
                <i className="bi bi-check-circle"></i>
              </div>
              <h2 className="success-title">{t.contact.success.split('!')[0]}!</h2>
              <p className="success-text">{t.contact.success}</p>
              <button onClick={() => setSubmitted(false)} className="success-btn">
                {t.contact.submit}
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className={`main-content ${resolvedTheme === 'light' ? 'light' : ''}`}>
        <div className="container">
          {/* Hero Section */}
          <section className="page-hero">
            <h1 className="page-hero-title">{t.contact.title}</h1>
            <p className="page-hero-description">{t.contact.subtitle}</p>
          </section>

          {/* Contact Content */}
          <section className="contact-section">
            <div className="contact-grid">
              {/* Contact Info */}
              <div className="contact-info-card">
                <h2 className="contact-info-title">{t.contact.form_title}</h2>

                <div className="contact-info-list">
                  <div className="contact-info-item">
                    <div className="contact-info-icon">
                      <i className="bi bi-envelope"></i>
                    </div>
                    <div className="contact-info-details">
                      <h3>{t.contact.email_label}</h3>
                      <p>info@amoriaglobal.com</p>
                    </div>
                  </div>

                  <div className="contact-info-item">
                    <div className="contact-info-icon">
                      <i className="bi bi-telephone"></i>
                    </div>
                    <div className="contact-info-details">
                      <h3>{t.contact.phone_label}</h3>
                      <p>+250 788 437 347</p>
                    </div>
                  </div>

                  <div className="contact-info-item">
                    <div className="contact-info-icon">
                      <i className="bi bi-geo-alt"></i>
                    </div>
                    <div className="contact-info-details">
                      <h3>{t.contact.address}</h3>
                      <p>KK 84B St, EVA PLAZA Building</p>
                      <p>Nyarugunga, Kicukiro, Kigali, Rwanda</p>
                      <p style={{ fontSize: '0.85em', opacity: 0.7 }}>Near Rwanda Military Hospital</p>
                    </div>
                  </div>

                  <div className="contact-info-item">
                    <div className="contact-info-icon">
                      <i className="bi bi-clock"></i>
                    </div>
                    <div className="contact-info-details">
                      <h3>{t.contact.working_hours}</h3>
                      <p>{t.contact.working_hours_text}</p>
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="contact-map" style={{ marginTop: '1.5rem', borderRadius: '12px', overflow: 'hidden' }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.5!2d29.969!3d-1.974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca7f0b4f15b5f%3A0x2cf6f9e1a8b5e5a0!2sEVA%20PLAZA!5e0!3m2!1sen!4v1708000000000"
                    width="100%"
                    height="250"
                    style={{ border: 0, borderRadius: '12px' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Office Location - EVA PLAZA, Kigali"
                  />
                </div>

                {/* Stats */}
                <div className="contact-stats">
                  <div className="contact-stat">
                    <span className="contact-stat-value">24h</span>
                    <span className="contact-stat-label">Response Time</span>
                  </div>
                  <div className="contact-stat">
                    <span className="contact-stat-value">50+</span>
                    <span className="contact-stat-label">Happy Clients</span>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="contact-form-card">
                <h2 className="contact-form-title">{t.contact.form_title}</h2>

                {error && (
                  <div className="contact-error">
                    <i className="bi bi-exclamation-triangle"></i>
                    <p>{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <label htmlFor="name">{t.contact.name} *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder={t.contact.name_placeholder}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">{t.contact.email} *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder={t.contact.email_placeholder}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">
                      {t.contact.phone} <span className="optional">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder={t.contact.phone_placeholder}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">{t.contact.message} *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      placeholder={t.contact.message_placeholder}
                    />
                    <span className="char-count">{formData.message.length} characters</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
                    className="contact-submit-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="loading-spinner small"></div>
                        {t.contact.sending}
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send"></i>
                        {t.contact.submit}
                      </>
                    )}
                  </button>
                </form>

                <p className="contact-privacy">
                  {t.footer.privacy} & {t.footer.terms}
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {mounted && showScrollTop && (
        <button
          className="scroll-to-top"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <i className="bi bi-arrow-up"></i>
        </button>
      )}

      <Chatbot />
      <Footer />
    </>
  );
}
