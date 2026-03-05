'use client';

import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { resolvedTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <>
      {/* Brick Pattern Divider */}
      <div className="footer-bricks">
        <div className="brick-row row-1">
          <div className="bricks-side left">
            <div className="brick" /><div className="brick" /><div className="brick" /><div className="brick" /><div className="brick" />
          </div>
          <div className="bricks-center-gap" />
          <div className="bricks-side right">
            <div className="brick" /><div className="brick" /><div className="brick" /><div className="brick" /><div className="brick" />
          </div>
        </div>
        <div className="brick-row row-2">
          <div className="bricks-side left">
            <div className="brick" /><div className="brick" /><div className="brick" /><div className="brick" /><div className="brick" /><div className="brick" />
          </div>
          <div className="bricks-center-gap" />
          <div className="bricks-side right">
            <div className="brick" /><div className="brick" /><div className="brick" /><div className="brick" /><div className="brick" /><div className="brick" />
          </div>
        </div>
        <div className="brick-row row-3">
          <div className="bricks-side left">
            <div className="brick" /><div className="brick" /><div className="brick" /><div className="brick" /><div className="brick" /><div className="brick" /><div className="brick" />
          </div>
          <div className="bricks-center-gap" />
          <div className="bricks-side right">
            <div className="brick" /><div className="brick" /><div className="brick" /><div className="brick" /><div className="brick" /><div className="brick" /><div className="brick" />
          </div>
        </div>
      </div>

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
                <li><Link href="/compliance" className="footer-link">{t.footer.compliance}</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-title">{t.footer.location}</h3>
              <div className="footer-map-wrapper">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2990!2d30.1687772!3d-1.9757676!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19db59c4b2591e71%3A0xb0b493858167cb1c!2sEVA%20PLAZA!5e0!3m2!1sen!4v1709000000000"
                  width="100%"
                  height="150"
                  style={{ border: 0, borderRadius: '8px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Amoria Global Tech Location"
                />
              </div>
              <a
                href="https://maps.app.goo.gl/MN6UxyVrBE2rt3pD7"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-location-link"
              >
                <i className="bi bi-geo-alt-fill"></i>
                <span>{t.footer.address2}</span>
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
                <a href="https://appointment.jambolush.com/book/amoria-global" target="_blank" rel="noopener noreferrer" className="contact-item">
                  <i className="bi bi-calendar-check-fill contact-icon"></i>
                  <span className="contact-text">Book an Appointment</span>
                </a>
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
