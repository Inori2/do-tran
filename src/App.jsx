import gsap from "gsap";
import { ReactLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import Preloader from "./components/Preloader";
import Navbar from "./ui/Navbar";
import Gallery from "./components/Gallery";

export default function App() {
  const lenisRef = useRef();

  // ✅ Track if the preloader is done
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);

  useEffect(() => {
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
      {/* Pass setIsPreloaderDone to Preloader so it can notify App */}
      {!isPreloaderDone && (
        <Preloader setIsPreloaderDone={setIsPreloaderDone} />
      )}

      <Navbar />
      <main className="scroll-content">
        {/* Pass the state down to Gallery */}
        <Gallery isPreloaderDone={isPreloaderDone} />
      </main>
    </ReactLenis>
  );
}
