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
      const res = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(content.social.email)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            message: form.message.trim(),
            _subject: `Portfolio message from ${form.name.trim()}`,
            _replyto: form.email.trim(),
            _template: "table",
            _captcha: false,
          }),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false || data.success === "false") {
        throw new Error(data.message || "Failed to send");
      }
      setStatus(
        data.message || "Thanks for reaching out. I’ll get back to you soon."
      );
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
