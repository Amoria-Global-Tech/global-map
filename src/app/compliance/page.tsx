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
                  style={{ objectFit: 'contain', filter: 'invert(1) hue-rotate(180deg)' }}
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
                  style={{ objectFit: 'contain', filter: 'invert(1) hue-rotate(180deg)' }}
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
