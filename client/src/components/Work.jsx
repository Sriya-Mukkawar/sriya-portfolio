import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { content } from "../data/content";
import WorkImage from "./WorkImage";

gsap.registerPlugin(ScrollTrigger);

const isDesktopWork = () => window.matchMedia("(min-width: 1025px)").matches;

const Work = () => {
  useEffect(() => {
    const section = document.querySelector(".work-section");
    const flex = document.querySelector(".work-flex");
    if (!section || !flex) return;

    let tween;

    const kill = () => {
      tween?.scrollTrigger?.kill();
      tween?.kill();
      tween = null;
      ScrollTrigger.getById("work")?.kill();
      gsap.set(flex, { clearProps: "transform,x" });
    };

    const setup = () => {
      kill();
      if (!isDesktopWork()) {
        ScrollTrigger.refresh();
        return;
      }

      const container = section.querySelector(".work-container");
      const getDistance = () => {
        const boxes = flex.querySelectorAll(".work-box");
        if (!boxes.length || !container) return 0;
        return Math.max(0, boxes[0].offsetWidth * boxes.length - container.clientWidth);
      };

      tween = gsap.to(flex, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${Math.max(getDistance(), 1)}`,
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          id: "work",
        },
      });
    };

    setup();
    const media = window.matchMedia("(min-width: 1025px)");
    const onChange = () => setup();
    media.addEventListener("change", onChange);

    return () => {
      media.removeEventListener("change", onChange);
      kill();
    };
  }, []);

  return (
    <section className="work-section" id="work">
      <div className="work-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {content.projects.map((project, index) => (
            <article className="work-box" key={project.id}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>
                  <div>
                    <h4>{project.title}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>{project.technologies}</p>
                {(project.appStore || project.playStore) && (
                  <div className="work-stores">
                    {project.appStore && (
                      <a href={project.appStore} target="_blank" rel="noreferrer">
                        App Store
                      </a>
                    )}
                    {project.playStore && (
                      <a href={project.playStore} target="_blank" rel="noreferrer">
                        Google Play
                      </a>
                    )}
                  </div>
                )}
              </div>
              <WorkImage
                image={project.image}
                alt={project.title}
                link={project.link}
                kind={project.imageKind}
              />
            </article>
          ))}
          <div className="work-box work-box-cta">
            <div className="see-all-works">
              <h3>Want to see more?</h3>
              <p>Explore all of my projects and creations</p>
              <a
                className="see-all-btn"
                href={content.social.github}
                target="_blank"
                rel="noreferrer"
              >
                See All Works →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Work;
