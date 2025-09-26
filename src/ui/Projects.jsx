import { useState, useMemo, useRef, useEffect } from "react";
import { useProjects } from "../hooks/useProjects";

export default function Projects() {
  const { projects, loading } = useProjects();
  const [selectedProject, setSelectedProject] = useState(null);
  const scrollContainerRef = useRef(null);

  // --- Duplicate the projects 3x to allow seamless looping ---
  const infiniteProjects = useMemo(
    () => [...projects, ...projects, ...projects],
    [projects]
  );

  // --- Infinite scroll effect (to the right only) ---
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollWidth = container.scrollWidth;
      const viewportWidth = container.offsetWidth;
      const third = scrollWidth / 3;
      const buffer = 50; // small threshold

      // If user goes too far right → reset back one third forward
      if (container.scrollLeft >= third * 2 - viewportWidth - buffer) {
        const offset = container.scrollLeft - third; // maintain momentum
        container.style.scrollBehavior = "auto";
        container.scrollLeft = offset - third; // shift back one set
        container.style.scrollBehavior = "";
      }
    };

    // Start in the first third so movement always feels rightward
    container.scrollLeft = 0;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [infiniteProjects]);

  // --- Trackpad & Mouse Wheel Scroll (Map Vertical to Horizontal) ---
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      console.log("Wheel event fired. Delta Y:", e.deltaY);
      // Prevent the default vertical page scroll
      e.preventDefault();

      // Use deltaY (vertical scroll) as horizontal scroll
      // Negative deltaY means scroll UP → move LEFT
      container.scrollLeft += e.deltaY;
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

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

  // --- Default View: Infinite Horizontal Scroll + Trackpad Support ---
  return (
    <section className="gallery w-screen h-screen overflow-hidden">
      <div
        ref={scrollContainerRef}
        className="
          projects
          w-screen
          h-screen
          overflow-x-scroll
          overflow-y-hidden
          no-scrollbar
          px-5
          py-20
        "
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
              className="cursor-pointer flex-shrink-0 h-full px-5"
              style={{
                width: `calc((100vw - (6 * 1.25rem)) / 7)`, // 7 columns
                // 3 rows
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
