import { useEffect, useState } from "react";
import { content } from "../data/content";
import { startLenis, scrollToSection } from "../hooks/useSmoothScroll";

const Navbar = ({ enabled }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (enabled) startLenis();
  }, [enabled]);

  useEffect(() => {
    document.body.classList.toggle("nav-open", menuOpen);
    return () => document.body.classList.remove("nav-open");
  }, [menuOpen]);

  const goTo = (href) => {
    setMenuOpen(false);
    scrollToSection(href);
  };

  return (
    <header className="nav">
      <a className="nav-logo" href="#landingDiv" onClick={() => setMenuOpen(false)}>
        {content.developer.initials}
      </a>
      <ul className={`nav-links${menuOpen ? " is-open" : ""}`}>
        {content.nav.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                goTo(item.href);
              }}
            >
              {item.label}
            </a>
          </li>
        ))}
        <li className="nav-links-email">
          <a href={`mailto:${content.social.email}`}>{content.social.email}</a>
        </li>
      </ul>
      <a className="nav-email" href={`mailto:${content.social.email}`}>
        {content.social.email}
      </a>
      <button
        className={`nav-toggle${menuOpen ? " is-open" : ""}`}
        type="button"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
      </button>
    </header>
  );
};

export default Navbar;
