'use client';

import { useState, useEffect } from 'react';
import Chatbot from '../components/Chatbot';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { api } from '../api/utils/apiService';

// Type definitions
interface Service {
  id?: number;
  name: string;
  description: string | null;
  category: string | null;
  icon: string | null;
  features: string | null;
  imageUrl?: string | null;
  isActive?: boolean;
}

interface ServiceDisplay {
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceDisplay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fallback services in case API fails
  const fallbackServices: ServiceDisplay[] = [
    {
      title: 'Web Development',
      description: 'Modern, scalable web solutions from landing pages to complex web applications. We build responsive, fast-loading websites that convert visitors into customers.',
      icon: '🌐',
      features: ['Responsive design', 'E-commerce integration', 'CMS development', 'Performance optimization', 'SEO-ready structure']
    },
    {
      title: 'Mobile App Development',
      description: 'Native and cross-platform mobile applications that deliver seamless user experiences across iOS and Android devices.',
      icon: '📱',
      features: ['iOS development', 'Android development', 'Cross-platform apps', 'App store deployment', 'Mobile-first design']
    },
    {
      title: 'Desktop Applications Development',
      description: 'Robust desktop software solutions for Windows, macOS, and Linux that streamline business operations and enhance productivity.',
      icon: '💻',
      features: ['Cross-platform compatibility', 'Enterprise integration', 'Offline functionality', 'System optimization', 'User-friendly interfaces']
    },
    {
      title: 'SEO Optimization',
      description: 'Data-driven search engine optimization strategies that improve rankings, increase organic traffic, and boost online visibility.',
      icon: '🚀',
      features: ['Technical SEO', 'Content strategy', 'Local optimization', 'Performance audits', 'Analytics tracking']
    },
    {
      title: 'IT Consultation',
      description: 'Strategic technology guidance to help businesses make informed decisions about digital transformation and infrastructure planning.',
      icon: '🔧',
      features: ['Technology assessment', 'Digital strategy', 'Infrastructure planning', 'Process optimization', 'Risk evaluation']
    },
    {
      title: 'Custom Software Solutions',
      description: 'Bespoke software development tailored to unique business requirements, from automation tools to enterprise management systems.',
      icon: '⚙️',
      features: ['Business automation', 'System integration', 'Workflow optimization', 'Custom databases', 'Scalable architecture']
    },
    {
      title: 'Cyber Security',
      description: 'Comprehensive security solutions to protect digital assets, prevent data breaches, and ensure compliance with industry standards.',
      icon: '🔒',
      features: ['Security assessments', 'Threat protection', 'Data encryption', 'Compliance audits', 'Incident response']
    },
    {
      title: 'Data Analysis',
      description: 'Transform raw data into actionable business insights through advanced analytics, visualization, and business intelligence solutions.',
      icon: '📊',
      features: ['Business intelligence', 'Data visualization', 'Predictive modeling', 'Performance metrics', 'Decision support']
    }
  ];

  // Fetch services from API
  useEffect((): void => {
    const fetchServices = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get('/public/services');

        // Check if response is defined
        if (!response || response.success === undefined) {
          setServices(fallbackServices);
          setLoading(false);
          return;
        }

        if (!response.success) {
          setServices(fallbackServices);
          setLoading(false);
          return;
        }

        // Handle API response
        const data = response.data;
        let apiServices: Service[] = [];

        if (Array.isArray(data)) {
          apiServices = data;
        } else if (data && Array.isArray(data.data)) {
          apiServices = data.data;
        } else if (data && data.services && Array.isArray(data.services)) {
          apiServices = data.services;
        }

        // Transform API services to display format
        if (apiServices.length > 0) {
          const transformedServices: ServiceDisplay[] = apiServices
            .filter((s: Service) => s.isActive !== false)
            .map((service: Service) => ({
              title: service.name,
              description: service.description || 'No description available',
              icon: service.icon || '⚙️',
              features: service.features ? JSON.parse(service.features) : []
            }));
          setServices(transformedServices);
        } else {
          setServices(fallbackServices);
        }
      } catch (err: unknown) {
        setServices(fallbackServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

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

  // Don't render until mounted
  if (!mounted) {
    return <div></div>;
  }

  return (
    <>
     <Navbar />

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* Hero Section */}
          <section className="hero-section">
            <h1 className="hero-title text-xl font-bold text-white/80">Our Services</h1>
            <p className="hero-description">
              Comprehensive solutions designed to transform your business operations 
              and drive growth through innovative technology.
            </p>
          </section>
          {/* Services Grid */}
          <section className="services-grid-section">
            <div className="services-grid">
              {services.map((service, index) => (
                <div key={index} className="service-detail-card">
                  <div className="service-detail-header">
                    <div className="service-detail-icon">
                      <span>{service.icon}</span>
                    </div>
                  </div>
                  
                  <div className="service-detail-content">
                    <h3 className="service-detail-title">{service.title}</h3>
                    <p className="service-detail-description">{service.description}</p>
                    
                    <ul className="service-detail-features">
                      {service.features.map((feature, i) => (
                        <li key={i} className="service-detail-feature">
                          <span className="feature-check">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <button className="service-cta-button">
                      Get Started →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Call to Action Section */}
          <section className="cta-section">
            <div className="cta-content">
              <h2 className="cta-title">Ready to Transform Your Business?</h2>
              <p className="cta-description">
                Get started with our comprehensive suite of services today and see the difference 
                advanced technology can make for your business.
              </p>
              <div className="cta-buttons">
                <button className="cta-secondary-btn">Schedule Demo</button>
              </div>
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