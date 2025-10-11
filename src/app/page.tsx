'use client';

import { useState, useEffect, useRef } from 'react';
import Chatbot from './components/Chatbot';
import Navbar from './components/navbar';
import Footer from './components/footer';
import { api } from './api/utils/apiService';

// Type definitions
interface Product {
  id: string | number;
  name: string;
  description: string;
  category: string;
  price?: string | number;
  imageUrl?: string;
  isAvailable: boolean;
  siteUrl?: string;
}

interface Service {
  title: string;
  description: string;
  icon: string;
  features: string[];
}

interface LoadingStage {
  progress: number;
  status: string;
  text: string;
}


export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(true);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [typingText, setTypingText] = useState<string>('');
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [loadingStatus, setLoadingStatus] = useState<string>('Starting system...');
  const [loadingText, setLoadingText] = useState<string>('INITIALIZING');
  const [preloaderReady, setPreloaderReady] = useState<boolean>(false);
  const [hasShownPreloader, setHasShownPreloader] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [stars, setStars] = useState<React.ReactElement[]>([]);
  const [particles, setParticles] = useState<React.ReactElement[]>([]);

  // API-related state
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState<boolean>(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  const trackRef = useRef<HTMLDivElement>(null);

  // Loading stages for the preloader - 20% increments
  const loadingStages: LoadingStage[] = [
    { progress: 20, status: "Loading core modules...", text: "LOADING" },
    { progress: 40, status: "Establishing connections...", text: "CONNECTING" },
    { progress: 60, status: "Syncing global data...", text: "SYNCING" },
    { progress: 80, status: "Optimizing performance...", text: "OPTIMIZING" },
    { progress: 100, status: "Welcome to Amoria Tech Global!", text: "COMPLETE" }
  ];

  const originalServices: Service[] = [
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

  // Fetch products from API
  useEffect((): void => {
    const fetchProducts = async (): Promise<void> => {
      try {
        setProductsLoading(true);
        setProductsError(null);

        const response = await api.get('/public/products');

        // Check if response is defined and has the success property
        if (!response || response.success === undefined) {
          throw new Error('Invalid API response - server may be unavailable');
        }

        if (!response.success) {
          throw new Error(response.error || 'Failed to load products');
        }

        // Handle different API response formats
        const data = response.data;
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data && Array.isArray(data.data)) {
          setProducts(data.data);
        } else if (data && data.products && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setProductsError(errorMessage);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Helper function to get product icon based on category or name
  const getProductIcon = (product: Product): string => {
    if (product.category === 'Photo & Video') return '🎪';
    if (product.name.toLowerCase().includes('connect')) return '🎪';
    if (product.category === 'Software') return '💻';
    if (product.category === 'Security') return '🔒';
    return '📦'; // Default icon
  };

  /* Format price display
  const formatPrice = (price: string | number): string => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numericPrice.toLocaleString();
  }; */

  // Initial client-side mount
  useEffect((): void => {
    setIsClient(true);

    const hasShown: string | null = typeof window !== 'undefined' ? sessionStorage.getItem('preloaderShown') : null;
    if (hasShown) {
      setHasShownPreloader(true);
      setMounted(true);
    } else {
      setPreloaderReady(true);
    }
  }, []);

  // Preloader animation logic - only runs if not shown before
  useEffect((): (() => void) | void => {
    if (!preloaderReady || hasShownPreloader || !isClient) return;

    let currentStage = 0;

    const updateProgress = (): void => {
      if (currentStage < loadingStages.length) {
        const stage: LoadingStage = loadingStages[currentStage];

        // Jump directly to the target percentage
        setLoadingProgress(stage.progress);
        setLoadingStatus(stage.status);
        setLoadingText(stage.text);

        if (stage.progress === 100) {
          setTimeout((): void => {
            setMounted(true);
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('preloaderShown', 'true');
            }
          }, 1000);
        } else {
          currentStage++;
          setTimeout(updateProgress, 1200); // Pause for 1.2 seconds between stages
        }
      }
    };

    const timer: NodeJS.Timeout = setTimeout(updateProgress, 1000);
    return (): void => clearTimeout(timer);
  }, [preloaderReady, hasShownPreloader, isClient, loadingStages]);

  // Create stars and particles after hydration to avoid hydration issues
  useEffect((): void => {
    if (!preloaderReady || hasShownPreloader || !isClient) return;

    const starsArray: React.ReactElement[] = [];
    for (let i = 0; i < 100; i++) {
      starsArray.push(
        <div
          key={i}
          className="star"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            animationDelay: `${Math.random() * 3}s`
          }}
        />
      );
    }
    setStars(starsArray);

    // Create particles
    const particlesArray: React.ReactElement[] = [];
    for (let i = 0; i < 8; i++) {
      particlesArray.push(
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${Math.random() * 3 + 2}s`
          }}
        />
      );
    }
    setParticles(particlesArray);
  }, [preloaderReady, hasShownPreloader, isClient]);

  // Show/hide scroll-to-top button (only after mount)
  useEffect((): (() => void) | void => {
    if (!mounted || !isClient) return;

    const handleScroll = (): void => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > 300) {
          setShowScrollTop(true);
        } else {
          setShowScrollTop(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return (): void => window.removeEventListener('scroll', handleScroll);
  }, [mounted, isClient]);

  // Scroll to top function
  const scrollToTop = (): void => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Create infinite array by duplicating services
  const services: Service[] = [...originalServices, ...originalServices];

  // Auto-sliding functionality with infinite loop (only after mount)
  useEffect((): (() => void) | void => {
    if (!mounted || !isClient) return;

    const interval: NodeJS.Timeout = setInterval((): void => {
      setCurrentSlide(prev => prev + 1);
    }, 4000);

    return (): void => clearInterval(interval);
  }, [mounted, isClient]);

  // Handle infinite loop reset
  useEffect((): (() => void) | void => {
    if (!mounted || !isClient) return;

    if (currentSlide >= originalServices.length) {
      const timer: NodeJS.Timeout = setTimeout((): void => {
        setIsTransitioning(false);
        setCurrentSlide(0);
        setTimeout((): void => {
          setIsTransitioning(true);
        }, 50);
      }, 3000);
      return (): void => clearTimeout(timer);
    }
  }, [currentSlide, originalServices.length, mounted, isClient]);

  // Fixed typing animation using React state instead of DOM manipulation
  useEffect((): (() => void) | void => {
    if (!mounted || !isClient) return;

    const word = 'Technology';
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
  }, [mounted, isClient]);

  // Navigation functions
  const nextSlide = (): void => {
    if (currentSlide >= originalServices.length - 1) {
      setIsTransitioning(false);
      setCurrentSlide(0);
      setTimeout((): void => {
        setIsTransitioning(true);
        setCurrentSlide(1);
      }, 50);
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = (): void => {
    if (currentSlide <= 0) {
      setIsTransitioning(false);
      setCurrentSlide(originalServices.length);
      setTimeout((): void => {
        setIsTransitioning(true);
        setCurrentSlide(originalServices.length - 1);
      }, 50);
    } else {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const goToSlide = (index: number): void => {
    setCurrentSlide(index);
  };

  // Safe scroll into view function
  const scrollToElement = (elementId: string): void => {
    if (typeof document !== 'undefined') {
      const element: HTMLElement | null = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Handle image error - show placeholder
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
    const target = e.target as HTMLImageElement;
    target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23667" width="200" height="200"/%3E%3Ctext fill="rgba(255,255,255,0.5)" font-family="sans-serif" font-size="16" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
  };

  // Handle explore click
  const handleExploreClick = (siteUrl?: string): void => {
    if (siteUrl) {
      window.open(siteUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Globe Preloader Component - only show when ready and not mounted and hasn't been shown before
  if (!mounted && !hasShownPreloader && isClient) {
    // Show minimal loading state until preloader is ready
    if (!preloaderReady) {
      return (
        <div className="preloader-container">
          <div className="preloader-content">
            <div className="loading-info">
              <div className="loading-text">INITIALIZING</div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="preloader-container">
        {/* Animated Stars Background */}
        <div className="stars">
          {stars}
        </div>

        <div className="preloader-content">
          <div className="globe-container">
            {/* Orbit Rings */}
            <div className="orbit-ring orbit-ring-1"></div>
            <div className="orbit-ring orbit-ring-2"></div>

            {/* Main Globe */}
            <div className="globe">
              <div className="globe-sphere">
                {/* Grid Lines */}
                <div className="grid-lines">
                  <div className="latitude-line latitude-1"></div>
                  <div className="latitude-line latitude-2"></div>
                  <div className="latitude-line latitude-3"></div>
                  <div className="longitude-line longitude-1"></div>
                  <div className="longitude-line longitude-2"></div>
                  <div className="longitude-line longitude-3"></div>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="arrow-container">
              <div className="arrow"></div>
            </div>

            {/* Particles */}
            <div className="particles">
              {particles}
            </div>
          </div>

          {/* Loading Information */}
          <div className="loading-info">
            <div className="loading-text">{loadingText}</div>
            <div className="progress-container">
              <div
                className="progress-bar"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <div className="percentage">{Math.round(loadingProgress)}%</div>
            <div className="status-text">{loadingStatus}</div>
          </div>
        </div>
      </div>
    );
  }

  // Don't render main content until client-side mounted
  if (!isClient) {
    return <div></div>;
  }

  return (
    <>
      <Navbar />

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* Hero Heading Section */}
          <section className="hero-heading-section">
            <h1 className="hero-animated-title">
              Connect the Future with Innovation and Secure{' '}
              <span className="typing-container">
                <span className="typing-text">{typingText}</span>
                <span className="typing-cursor">|</span>
              </span>
            </h1>
            <p className="hero-animated-subtitle">
              Empowering businesses with cutting-edge solutions that drive digital transformation
              and create lasting value in tomorrow&apos;s connected world.
            </p>
          </section>

          {/* Action Buttons Section */}
          <section className="action-buttons-section">
            <div className="action-buttons-container">
              <button
                className="action-btn member-btn"
                onClick={() => scrollToElement('services-section')}
              >
                Explore our services
              </button>
              <button
                className="action-btn started-btn"
                onClick={() => scrollToElement('services-section')}
              >
                Contact Sales
              </button>
            </div>
          </section>

          {/* Products Section */}
          <section className="products-section">
            <div className="container">
              <div className="products-header">
                <h2 className="products-title">Our Products</h2>
                <p className="products-description">
                  Innovative solutions designed to meet your business needs
                </p>
              </div>

              {/* Loading State */}
              {productsLoading && (
                <div className="products-loading" style={{ textAlign: 'center', padding: '2rem' }}>
                  <p style={{ color: 'white', fontSize: '1.1rem' }}>Loading products...</p>
                </div>
              )}

              {/* Error State */}
              {productsError && (
                <div className="products-error" style={{ textAlign: 'center', padding: '2rem' }}>
                  <p style={{ color: '#ff6b6b', fontSize: '1.1rem' }}>{productsError}</p>
                </div>
              )}

              {/* No Products State */}
              {!productsLoading && !productsError && products.length === 0 && (
                <div className="no-products" style={{ textAlign: 'center', padding: '2rem' }}>
                  <p style={{ color: 'white', fontSize: '1.1rem' }}>No products available at the moment.</p>
                </div>
              )}

              {/* Products Grid */}
              {!productsLoading && !productsError && products.length > 0 && (
                <div className="products-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1.5rem',
                  padding: '1rem 0'
                }}>
                  {products.map((product: Product) => (
                    <div key={product.id} className="product-card" style={{
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      position: 'relative'
                    }}>
                      {/* Product Image */}
                      <div className="product-image" style={{
                        margin: '0',
                        overflow: 'hidden',
                        borderRadius: '8px 8px 0 0',
                        flexShrink: 0
                      }}>
                        <img
                          src={product.imageUrl || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="150"%3E%3Crect fill="%23667" width="200" height="150"/%3E%3Ctext fill="rgba(255,255,255,0.5)" font-family="sans-serif" font-size="16" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E'}
                          alt={product.name}
                          style={{
                            width: '100%',
                            height: '140px',
                            objectFit: 'contain',
                            display: 'block'
                          }}
                          onError={handleImageError}
                        />
                      </div>

                      <div className="product-content" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: '1',
                        padding: '1.5rem',
                        gap: '0.75rem',
                        position: 'relative'
                      }}>
                        <h3 className="product-title" style={{
                          margin: '0 0 0.5rem 0',
                          position: 'relative'
                        }}>{product.name}</h3>

                        {/* Show description only if available */}
                        {product.isAvailable ? (
                          <p className="product-description" style={{
                            flex: '1',
                            margin: '0 0 1rem 0',
                            position: 'relative',
                            minHeight: '3.5rem'
                          }}>
                            {product.description}
                          </p>
                        ) : (
                          <p className="product-description" style={{
                            color: '#fbbf24',
                            fontWeight: '500',
                            fontStyle: 'italic',
                            flex: '1',
                            margin: '0 0 1rem 0',
                            position: 'relative',
                            minHeight: '3rem'
                          }}>
                            Coming Soon
                          </p>
                        )}

                        {/* Button - clickable if available and has siteUrl */}
                        <button
                          className="product-price-btn"
                          onClick={() => product.isAvailable && handleExploreClick(product.siteUrl)}
                          disabled={!product.isAvailable}
                          style={{
                            opacity: product.isAvailable ? 1 : 0.6,
                            cursor: product.isAvailable && product.siteUrl ? 'pointer' : 'not-allowed',
                            marginTop: 'auto',
                          }}
                        >
                          {product.isAvailable ? 'Explore' : 'Coming Soon'}
                        </button>
                      </div>
                    </div>
                  ))}
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
                    <img src="/partners/alu-logo.png" alt="ALU" />
                  </div>
                  <div className="logo-item">
                    <img src="/partners/rwandair-logo.png" alt="RwandAir" />
                  </div>
                  <div className="logo-item">
                    <img src="/partners/bk-logo.png" alt="Bank of Kigali" />
                  </div>
                  <div className="logo-item">
                    <img src="/partners/bralirwa-logo.png" alt="Bralirwa" />
                  </div>
                  <div className="logo-item">
                    <img src="/partners/lemigo-logo.png" alt="Lemigo Hotel" />
                  </div>
                  <div className="logo-item">
                    <img src="/partners/radisson-logo.png" alt="Radisson Blue" />
                  </div>
                  <div className="logo-item">
                    <img src="/partners/rra-logo.png" alt="RRA" />
                  </div>
                  <div className="logo-item">
                    <img src="/partners/moshions-logo.png" alt="Moshions" />
                  </div>
                </div>

                {/* Duplicate for continuous loop */}
                <div className="single-partner-card">
                  <div className="logo-item">
                    <img src="/partners/alu-logo.png" alt="ALU" />
                  </div>
                  <div className="logo-item">
                    <img src="/partners/rwandair-logo.png" alt="RwandAir" />
                  </div>
                  <div className="logo-item">
                    <img src="/partners/bk-logo.png" alt="Bank of Kigali" />
                  </div>
                  <div className="logo-item">
                    <img src="/partners/bralirwa-logo.png" alt="Bralirwa" />
                  </div>
                  <div className="logo-item">
                    <img src="/partners/lemigo-logo.png" alt="Lemigo Hotel" />
                  </div>
                  <div className="logo-item">
                    <img src="/partners/radisson-logo.png" alt="Radisson Blue" />
                  </div>
                  <div className="logo-item">
                    <img src="/partners/rra-logo.png" alt="RRA" />
                  </div>
                  <div className="logo-item">
                    <img src="/partners/moshions-logo.png" alt="Moshions" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section className="services-section" id="services-section">
            <div className="services-header">
              <h2 className="services-title">Our Services</h2>
              <p className="services-description">
                Discover powerful features designed to transform your business operations
              </p>
            </div>

            <div className="services-carousel">
              {/* Left Navigation Button */}
              <button className="nav-button nav-button-left" onClick={prevSlide}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div
                ref={trackRef}
                className="services-track"
                style={{
                  transform: `translateX(-${currentSlide * 304}px)`,
                  transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none'
                }}
              >
                {services.map((service: Service, index: number) => (
                  <div key={`${service.title}-${index}`} className="service-card">
                    <div className="service-icon">
                      <span>{service.icon}</span>
                    </div>
                    <div className="service-content">
                      <h3 className="service-title">{service.title}</h3>
                      <p className="service-description">{service.description}</p>
                      <ul className="service-features">
                        {service.features.map((feature: string, i: number) => (
                          <li key={i} className="service-feature">
                            <span className="feature-dot">•</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Navigation Button */}
              <button className="nav-button nav-button-right" onClick={nextSlide}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Slide Indicators */}
            <div className="slide-indicators">
              {originalServices.map((_: Service, index: number) => (
                <button
                  key={index}
                  className={`indicator ${index === (currentSlide % originalServices.length) ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Scroll to Top Button */}
      {isClient && mounted && showScrollTop && (
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