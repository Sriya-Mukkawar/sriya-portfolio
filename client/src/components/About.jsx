import { content } from "../data/content";

const About = () => (
  <section className="section about-section" id="about">
    <div className="about-me">
      <p className="section-label">01 — About</p>
      <h2>{content.about.title}</h2>
      {content.about.description.map((paragraph) => (
        <p key={paragraph.slice(0, 24)}>{paragraph}</p>
      ))}
    </div>
  </section>
);

export default About;
