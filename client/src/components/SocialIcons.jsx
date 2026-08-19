import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdMail } from "react-icons/md";
import { content } from "../data/content";

const SocialIcons = () => (
  <aside className="social-rail">
    <a href={content.social.github} target="_blank" rel="noreferrer" aria-label="GitHub">
      <FaGithub />
    </a>
    <a href={content.social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
      <FaLinkedin />
    </a>
    <a href={`mailto:${content.social.email}`} aria-label="Email">
      <MdMail />
    </a>
  </aside>
);

export default SocialIcons;
