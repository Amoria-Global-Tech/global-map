'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Chatbot from '../components/Chatbot';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  authorRole: string;
  readTime: string;
  publishedAt: string;
  imageUrl: string | null;
  tags: string[];
}

export default function BlogPage() {
  const { resolvedTheme } = useTheme();
  const { t } = useLanguage();

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mounted, setMounted] = useState(false);

  const categories = ['all', 'technology', 'development', 'design', 'business', 'tutorials'];

  const categoryIcons: Record<string, string> = {
    technology: 'bi-cpu',
    development: 'bi-code-slash',
    design: 'bi-palette',
    business: 'bi-briefcase',
    tutorials: 'bi-book',
  };

  // Sample blog posts (in production, fetch from API)
  const samplePosts: BlogPost[] = [
    {
      id: 1,
      title: 'Building Scalable Web Applications with Next.js 15',
      slug: 'building-scalable-web-applications-nextjs-15',
      excerpt: 'Learn how to build high-performance, scalable web applications using the latest features in Next.js 15.',
      content: '',
      category: 'development',
      author: 'Joseph Maranatha',
      authorRole: 'CTO',
      readTime: '8 min read',
      publishedAt: '2024-12-15',
      imageUrl: null,
      tags: ['Next.js', 'React', 'Web Development']
    },
    {
      id: 2,
      title: 'The Future of AI in Software Development',
      slug: 'future-of-ai-in-software-development',
      excerpt: 'Exploring how artificial intelligence is transforming the way we build and deploy software.',
      content: '',
      category: 'technology',
      author: 'Moses Mirarayi',
      authorRole: 'Head of Operations',
      readTime: '6 min read',
      publishedAt: '2024-12-10',
      imageUrl: null,
      tags: ['AI', 'Machine Learning', 'Innovation']
    },
    {
      id: 3,
      title: 'UI/UX Best Practices for Modern Applications',
      slug: 'ui-ux-best-practices-modern-applications',
      excerpt: 'Essential design principles and practices for creating intuitive user experiences.',
      content: '',
      category: 'design',
      author: 'Pacific Uwitonze',
      authorRole: 'UI/UX Designer',
      readTime: '5 min read',
      publishedAt: '2024-12-05',
      imageUrl: null,
      tags: ['UI/UX', 'Design', 'User Experience']
    },
    {
      id: 4,
      title: 'Cybersecurity Essentials for Businesses',
      slug: 'cybersecurity-essentials-for-businesses',
      excerpt: 'Protecting your digital assets with modern security practices and tools.',
      content: '',
      category: 'technology',
      author: 'Jackson Mugwiza',
      authorRole: 'Cybersecurity Analyst',
      readTime: '7 min read',
      publishedAt: '2024-12-01',
      imageUrl: null,
      tags: ['Security', 'Cybersecurity', 'Business']
    },
    {
      id: 5,
      title: 'Getting Started with Cloud Infrastructure',
      slug: 'getting-started-cloud-infrastructure',
      excerpt: 'A comprehensive guide to setting up and managing cloud infrastructure for your projects.',
      content: '',
      category: 'tutorials',
      author: 'Joseph Maranatha',
      authorRole: 'CTO',
      readTime: '10 min read',
      publishedAt: '2024-11-25',
      imageUrl: null,
      tags: ['Cloud', 'AWS', 'Infrastructure']
    },
    {
      id: 6,
      title: 'Digital Transformation Strategies for SMEs',
      slug: 'digital-transformation-strategies-smes',
      excerpt: 'How small and medium enterprises can leverage technology for growth and efficiency.',
      content: '',
      category: 'business',
      author: 'Moses Mirarayi',
      authorRole: 'Head of Operations',
      readTime: '6 min read',
      publishedAt: '2024-11-20',
      imageUrl: null,
      tags: ['Business', 'Digital Transformation', 'Strategy']
    }
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Simulate API fetch
    setLoading(true);
    setTimeout(() => {
      if (activeCategory === 'all') {
        setPosts(samplePosts);
      } else {
        setPosts(samplePosts.filter(post => post.category === activeCategory));
      }
      setLoading(false);
    }, 500);
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
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
            <span className="page-hero-badge">
              <i className="bi bi-journal-richtext"></i>
              {t.blog.title}
            </span>
            <h1 className="page-hero-title">{t.blog.subtitle}</h1>
            <p className="page-hero-description">{t.blog.description}</p>
          </section>

          {/* Category Filter */}
          <section className="blog-filter">
            <div className="filter-buttons">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
                >
                  {category === 'all' ? (
                    t.blog.all_posts
                  ) : (
                    <>
                      <i className={`bi ${categoryIcons[category]}`}></i>
                      {t.blog.categories[category as keyof typeof t.blog.categories] || category.charAt(0).toUpperCase() + category.slice(1)}
                    </>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Blog Grid */}
          <section className="blog-page-grid">
            {loading ? (
              <div className="blog-loading-grid">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="blog-skeleton">
                    <div className="skeleton-image"></div>
                    <div className="skeleton-content">
                      <div className="skeleton-badge"></div>
                      <div className="skeleton-title"></div>
                      <div className="skeleton-text"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="page-empty">
                <i className="bi bi-journal-x"></i>
                <h3>{t.blog.no_posts}</h3>
                <p>{t.blog.check_back}</p>
              </div>
            ) : (
              <>
                {/* Featured Post */}
                {posts.length > 0 && (
                  <div className="blog-featured">
                    <div className="blog-featured-image">
                      {posts[0].imageUrl ? (
                        <img src={posts[0].imageUrl} alt={posts[0].title} />
                      ) : (
                        <div className="blog-featured-placeholder">
                          <i className={`bi ${categoryIcons[posts[0].category] || 'bi-journal'}`}></i>
                        </div>
                      )}
                      <span className="blog-featured-badge">{t.blog.featured}</span>
                    </div>
                    <div className="blog-featured-content">
                      <div className="blog-meta">
                        <span className="blog-category">{posts[0].category}</span>
                        <span className="blog-date">{formatDate(posts[0].publishedAt)}</span>
                        <span className="blog-read-time">{posts[0].readTime}</span>
                      </div>
                      <h2 className="blog-featured-title">{posts[0].title}</h2>
                      <p className="blog-featured-excerpt">{posts[0].excerpt}</p>
                      <div className="blog-author">
                        <div className="blog-author-avatar">
                          <i className="bi bi-person-circle"></i>
                        </div>
                        <div className="blog-author-info">
                          <span className="blog-author-name">{posts[0].author}</span>
                          <span className="blog-author-role">{posts[0].authorRole}</span>
                        </div>
                      </div>
                      <div className="blog-tags">
                        {posts[0].tags.map((tag, i) => (
                          <span key={i} className="blog-tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Blog Grid */}
                <div className="blog-grid-container">
                  {posts.slice(1).map((post) => (
                    <div key={post.id} className="blog-card">
                      <div className="blog-card-image">
                        {post.imageUrl ? (
                          <img src={post.imageUrl} alt={post.title} />
                        ) : (
                          <div className="blog-card-placeholder">
                            <i className={`bi ${categoryIcons[post.category] || 'bi-journal'}`}></i>
                          </div>
                        )}
                      </div>
                      <div className="blog-card-content">
                        <div className="blog-meta">
                          <span className="blog-category">{post.category}</span>
                          <span className="blog-read-time">{post.readTime}</span>
                        </div>
                        <h3 className="blog-card-title">{post.title}</h3>
                        <p className="blog-card-excerpt">{post.excerpt}</p>
                        <div className="blog-card-footer">
                          <span className="blog-author-name">
                            <i className="bi bi-person"></i>
                            {post.author}
                          </span>
                          <span className="blog-date">{formatDate(post.publishedAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>

          {/* CTA Section */}
          <section className="page-cta">
            <h2 className="page-cta-title">{t.blog.cta_title}</h2>
            <p className="page-cta-description">{t.blog.cta_description}</p>
            <Link href="/contact" className="page-cta-btn">
              {t.blog.cta_button}
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
