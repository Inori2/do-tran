import { useState, useEffect, useRef } from "react";
import { useProjects } from "../hooks/useProjects";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Projects({ isPreloaderDone }) {
  const { projects, loading } = useProjects();
  const [selectedProject, setSelectedProject] = useState(null);
  const projectRefs = useRef([]);

  /**
   * --- Initial Stagger Animation After Preloader ---
   */
  useEffect(() => {
    if (
      !loading &&
      projects.length > 0 &&
      isPreloaderDone &&
      selectedProject === null
    ) {
      const elements = projectRefs.current;

      // Reset all items to hidden state
      gsap.set(elements, { clipPath: "inset(0% 0% 100% 0%)" });

      // Initial stagger reveal animation
      const tl = gsap.timeline({
        onComplete: () => {
          // After stagger finishes, enable ScrollTrigger animations
          elements.forEach((el) => {
            ScrollTrigger.create({
              trigger: el,
              start: "top 80%", // when item comes into view
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

      tl.to(elements, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1,
        ease: "power3.inOut",
        stagger: {
          amount: 1, // total stagger time
          from: "start",
        },
      });
    }
  }, [loading, projects, isPreloaderDone, selectedProject]);

  if (loading) return <p>Loading projects...</p>;

  /**
   * --- Detail View ---
   */
  if (selectedProject) {
    return (
      <div className="project-details w-full h-screen px-5 py-20">
        <button
          onClick={() => setSelectedProject(null)}
          className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300"
        >
          ← Back
        </button>

        {/* Main Thumbnail */}
        <div className="w-full flex flex-col h-2/3 py-5 items-center">
          {selectedProject.data.thumbnail?.url && (
            <img
              src={selectedProject.data.thumbnail.url}
              alt="Project Thumbnail"
              className="h-full object-cover"
            />
          )}
        </div>

        {/* Gallery Section */}
        {selectedProject.data.gallery?.length > 0 && (
          <div className="gallery flex gap-4 h-1/4 px-20 justify-center">
            {selectedProject.data.gallery.map((item, index) => (
              <img
                key={index}
                src={item.image.url}
                alt={`Gallery image ${index + 1}`}
                className="h-40 object-cover"
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  /**
   * --- Default View: Grid of Thumbnails ---
   */
  return (
    <section className="gallery w-full max-w-[100vw] px-5 py-20">
      <div className="projects w-full h-full">
        <div className="w-full grid grid-cols-3 sm:grid-cols-7 gap-5 md:gap-10 lg:gap-20">
          {projects.map((project, index) => (
            <div
              key={project.id || index}
              ref={(el) => (projectRefs.current[index] = el)}
              className="cursor-pointer overflow-hidden relative [clip-path:inset(0%_0%_100%_0%)]"
              onClick={() => setSelectedProject(project)}
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
      </div>
    </section>
  );
}
