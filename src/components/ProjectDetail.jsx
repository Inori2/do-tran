import { useParams, useNavigate } from "react-router-dom";
import { asText } from "@prismicio/helpers";
import { useState, useEffect } from "react";
import Hero from "./Hero";

export default function ProjectDetail({ projects, loading }) {
  const navigate = useNavigate();
  const { slug } = useParams();

  // State must always be declared at the top
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Find the project by slug (can be undefined initially)
  const project = projects?.find((p) => p.uid === slug);

  // Combine thumbnail + gallery
  const galleryWithThumbnail = project
    ? [project.data.thumbnail, ...(project.data.gallery || [])].filter(Boolean)
    : [];

  // Ensure selectedIndex is valid when gallery changes
  useEffect(() => {
    if (selectedIndex >= galleryWithThumbnail.length) {
      setSelectedIndex(0);
    }
  }, [galleryWithThumbnail.length, selectedIndex]);

  const selectedImage = galleryWithThumbnail[selectedIndex];

  // Handle loading state
  if (loading) {
    return (
      <div className="w-screen h-screen bg-neutral-50 flex items-center justify-center">
        <p>Loading project...</p>
      </div>
    );
  }

  // Handle empty projects
  if (!projects || projects.length === 0) {
    return (
      <div className="w-screen h-screen bg-neutral-50 flex items-center justify-center">
        <p>No projects available.</p>
      </div>
    );
  }

  // Handle project not found
  if (!project) {
    return (
      <div className="w-screen h-screen bg-neutral-50 flex items-center justify-center">
        <p>Project not found</p>
      </div>
    );
  }

  return (
    <div className="project-details w-screen h-screen min-h-screen px-5 py-20 z-10 relative bg-neutral-50">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300"
      >
        ← Back
      </button>

      {/* Gallery */}
      {galleryWithThumbnail.length > 0 && (
        <div className="h-full my-5">
          {/* Highlighted image */}
          <div className="w-full h-2/3 mb-6 place-content-center place-items-center">
            <img
              src={selectedImage?.url || selectedImage?.image?.url}
              alt={asText(project.data.project_name) || "Project image"}
              className="max-w-[50vw] h-full object-cover shadow-md transition-all duration-500 ease-in-out"
            />
          </div>

          {/* Thumbnails */}
          {galleryWithThumbnail.length > 1 && (
            <div className="flex gap-4 w-full place-content-center">
              {galleryWithThumbnail.map((item, idx) => (
                <img
                  key={idx}
                  src={item.url || item.image?.url}
                  alt={`Gallery image ${idx + 1}`}
                  onClick={() => setSelectedIndex(idx)}
                  className={`h-20 w-20 object-cover cursor-pointer transition duration-300 ${
                    idx === selectedIndex
                      ? "ring-4 ring-neutral-900 scale-105"
                      : "hover:opacity-80"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Hero */}
      <Hero Text={asText(project.data.project_name) || "Untitled Project"} />
    </div>
  );
}
