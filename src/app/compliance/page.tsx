'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Chatbot from '../components/Chatbot';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CompliancePage() {
  const { resolvedTheme } = useTheme();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  return (
    <>
      <Navbar />

      <main className={`main-content ${resolvedTheme === 'light' ? 'light' : ''}`}>
        <div className="container">
          {/* Hero Section */}
          <section className="page-hero">
            <h1 className="page-hero-title">{t.compliance.title}</h1>
            <p className="page-hero-description">{t.compliance.subtitle}</p>
          </section>

          {/* Compliance Cards */}
          <div className="compliance-grid">
            {/* ICT Chamber Card */}
            <div className="compliance-card">
              <div className="compliance-card-logo">
                <Image
                  src="/partners/ict-chamber-logo.png"
                  alt="Rwanda ICT Chamber"
                  width={140}
                  height={80}
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <div className="compliance-card-body">
                <h2>{t.compliance.ict_title}</h2>
                <p>{t.compliance.ict_description}</p>
                <a href="https://ictchamber.rw/" target="_blank" rel="noopener noreferrer">
                  Visit Rwanda ICT Chamber <i className="bi bi-arrow-right"></i>
                </a>
              </div>
            </div>

            {/* Data Protection Card */}
            <div className="compliance-card">
              <div className="compliance-card-logo">
                <Image
                  src="/partners/data-protection-logo.png"
                  alt="Data Protection Office Rwanda"
                  width={180}
                  height={80}
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <div className="compliance-card-body">
                <h2>{t.compliance.dp_title}</h2>
                <p>{t.compliance.dp_description}</p>
                <a href="https://www.dataprotection.gov.rw/" target="_blank" rel="noopener noreferrer">
                  Visit Data Protection Office <i className="bi bi-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Certificates Section */}
          <div className="certificates-section">
            <h2>{t.compliance.certificates_title}</h2>
            <p>{t.compliance.certificates_description}</p>
            <div className="certificates-grid">
              <div className="certificate-item">
                <Image
                  src="/partners/ict-chamber.png"
                  alt="Rwanda ICT Chamber Membership Certificate"
                  width={500}
                  height={350}
                  style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
                />
                <span className="certificate-label">Rwanda ICT Chamber — Silver Member</span>
              </div>
              <div className="certificate-item">
                <Image
                  src="/partners/data-controller.png"
                  alt="Data Controller Registration Certificate"
                  width={400}
                  height={550}
                  style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
                />
                <span className="certificate-label">Data Controller — Certificate of Registration</span>
              </div>
            </div>
          </div>
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
