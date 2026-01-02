'use client';

import { useState, useEffect } from 'react';
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
            <h1 className="page-hero-title">{t.services.title}</h1>
            <p className="page-hero-description">{t.services.subtitle}</p>
          </section>

          {/* Services Grid */}
          <section className="services-page-grid">
            {services.map((service, index) => (
              <div key={index} className="service-page-card">
                <div className="service-page-icon">
                  <i className={`bi ${service.icon}`}></i>
                </div>

                <div className="service-page-content">
                  <h3 className="service-page-title">{service.title}</h3>
                  <p className="service-page-description">{service.description}</p>

                  <ul className="service-page-features">
                    {service.features.map((feature, i) => (
                      <li key={i}>
                        <i className="bi bi-check-circle"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link href="/contact" className="service-page-btn">
                    {t.services.get_quote}
                    <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
              </div>
            ))}
          </section>

          {/* CTA Section */}
          <section className="page-cta">
            <h2 className="page-cta-title">{t.home.hero_title}</h2>
            <p className="page-cta-description">{t.home.hero_subtitle}</p>
            <Link href="/contact" className="page-cta-btn">
              {t.contact.title}
              <i className="bi bi-arrow-right"></i>
            </Link>
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
