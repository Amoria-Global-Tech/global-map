"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Chatbot from "../components/Chatbot";
import { api } from '../api/utils/apiService';

interface ContactFormData {
  name: string;
  email: string;
  phoneNumber: string;
  subject: string;
  message: string;
}

export default function ContactUsPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phoneNumber: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mounted, setMounted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await api.post('/public/contact', {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        subject: formData.subject || 'Contact Form Submission',
        message: formData.message
      });

      if (!response || response.success === undefined) {
        throw new Error('Server unavailable. Please try again later.');
      }

      if (response.success) {
        setSubmitted(true);
        setFormData({ name: "", email: "", phoneNumber: "", subject: "", message: "" });
      } else {
        setError(response.error || 'Failed to send message. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show/hide scroll-to-top button
  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Animate timeline items on scroll
  useEffect(() => {
    if (!mounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animation logic can be added here if needed
            // For example: entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.3 }
    );

    const timelineElements = document.querySelectorAll('.timeline-item');
    timelineElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [mounted]);

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return null;
  }
  
  if (submitted) {
    return (
      <div className="main-container contact-success-page">
        <div className="success-container">
          <div className="success-card">
            <div className="success-icon">
              <i className="bi bi-check-circle"></i>
            </div>
            <h2 className="success-title">Message Sent!</h2>
            <p className="success-text">
              Thank you for reaching out. We&apos;ve received your message and will get back to you within 24 hours.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="success-button"
            >
              Send Another Message
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="main-container contact-page">
        <div className="contact-container">
          {/* Header Section */}
          <div className="contact-header">
            <h1 className="contact-title">
              Get In <span className="title-gradient">Touch</span>
            </h1>
            <p className="contact-subtitle">
              Have a question, project idea, or just want to say hello? We&apos;d love to hear from you. 
              Send us a message and we&apos;ll respond as soon as possible.
            </p>
          </div>

          <div className="contact-content">
            {/* Contact Information */}
            <div className="contact-info">
              <div className="info-card">
                <h2 className="info-title">Contact Information</h2>
                
                <div className="info-items">
                  <div className="info-item">
                    <div className="info-icon email-icon">
                      <i className="bi bi-envelope"></i>
                    </div>
                    <div className="info-details">
                      <h3 className="info-label">Email</h3>
                      <p className="info-value">info@amoriaglobal.com</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon phone-icon">
                      <i className="bi bi-telephone"></i>
                    </div>
                    <div className="info-details">
                      <h3 className="info-label">Phone</h3>
                      <p className="info-value">+250 788 437 347</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon location-icon">
                      <i className="bi bi-geo-alt"></i>
                    </div>
                    <div className="info-details">
                      <h3 className="info-label">Office</h3>
                      <p className="info-value">Kigali, Rwanda</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon time-icon">
                      <i className="bi bi-clock"></i>
                    </div>
                    <div className="info-details">
                      <h3 className="info-label">Business Hours</h3>
                      <p className="info-value">Monday - Friday<br />9:00 AM - 6:00 PM EAT</p>
                    </div>
                  </div>
                </div>
              </div>

             
              {/* Quick Stats */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-number response-time">24h</div>
                  <div className="stat-label">Response Time</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number clients-count">50+</div>
                  <div className="stat-label">Happy Clients</div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-card">
              <h2 className="form-title">Send us a Message</h2>
              
              {error && (
                <div className="error-message">
                  <div className="error-content">
                    <i className="bi bi-exclamation-triangle"></i>
                    <p>{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                {/* Name Field */}
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email Field */}
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Enter your email address"
                  />
                </div>

                {/* Phone Field */}
                <div className="form-group">
                  <label htmlFor="phoneNumber" className="form-label">
                    Phone Number <span className="optional-text">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Subject Field */}
                <div className="form-group">
                  <label htmlFor="subject" className="form-label">
                    Subject <span className="optional-text">(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="What is this regarding?"
                  />
                </div>

                {/* Message Field */}
                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="form-textarea"
                    placeholder="Tell us about your project, question, or how we can help you..."
                  />
                  <p className="character-count">{formData.message.length} characters</p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
                  className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="loading-spinner"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send"></i>
                      Send Message
                    </>
                  )}
                </button>
              </form>

              <div className="form-footer">
                <p className="privacy-text">
                  By sending this message, you agree to our privacy policy and terms of service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll to Top Button */}
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