'use client';

import { useState, useRef } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Chatbot from '../components/Chatbot';
import { useTheme } from '@/contexts/ThemeContext';

const ROLE_OPTIONS = [
  'Full-Stack Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Mobile Application Developer',
  'UI/UX & Product Designer',
  'Cloud & DevOps Engineer',
  'Cybersecurity Analyst',
  'QA / Software Tester',
  'Project & Product Management',
  'Spontaneous / Open Application',
];

export default function CareersPage() {
  const { resolvedTheme } = useTheme();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState(ROLE_OPTIONS[0]);
  const [experience, setExperience] = useState('Mid-Level (3-5 years)');
  const [portfolio, setPortfolio] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowed.includes(ext)) {
      setErrorMessage('Please select a valid document (PDF, DOC, or DOCX).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size must be under 10MB.');
      return;
    }
    setErrorMessage(null);
    setCvFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!cvFile) {
      setErrorMessage('Please attach your CV/Resume before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('position', position);
      formData.append('experience', experience);
      formData.append('portfolio', portfolio);
      formData.append('coverLetter', coverLetter);
      formData.append('cv', cvFile);

      const res = await fetch('/api/careers', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitted(true);
        // Reset form
        setFullName('');
        setEmail('');
        setPhone('');
        setPortfolio('');
        setCoverLetter('');
        setCvFile(null);
      } else {
        setErrorMessage(data.message || 'Failed to submit application. Please try again or email info@amoriaglobal.com.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMessage('A network error occurred. Please try again or email info@amoriaglobal.com.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className={`main-content ${resolvedTheme === 'light' ? 'light' : ''}`}>
        {/* Careers Hero Section */}
        <section className="careers-hero-section">
          <div className="container">
            <div className="careers-hero-content">
              <span className="page-hero-badge">
                <i className="bi bi-briefcase-fill"></i> Careers at Amoria
              </span>
              <h1 className="page-hero-title">
                Build the Future of Technology With Us
              </h1>
              <p className="page-hero-description">
                We are building transformative digital platforms across East Africa and beyond. If you are passionate about software excellence, design, and impactful innovation, join our mission.
              </p>
              <div className="careers-hero-actions">
                <a href="#application-form" className="action-btn member-btn">
                  Submit Your CV Directly <i className="bi bi-arrow-down-short"></i>
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="container">
          {/* Application Form Section */}
          <section className="careers-form-section" id="application-form" ref={formRef}>
            <div className="careers-form-card">
              <div className="careers-form-header">
                <span className="careers-badge">
                  <i className="bi bi-send-fill"></i> Direct Application
                </span>
                <h2 className="careers-form-title">Send Your CV to Our Team</h2>
                <p className="careers-form-subtitle">
                  Applications and CVs are automatically dispatched directly to our HR team at <strong>info@amoriaglobal.com</strong>.
                </p>
              </div>

              {submitted ? (
                <div className="careers-success-state">
                  <div className="careers-success-icon">
                    <i className="bi bi-check2-circle"></i>
                  </div>
                  <h3>Application Submitted Successfully!</h3>
                  <p>
                    Thank you for your interest in Amoria Global Tech. Your application and CV have been securely delivered to <strong>info@amoriaglobal.com</strong>.
                  </p>
                  <p className="careers-success-subtext">
                    Our hiring team will carefully review your credentials and contact you directly if there is a match with our current or upcoming openings.
                  </p>
                  <button
                    className="action-btn member-btn"
                    onClick={() => setSubmitted(false)}
                  >
                    Submit Another Application
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="careers-form">
                  {errorMessage && (
                    <div className="careers-error-banner">
                      <i className="bi bi-exclamation-triangle-fill"></i>
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="careers-form-row">
                    <div className="form-group">
                      <label htmlFor="fullName" className="form-label">
                        Full Name <span className="required-star">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        required
                        className="form-input"
                        placeholder="e.g. Jean Bosco Mugisha"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email" className="form-label">
                        Email Address <span className="required-star">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        className="form-input"
                        placeholder="e.g. name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="careers-form-row">
                    <div className="form-group">
                      <label htmlFor="phone" className="form-label">
                        Phone Number <span className="required-star">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        required
                        className="form-input"
                        placeholder="e.g. +250 788 123 456"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="position" className="form-label">
                        Position / Role <span className="required-star">*</span>
                      </label>
                      <select
                        id="position"
                        className="form-input form-select"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                      >
                        {ROLE_OPTIONS.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="careers-form-row">
                    <div className="form-group">
                      <label htmlFor="experience" className="form-label">
                        Experience Level <span className="required-star">*</span>
                      </label>
                      <select
                        id="experience"
                        className="form-input form-select"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                      >
                        <option value="Intern / Student">Intern / Student</option>
                        <option value="Entry-Level (0 - 1 year)">Entry-Level (0 - 1 year)</option>
                        <option value="Junior (1 - 2 years)">Junior (1 - 2 years)</option>
                        <option value="Mid-Level (3 - 5 years)">Mid-Level (3 - 5 years)</option>
                        <option value="Senior (5+ years)">Senior (5+ years)</option>
                        <option value="Lead / Principal">Lead / Principal</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="portfolio" className="form-label">
                        Portfolio, LinkedIn, or GitHub <span className="optional-text">(Optional)</span>
                      </label>
                      <input
                        type="url"
                        id="portfolio"
                        className="form-input"
                        placeholder="https://linkedin.com/in/... or github.com/..."
                        value={portfolio}
                        onChange={(e) => setPortfolio(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="coverLetter" className="form-label">
                      Brief Note / Why Amoria? <span className="optional-text">(Optional)</span>
                    </label>
                    <textarea
                      id="coverLetter"
                      className="form-textarea"
                      rows={3}
                      placeholder="Tell us briefly about yourself, what you love to build, and what drives you..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                    />
                  </div>

                  {/* CV Upload Dropzone */}
                  <div className="form-group">
                    <label className="form-label">
                      CV / Resume Attachment <span className="required-star">*</span>
                    </label>

                    <div
                      className={`careers-dropzone ${isDragging ? 'dragging' : ''} ${cvFile ? 'has-file' : ''}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        style={{ display: 'none' }}
                      />

                      {cvFile ? (
                        <div className="careers-file-info">
                          <i className="bi bi-file-earmark-pdf-fill file-icon"></i>
                          <div className="file-details">
                            <span className="file-name">{cvFile.name}</span>
                            <span className="file-size">
                              {(cvFile.size / 1024 / 1024).toFixed(2)} MB &bull; Ready to send
                            </span>
                          </div>
                          <button
                            type="button"
                            className="file-remove-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCvFile(null);
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                          >
                            <i className="bi bi-x-circle-fill"></i> Remove
                          </button>
                        </div>
                      ) : (
                        <div className="dropzone-prompt">
                          <i className="bi bi-cloud-arrow-up-fill dropzone-icon"></i>
                          <p className="dropzone-main">
                            Drag &amp; drop your CV here, or <span>browse file</span>
                          </p>
                          <p className="dropzone-sub">
                            Accepted formats: PDF, DOC, DOCX &bull; Max size: 10MB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="careers-form-actions">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="careers-submit-btn"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          Submitting &amp; Sending CV...
                        </>
                      ) : (
                        <>
                          Submit Application <i className="bi bi-arrow-right"></i>
                        </>
                      )}
                    </button>

                    <p className="careers-direct-email-note">
                      Prefer direct email? You can also email your CV and portfolio to{' '}
                      <a href="mailto:info@amoriaglobal.com?subject=Job%20Application%20at%20Amoria">
                        info@amoriaglobal.com
                      </a>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
      <Chatbot />
    </>
  );
}
