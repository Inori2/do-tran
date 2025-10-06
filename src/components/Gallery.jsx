import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger, ScrollSmoother } from "gsap/all";
import { useNavigate } from "react-router-dom";
import Hero from "./Hero";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function Projects({ isPreloaderDone, projects, loading }) {
  const navigate = useNavigate();
  const gridRef = useRef(null);
  const projectRefs = useRef([]);

  useEffect(() => {
    if (loading || !isPreloaderDone || !projects.length) return;

    const items = projectRefs.current;

    gsap.set(items, { clipPath: "inset(0% 0% 100% 0%)" });

    gsap.to(items, {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 0.6,
      ease: "cubic-bezier(0.76, 0, 0.24, 1)",
      stagger: { amount: 1.5, from: "start" },
      onComplete: () => ScrollTrigger.refresh(),
    });
  }, [loading, projects, isPreloaderDone]);

  if (loading) return <p>Loading projects...</p>;

  return (
    <section className="gallery w-screen max-w-[100vw] px-5 py-20 bg-neutral-50 scroll-content">
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
      <Hero />
    </section>
  );
}
