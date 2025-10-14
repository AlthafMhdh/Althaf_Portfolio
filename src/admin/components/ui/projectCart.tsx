import React from "react";
import { FaEdit } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";

type CartProps = {
  project: {
    id: string;
    projectName: string;
    about: string;
    technologies: string;
    github?: string;
    website?: string;
    photoUrl?: string;
  };
  onEdit: (project: any) => void;
  onDelete: (id: string) => void;
};

const ProjectCart: React.FC<CartProps> = ({ project, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition p-4 flex flex-col">
      {/* Project Image */}
      {project.photoUrl && (
        <img
          src={project.photoUrl}
          alt={project.projectName}
          className="w-full h-48 object-cover rounded-lg mb-3"
        />
      )}

      {/* Project Info */}
      <h3 className="text-lg font-semibold text-gray-800 mb-1">
        {project.projectName}
      </h3>
      <p className="text-gray-600 text-sm mb-2 line-clamp-3">{project.about}</p>
      <p className="text-sm text-gray-500 mb-3">
        <strong>Tech:</strong> {project.technologies}
      </p>

      {/* Links */}
      {/* <div className="flex space-x-3 mb-3">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 text-sm hover:underline"
          >
            GitHub
          </a>
        )}
        {project.website && (
          <a
            href={project.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 text-sm hover:underline"
          >
            Website
          </a>
        )}
      </div> */}

      {/* Edit/Delete Buttons */}
      <div className="flex justify-end space-x-3 mt-auto">
        <button
          onClick={() => onEdit(project)}
          className="text-blue-600 hover:text-blue-800"
          title="Edit Project"
        >
          <FaEdit size={20} />
        </button>
        <button
          onClick={() => onDelete(project.id)}
          className="text-red-600 hover:text-red-800"
          title="Delete Project"
        >
          <FiTrash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default ProjectCart;
