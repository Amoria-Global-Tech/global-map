'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Chatbot from '../components/Chatbot';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { PRODUCTS, type Product } from '@/data/products';

export default function ProductsPage() {
  const { resolvedTheme } = useTheme();
  const { t } = useLanguage();

  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  const products: Product[] = PRODUCTS;

  useEffect((): void => {
    setMounted(true);
  }, []);

  useEffect((): (() => void) | void => {
    if (!mounted) return;

    const handleScroll = (): void => {
      setShowScrollTop(window.scrollY > 300);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return (): void => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);

  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getProductIcon = (product: Product): string => {
    if (product.category === 'Photo & Video') return 'bi-camera-video';
    if (product.name.toLowerCase().includes('connect')) return 'bi-link-45deg';
    if (product.category === 'Software') return 'bi-box';
    return 'bi-box-seam';
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
            <h1 className="page-hero-title">{t.products.title}</h1>
            <p className="page-hero-description">{t.products.subtitle}</p>
          </section>

          {/* Products Grid */}
          <section className="products-page-grid">
            {products.length === 0 ? (
              <div className="page-empty">
                <i className="bi bi-box-seam"></i>
                <p>{t.common.no_data}</p>
              </div>
            ) : (
              <div className="products-grid">
                {products.map((product: Product) => (
                  <div key={product.id} className="product-card">
                    <div className="product-badge">
                      {product.isAvailable ? t.products.available : t.products.coming_soon}
                    </div>

                    <div className="product-icon">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
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

                      {product.isAvailable ? (
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
                ))}
              </div>
            )}
          </section>

          {/* CTA Section */}
          <section className="page-cta">
            <h2 className="page-cta-title">{t.services.get_quote}</h2>
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
