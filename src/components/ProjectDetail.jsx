import { useParams, useNavigate } from "react-router-dom";
import { asText } from "@prismicio/helpers";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import Hero from "./Hero";

export default function ProjectDetail({ projects, loading }) {
  const navigate = useNavigate();
  const { slug } = useParams();

  // Refs for animation
  const highlightRef = useRef(null);
  const galleryRef = useRef(null);

  const [selectedIndex, setSelectedIndex] = useState(0);

  // Find project by slug
  const project = projects?.find((p) => p.uid === slug);

  // Combine thumbnail + gallery
  const galleryWithThumbnail = project
    ? [project.data.thumbnail, ...(project.data.gallery || [])].filter(Boolean)
    : [];

  // Ensure selectedIndex is valid
  useEffect(() => {
    if (selectedIndex >= galleryWithThumbnail.length) {
      setSelectedIndex(0);
    }
  }, [galleryWithThumbnail.length, selectedIndex]);

  const selectedImage = galleryWithThumbnail[selectedIndex];

  // --- ✨ GSAP animations for highlight & thumbnails ---
  useEffect(() => {
    if (!loading && project) {
      const tl = gsap.timeline({
        defaults: { ease: "cubic-bezier(0.76, 0, 0.24, 1)" },
      });

      // Highlight image reveal
      tl.fromTo(
        highlightRef.current,
        { clipPath: "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2 }
      );

      // Thumbnail stagger reveal
      const thumbnails = galleryRef.current?.querySelectorAll("img");
      if (thumbnails && thumbnails.length > 0) {
        tl.fromTo(
          thumbnails,
          { clipPath: "inset(0% 0% 100% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.6,
            stagger: 0.1, // 👈 each thumbnail appears one after another
          },
          "-=0.6" // overlap with highlight animation for smoother flow
        );
      }
    }
  }, [loading, project, slug]);
  // ----------------------------------------------------

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
    <div className="project-details w-screen h-screen min-h-screen px-5 py-20 z-10 relative bg-neutral-50 overflow-hidden">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 transition"
      >
        ← Back
      </button>

      {/* Highlighted image */}
      {selectedImage && (
        <div
          ref={highlightRef}
          className="highlight-image w-full h-2/3 mb-6 flex justify-center items-center overflow-hidden"
          style={{ clipPath: "inset(0% 0% 100% 0%)" }}
        >
          <img
            src={selectedImage?.url || selectedImage?.image?.url}
            alt={asText(project.data.project_name) || "Project image"}
            className="max-w-[50vw] h-full object-cover shadow-md transition-all duration-500 ease-in-out"
          />
        </div>
      )}

      {/* Thumbnails gallery */}
      {galleryWithThumbnail.length > 1 && (
        <div
          ref={galleryRef}
          className="thumbnail-gallery flex gap-4 w-full justify-center overflow-hidden"
        >
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

      {/* Hero */}
      <Hero Text={asText(project.data.project_name) || "Untitled Project"} />
    </div>
  );
}
