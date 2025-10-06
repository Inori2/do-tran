import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import gsap from "gsap";
import { ReactLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import Preloader from "./components/Preloader";
import Navbar from "./ui/Navbar";
import Gallery from "./components/Gallery";
import ProjectDetail from "./components/ProjectDetail";
import { useProjects } from "./hooks/useProjects"; // import hook here
import Hero from "./components/Hero";
import TodoApp from "./components/DailyChallenges";

export default function App() {
  const lenisRef = useRef();
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);

  // Lift projects state to App
  const { projects, loading } = useProjects();

  useEffect(() => {
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(update);
    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
      {!isPreloaderDone && (
        <Preloader setIsPreloaderDone={setIsPreloaderDone} />
      )}
      <Navbar />
      <main className="scroll-content">
        <Routes>
          <Route
            path="/"
            element={
              <Gallery
                isPreloaderDone={isPreloaderDone}
                projects={projects}
                loading={loading}
              />
            }
          />
          <Route
            path="/projects/:slug"
            element={<ProjectDetail projects={projects} loading={loading} />}
          />
        </Routes>
      </main>
    </ReactLenis>
  );
}
