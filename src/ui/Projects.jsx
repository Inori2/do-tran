import { useState, useMemo, useRef, useEffect } from "react";
import { useProjects } from "../hooks/useProjects";

export default function Projects() {
  const { projects, loading } = useProjects();
  const [selectedProject, setSelectedProject] = useState(null);
  const scrollContainerRef = useRef(null);

  // Duplicate the projects 3x to allow seamless looping
  const infiniteProjects = useMemo(
    () => [...projects, ...projects, ...projects],
    [projects]
  );

  // When user scrolls too far left or right, reset position to middle
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollWidth = container.scrollWidth;
      const viewportWidth = window.innerWidth;
      const third = scrollWidth / 3;

      // If user scrolls too far to the left
      if (container.scrollLeft < third / 2) {
        container.scrollLeft += third;
      }
      // If user scrolls too far to the right
      else if (container.scrollLeft > third * 1.5) {
        container.scrollLeft -= third;
      }
    };

    container.addEventListener("scroll", handleScroll);

    // Set initial scroll to the middle duplicate
    container.scrollLeft = container.scrollWidth / 3;

    return () => container.removeEventListener("scroll", handleScroll);
  }, [infiniteProjects]);

  if (loading) return <p>Loading projects...</p>;

  // --- Detail View ---
  if (selectedProject) {
    return (
      <div className="project-details w-screen h-screen px-5 py-20">
        <button
          onClick={() => setSelectedProject(null)}
          className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300"
        >
          ← Back
        </button>

        {/* Thumbnail Section */}
        <div className="w-full flex flex-col h-2/3 py-5 items-center">
          <div className="h-full">
            {selectedProject.data.thumbnail?.url && (
              <img
                src={selectedProject.data.thumbnail.url}
                alt="Project Thumbnail"
                className="h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* Gallery */}
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

  // --- Default View: Infinite horizontal scroll ---
  return (
    <section className="gallery w-screen h-screen overflow-hidden">
      <div
        ref={scrollContainerRef}
        className="projects w-screen h-screen overflow-x-scroll overflow-y-hidden scrollbar-hide px-5 py-20"
      >
        <div
          className="grid grid-rows-3 grid-flow-col gap-20 h-full w-max"
          style={{
            gridTemplateColumns: `repeat(${
              infiniteProjects.length / 3
            }, minmax(0, 1fr))`,
          }}
        >
          {infiniteProjects.map((project, index) => (
            <div
              key={`${project.id}-${index}`}
              className="cursor-pointer flex-shrink-0"
              style={{
                width: `calc((100vw - (6 * 1.25rem)) / 7)`, // 7 columns
                height: `calc((100vh - (2 * 5rem) - (2 * 1.25rem)) / 3)`, // 3 rows
              }}
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
