import { content } from "../data/content";

const TechStack = () => (
  <section className="techstack-new" id="skills">
    <div className="techstack-content">
      <h2>Tech Stack</h2>
      <div className="techstack-pyramid">
        {content.techStack.map((row, rowIndex) => (
          <div className="techstack-row" key={rowIndex}>
            {row.map((tech) => (
              <a
                key={tech.name}
                href={tech.url}
                target="_blank"
                rel="noopener noreferrer"
                className="techstack-item"
                title={tech.name}
              >
                <img src={tech.icon} alt="" loading="lazy" decoding="async" />
                <span>{tech.name}</span>
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TechStack;
