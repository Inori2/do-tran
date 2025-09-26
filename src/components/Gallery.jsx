import { useState, useEffect, useRef } from "react";
import { useProjects } from "../hooks/useProjects";
import gsap from "gsap";

export default function Projects({ isPreloaderDone }) {
  const { projects, loading } = useProjects();
  const [selectedProject, setSelectedProject] = useState(null);
  const projectRefs = useRef([]);

  // Animate after preloader finishes
  useEffect(() => {
    if (!loading && projects.length > 0 && isPreloaderDone) {
      const elements = projectRefs.current;

      // GSAP reveal animation
      gsap.to(elements, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1,
        ease: "power3.out",
        stagger: {
          amount: 1,
          from: "start",
        },
      });
    }
  }, [loading, projects, isPreloaderDone]);

  if (loading) return <p>Loading projects...</p>;

  /**
   * --- Detail View ---
   */
  if (selectedProject) {
    return (
      <div className="project-details w-screen h-screen px-5 py-20">
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
    <section className="gallery w-screen">
      <div className="projects w-full h-full px-5 py-20">
        <div
          className="
            grid
            grid-cols-3 sm:grid-cols-7
            gap-5
            md:gap-10
            lg:gap-20
          "
        >
          {projects.map((project, index) => (
            <div
              key={project.id || index}
              ref={(el) => (projectRefs.current[index] = el)}
              className="cursor-pointer flex-shrink-0 overflow-hidden relative [clip-path:inset(0%_0%_100%_0%)]" // ✅ hidden by default
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
