'use client';

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage, Language, languageNames } from "@/contexts/LanguageContext";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { name: t.nav.home, href: '/' },
    { name: t.nav.about, href: '/about' },
    { name: t.nav.services, href: '/services' },
    { name: t.nav.products, href: '/products' },
    { name: t.nav.news, href: '/news' },
  ];

  const extraLinks = [
    { name: t.nav.blog, href: '/news', icon: 'bi-journal-text' },
    { name: t.nav.donate, href: '/donate', icon: 'bi-heart' },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const languages: Language[] = ['en', 'fr', 'es', 'rw', 'sw'];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <Link href="/" className="navbar-logo">
            <img src="/logo1.png" alt="" className="navbar-logo-icon" /><span className="navbar-logo-text">Amoria Global Tech</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-nav">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`navbar-link ${pathname === item.href ? 'active' : ''}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Section: Theme, Language, Extra Links, Contact */}
          <div className="navbar-actions">
            {/* Theme Toggle */}
            <button
              className="navbar-icon-btn"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <i className={`bi ${resolvedTheme === 'dark' ? 'bi-sun' : 'bi-moon-fill'}`}></i>
            </button>

            {/* Language Selector */}
            <div className="navbar-dropdown" ref={langDropdownRef}>
              <button
                className="navbar-icon-btn lang-btn"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                aria-label="Select language"
              >
                <span className="lang-flag">{languageNames[language].flag}</span>
                <span className="lang-code">{language.toUpperCase()}</span>
                <i className="bi bi-chevron-down"></i>
              </button>
              {langDropdownOpen && (
                <div className="dropdown-menu">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      className={`dropdown-item ${language === lang ? 'active' : ''}`}
                      onClick={() => {
                        setLanguage(lang);
                        setLangDropdownOpen(false);
                      }}
                    >
                      <span className="lang-flag">{languageNames[lang].flag}</span>
                      <span>{languageNames[lang].name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="navbar-divider"></div>

            {/* Extra Links - Desktop */}
            <div className="navbar-extra-links">
              {extraLinks.map((link) => (
                link.href === '/donate' ? (
                  <span
                    key={link.name}
                    className="navbar-extra-link donate-disabled"
                    title="Coming soon"
                  >
                    <i className={`bi ${link.icon} donate-icon-default`}></i>
                    <i className="bi bi-slash-circle donate-icon-hover"></i>
                    <span>{link.name}</span>
                  </span>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`navbar-extra-link ${pathname === link.href ? 'active' : ''}`}
                  >
                    <i className={`bi ${link.icon}`}></i>
                    <span>{link.name}</span>
                  </Link>
                )
              ))}
            </div>

            {/* Contact Button */}
            <Link
              href="/contact"
              className={`navbar-contact-btn ${pathname === '/contact' ? 'active' : ''}`}
            >
              <i className="bi bi-envelope"></i>
              <span>{t.nav.contact}</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="navbar-mobile-btn"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <i className={`bi ${mobileMenuOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-nav ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-nav-header">
          <Link href="/" className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
            <img src="/logo1.png" alt="" className="navbar-logo-icon" /><span className="navbar-logo-text">Amoria Global Tech</span>
          </Link>
          <button
            className="mobile-nav-close"
            onClick={toggleMobileMenu}
            aria-label="Close menu"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="mobile-nav-content">
          {/* Main Navigation */}
          <div className="mobile-nav-section">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`mobile-nav-link ${pathname === item.href ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="mobile-nav-divider"></div>

          {/* Extra Links */}
          <div className="mobile-nav-section">
            {extraLinks.map((link) => (
              link.href === '/donate' ? (
                <span
                  key={link.name}
                  className="mobile-nav-link donate-disabled"
                  title="Coming soon"
                >
                  <i className={`bi ${link.icon} donate-icon-default`}></i>
                  <i className="bi bi-slash-circle donate-icon-hover"></i>
                  {link.name}
                </span>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`mobile-nav-link ${pathname === link.href ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className={`bi ${link.icon}`}></i>
                  {link.name}
                </Link>
              )
            ))}
            <Link
              href="/contact"
              className={`mobile-nav-link ${pathname === '/contact' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="bi bi-envelope"></i>
              {t.nav.contact}
            </Link>
          </div>

          {/* Divider */}
          <div className="mobile-nav-divider"></div>

          {/* Theme & Language */}
          <div className="mobile-nav-settings">
            {/* Theme Toggle */}
            <div className="mobile-settings-group">
              <span className="mobile-settings-label">
                <i className="bi bi-palette"></i>
                Theme
              </span>
              <div className="mobile-settings-options">
                <button
                  className="mobile-setting-btn"
                  onClick={toggleTheme}
                >
                  <i className={`bi ${resolvedTheme === 'dark' ? 'bi-sun' : 'bi-moon-fill'}`}></i>
                  <span className="mobile-theme-label">
                    {resolvedTheme === 'dark' ? 'Light' : 'Dark'}
                  </span>
                </button>
              </div>
            </div>

            {/* Language Options */}
            <div className="mobile-settings-group">
              <span className="mobile-settings-label">
                <i className="bi bi-globe"></i>
                {t.language.select}
              </span>
              <div className="mobile-lang-options">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    className={`mobile-lang-btn ${language === lang ? 'active' : ''}`}
                    onClick={() => setLanguage(lang)}
                  >
                    <span className="lang-flag">{languageNames[lang].flag}</span>
                    <span className="lang-code">{lang.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Footer */}
        <div className="mobile-nav-footer">
          <div className="mobile-nav-social">
            <a href="https://facebook.com/share/1Ga8spfH7y/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="https://www.instagram.com/amoria_global_tech/" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-instagram"></i>
            </a>
            <a href="https://x.com/amoria32419" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-twitter-x"></i>
            </a>
            <a href="https://www.linkedin.com/in/amoria-global-tech-8a774736b/" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-linkedin"></i>
            </a>
          </div>
          <div className="mobile-nav-contact">
            <a href="tel:+250788437347">
              <i className="bi bi-telephone"></i>
              +250 788 437 347
            </a>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-nav-overlay" onClick={() => setMobileMenuOpen(false)}></div>
      )}
    </>
  );
}

export default Navbar;
