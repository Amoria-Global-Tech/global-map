'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Chatbot from '../components/Chatbot';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';


export default function ServicesPage() {
  const { resolvedTheme } = useTheme();
  const { t } = useLanguage();

  const services = [
    {
      title: t.services.web_dev,
      description: t.services.web_dev_desc,
      icon: 'bi-globe',
      features: ['Responsive design', 'E-commerce integration', 'CMS development', 'Performance optimization', 'SEO-ready structure']
    },
    {
      title: t.services.mobile_dev,
      description: t.services.mobile_dev_desc,
      icon: 'bi-phone',
      features: ['iOS development', 'Android development', 'Cross-platform apps', 'App store deployment', 'Mobile-first design']
    },
    {
      title: t.services.desktop_dev,
      description: t.services.desktop_dev_desc,
      icon: 'bi-laptop',
      features: ['Cross-platform compatibility', 'Enterprise integration', 'Offline functionality', 'System optimization', 'User-friendly interfaces']
    },
    {
      title: t.services.seo,
      description: t.services.seo_desc,
      icon: 'bi-graph-up-arrow',
      features: ['Technical SEO', 'Content strategy', 'Local optimization', 'Performance audits', 'Analytics tracking']
    },
    {
      title: t.services.consulting,
      description: t.services.consulting_desc,
      icon: 'bi-tools',
      features: ['Technology assessment', 'Digital strategy', 'Infrastructure planning', 'Process optimization', 'Risk evaluation']
    },
    {
      title: t.services.custom_software,
      description: t.services.custom_software_desc,
      icon: 'bi-gear',
      features: ['Business automation', 'System integration', 'Workflow optimization', 'Custom databases', 'Scalable architecture']
    },
    {
      title: t.services.security,
      description: t.services.security_desc,
      icon: 'bi-shield-lock',
      features: ['Security assessments', 'Threat protection', 'Data encryption', 'Compliance audits', 'Incident response']
    },
    {
      title: t.services.data_analysis,
      description: t.services.data_analysis_desc,
      icon: 'bi-bar-chart-line',
      features: ['Business intelligence', 'Data visualization', 'Predictive modeling', 'Performance metrics', 'Decision support']
    }
  ];

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [scrollPos, setScrollPos] = useState(0);
  const [dotPositions, setDotPositions] = useState<Record<number, { x: number; y: number }>>({});
  const [ctaDot, setCtaDot] = useState<{ x: number; y: number } | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const handleCardMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setDotPositions(prev => ({ ...prev, [index]: { x, y } }));
  }, []);

  const handleCardMouseLeave = useCallback((index: number) => {
    setDotPositions(prev => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  }, []);

  // Ease-out cubic for smoother deceleration
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let rafId: number;

    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setShowScrollTop(window.scrollY > 300);

        if (sectionRef.current) {
          const rect = sectionRef.current.getBoundingClientRect();
          const sectionHeight = sectionRef.current.offsetHeight;
          const viewportH = window.innerHeight;
          const scrolled = -rect.top;
          const scrollableHeight = sectionHeight - viewportH;

          if (scrollableHeight > 0) {
            const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));

            const trackWidth = trackRef.current?.scrollWidth || 0;
            const vpWidth = viewportRef.current?.offsetWidth || 0;
            const maxTranslate = Math.max(0, trackWidth - vpWidth);
            setTranslateX(progress * maxTranslate);

            // Exact floating position across all cards (0 to 7)
            const exactPos = progress * (services.length - 1);
            setScrollPos(exactPos);
            setActiveIndex(Math.round(exactPos));
          }
        }
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [mounted, services.length]);

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
            <h1 className="page-hero-title">{t.services.title}</h1>
            <p className="page-hero-description">{t.services.subtitle}</p>
          </section>

          {/* Services Scroll-Driven Layout */}
          <section className="scroll-services" ref={sectionRef}>
            <div className="scroll-services-sticky">
              {/* Left side — reserved for future feature */}
              <div className="scroll-left-side">
                {/* Particle animation or other feature will go here */}
              </div>

              <div className="scroll-card-viewport" ref={viewportRef}>
                <div
                  ref={trackRef}
                  className="scroll-card-track"
                  style={{ transform: `translateX(-${translateX}px)` }}
                >
                  {services.map((service, index) => {
                    const isActive = index === activeIndex;
                    const num = String(index + 1).padStart(2, '0');

                    // Scale: 1 when at exact position, shrinks as it moves away
                    const dist = Math.abs(scrollPos - index);
                    const scale = Math.max(0.82, 1 - dist * 0.12);

                    return (
                      <div
                        key={index}
                        className={`scroll-card ${isActive ? 'active' : 'inactive'}`}
                        style={{ transform: `scale(${scale})` }}
                        onMouseMove={(e) => !isActive && handleCardMouseMove(e, index)}
                        onMouseLeave={() => !isActive && handleCardMouseLeave(index)}
                      >
                        {/* Active: title + arrow at top */}
                        {isActive && (
                          <>
                            <h3 className="scroll-card-title">{service.title}</h3>

                            <p className="scroll-card-description">{service.description}</p>

                            <div className="scroll-card-footer">
                              <div className="scroll-card-footer-col">
                                <span className="scroll-card-label">Services</span>
                                <ul className="scroll-card-features-list">
                                  {service.features.map((feature, i) => (
                                    <li key={i}><i className="bi bi-check-lg"></i> {feature}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Inactive: number top, title at bottom, dots follow cursor */}
                        {!isActive && (
                          <>
                            <div className="scroll-card-top">
                              <span className="scroll-card-number">{num}</span>
                            </div>

                            <div
                              className={`scroll-card-dots ${dotPositions[index] ? 'hovering' : ''}`}
                              style={dotPositions[index] ? {
                                '--dot-x': `${dotPositions[index].x}px`,
                                '--dot-y': `${dotPositions[index].y}px`,
                              } as React.CSSProperties : {}}
                            ></div>

                            <div className="scroll-card-bottom-title">
                              {service.title}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Fade edges */}
                <div className="scroll-fade-left"></div>
                <div className="scroll-fade-right"></div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section
            className="page-cta"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setCtaDot({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            }}
            onMouseLeave={() => setCtaDot(null)}
          >
            <div className="page-cta-glow"></div>
            <div className="page-cta-glow-bl"></div>
            <div
              className={`page-cta-dots ${ctaDot ? 'hovering' : ''}`}
              style={ctaDot ? {
                '--cta-dot-x': `${ctaDot.x}px`,
                '--cta-dot-y': `${ctaDot.y}px`,
              } as React.CSSProperties : {}}
            ></div>
            <div className="page-cta-content">
              <span className="page-cta-badge">{t.services.title}</span>
              <h2 className="page-cta-title">{t.home.hero_title}</h2>
              <p className="page-cta-description">{t.home.hero_subtitle}</p>
              <Link href="/contact" className="page-cta-btn">
                {t.contact.title}
                <i className="bi bi-arrow-right"></i>
              </Link>
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
