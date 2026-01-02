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

const categoryColors: Record<string, string> = {
  news: "bg-blue-100 text-blue-800",
  feature: "bg-purple-100 text-purple-800",
  product: "bg-green-100 text-green-800",
  announcement: "bg-yellow-100 text-yellow-800",
  update: "bg-orange-100 text-orange-800",
};

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

  if (loading) {
    return (
      <>
        <Navbar />
        <main className={`min-h-screen ${resolvedTheme === 'light' ? 'bg-gray-50' : 'bg-slate-900'}`} style={{ paddingTop: '100px' }}>
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="animate-pulse">
              <div className={`h-8 ${resolvedTheme === 'light' ? 'bg-gray-200' : 'bg-slate-700'} rounded w-1/4 mb-6`}></div>
              <div className={`h-12 ${resolvedTheme === 'light' ? 'bg-gray-200' : 'bg-slate-700'} rounded w-3/4 mb-4`}></div>
              <div className={`h-6 ${resolvedTheme === 'light' ? 'bg-gray-200' : 'bg-slate-700'} rounded w-1/2 mb-8`}></div>
              <div className={`h-96 ${resolvedTheme === 'light' ? 'bg-gray-200' : 'bg-slate-700'} rounded-2xl mb-8`}></div>
              <div className="space-y-4">
                <div className={`h-4 ${resolvedTheme === 'light' ? 'bg-gray-200' : 'bg-slate-700'} rounded w-full`}></div>
                <div className={`h-4 ${resolvedTheme === 'light' ? 'bg-gray-200' : 'bg-slate-700'} rounded w-full`}></div>
                <div className={`h-4 ${resolvedTheme === 'light' ? 'bg-gray-200' : 'bg-slate-700'} rounded w-3/4`}></div>
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
        <main className={`min-h-screen ${resolvedTheme === 'light' ? 'bg-gray-50' : 'bg-slate-900'}`} style={{ paddingTop: '100px' }}>
          <div className="container mx-auto px-4 text-center py-20">
            <div className={`w-24 h-24 ${resolvedTheme === 'light' ? 'bg-gray-100' : 'bg-slate-800'} rounded-full flex items-center justify-center mx-auto mb-6`}>
              <i className={`bi bi-exclamation-triangle text-4xl ${resolvedTheme === 'light' ? 'text-gray-400' : 'text-slate-500'}`}></i>
            </div>
            <h1 className={`text-2xl font-bold ${resolvedTheme === 'light' ? 'text-gray-900' : 'text-white'} mb-4`}>
              {error || t.news.no_results}
            </h1>
            <p className={`${resolvedTheme === 'light' ? 'text-gray-500' : 'text-gray-400'} mb-8`}>
              {t.news.subtitle}
            </p>
            <Link
              href="/news"
              className={`inline-flex items-center gap-2 px-6 py-3 ${resolvedTheme === 'light' ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-blue-600 text-white hover:bg-blue-700'} rounded-full transition-colors`}
            >
              <i className="bi bi-arrow-left"></i>
              {t.common.back}
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className={`min-h-screen ${resolvedTheme === 'light' ? 'bg-gray-50' : 'bg-slate-900'}`} style={{ paddingTop: '80px' }}>
        {/* Hero Section */}
        <section className={`${resolvedTheme === 'light' ? 'bg-gradient-to-br from-slate-100 via-slate-50 to-white text-slate-900' : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white'} py-16`}>
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Breadcrumb */}
            <nav className={`flex items-center gap-2 text-sm ${resolvedTheme === 'light' ? 'text-gray-500' : 'text-gray-400'} mb-6`}>
              <Link href="/" className={`hover:${resolvedTheme === 'light' ? 'text-gray-900' : 'text-white'} transition-colors`}>{t.nav.home}</Link>
              <i className="bi bi-chevron-right text-xs"></i>
              <Link href="/news" className={`hover:${resolvedTheme === 'light' ? 'text-gray-900' : 'text-white'} transition-colors`}>{t.nav.news}</Link>
              <i className="bi bi-chevron-right text-xs"></i>
              <span className={`${resolvedTheme === 'light' ? 'text-gray-700' : 'text-gray-300'} truncate max-w-xs`}>{news.title}</span>
            </nav>

            {/* Category & Date */}
            <div className="flex items-center gap-4 mb-6">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[news.category] || "bg-gray-100 text-gray-800"}`}>
                <i className={`bi ${categoryIcons[news.category]} mr-2`}></i>
                {news.category.charAt(0).toUpperCase() + news.category.slice(1)}
              </span>
              <span className={resolvedTheme === 'light' ? 'text-gray-500' : 'text-gray-400'}>
                {formatDate(news.publishedAt || news.createdAt)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {news.title}
            </h1>

            {/* Excerpt */}
            {news.excerpt && (
              <p className={`text-xl ${resolvedTheme === 'light' ? 'text-gray-600' : 'text-gray-300'} mb-6`}>
                {news.excerpt}
              </p>
            )}

            {/* Meta Info */}
            <div className={`flex flex-wrap items-center gap-6 text-sm ${resolvedTheme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
              {news.author && (
                <span className="flex items-center gap-2">
                  <i className="bi bi-person-circle text-lg"></i>
                  {news.author}
                </span>
              )}
              <span className="flex items-center gap-2">
                <i className="bi bi-eye text-lg"></i>
                {news.views} {t.news.views}
              </span>
              <span className="flex items-center gap-2">
                <i className="bi bi-clock text-lg"></i>
                {Math.ceil((news.content?.split(" ").length || 100) / 200)} min read
              </span>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Featured Image */}
              {news.imageUrl && (
                <div className="relative -mt-20 mb-10 rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="w-full h-auto max-h-[500px] object-cover"
                  />
                </div>
              )}

              {/* Article Content */}
              <article className={`${resolvedTheme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl p-8 md:p-12 shadow-sm mb-12`}>
                <div
                  className={`prose prose-lg max-w-none ${resolvedTheme === 'light' ? 'prose-headings:text-slate-900 prose-p:text-gray-600 prose-a:text-blue-600 prose-strong:text-slate-900' : 'prose-invert prose-headings:text-white prose-p:text-gray-300 prose-a:text-blue-400 prose-strong:text-white'}`}
                  dangerouslySetInnerHTML={{
                    __html: news.content || "<p>No content available.</p>",
                  }}
                />

                {/* Tags */}
                {news.tags.length > 0 && (
                  <div className={`mt-10 pt-8 border-t ${resolvedTheme === 'light' ? 'border-gray-200' : 'border-slate-700'}`}>
                    <h4 className={`text-sm font-medium ${resolvedTheme === 'light' ? 'text-gray-500' : 'text-gray-400'} mb-3`}>Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {news.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 ${resolvedTheme === 'light' ? 'bg-gray-100 text-gray-600' : 'bg-slate-700 text-gray-300'} rounded-full text-sm`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share Buttons */}
                <div className={`mt-8 pt-8 border-t ${resolvedTheme === 'light' ? 'border-gray-200' : 'border-slate-700'}`}>
                  <h4 className={`text-sm font-medium ${resolvedTheme === 'light' ? 'text-gray-500' : 'text-gray-400'} mb-3`}>{t.news.share}</h4>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleShare("twitter")}
                      className={`p-3 ${resolvedTheme === 'light' ? 'bg-gray-100 hover:bg-blue-100 hover:text-blue-600' : 'bg-slate-700 hover:bg-blue-900 hover:text-blue-400'} rounded-full transition-colors`}
                    >
                      <i className="bi bi-twitter-x"></i>
                    </button>
                    <button
                      onClick={() => handleShare("facebook")}
                      className={`p-3 ${resolvedTheme === 'light' ? 'bg-gray-100 hover:bg-blue-100 hover:text-blue-600' : 'bg-slate-700 hover:bg-blue-900 hover:text-blue-400'} rounded-full transition-colors`}
                    >
                      <i className="bi bi-facebook"></i>
                    </button>
                    <button
                      onClick={() => handleShare("linkedin")}
                      className={`p-3 ${resolvedTheme === 'light' ? 'bg-gray-100 hover:bg-blue-100 hover:text-blue-600' : 'bg-slate-700 hover:bg-blue-900 hover:text-blue-400'} rounded-full transition-colors`}
                    >
                      <i className="bi bi-linkedin"></i>
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(shareUrl)}
                      className={`p-3 ${resolvedTheme === 'light' ? 'bg-gray-100 hover:bg-green-100 hover:text-green-600' : 'bg-slate-700 hover:bg-green-900 hover:text-green-400'} rounded-full transition-colors`}
                    >
                      <i className="bi bi-link-45deg"></i>
                    </button>
                  </div>
                </div>
              </article>

              {/* Navigation */}
              <div className="flex justify-between items-center mb-12">
                <button
                  onClick={() => router.back()}
                  className={`flex items-center gap-2 ${resolvedTheme === 'light' ? 'text-gray-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'} transition-colors`}
                >
                  <i className="bi bi-arrow-left"></i>
                  {t.common.back}
                </button>
                <Link
                  href="/news"
                  className={`flex items-center gap-2 ${resolvedTheme === 'light' ? 'text-gray-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'} transition-colors`}
                >
                  {t.news.all} {t.nav.news}
                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>

              {/* Related News */}
              {relatedNews.length > 0 && (
                <div className="mb-12">
                  <h3 className={`text-2xl font-bold ${resolvedTheme === 'light' ? 'text-gray-900' : 'text-white'} mb-6`}>{t.news.related}</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {relatedNews.map((item) => (
                      <Link
                        key={item.id}
                        href={`/news/${item.slug}`}
                        className={`group ${resolvedTheme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all`}
                      >
                        <div className={`relative h-36 ${resolvedTheme === 'light' ? 'bg-gradient-to-br from-slate-100 to-slate-200' : 'bg-gradient-to-br from-slate-700 to-slate-800'}`}>
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <i className={`bi ${categoryIcons[item.category]} text-3xl ${resolvedTheme === 'light' ? 'text-slate-300' : 'text-slate-600'}`}></i>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <span className={`text-xs ${resolvedTheme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {formatDate(item.publishedAt)}
                          </span>
                          <h4 className={`font-semibold ${resolvedTheme === 'light' ? 'text-gray-900' : 'text-white'} group-hover:text-blue-600 transition-colors line-clamp-2 mt-1`}>
                            {item.title}
                          </h4>
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
