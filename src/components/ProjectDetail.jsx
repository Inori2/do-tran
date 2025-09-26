import { useParams, useNavigate } from "react-router-dom";
import { asText } from "@prismicio/helpers"; // convert RichText to plain text

export default function ProjectDetail({ projects, loading }) {
  const navigate = useNavigate();
  const { slug } = useParams();

  // Wait until projects are loaded
  if (loading) return <p>Loading project...</p>;
  if (!projects || projects.length === 0) return <p>Loading project data...</p>;

  // Find project by slug
  const project = projects.find((p) => p.uid === slug);
  if (!project) return <p>Project not found</p>;

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

      {/* Thumbnail */}
      {project.data.thumbnail?.url && (
        <img
          src={project.data.thumbnail.url}
          alt={asText(project.data.project_name) || "Project Thumbnail"}
          className="w-full max-h-[60vh] object-cover my-5"
        />
      )}

      {/* Gallery */}
      {project.data.gallery?.length > 0 && (
        <div className="flex gap-4 flex-wrap">
          {project.data.gallery.map((item, index) => (
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
