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

  useEffect(() => {
    if (percent < 100) return undefined;
    setReady(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [percent, setIsLoading]);

  useEffect(() => {
    const failsafe = setTimeout(() => setIsLoading(false), 5000);
    return () => clearTimeout(failsafe);
  }, [setIsLoading]);

  return (
    <div className="loader">
      <div className="loader-watermark">{content.developer.fullName.replace(" ", "")}</div>
      <div className="loader-marquee">
        <div className="loader-marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={`${item}-${i}`}>{item}</span>
          ))}
        </div>
      </div>
      <div className="loader-center">
        <div className="loader-btn">{ready ? "Welcome" : `Loading ${Math.min(percent, 99)}%`}</div>
        <div className="loader-percent">{ready ? "Entering" : "Preparing the experience"}</div>
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
