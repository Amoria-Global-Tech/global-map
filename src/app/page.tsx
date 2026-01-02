'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Chatbot from './components/Chatbot';
import Navbar from './components/navbar';
import Footer from './components/footer';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

// Type definitions
interface Product {
  id: string | number;
  name: string;
  description: string;
  category: string;
  price?: string | number;
  image_url?: string;
  imageUrl?: string | null;
  is_available?: boolean;
  isAvailable?: boolean;
  siteUrl?: string | null;
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

interface ApiResponse {
  products?: Product[];
}

export default function HomePage() {
  const { resolvedTheme } = useTheme();
  const { t } = useLanguage();
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
    { progress: 20, status: t.home.loading.loading_modules, text: t.home.loading.loading },
    { progress: 40, status: t.home.loading.establishing, text: t.home.loading.connecting },
    { progress: 60, status: t.home.loading.syncing_data, text: t.home.loading.syncing },
    { progress: 80, status: t.home.loading.optimizing_perf, text: t.home.loading.optimizing },
    { progress: 100, status: t.home.loading.welcome, text: t.home.loading.complete }
  ];

  const originalServices: Service[] = [
    {
      title: t.home.services.web_dev.title,
      description: t.home.services.web_dev.description,
      icon: '🌐',
      features: t.home.services.web_dev.features
    },
    {
      title: t.home.services.mobile_dev.title,
      description: t.home.services.mobile_dev.description,
      icon: '📱',
      features: t.home.services.mobile_dev.features
    },
    {
      title: t.home.services.desktop_dev.title,
      description: t.home.services.desktop_dev.description,
      icon: '💻',
      features: t.home.services.desktop_dev.features
    },
    {
      title: t.home.services.seo.title,
      description: t.home.services.seo.description,
      icon: '🚀',
      features: t.home.services.seo.features
    },
    {
      title: t.home.services.consulting.title,
      description: t.home.services.consulting.description,
      icon: '🔧',
      features: t.home.services.consulting.features
    },
    {
      title: t.home.services.custom_software.title,
      description: t.home.services.custom_software.description,
      icon: '⚙️',
      features: t.home.services.custom_software.features
    },
    {
      title: t.home.services.security.title,
      description: t.home.services.security.description,
      icon: '🔒',
      features: t.home.services.security.features
    },
    {
      title: t.home.services.data_analysis.title,
      description: t.home.services.data_analysis.description,
      icon: '📊',
      features: t.home.services.data_analysis.features
    }
  ];

  // Fetch products from API
  useEffect((): void => {
    const fetchProducts = async (): Promise<void> => {
      try {
        setProductsLoading(true);
        const response: Response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: Product[] | ApiResponse = await response.json();
        
        // Handle different API response formats
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data && 'products' in data && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (err: unknown) {
        console.error('Error fetching products:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setProductsError(`Failed to load products: ${errorMessage}. Please try again later.`);
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
  }, [mounted, isClient, t.home.typing_word]);

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

  // Globe Preloader Component - only show when ready and not mounted and hasn't been shown before
  if (!mounted && !hasShownPreloader && isClient) {
    // Show minimal loading state until preloader is ready
    if (!preloaderReady) {
      return (
        <div className="preloader-container">
          <div className="preloader-content">
            <div className="loading-info">
              <div className="loading-text">{t.home.loading.initializing}</div>
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
      <main className={`main-content ${resolvedTheme === 'light' ? 'light' : ''}`}>
        <div className="container">
          {/* Hero Heading Section */}
          <section className="hero-heading-section">
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
          </section>
          
          {/* Action Buttons Section */}
          <section className="action-buttons-section">
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
          </section>

          {/* Products Section */}
          <section className="products-section">
            <div className="container">
              <div className="products-header">
                <h2 className="products-title">{t.home.products_title}</h2>
                <p className="products-description">
                  {t.home.products_subtitle}
                </p>
              </div>

              {/* Loading State */}
              {productsLoading && (
                <div className="products-loading" style={{ textAlign: 'center', padding: '2rem' }}>
                  <p style={{ color: 'white', fontSize: '1.1rem' }}>{t.home.products_loading}</p>
                </div>
              )}

              {/* Error State */}
              {productsError && (
                <div className="products-error" style={{ textAlign: 'center', padding: '2rem' }}>
                  <p style={{ color: '#ff6b6b', fontSize: '1.1rem' }}>{t.home.products_error}</p>
                </div>
              )}

              {/* No Products State */}
              {!productsLoading && !productsError && products.length === 0 && (
                <div className="no-products" style={{ textAlign: 'center', padding: '2rem' }}>
                  <p style={{ color: 'white', fontSize: '1.1rem' }}>{t.home.products_empty}</p>
                </div>
              )}

              {/* Products Grid */}
              {!productsLoading && !productsError && products.length > 0 && (
                <div className="products-grid">
                  {products.map((product: Product) => {
                    const isAvailable = product.isAvailable ?? product.is_available ?? false;
                    const productImage = product.imageUrl ?? product.image_url;

                    return (
                      <div key={product.id} className="product-card">
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
                            <span>{getProductIcon(product)}</span>
                          )}
                        </div>

                        <div className="product-content">
                          {product.category && (
                            <span className="product-category">{product.category}</span>
                          )}
                          <h3 className="product-title">{product.name}</h3>
                          <p className="product-description">{product.description}</p>

                          {isAvailable ? (
                            product.siteUrl ? (
                              <a
                                href={product.siteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="product-btn visit-btn"
                              >
                                {t.products.visit_now}
                                <i className="bi bi-arrow-right"></i>
                              </a>
                            ) : (
                              <button className="product-btn visit-btn">
                                {t.products.explore}
                                <i className="bi bi-arrow-right"></i>
                              </button>
                            )
                          ) : (
                            <button className="product-btn coming-soon-btn" disabled>
                              {t.products.coming_soon}
                              <i className="bi bi-clock"></i>
                            </button>
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
                    <img src="/partners/alu-logo.png" alt="ALU"  />
                  </div>
                  <div className="logo-item">
                    <img src="/partners/rwandair-logo.png" alt="RwandAir"  />
                  </div>
                  <div className="logo-item">
                    <img src="/partners/bk-logo.png" alt="Bank of Kigali"  />
                  </div>
                  <div className="logo-item">
                    <img src="/partners/bralirwa-logo.png" alt="Bralirwa"  />
                  </div>
                  <div className="logo-item">
                    <img src="/partners/lemigo-logo.png" alt="Lemigo Hotel"  />
                  </div>
                  <div className="logo-item">
                    <img src="/partners/radisson-logo.png" alt="Radisson Blue"  />
                  </div>
                  <div className="logo-item">
                    <img src="/partners/rra-logo.png" alt="RRA"  />
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
              <h2 className="services-title">{t.home.services_title}</h2>
              <p className="services-description">
                {t.home.services_subtitle}
              </p>
            </div>

            <div className="services-carousel">
              {/* Left Navigation Button */}
              <button className="nav-button nav-button-left" onClick={prevSlide}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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