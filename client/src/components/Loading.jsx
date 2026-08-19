import { useEffect, useState } from "react";
import { content } from "../data/content";
import { useLoading } from "../context/LoadingContext";

const marqueeItems = Array.from({ length: 12 }, () => [
  content.developer.title,
  "React",
  "Node.js",
  "TypeScript",
]).flat();

const Loading = ({ percent }) => {
  const { setIsLoading } = useLoading();
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (percent >= 100) {
      const timer = setTimeout(() => setReady(true), 400);
      return () => clearTimeout(timer);
    }
  }, [percent]);

  const enter = () => {
    if (!ready) return;
    setLeaving(true);
    setTimeout(() => setIsLoading(false), 700);
  };

  return (
    <div className={`loader ${leaving ? "is-gone" : ""}`}>
      <div className="loader-watermark">{content.developer.fullName.replace(" ", "")}</div>
      <div className="loader-marquee">
        <div className="loader-marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={`${item}-${i}`}>{item}</span>
          ))}
        </div>
      </div>
      <div className="loader-center">
        <button className="loader-btn" onClick={enter} disabled={!ready}>
          {ready ? "Welcome" : `Loading ${Math.min(percent, 99)}%`}
        </button>
        <div className="loader-percent">{ready ? "Click to enter" : "Preparing the experience"}</div>
      </div>
      <div className="loader-marquee">
        <div className="loader-marquee-track" style={{ animationDirection: "reverse" }}>
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={`b-${item}-${i}`}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
