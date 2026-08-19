import { useState } from "react";
import { content } from "../data/content";

const Contact = () => {
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");
      setStatus(data.message);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <section className="section contact-section" id="contact">
      <div className="container">
        <div className="contact-cta">
          <h3>Let’s build something.</h3>
          <a className="cta-btn" href={`mailto:${content.social.email}`}>
            Start a conversation →
          </a>
        </div>
        <p className="section-label">06 — Contact</p>
        <h2>{content.developer.fullName}</h2>
        <div className="contact-grid">
          <div className="contact-card">
            <div className="contact-row">
              <span>Email</span>
              <a href={`mailto:${content.social.email}`}>{content.social.email}</a>
            </div>
            <div className="contact-row">
              <span>Location</span>
              <b>{content.social.location}</b>
            </div>
            <div className="contact-row">
              <span>GitHub</span>
              <a href={content.social.github} target="_blank" rel="noreferrer">
                Sriya-Mukkawar
              </a>
            </div>
            <div className="contact-row">
              <span>LinkedIn</span>
              <a href={content.social.linkedin} target="_blank" rel="noreferrer">
                sriyamukkawar
              </a>
            </div>
          </div>
          <form className="contact-form" onSubmit={onSubmit}>
            <input
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={onChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Your email"
              value={form.email}
              onChange={onChange}
              required
            />
            <textarea
              name="message"
              placeholder="Tell me about a role, a project, or just say hi."
              value={form.message}
              onChange={onChange}
              required
            />
            <button type="submit">Send message</button>
            <div className="form-status">{status}</div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
