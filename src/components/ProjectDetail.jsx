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
  const imageRef = useRef(null);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

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

  // --- ✨ Initial GSAP animations for highlight & thumbnails ---
  useEffect(() => {
    if (!loading && project) {
      const tl = gsap.timeline({
        defaults: { ease: "cubic-bezier(0.76, 0, 0.24, 1)" },
      });

      // Highlight image reveal
      tl.fromTo(
        highlightRef.current,
        { clipPath: "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1 }
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
            stagger: 0.1,
          },
          "-=0.6"
        );
      }
    }
  }, [loading, project, slug]);
  // -------------------------------------------------------------

  // --- 🔄 Handle thumbnail click animation ---
  const handleThumbnailClick = (idx) => {
    if (animating || idx === selectedIndex) return;
    setAnimating(true);

    const currentImage = imageRef.current;
    const newSrc =
      galleryWithThumbnail[idx]?.url || galleryWithThumbnail[idx]?.image?.url;

    const tl = gsap.timeline({
      defaults: { ease: "cubic-bezier(0.76, 0, 0.24, 1)" },
      onComplete: () => setAnimating(false),
    });

    // 1️⃣ Close current image
    tl.to(highlightRef.current, {
      clipPath: "inset(100% 0% 0% 0%)",
      transformOrigin: "top center",
      duration: 0.5,
    });

    // 2️⃣ Swap image once closed
    tl.add(() => {
      currentImage.src = newSrc;
      setSelectedIndex(idx);
    });

    // 3️⃣ Reveal new image
    tl.to(highlightRef.current, {
      clipPath: "inset(0% 0% 0% 0%)",

      duration: 0.8,
    });
  };
  // -------------------------------------------------------------

  // Handle loading states
  if (loading) {
    return (
      <div className="w-screen h-screen bg-neutral-50 flex items-center justify-center">
        <p>Loading project...</p>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="w-screen h-screen bg-neutral-50 flex items-center justify-center">
        <p>No projects available.</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="w-screen h-screen bg-neutral-50 flex items-center justify-center">
        <p>Project not found</p>
      </div>
    );
  }

  return (
    <div className="project-details w-screen h-screen min-h-screen px-5 py-20 z-10 relative bg-neutral-50 overflow-hidden flex flex-col lg:block">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 w-fit bg-gray-200 hover:bg-gray-300 transition"
      >
        ← Back
      </button>

      {/* Highlighted image */}
      {selectedImage && (
        <div
          ref={highlightRef}
          className="highlight-image my-auto w-full lg:h-2/3 lg:mb-6 flex justify-center items-center overflow-hidden"
          style={{ clipPath: "inset(0% 0% 100% 0%)" }}
        >
          <img
            ref={imageRef}
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
          className="thumbnail-gallery flex pb-20 lg:pb-5 gap-4 w-fit justify-center overflow-hidden overflow-x-scroll"
        >
          {galleryWithThumbnail.map((item, idx) => (
            <img
              key={idx}
              src={item.url || item.image?.url}
              alt={`Gallery image ${idx + 1}`}
              onClick={() => handleThumbnailClick(idx)}
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
      <Hero
        Text={asText(project.data.project_name) || "Untitled Project"}
        isPreloaderDone={true}
      />
    </div>
  );
}
