import gsap from "gsap";
import { ReactLenis } from "lenis/react";
import { useEffect, useRef } from "react";
import Preloader from "./components/Preloader";
import Navbar from "./ui/Navbar";
import Gallery from "./components/Gallery";
import Projects from "./ui/Projects";

export default function App() {
  const lenisRef = useRef();

  useEffect(() => {
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
      <Preloader />
      <Navbar />
      {/*       <Gallery /> */}
      <Projects />
    </ReactLenis>
  );
}
