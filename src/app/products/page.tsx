'use client';

import { useState, useEffect } from 'react';
import Chatbot from '../components/Chatbot';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { api } from '../api/utils/apiService';

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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Handle mounting to prevent hydration mismatch
  useEffect((): void => {
    setMounted(true);
  }, []);

  // Fetch products from API
  useEffect((): void => {
    const fetchProducts = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get('/public/products');

        // Check if response is defined and has the success property
        if (!response || response.data.success === undefined) {
          throw new Error('Invalid API response - server may be unavailable');
        }

        if (!response.data.success) {
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
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Show/hide scroll-to-top button - only after component is mounted
  useEffect((): (() => void) | void => {
    if (!mounted) return;

    const handleScroll = (): void => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return (): void => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);

  // Scroll to top function
  const scrollToTop = (): void => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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
            <h1 className="hero-title text-xl font-bold text-white/80">Our Products</h1>
            <p className="hero-description">
              Cutting-edge technology solutions designed to transform your business
              operations and drive digital innovation across all industries.
            </p>
          </section>

          {/* Products Grid */}
          <section className="products-page-grid-section">
            {loading && (
              <div className="loading-container" style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ color: 'white', fontSize: '1.1rem' }}>Loading products...</p>
              </div>
            )}

            {error && (
              <div className="error-container" style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ color: '#ff6b6b', fontSize: '1.1rem' }}>{error}</p>
              </div>
            )}

            {!loading && !error && products.length === 0 && (
              <div className="no-products-container" style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ color: 'white', fontSize: '1.1rem' }}>No products available at the moment.</p>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && products.length > 0 && (
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
          </section>

          {/* Call to Action Section */}
          <section className="products-cta-section">
            <div className="products-cta-content">
              <h2 className="products-cta-title">Need Custom Solutions?</h2>
              <p className="products-cta-description">
                Our team of experts can customize any product to meet your specific business
                requirements. Get in touch with us for personalized solutions.
              </p>
              <div className="products-cta-buttons">
                <button className="products-cta-primary-btn">Contact Sales</button>
                <button className="products-cta-secondary-btn">Request Quote</button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Scroll to Top Button - only render after mounted to prevent hydration mismatch */}
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