import React, { useState, useEffect } from "react";
import "./contact.css";

const initialState = {
  name: "",
  email: "",
  subject: "",
  message: "",
  newsletter: false,
};

const MailIcon = () => (
  <span className="icon-circle"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="12" fill="#FF8C00" fillOpacity="0.13"/><path d="M5 8.5l7 5 7-5" stroke="#FF8C00" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><rect x="5" y="7" width="14" height="10" rx="2" stroke="#FF8C00" strokeWidth="1.7"/></svg></span>
);
const PhoneIcon = () => (
  <span className="icon-circle"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="12" fill="#FF8C00" fillOpacity="0.13"/><path d="M7.5 8.5a9.5 9.5 0 008 8l2-2a1 1 0 011.1-.21c1.12.45 2.36.7 3.4.7a1 1 0 011 1v3a1 1 0 01-1 1C7.61 21 3 16.39 3 11a1 1 0 011-1h3a1 1 0 011 1c0 1.04.25 2.28.7 3.4a1 1 0 01-.21 1.1l-2 2z" stroke="#FF8C00" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
);
// Illustration SVG décorative (exemple : enveloppe stylisée)
const ContactIllustration = () => (
  <svg className="contact-illustration" width="110" height="80" viewBox="0 0 110 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="20" width="90" height="50" rx="12" fill="#FF8C00" fillOpacity="0.13"/>
    <rect x="20" y="30" width="70" height="30" rx="8" fill="#fff" stroke="#FF8C00" strokeWidth="2"/>
    <path d="M25 35l30 18 30-18" stroke="#FF8C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="95" cy="25" r="6" fill="#FF8C00" fillOpacity="0.7"/>
    <circle cx="15" cy="65" r="4" fill="#003366" fillOpacity="0.18"/>
  </svg>
);

const Contact = () => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      newErrors.email = "Invalid email format.";
    if (!form.subject.trim()) newErrors.subject = "Subject is required.";
    if (!form.message.trim() || form.message.length < 10)
      newErrors.message = "Message must be at least 10 characters.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    setErrors({ ...errors, [name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSending(true);
    setSuccess(false);
    setTimeout(() => {
      setSending(false);
      setSuccess(true);
      setForm(initialState);
    }, 1500);
  };

  // Helper for floating label
  const isFilled = (field) => form[field] && form[field].length > 0;

  return (
    <div className="contact-solar-wrapper">
      {/* Hero image */}
      <div className="contact-solar-hero">
        <img src="/assets/images/tramway_1.jpg" alt="Tramway Hero" className="contact-solar-hero-img" />
        <div className="contact-solar-hero-overlay">
          {/* <h1 className="contact-solar-hero-title">Contact Us</h1> */}
          <p className="contact-solar-hero-desc">We’re here to help you. Reach out for any question, suggestion or support.</p>
        </div>
      </div>
      {/* Main section */}
      <div className="contact-solar-main">
        <div className="contact-solar-main-left">
          <ContactIllustration />
          <h2 className="contact-solar-main-title">Get In Touch Now</h2>
          <p className="contact-solar-main-desc">Our team will answer all your questions as soon as possible. Fill out the form or use the contact info below.</p>
          <div className="contact-solar-info-list">
            <div className="contact-solar-info-item"><PhoneIcon /> <span>+212 6 00 00 00 00</span></div>
            <div className="contact-solar-info-item"><MailIcon /> <span>contact@fanzone.com</span></div>
          </div>
        </div>
        <div className="contact-solar-main-right">
          <form className="contact-solar-form" onSubmit={handleSubmit} noValidate>
            <div className="contact-solar-form-group floating-label">
              <input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={sending}
                autoComplete="off"
                required
              />
              <label htmlFor="name" className={isFilled('name') ? 'float active' : 'float'}>Name</label>
              {errors.name && <div className="contact2-error">{errors.name}</div>}
            </div>
            <div className="contact-solar-form-group floating-label">
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={sending}
                autoComplete="off"
                required
              />
              <label htmlFor="email" className={isFilled('email') ? 'float active' : 'float'}>Email</label>
              {errors.email && <div className="contact2-error">{errors.email}</div>}
            </div>
            <div className="contact-solar-form-group floating-label">
              <input
                id="subject"
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                disabled={sending}
                autoComplete="off"
                required
              />
              <label htmlFor="subject" className={isFilled('subject') ? 'float active' : 'float'}>Subject</label>
              {errors.subject && <div className="contact2-error">{errors.subject}</div>}
            </div>
            <div className="contact-solar-form-group floating-label">
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                disabled={sending}
                autoComplete="off"
                required
              />
              <label htmlFor="message" className={isFilled('message') ? 'float active' : 'float'}>How can we help you? Feel free to get in touch.</label>
              {errors.message && <div className="contact2-error">{errors.message}</div>}
            </div>
            <button type="submit" className="contact-solar-btn" disabled={sending}>
              {sending ? "Sending..." : "Send Message"}
            </button>
            {success && (
              <div className="contact2-success" aria-live="polite">
                Your message has been sent!
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;