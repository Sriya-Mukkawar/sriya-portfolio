import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { content } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

const yearLabel = (period) =>
  period.toLowerCase().includes("present") ? "NOW" : period.split(/[\s-]/)[0];

const Career = () => {
  useEffect(() => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".career-section",
        start: "top 70%",
        end: "bottom 40%",
        scrub: 1.5,
        invalidateOnRefresh: true,
      },
    });

    timeline
      .fromTo(".career-timeline", { maxHeight: "0%" }, { maxHeight: "100%", duration: 1, ease: "none" }, 0)
      .fromTo(".career-timeline", { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0)
      .fromTo(".career-info-box", { opacity: 0, y: 24 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 }, 0);

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
    };
  }, []);

  return (
    <section className="section career-section" id="career">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br />
          experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot" />
          </div>
          {content.experiences.map((exp) => (
            <article className="career-info-box" key={`${exp.company}-${exp.period}`}>
              <div className="career-info-in">
                <div className="career-role">
                  <h4>{exp.position}</h4>
                  <h5>{exp.company}</h5>
                </div>
                <h3>{yearLabel(exp.period)}</h3>
              </div>
              <p>{exp.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Career;
