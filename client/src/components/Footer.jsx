import { content } from "../data/content";

const Footer = () => (
  <footer className="footer container">
    <span>Designed and developed by {content.developer.fullName}</span>
    <span>© {new Date().getFullYear()}</span>
  </footer>
);

export default Footer;
