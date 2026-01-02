'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Chatbot from '../components/Chatbot';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  imageUrl: string | null;
  category: string;
  tags: string[];
  author: string | null;
  views: number;
  publishedAt: string | null;
  createdAt: string;
}

export default function NewsPage() {
  const { resolvedTheme } = useTheme();
  const { t } = useLanguage();

  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 12,
    offset: 0,
    hasMore: false,
  });

  const categories = ['all', 'news', 'feature', 'product', 'announcement', 'update'];

  const categoryIcons: Record<string, string> = {
    news: 'bi-newspaper',
    feature: 'bi-stars',
    product: 'bi-box-seam',
    announcement: 'bi-megaphone',
    update: 'bi-arrow-repeat',
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchNews();
  }, [activeCategory]);

  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);

  const fetchNews = async (offset = 0) => {
    try {
      setLoading(true);
      const categoryParam = activeCategory !== 'all' ? `&category=${activeCategory}` : '';
      const response = await fetch(
        `/api/news?limit=${pagination.limit}&offset=${offset}${categoryParam}`
      );
      const data = await response.json();

      if (data.success) {
        if (offset === 0) {
          setNews(data.data);
        } else {
          setNews((prev) => [...prev, ...data.data]);
        }
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    fetchNews(pagination.offset + pagination.limit);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
            <span className="page-hero-badge">{t.news.title}</span>
            <h1 className="page-hero-title">{t.news.title}</h1>
            <p className="page-hero-description">{t.news.subtitle}</p>
          </section>

          {/* Category Filter */}
          <section className="news-filter">
            <div className="filter-buttons">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setPagination((prev) => ({ ...prev, offset: 0 }));
                  }}
                  className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
                >
                  {category === 'all' ? (
                    t.news.all
                  ) : (
                    <>
                      <i className={`bi ${categoryIcons[category]}`}></i>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* News Grid */}
          <section className="news-page-grid">
            {loading && news.length === 0 ? (
              <div className="news-loading-grid">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="news-skeleton">
                    <div className="skeleton-image"></div>
                    <div className="skeleton-content">
                      <div className="skeleton-badge"></div>
                      <div className="skeleton-title"></div>
                      <div className="skeleton-text"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : news.length === 0 ? (
              <div className="page-empty">
                <i className="bi bi-newspaper"></i>
                <h3>{t.news.no_results}</h3>
                <p>{t.news.subtitle}</p>
              </div>
            ) : (
              <>
                {/* Featured News */}
                {news.length > 0 && pagination.offset === 0 && (
                  <Link href={`/news/${news[0].slug}`} className="news-featured">
                    <div className="news-featured-image">
                      {news[0].imageUrl ? (
                        <img src={news[0].imageUrl} alt={news[0].title} />
                      ) : (
                        <div className="news-featured-placeholder">
                          <i className={`bi ${categoryIcons[news[0].category] || 'bi-newspaper'}`}></i>
                        </div>
                      )}
                      <span className="news-featured-badge">Featured</span>
                    </div>
                    <div className="news-featured-content">
                      <div className="news-meta">
                        <span className="news-category">{news[0].category}</span>
                        <span className="news-date">{formatDate(news[0].publishedAt || news[0].createdAt)}</span>
                      </div>
                      <h2 className="news-featured-title">{news[0].title}</h2>
                      <p className="news-featured-excerpt">{news[0].excerpt || 'Click to read more about this update.'}</p>
                      <div className="news-footer">
                        {news[0].author && (
                          <span className="news-author">
                            <i className="bi bi-person-circle"></i>
                            {news[0].author}
                          </span>
                        )}
                        <span className="news-views">
                          <i className="bi bi-eye"></i>
                          {news[0].views} {t.news.views}
                        </span>
                      </div>
                    </div>
                  </Link>
                )}

                {/* News Grid */}
                <div className="news-grid-container">
                  {news.slice(pagination.offset === 0 ? 1 : 0).map((item) => (
                    <Link key={item.id} href={`/news/${item.slug}`} className="news-card">
                      <div className="news-card-image">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.title} />
                        ) : (
                          <div className="news-card-placeholder">
                            <i className={`bi ${categoryIcons[item.category] || 'bi-newspaper'}`}></i>
                          </div>
                        )}
                      </div>
                      <div className="news-card-content">
                        <div className="news-meta">
                          <span className="news-category">{item.category}</span>
                          <span className="news-date">{formatDate(item.publishedAt || item.createdAt)}</span>
                        </div>
                        <h3 className="news-card-title">{item.title}</h3>
                        <p className="news-card-excerpt">{item.excerpt || 'Click to read more.'}</p>
                        <div className="news-footer">
                          <span className="news-views">
                            <i className="bi bi-eye"></i>
                            {item.views}
                          </span>
                          {item.tags.length > 0 && (
                            <span className="news-tag">
                              <i className="bi bi-tag"></i>
                              {item.tags[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Load More */}
                {pagination.hasMore && (
                  <div className="news-load-more">
                    <button onClick={loadMore} disabled={loading} className="load-more-btn">
                      {loading ? (
                        <>
                          <div className="loading-spinner small"></div>
                          {t.common.loading}
                        </>
                      ) : (
                        <>
                          {t.news.load_more}
                          <i className="bi bi-arrow-down"></i>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
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
