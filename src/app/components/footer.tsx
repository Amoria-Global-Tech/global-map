'use client';

import Link from "next/link";
import { useState } from 'react';
import { api } from '../api/utils/apiService';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await api.post('/public/newsletter/subscribe', { email });

      if (!response || response.success === undefined) {
        throw new Error('Server unavailable. Please try again later.');
      }

      if (!response.success) {
        throw new Error(response.error || 'Failed to subscribe');
      }

      setStatus('success');
      setMessage('Thank you for subscribing!');
      setEmail('');

      // Reset after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Failed to subscribe. Please try again.');

      // Reset after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    }
  };

  return (
    <>
      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-column">
              <h3 className="footer-title">Useful Links</h3>
              <ul className="footer-links">
                <li><Link href="/" className="footer-link">Home</Link></li>
                <li><Link href="/about" className="footer-link">About Us</Link></li>
                <li><Link href="/services" className="footer-link">Services</Link></li>
                <li><Link href="/products" className="footer-link">Products</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-title">Newsletter</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Subscribe to get the latest updates and news
              </p>
              <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={status === 'loading'}
                    style={{
                      flex: 1,
                      padding: '0.6rem',
                      borderRadius: '4px',
                      border: '1px solid #475569',
                      backgroundColor: '#1e293b',
                      color: 'white',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    style={{
                      padding: '0.6rem 1.2rem',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: status === 'loading' ? '#64748b' : '#3b82f6',
                      color: 'white',
                      fontSize: '0.9rem',
                      cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    {status === 'loading' ? 'Sending...' : 'Subscribe'}
                  </button>
                </div>
                {message && (
                  <p style={{
                    fontSize: '0.85rem',
                    color: status === 'success' ? '#22c55e' : '#ef4444',
                    margin: '0.25rem 0 0 0'
                  }}>
                    {message}
                  </p>
                )}
              </form>
            </div>

            <div className="footer-column">
              <h3 className="footer-title">Our Location</h3>
              <a
                href="https://maps.google.com/?q=Kigali,Rwanda"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-location-link"
              >
                <i className="bi bi-geo-alt-fill"></i>
                <span>Kigali, Rwanda</span>
              </a>
            </div>

            <div className="footer-column">
              <h3 className="footer-title">Contact Us</h3>
              <div className="footer-contact ">
                <a href="tel:+250788437347" className="contact-item">
                  <i className="bi bi-telephone-fill contact-icon"></i>
                  <span className="contact-text">+250 788 437 347</span>
                </a>
                <a href="mailto:info@amoriaglobal.com" className="contact-item">
                  <i className="bi bi-envelope-fill contact-icon"></i>
                  <span className="contact-text">info@amoriaglobal.com</span>
                </a>
                <div className="contact-item">
                  <i className="bi bi-clock-fill contact-icon"></i>
                  <span className="contact-text">Mon-Fri: 8am - 6pm</span>
                </div>
              </div>
            </div>

            <div className="footer-column">
              <h3 className="footer-title">Follow Us On </h3>
              <div className="social-links">
                <a
                  href="https://facebook.com/share/1Ga8spfH7y/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link facebook"
                >
                  <i className="bi bi-facebook"></i>
                </a>
                <a
                  href="https://www.instagram.com/amoria_global_tech/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link instagram"
                >
                  <i className="bi bi-instagram"></i>
                </a>
                <a
                  href="https://x.com/amoria32419"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link twitter"
                >
                  <i className="bi bi-twitter-x"></i>
                </a>
                <a
                  href="https://www.linkedin.com/in/amoria-global-tech-8a774736b/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link linkedin"
                >
                  <i className="bi bi-linkedin"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">© 2025 Amoria Global Tech. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
export default Footer;