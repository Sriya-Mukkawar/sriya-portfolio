import { content } from "../data/content";

const WhatIDo = () => (
    <section className="section whatIDO" id="what-i-do">
    <div className="what-layout">
      <div className="what-heading">
        <p className="section-label">02 — What I do</p>
        <h2>What I do</h2>
      </div>
      <div className="what-grid what-box-in">
        {[content.skills.develop, content.skills.design].map((skill) => (
          <article className="what-card" key={skill.title}>
            <h3>{skill.title}</h3>
            <p className="lede">{skill.description}</p>
            <p>{skill.details}</p>
            <div className="tools">
              {skill.tools.map((tool) => (
                <span key={tool}>{tool}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default WhatIDo;
