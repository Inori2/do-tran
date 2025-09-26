import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger, ScrollSmoother } from "gsap/all";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function Projects({ isPreloaderDone, projects, loading }) {
  const navigate = useNavigate();
  const gridRef = useRef(null);
  const projectRefs = useRef([]);

  useEffect(() => {
    if (loading || !isPreloaderDone || !projects.length) return;

    // ------------------ ScrollSmoother ------------------
    const smoother = ScrollSmoother.create({
      smooth: 1,
      effects: true,
      normalizeScroll: true,
      content: ".scroll-content", // ONLY scrollable content
    });

    const items = projectRefs.current;

    // ------------------ Initial Stagger Reveal ------------------
    gsap.set(items, { clipPath: "inset(0% 0% 100% 0%)" });
    const tl = gsap.timeline({
      onComplete: () => {
        items.forEach((el) => {
          ScrollTrigger.create({
            trigger: el,
            start: "top 80%",
            onEnter: () => {
              gsap.to(el, {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 1,
                ease: "power3.inOut",
              });
            },
          });
        });
      },
    });
    tl.to(items, {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1,
      ease: "power3.inOut",
      stagger: { amount: 1, from: "start" },
    });

    // ------------------ Lag per item ------------------
    const baseLag = 0.5;
    const lagScale = 0.13;
    items.forEach((item, i) => {
      const lag = baseLag + (i % 3) * lagScale; // approximate column lag
      smoother.effects(item, { speed: 1, lag });
    });

    // ------------------ Scroll velocity scaling ------------------
    const minScaleX = 0.7;
    const maxScaleY = 1.7;
    const threshold = 700;
    const scrollSensitivity = 4000;

    const updateScale = () => {
      const rawVel = smoother.getVelocity();
      const absVel = Math.abs(rawVel);
      const vRaw = Math.max(0, absVel - threshold);
      const v = Math.min(vRaw / scrollSensitivity, 1);

      const si = 1 + (minScaleX - 1) * v;
      const sy = 1 + (maxScaleY - 1) * v;
      const origin = rawVel < 0 ? "50% 0%" : "50% 100%";

      gridRef.current.style.setProperty("--si", si);
      gridRef.current.style.setProperty("--sy", sy);
      gridRef.current.style.setProperty("--to", origin);
    };

    gsap.ticker.add(updateScale);

    return () => {
      smoother.kill();
      gsap.ticker.remove(updateScale);
    };
  }, [loading, projects, isPreloaderDone]);

  if (loading) return <p>Loading projects...</p>;

  return (
    <section className="gallery w-full max-w-[100vw] px-5 py-20 overflow-x-hidden bg-neutral-50 scroll-content">
      <div
        ref={gridRef}
        className="projects w-full h-full grid grid-cols-3 sm:grid-cols-7 gap-5 md:gap-10 lg:gap-20"
      >
        {projects.map((project, index) => (
          <div
            key={project.id || index}
            ref={(el) => (projectRefs.current[index] = el)}
            className="grid__item cursor-pointer overflow-hidden relative [clip-path:inset(0%_0%_100%_0%)] transform-gpu"
            onClick={() => navigate(`/projects/${project.uid}`)}
          >
            {project.data.thumbnail?.url ? (
              <img
                src={project.data.thumbnail.url}
                alt="Thumbnail"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-sm">No Thumbnail</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
