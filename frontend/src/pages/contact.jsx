import React, { useState, useEffect } from "react";
import "./contact.css";

const initialState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const subjects = [
  "Demande d'information",
  "Support technique",
  "Suggestion",
  "Autre",
];

const Contact = () => {
  const [form, setForm] = useState(initialState);
  const [customSubject, setCustomSubject] = useState("");
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
    if (!form.name.trim()) newErrors.name = "Le nom est requis.";
    if (!form.email.trim()) newErrors.email = "L'email est requis.";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      newErrors.email = "Format d'email invalide.";
    if (form.phone && !/^[+0-9\s-]{6,}$/.test(form.phone))
      newErrors.phone = "Format de téléphone invalide.";
    if (!form.subject) newErrors.subject = "Le sujet est requis.";
    if (form.subject === "Autre" && !customSubject.trim())
      newErrors.customSubject = "Merci de préciser le sujet.";
    if (!form.message.trim() || form.message.length < 10)
      newErrors.message = "Le message doit contenir au moins 10 caractères.";
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleCustomSubject = (e) => {
    setCustomSubject(e.target.value);
    setErrors({ ...errors, customSubject: undefined });
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

    // Simulated sending delay (replace with real API call if needed)
    setTimeout(() => {
      setSending(false);
      setSuccess(true);
      setForm(initialState);
      setCustomSubject("");
    }, 1500);
  };

  return (
    <div className="contact-container contact-hover">
      <h1>Contactez-nous</h1>
      <p className="contact-intro">
        Une question, une suggestion ou besoin d’aide ? Remplissez le formulaire ci-dessous, nous vous répondrons rapidement.
      </p>
      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="name">Nom complet</label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="Votre nom complet"
          value={form.name}
          onChange={handleChange}
          disabled={sending}
        />
        {errors.name && <div className="contact-error">{errors.name}</div>}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Votre email"
          value={form.email}
          onChange={handleChange}
          disabled={sending}
        />
        {errors.email && <div className="contact-error">{errors.email}</div>}

        <label htmlFor="phone">Téléphone (optionnel)</label>
        <input
          id="phone"
          type="tel"
          name="phone"
          placeholder="Téléphone (optionnel)"
          value={form.phone}
          onChange={handleChange}
          disabled={sending}
        />
        {errors.phone && <div className="contact-error">{errors.phone}</div>}

        <label htmlFor="subject">Sujet</label>
        <select
          id="subject"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          disabled={sending}
        >
          <option value="">-- Sujet --</option>
          {subjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {errors.subject && <div className="contact-error">{errors.subject}</div>}

        {form.subject === "Autre" && (
          <>
            <label htmlFor="customSubject">Sujet personnalisé</label>
            <input
              id="customSubject"
              type="text"
              name="customSubject"
              placeholder="Précisez votre sujet"
              value={customSubject}
              onChange={handleCustomSubject}
              disabled={sending}
            />
            {errors.customSubject && <div className="contact-error">{errors.customSubject}</div>}
          </>
        )}

        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          placeholder="Votre message"
          value={form.message}
          onChange={handleChange}
          disabled={sending}
        />
        {errors.message && <div className="contact-error">{errors.message}</div>}

        <button type="submit" className="contact-btn" disabled={sending}>
          {sending ? "Envoi en cours..." : "Envoyer"}
        </button>

        {success && (
          <div className="contact-success" aria-live="polite">
            Votre message a bien été envoyé !
          </div>
        )}
      </form>

      <div className="contact-info">
        <p>Email : contact@fanzone.com</p>
        <p>Téléphone : +212 6 00 00 00 00</p>
      </div>
    </div>
  );
};

export default Contact;
