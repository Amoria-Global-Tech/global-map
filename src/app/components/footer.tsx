'use client';

import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { resolvedTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <>
      {/* Footer */}
      <footer className={`footer ${resolvedTheme === 'light' ? 'light' : ''}`}>
        <div className="container">
          <div className="footer-content">
            <div className="footer-column">
              <h3 className="footer-title">{t.footer.useful_links}</h3>
              <ul className="footer-links">
                <li><Link href="/" className="footer-link">{t.nav.home}</Link></li>
                <li><Link href="/about" className="footer-link">{t.nav.about}</Link></li>
                <li><Link href="/services" className="footer-link">{t.nav.services}</Link></li>
                <li><Link href="/products" className="footer-link">{t.nav.products}</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-title">{t.footer.location}</h3>
              <a
                href="https://maps.google.com/?q=Kigali,Rwanda"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-location-link"
              >
                <i className="bi bi-geo-alt-fill"></i>
                <span>Kigali, Rwanda</span>
              </a>
            </div>

            <div className="footer-column">
              <h3 className="footer-title">{t.footer.contact_us}</h3>
              <div className="footer-contact">
                <a href="tel:+250788437347" className="contact-item">
                  <i className="bi bi-telephone-fill contact-icon"></i>
                  <span className="contact-text">+250 788 437 347</span>
                </a>
                <a href="mailto:info@amoriaglobal.com" className="contact-item">
                  <i className="bi bi-envelope-fill contact-icon"></i>
                  <span className="contact-text">info@amoriaglobal.com</span>
                </a>
                <div className="contact-item">
                  <i className="bi bi-clock-fill contact-icon"></i>
                  <span className="contact-text">{t.contact.working_hours_text}</span>
                </div>
              </div>
            </div>

            <div className="footer-column">
              <h3 className="footer-title">{t.footer.follow_us}</h3>
              <div className="social-links">
                <a
                  href="https://facebook.com/share/1Ga8spfH7y/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link facebook"
                >
                  <i className="bi bi-facebook"></i>
                </a>
                <a
                  href="https://www.instagram.com/amoria_global_tech/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link instagram"
                >
                  <i className="bi bi-instagram"></i>
                </a>
                <a
                  href="https://x.com/amoria32419"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link twitter"
                >
                  <i className="bi bi-twitter-x"></i>
                </a>
                <a
                  href="https://www.linkedin.com/in/amoria-global-tech-8a774736b/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link linkedin"
                >
                  <i className="bi bi-linkedin"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">© 2025 Amoria Global Tech. {t.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
