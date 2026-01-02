'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Chatbot from '../components/Chatbot';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AboutPage() {
  const { resolvedTheme } = useTheme();
  const { t } = useLanguage();
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mounted, setMounted] = useState(false);

  const timelineItems = [
    {
      title: t.about.timeline['2020'].title,
      subtitle: t.about.timeline['2020'].subtitle,
      description: t.about.timeline['2020'].description,
      year: "2020"
    },
    {
      title: t.about.timeline['2021'].title,
      subtitle: t.about.timeline['2021'].subtitle,
      description: t.about.timeline['2021'].description,
      year: "2021"
    },
    {
      title: t.about.timeline['2022'].title,
      subtitle: t.about.timeline['2022'].subtitle,
      description: t.about.timeline['2022'].description,
      year: "2022"
    },
    {
      title: t.about.timeline['2023'].title,
      subtitle: t.about.timeline['2023'].subtitle,
      description: t.about.timeline['2023'].description,
      year: "2023"
    },
    {
      title: t.about.timeline['2024'].title,
      subtitle: t.about.timeline['2024'].subtitle,
      description: t.about.timeline['2024'].description,
      year: "2024+"
    }
  ];

  // Handle mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show/hide scroll-to-top button
  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Animate timeline items on scroll
  useEffect(() => {
    if (!mounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleItems(prev => [...prev, index]);
          }
        });
      },
      { threshold: 0.3 }
    );

    const timelineElements = document.querySelectorAll('.timeline-item');
    timelineElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [mounted]);

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return <div></div>;
  }

  return (
    <>
     <Navbar />
      {/* Main Content */}
      <main className={`main-content ${resolvedTheme === 'light' ? 'light' : ''}`}>
        <div className="container">
          {/* Hero Section */}
          <section className="about-hero">
            <h1 className="about-hero-title">{t.about.hero_title}</h1>
            <p className="about-hero-description">{t.about.hero_description}</p>
          </section>
          {/* Our Team Section */}
          <section className="team-section">
            <div className="team-header">
              <h2 className="team-title">{t.about.team_title}</h2>
              <p className="team-description">{t.about.team_subtitle}</p>
            </div>

            <div className="team-grid">
              <div className="team-card">
                <div className="team-image-container">
                  <Image
                    src="/team/mos.jpg"
                    alt={t.about.team.moses.name}
                    width={120}
                    height={120}
                    className="team-image"
                  />
                </div>
                <div className="team-info">
                  <h3 className="team-name">{t.about.team.moses.name}</h3>
                  <p className="team-title-job">{t.about.team.moses.role}</p>
                  <p className="team-description-text">{t.about.team.moses.description}</p>
                </div>
              </div>

              <div className="team-card">
                <div className="team-image-container">
                  <Image
                    src="/team/but.jpg"
                    alt={t.about.team.joseph.name}
                    width={120}
                    height={120}
                    className="team-image"
                  />
                </div>
                <div className="team-info">
                  <h3 className="team-name">{t.about.team.joseph.name}</h3>
                  <p className="team-title-job">{t.about.team.joseph.role}</p>
                  <p className="team-description-text">{t.about.team.joseph.description}</p>
                </div>
              </div>

              <div className="team-card">
                <div className="team-image-container">
                  <Image
                    src="/team/mub.jpg"
                    alt={t.about.team.pacific.name}
                    width={120}
                    height={120}
                    className="team-image"
                  />
                </div>
                <div className="team-info">
                  <h3 className="team-name">{t.about.team.pacific.name}</h3>
                  <p className="team-title-job">{t.about.team.pacific.role}</p>
                  <p className="team-description-text">{t.about.team.pacific.description}</p>
                </div>
              </div>

              <div className="team-card">
                <div className="team-image-container">
                  <Image
                    src="/team/jax.jpg"
                    alt={t.about.team.jackson.name}
                    width={120}
                    height={120}
                    className="team-image"
                  />
                </div>
                <div className="team-info">
                  <h3 className="team-name">{t.about.team.jackson.name}</h3>
                  <p className="team-title-job">{t.about.team.jackson.role}</p>
                  <p className="team-description-text">{t.about.team.jackson.description}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Mission, Vision, Objectives */}
          <section className="company-values">
            <div className="values-grid">
              <div className="value-card mission-card">
                <div className="value-icon">
                  <i className="bi bi-bullseye"></i>
                </div>
                <h3 className="value-title">{t.about.mission_title}</h3>
                <p className="value-description">{t.about.mission_text}</p>
              </div>

              <div className="value-card vision-card">
                <div className="value-icon">
                  <i className="bi bi-rocket-takeoff"></i>
                </div>
                <h3 className="value-title">{t.about.vision_title}</h3>
                <p className="value-description">{t.about.vision_text}</p>
              </div>

              <div className="value-card objectives-card">
                <div className="value-icon">
                  <i className="bi bi-stars"></i>
                </div>
                <h3 className="value-title">{t.about.objectives_title}</h3>
                <ul className="objectives-list">
                  <li>{t.about.objectives['1']}</li>
                  <li>{t.about.objectives['2']}</li>
                  <li>{t.about.objectives['3']}</li>
                  <li>{t.about.objectives['4']}</li>
                  <li>{t.about.objectives['5']}</li>
                </ul>
              </div>
            </div>
          </section>
          {/* Animated Timeline */}
          <section className="timeline-section">
            <h2 className="timeline-title">{t.about.history_title}</h2>
            <div className="timeline-container">
              <div className="timeline-line"></div>
              {timelineItems.map((item, index) => (
                <div
                  key={index}
                  className={`timeline-item ${visibleItems.includes(index) ? 'visible' : ''}`}
                  data-index={index}
                >
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="timeline-year">{item.year}</div>
                    <h4 className="timeline-item-title">{item.title}</h4>
                    <h5 className="timeline-item-subtitle">{item.subtitle}</h5>
                    <p className="timeline-item-description">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Team & Culture Section */}
          <section className="culture-section">
            <div className="culture-content">
              <h2 className="culture-title">{t.about.culture_title}</h2>
              <div className="culture-grid">
                <div className="culture-item">
                  <h4>{t.about.culture.innovation}</h4>
                  <p>{t.about.culture.innovation_desc}</p>
                </div>
                <div className="culture-item">
                  <h4>{t.about.culture.customer}</h4>
                  <p>{t.about.culture.customer_desc}</p>
                </div>
                <div className="culture-item">
                  <h4>{t.about.culture.quality}</h4>
                  <p>{t.about.culture.quality_desc}</p>
                </div>
                <div className="culture-item">
                  <h4>{t.about.culture.impact}</h4>
                  <p>{t.about.culture.impact_desc}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="about-cta">
            <h2 className="about-cta-title">{t.about.cta_title}</h2>
            <p className="about-cta-description">{t.about.cta_description}</p>
            <div className="about-cta-buttons">
              <Link href="/services" className="about-cta-btn primary">
                {t.about.cta_services}
              </Link>
              <Link href="/products" className="about-cta-btn secondary">
                {t.about.cta_products}
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* Scroll to Top Button */}
      {mounted && showScrollTop && (
        <button
          className="scroll-to-top"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <i className="bi bi-arrow-up"></i>
        </button>
      )}

      {/* Chatbot Widget */}
      <Chatbot />

     <Footer />
    </>
  );
}
