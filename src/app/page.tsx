'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Chatbot from './components/Chatbot';
import Navbar from './components/navbar';
import Footer from './components/footer';

import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { PRODUCTS, type Product } from '@/data/products';

// Type definitions

interface Service {
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export default function HomePage() {
  const { resolvedTheme } = useTheme();
  const { t } = useLanguage();
  const [showBanner, setShowBanner] = useState<boolean>(true);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [typingText, setTypingText] = useState<string>('');
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);
  
  // Same static catalogue the products page renders.
  const products: Product[] = PRODUCTS;

  const originalServices: Service[] = [
    {
      title: t.home.services.web_dev.title,
      description: t.home.services.web_dev.description,
      icon: 'bi bi-globe2',
      features: t.home.services.web_dev.features
    },
    {
      title: t.home.services.mobile_dev.title,
      description: t.home.services.mobile_dev.description,
      icon: 'bi bi-phone',
      features: t.home.services.mobile_dev.features
    },
    {
      title: t.home.services.desktop_dev.title,
      description: t.home.services.desktop_dev.description,
      icon: 'bi bi-laptop',
      features: t.home.services.desktop_dev.features
    },
    {
      title: t.home.services.seo.title,
      description: t.home.services.seo.description,
      icon: 'bi bi-rocket-takeoff',
      features: t.home.services.seo.features
    },
    {
      title: t.home.services.consulting.title,
      description: t.home.services.consulting.description,
      icon: 'bi bi-tools',
      features: t.home.services.consulting.features
    },
    {
      title: t.home.services.custom_software.title,
      description: t.home.services.custom_software.description,
      icon: 'bi bi-gear',
      features: t.home.services.custom_software.features
    },
    {
      title: t.home.services.security.title,
      description: t.home.services.security.description,
      icon: 'bi bi-shield-lock',
      features: t.home.services.security.features
    },
    {
      title: t.home.services.data_analysis.title,
      description: t.home.services.data_analysis.description,
      icon: 'bi bi-bar-chart-line',
      features: t.home.services.data_analysis.features
    }
  ];


  // Helper function to get product icon based on category or name
  // Kept identical to the products page so both grids fall back the same way.
  const getProductIcon = (product: Product): string => {
    if (product.category === 'Photo & Video') return 'bi-camera-video';
    if (product.name.toLowerCase().includes('connect') || product.name.toLowerCase().includes('connekyt')) return 'bi-link-45deg';
    if (product.name.toLowerCase().includes('schedule')) return 'bi-calendar-check';
    if (product.category === 'Software') return 'bi-box';
    return 'bi-box-seam';
  };

  // Initial client-side mount
  useEffect((): void => {
    setMounted(true);
  }, []);

  // Show/hide scroll-to-top button (only after mount)
  useEffect((): (() => void) | void => {
    if (!mounted) return;

    const handleScroll = (): void => {
      if (typeof window !== 'undefined') {
        setShowScrollTop(window.scrollY > 300);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return (): void => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);

  // Scroll to top function
  const scrollToTop = (): void => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Fixed typing animation using React state instead of DOM manipulation
  useEffect((): (() => void) | void => {
    if (!mounted) return;

    const word = t.home.typing_word;
    let charIndex = 0;
    let isDeleting = false;

    const typeWriter = (): void => {
      if (isDeleting) {
        setTypingText(word.substring(0, charIndex - 1));
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          setTimeout(typeWriter, 500);
          return;
        }
      } else {
        setTypingText(word.substring(0, charIndex + 1));
        charIndex++;

        if (charIndex === word.length) {
          isDeleting = true;
          setTimeout(typeWriter, 2000);
          return;
        }
      }

      setTimeout(typeWriter, isDeleting ? 100 : 150);
    };

    const timer: NodeJS.Timeout = setTimeout(typeWriter, 1000);
    return (): void => clearTimeout(timer);
  }, [mounted, t.home.typing_word]);

  // Cursor spotlight effect for hero section
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>): void => {
    const hero = heroRef.current;
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  // Safe scroll into view function
  const scrollToElement = (elementId: string): void => {
    if (typeof document !== 'undefined') {
      const element: HTMLElement | null = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };


  return (
    <>
      <Navbar />

      {/* Announcement Banner */}
      {showBanner && (
        <div className="announcement-banner">
          <div className="announcement-content">
            <span className="announcement-icon"><i className="bi bi-megaphone-fill"></i></span>
            <p>
              Transform your business with custom software, web &amp; mobile apps <span className="announcement-divider">|</span> <strong>Let&apos;s build something great together!</strong>
            </p>
            <a href="/contact" className="announcement-cta">Get Started</a>
          </div>
          <button
            className="announcement-close"
            onClick={() => setShowBanner(false)}
            aria-label="Close announcement"
          >
            &times;
          </button>
        </div>
      )}

      {/* Hero Section with Background Image */}
      <section
        ref={heroRef}
        className={`hero-section ${resolvedTheme === 'light' ? 'light' : ''}`}
        onMouseMove={handleMouseMove}
      >
        {/* Cursor spotlight */}
        <div
          className="hero-spotlight"
          style={{
            left: mousePos.x,
            top: mousePos.y,
          }}
        />


        <div className="hero-content">
          <h1 className="hero-animated-title">
            {t.home.hero_title}{' '}
            <span className="typing-container">
              <span className="typing-text">{typingText}</span>
              <span className="typing-cursor">|</span>
            </span>
          </h1>
          <p className="hero-animated-subtitle">
            {t.home.hero_subtitle}
          </p>
          <div className="action-buttons-container">
            <button
              className="action-btn member-btn"
              onClick={() => scrollToElement('services-section')}
            >
              {t.home.cta_explore}
            </button>
            <button
              className="action-btn started-btn"
              onClick={() => scrollToElement('services-section')}
            >
              {t.home.cta_contact}
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className={`main-content ${resolvedTheme === 'light' ? 'light' : ''}`}>
        <div className="container">
          {/* Products Section */}
          <section className="products-section">
            <div className="container">
              <div className="products-header">
                <h2 className="products-title">{t.home.products_title}</h2>
                <p className="products-description">
                  {t.home.products_subtitle}
                </p>
              </div>

              {/* No Products State */}
              {products.length === 0 && (
                <div className="no-products">
                  <p>{t.home.products_empty}</p>
                </div>
              )}

              {/* Products Grid */}
              {products.length > 0 && (
                <div className="products-grid">
                  {products.map((product: Product) => {
                    const isAvailable = product.isAvailable;
                    const productImage = product.imageUrl;

                    return (
                      <div
                        key={product.id}
                        className="product-card"
                        onClick={() => {
                          if (isAvailable && product.siteUrl) {
                            window.open(product.siteUrl, '_blank', 'noopener,noreferrer');
                          }
                        }}
                        role={isAvailable && product.siteUrl ? 'link' : undefined}
                        tabIndex={isAvailable && product.siteUrl ? 0 : undefined}
                        onKeyDown={(e) => {
                          if ((e.key === 'Enter' || e.key === ' ') && isAvailable && product.siteUrl) {
                            window.open(product.siteUrl, '_blank', 'noopener,noreferrer');
                          }
                        }}
                      >
                        <div className="product-badge">
                          {isAvailable ? t.products.available : t.products.coming_soon}
                        </div>

                        <div className="product-icon">
                          {productImage ? (
                            <Image
                              src={productImage}
                              alt={product.name}
                              width={48}
                              height={48}
                              style={{ objectFit: 'contain', borderRadius: '8px' }}
                            />
                          ) : (
                            <span><i className={`bi ${getProductIcon(product)}`}></i></span>
                          )}
                        </div>

                        <div className="product-content">
                          {product.category && (
                            <span className="product-category">{product.category}</span>
                          )}
                          <h3 className="product-title">{product.name}</h3>
                          <p className="product-description">{product.description}</p>

                          {isAvailable ? (
                            <span className="product-btn visit-btn">
                              {t.products.discover} {product.name}
                            </span>
                          ) : (
                            <span className="product-btn coming-soon-btn">
                              {t.products.coming_soon}
                              <i className="bi bi-clock"></i>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Partners Section */}
          <section className="partners-section">
            <div className="partners-container">
              <div className="partners-track">
                <div className="single-partner-card">
                  <div className="logo-item">
                    <img src="/partners/Logo-SVG-01.svg" alt="ALU"  />
                  </div>
                  <div className="logo-item">
                    <img src="/partners/xentripaylogo.svg" alt="RwandAir"  />
                  </div>
                 
                </div>
                
                {/* Duplicate for continuous loop */}
                <div className="single-partner-card">
                  <div className="logo-item">
                    <img src="/partners/Logo-SVG-01.svg" alt="ALU"  />
                  </div>
                  <div className="logo-item">
                    <img src="/partners/xentripaylogo.svg" alt="RwandAir"  />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section className="services-section" id="services-section">
            <div className="services-header">
              <h2 className="services-title">{t.home.services_title}</h2>
              <p className="services-description">
                {t.home.services_subtitle}
              </p>
            </div>

            <div className="services-grid">
              {originalServices.map((service: Service, index: number) => (
                <div key={`${service.title}-${index}`} className="service-card">
                  <div className="service-header-row">
                    <div className="service-icon">
                      <i className={service.icon}></i>
                    </div>
                    <h3 className="service-title">{service.title}</h3>
                  </div>
                  <div className="service-content">
                    <p className="service-description">{service.description}</p>
                    <ul className="service-features">
                      {service.features.map((feature: string, i: number) => (
                        <li key={i} className="service-feature">
                          <span className="feature-dot">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Trusted & Recognized By Section */}
          <section className="trust-recognized-section">
            <h2 className="trust-recognized-title">{t.home.trust_title}</h2>
            <p className="trust-recognized-subtitle">{t.home.trust_subtitle}</p>
            <div className="trust-logos-grid">
              <a
                href="https://ictchamber.rw/"
                target="_blank"
                rel="noopener noreferrer"
                className="trust-logo-card"
              >
                <div className="trust-logo-img">
                  <Image
                    src="/partners/ict-chamber-logo.png"
                    alt="Rwanda ICT Chamber"
                    width={140}
                    height={80}
                    style={{ objectFit: 'contain', filter: 'invert(1) hue-rotate(180deg)' }}
                  />
                </div>
                <div className="trust-logo-caption">
                  <h3>Rwanda ICT Chamber</h3>
                  <p>{t.home.trust_ict_caption}</p>
                </div>
              </a>
              <a
                href="https://dpo.gov.rw/"
                target="_blank"
                rel="noopener noreferrer"
                className="trust-logo-card"
              >
                <div className="trust-logo-img">
                  <Image
                    src="/partners/data-protection-logo.png"
                    alt="Data Protection Office Rwanda"
                    width={140}
                    height={80}
                    style={{ objectFit: 'contain', filter: 'invert(1) hue-rotate(180deg)' }}
                  />
                </div>
                <div className="trust-logo-caption">
                  <h3>Data Protection Office</h3>
                  <p>{t.home.trust_dp_caption}</p>
                </div>
              </a>
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