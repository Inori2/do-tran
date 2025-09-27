import { useParams, useNavigate } from "react-router-dom";
import { asText } from "@prismicio/helpers"; // convert RichText to plain text

export default function ProjectDetail({ projects, loading }) {
  const navigate = useNavigate();
  const { slug } = useParams();

  // Wait until projects are loaded
  if (loading) return <p>Loading project...</p>;
  if (!projects || projects.length === 0)
    return (
      <div className="w-screen h-screen bg-neutral-50 flex items-center">
        <p>Loading project data...</p>
      </div>
    );

  // Find project by slug
  const project = projects.find((p) => p.uid === slug);
  if (!project) return <p>Project not found</p>;

  // Combine thumbnail + gallery
  const galleryWithThumbnail = [
    project.data.thumbnail,
    ...(project.data.gallery || []),
  ].filter(Boolean); // remove any undefined items

  return (
    <div className="project-details w-full min-h-screen px-5 py-20">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300"
      >
        ← Back
      </button>

      {/* Project title */}
      <h1 className="text-2xl font-bold">
        {asText(project.data.project_name) || "Untitled Project"}
      </h1>

      {/* Gallery */}
      {galleryWithThumbnail.length > 0 && (
        <div className="flex gap-4 flex-wrap my-5">
          {galleryWithThumbnail.map((item, index) => (
            <img
              key={index}
              src={item.url || item.image?.url}
              alt={`Gallery image ${index + 1}`}
              className="h-40 object-cover"
            />
          ))}
        </div>
      )}
    </div>
  );
}
