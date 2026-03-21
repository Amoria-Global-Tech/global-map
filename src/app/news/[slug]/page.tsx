"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  imageUrl: string | null;
  category: string;
  tags: string[];
  author: string | null;
  views: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface RelatedNews {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  imageUrl: string | null;
  category: string;
  publishedAt: string | null;
}

const categoryIcons: Record<string, string> = {
  news: "bi-newspaper",
  feature: "bi-stars",
  product: "bi-box-seam",
  announcement: "bi-megaphone",
  update: "bi-arrow-repeat",
};

export default function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { t } = useLanguage();

  const [news, setNews] = useState<NewsItem | null>(null);
  const [relatedNews, setRelatedNews] = useState<RelatedNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNewsDetail();
  }, [slug]);

  const fetchNewsDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/news/${slug}`);
      const data = await response.json();

      if (data.success) {
        setNews(data.data);
        fetchRelatedNews(data.data.category, data.data.id);
      } else {
        setError(data.message || "News not found");
      }
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("Failed to load news");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedNews = async (category: string, excludeId: number) => {
    try {
      const response = await fetch(`/api/news?category=${category}&limit=3`);
      const data = await response.json();
      if (data.success) {
        setRelatedNews(data.data.filter((item: RelatedNews) => item.id !== excludeId).slice(0, 3));
      }
    } catch (err) {
      console.error("Error fetching related news:", err);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShare = (platform: string) => {
    const title = news?.title || "";
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    };
    window.open(urls[platform], "_blank", "width=600,height=400");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className={`main-content ${resolvedTheme === 'light' ? 'light' : ''}`}>
          <div className="container">
            <div className="news-detail-loading">
              <div className="skeleton-breadcrumb"></div>
              <div className="skeleton-detail-title"></div>
              <div className="skeleton-detail-meta"></div>
              <div className="skeleton-detail-image"></div>
              <div className="skeleton-detail-content">
                <div className="skeleton-text"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !news) {
    return (
      <>
        <Navbar />
        <main className={`main-content ${resolvedTheme === 'light' ? 'light' : ''}`}>
          <div className="container">
            <div className="page-empty">
              <i className="bi bi-exclamation-triangle"></i>
              <h3>{error || t.news.no_results}</h3>
              <p>{t.news.subtitle}</p>
              <Link href="/news" className="load-more-btn">
                <i className="bi bi-arrow-left"></i>
                {t.common.back}
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className={`main-content ${resolvedTheme === 'light' ? 'light' : ''}`}>
        {/* Hero Section */}
        <section className="news-detail-hero">
          <div className="container">
            <div className="news-detail-hero-inner">
              {/* Breadcrumb */}
              <nav className="news-detail-breadcrumb">
                <Link href="/">{t.nav.home}</Link>
                <i className="bi bi-chevron-right"></i>
                <Link href="/news">{t.nav.news}</Link>
                <i className="bi bi-chevron-right"></i>
                <span>{news.title}</span>
              </nav>

              {/* Category & Date */}
              <div className="news-detail-meta-top">
                <span className="news-category">{news.category}</span>
                <span className="news-date">{formatDate(news.publishedAt || news.createdAt)}</span>
              </div>

              {/* Title */}
              <h1 className="news-detail-title">{news.title}</h1>

              {/* Excerpt */}
              {news.excerpt && (
                <p className="news-detail-excerpt">{news.excerpt}</p>
              )}

              {/* Meta Info */}
              <div className="news-detail-meta">
                {news.author && (
                  <span className="news-detail-meta-item">
                    <i className="bi bi-person-circle"></i>
                    {news.author}
                  </span>
                )}
                <span className="news-detail-meta-item">
                  <i className="bi bi-eye"></i>
                  {news.views} {t.news.views}
                </span>
                <span className="news-detail-meta-item">
                  <i className="bi bi-clock"></i>
                  {Math.ceil((news.content?.split(" ").length || 100) / 200)} min read
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="news-detail-body">
          <div className="container">
            <div className="news-detail-body-inner">
              {/* Featured Image */}
              {news.imageUrl && (
                <div className="news-detail-image">
                  <img src={news.imageUrl} alt={news.title} />
                </div>
              )}

              {/* Article Content */}
              <article className="news-detail-article">
                <div
                  className="news-detail-content"
                  dangerouslySetInnerHTML={{
                    __html: news.content || "<p>No content available.</p>",
                  }}
                />

                {/* Tags */}
                {news.tags.length > 0 && (
                  <div className="news-detail-tags">
                    <h4>Tags</h4>
                    <div className="news-detail-tags-list">
                      {news.tags.map((tag, index) => (
                        <span key={index} className="news-detail-tag">#{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share Buttons */}
                <div className="news-detail-share">
                  <h4>{t.news.share}</h4>
                  <div className="news-detail-share-buttons">
                    <button onClick={() => handleShare("twitter")} className="share-btn" title="Share on X">
                      <i className="bi bi-twitter-x"></i>
                    </button>
                    <button onClick={() => handleShare("facebook")} className="share-btn" title="Share on Facebook">
                      <i className="bi bi-facebook"></i>
                    </button>
                    <button onClick={() => handleShare("linkedin")} className="share-btn" title="Share on LinkedIn">
                      <i className="bi bi-linkedin"></i>
                    </button>
                    <button onClick={handleCopyLink} className="share-btn" title="Copy link">
                      <i className="bi bi-link-45deg"></i>
                    </button>
                  </div>
                </div>
              </article>

              {/* Navigation */}
              <div className="news-detail-nav">
                <button onClick={() => router.back()} className="news-detail-nav-link">
                  <i className="bi bi-arrow-left"></i>
                  {t.common.back}
                </button>
                <Link href="/news" className="news-detail-nav-link">
                  {t.news.all} {t.nav.news}
                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>

              {/* Related News */}
              {relatedNews.length > 0 && (
                <div className="news-detail-related">
                  <h3>{t.news.related}</h3>
                  <div className="news-detail-related-grid">
                    {relatedNews.map((item) => (
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
                            <span className="news-date">{formatDate(item.publishedAt)}</span>
                          </div>
                          <h3 className="news-card-title">{item.title}</h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
