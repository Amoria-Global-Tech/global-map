'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Chatbot from '../components/Chatbot';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface DonationTier {
  id: string;
  name: string;
  amount: number;
  description: string;
  benefits: string[];
  icon: string;
  popular?: boolean;
}

export default function DonatePage() {
  const { resolvedTheme } = useTheme();
  const { t } = useLanguage();

  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mounted, setMounted] = useState(false);

  const donationTiers: DonationTier[] = [
    {
      id: 'supporter',
      name: t.donate.tiers.supporter.name,
      amount: 25,
      description: t.donate.tiers.supporter.description,
      benefits: t.donate.tiers.supporter.benefits,
      icon: 'bi-heart'
    },
    {
      id: 'contributor',
      name: t.donate.tiers.contributor.name,
      amount: 50,
      description: t.donate.tiers.contributor.description,
      benefits: t.donate.tiers.contributor.benefits,
      icon: 'bi-star',
      popular: true
    },
    {
      id: 'champion',
      name: t.donate.tiers.champion.name,
      amount: 100,
      description: t.donate.tiers.champion.description,
      benefits: t.donate.tiers.champion.benefits,
      icon: 'bi-trophy'
    },
    {
      id: 'visionary',
      name: t.donate.tiers.visionary.name,
      amount: 250,
      description: t.donate.tiers.visionary.description,
      benefits: t.donate.tiers.visionary.benefits,
      icon: 'bi-gem'
    }
  ];

  const impactStats = [
    { value: '500+', label: t.donate.impact_stats.students, icon: 'bi-mortarboard' },
    { value: '50+', label: t.donate.impact_stats.projects, icon: 'bi-folder-check' },
    { value: '10+', label: t.donate.impact_stats.communities, icon: 'bi-people' },
    { value: '95%', label: t.donate.impact_stats.success, icon: 'bi-graph-up-arrow' }
  ];

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

  const handleDonate = (tierId: string, amount: number) => {
    // In production, integrate with payment gateway
    alert(`${t.donate.thank_you} $${amount}`);
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
          <section className="donate-hero">
            <span className="page-hero-badge">
              <i className="bi bi-heart-fill"></i>
              {t.donate.badge}
            </span>
            <h1 className="page-hero-title">{t.donate.hero_title}</h1>
            <p className="page-hero-description">{t.donate.hero_description}</p>
          </section>

          {/* Impact Stats */}
          <section className="donate-impact">
            <div className="impact-grid">
              {impactStats.map((stat, index) => (
                <div key={index} className="impact-card">
                  <div className="impact-icon">
                    <i className={`bi ${stat.icon}`}></i>
                  </div>
                  <span className="impact-value">{stat.value}</span>
                  <span className="impact-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Donation Tiers */}
          <section className="donate-tiers">
            <h2 className="section-title">{t.donate.choose_impact}</h2>
            <p className="section-description">{t.donate.select_tier}</p>

            <div className="tiers-grid">
              {donationTiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`tier-card ${selectedTier === tier.id ? 'selected' : ''} ${tier.popular ? 'popular' : ''}`}
                  onClick={() => setSelectedTier(tier.id)}
                >
                  {tier.popular && <span className="tier-popular-badge">{t.donate.most_popular}</span>}
                  <div className="tier-icon">
                    <i className={`bi ${tier.icon}`}></i>
                  </div>
                  <h3 className="tier-name">{tier.name}</h3>
                  <div className="tier-amount">${tier.amount}</div>
                  <p className="tier-description">{tier.description}</p>
                  <ul className="tier-benefits">
                    {tier.benefits.map((benefit, i) => (
                      <li key={i}>
                        <i className="bi bi-check-circle"></i>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <button
                    className="tier-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDonate(tier.id, tier.amount);
                    }}
                  >
                    {t.donate.donate_btn} ${tier.amount}
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Custom Amount */}
          <section className="donate-custom">
            <div className="custom-card">
              <h3 className="custom-title">
                <i className="bi bi-gift"></i>
                {t.donate.custom_title}
              </h3>
              <p className="custom-description">{t.donate.custom_description}</p>
              <div className="custom-input-group">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder={t.donate.enter_amount}
                  min="1"
                  className="custom-input"
                />
                <button
                  className="custom-btn"
                  onClick={() => {
                    if (customAmount && parseFloat(customAmount) > 0) {
                      handleDonate('custom', parseFloat(customAmount));
                    }
                  }}
                  disabled={!customAmount || parseFloat(customAmount) <= 0}
                >
                  {t.donate.donate_btn}
                  <i className="bi bi-heart-fill"></i>
                </button>
              </div>
            </div>
          </section>

          {/* How It Helps */}
          <section className="donate-how">
            <h2 className="section-title">{t.donate.how_helps_title}</h2>
            <div className="how-grid">
              <div className="how-card">
                <div className="how-icon">
                  <i className="bi bi-laptop"></i>
                </div>
                <h3>{t.donate.how_helps.training.title}</h3>
                <p>{t.donate.how_helps.training.description}</p>
              </div>
              <div className="how-card">
                <div className="how-icon">
                  <i className="bi bi-building"></i>
                </div>
                <h3>{t.donate.how_helps.infrastructure.title}</h3>
                <p>{t.donate.how_helps.infrastructure.description}</p>
              </div>
              <div className="how-card">
                <div className="how-icon">
                  <i className="bi bi-people"></i>
                </div>
                <h3>{t.donate.how_helps.mentorship.title}</h3>
                <p>{t.donate.how_helps.mentorship.description}</p>
              </div>
              <div className="how-card">
                <div className="how-icon">
                  <i className="bi bi-globe"></i>
                </div>
                <h3>{t.donate.how_helps.access.title}</h3>
                <p>{t.donate.how_helps.access.description}</p>
              </div>
            </div>
          </section>

          {/* Trust Section */}
          <section className="donate-trust">
            <div className="trust-content">
              <h2 className="trust-title">{t.donate.trust_title}</h2>
              <p className="trust-description">{t.donate.trust_description}</p>
              <div className="trust-badges">
                <div className="trust-badge">
                  <i className="bi bi-shield-check"></i>
                  <span>{t.donate.trust_badges.secure}</span>
                </div>
                <div className="trust-badge">
                  <i className="bi bi-file-earmark-text"></i>
                  <span>{t.donate.trust_badges.tax}</span>
                </div>
                <div className="trust-badge">
                  <i className="bi bi-clock-history"></i>
                  <span>{t.donate.trust_badges.reports}</span>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="page-cta">
            <h2 className="page-cta-title">{t.donate.cta_title}</h2>
            <p className="page-cta-description">{t.donate.cta_description}</p>
            <Link href="/contact" className="page-cta-btn">
              {t.donate.cta_button}
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
