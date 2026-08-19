import { Component, lazy, Suspense, useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LoadingProvider, useLoading } from "./context/LoadingContext";
import FluidCursor from "./components/FluidCursor";
import Loading from "./components/Loading";
import Navbar from "./components/Navbar";
import SocialIcons from "./components/SocialIcons";
import Landing from "./components/Landing";
import About from "./components/About";
import WhatIDo from "./components/WhatIDo";
import Career from "./components/Career";
import Work from "./components/Work";
import TechStack from "./components/TechStack";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { content } from "./data/content";

const CharacterScene = lazy(() => import("./components/Character/Scene"));

class CharacterErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("3D character failed", error);
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

const App = () => (
  <LoadingProvider>
    <Portfolio />
  </LoadingProvider>
);

const Portfolio = () => {
  const { isLoading, progress, finishLoadingAssets } = useLoading();
  const [showCharacter, setShowCharacter] = useState(
    typeof window !== "undefined" ? window.innerWidth > 768 : false
  );

  useEffect(() => {
    document.body.classList.toggle("loading", isLoading);
    document.title = content.developer.fullName;
    if (!isLoading) {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
  }, [isLoading]);

  useEffect(() => {
    const onResize = () => setShowCharacter(window.innerWidth > 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => finishLoadingAssets(), 1200);
    return () => clearTimeout(timer);
  }, [finishLoadingAssets]);

  return (
    <>
      <FluidCursor />
      {isLoading && <Loading percent={progress} />}
      <Navbar enabled={!isLoading} />
      <SocialIcons />
      <main className="site">
        <Landing />
        <About />
        <WhatIDo />
        <Career />
        <Work />
        <TechStack />
        <Contact />
        <Footer />
      </main>
      {showCharacter && !isLoading && (
        <CharacterErrorBoundary>
          <Suspense fallback={null}>
            <CharacterScene />
          </Suspense>
        </CharacterErrorBoundary>
      )}
    </>
  );
};

export default App;
