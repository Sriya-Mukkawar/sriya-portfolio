import { content } from "../data/content";
import { scrollToSection } from "../hooks/useSmoothScroll";

const Landing = () => {
  const parts = content.developer.fullName.split(" ");
  const firstName = parts[0] || content.developer.name;
  const lastName = parts.slice(1).join(" ");

  return (
    <section className="landing-section" id="landingDiv">
      <div className="landing-watermark">{content.developer.name.toUpperCase()}</div>
      <div className="landing-container">
        <div className="landing-intro">
          <div className="landing-intro-inner">
            <h2>Hello! I'm</h2>
            <h1>
              {firstName.toUpperCase()}
              {lastName ? (
                <>
                  <br />
                  <span>{lastName.toUpperCase()}</span>
                </>
              ) : null}
            </h1>
          </div>
        </div>
        <div className="landing-info">
          <div className="landing-info-inner">
            <h3>A</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">Full Stack</div>
              <div>Developer</div>
            </h2>
            <h2>
              <div className="landing-h2-info">React · Node · TypeScript</div>
            </h2>
          </div>
        </div>
        <img
          className="mobile-portrait"
          src="https://avatars.githubusercontent.com/u/121482782?v=4"
          alt={content.developer.fullName}
        />
        <div className="chips landing-chips">
          {content.chips.map((chip) => (
            <button
              key={chip.key}
              className="chip"
              onClick={() => scrollToSection(chip.href)}
            >
              <i className="chip-dot" style={{ background: chip.color }} />
              <span>{chip.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Landing;
