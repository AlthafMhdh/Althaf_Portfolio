import React from "react";

interface Education {
  id: string;
  level: "Higher Education" | "Professional Qualification" | "School Education";
  educationName: string;
  grade?: string;
  instituteName?: string;
  logoUrl?: string;
  address: string;
  startYear?: string;
  endYear?: string;
  duration?: string;
}

interface EducationCardProps {
  education: Education;
  onEdit: (education: Education) => void;
  onDelete: (id: string) => void;
}

const EducationCard: React.FC<EducationCardProps> = ({ education, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center text-center relative">
      {/* Logo */}
      {education.logoUrl ? (
        <img
          src={education.logoUrl}
          alt={`${education.instituteName} Logo`}
          className="w-20 h-20 rounded-full object-cover mb-3"
        />
      ) : (
        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-3">
          <span className="text-gray-500 text-2xl">{education.educationName?.[0]}</span>
        </div>
      )}

      {/* Level */}
      <span className="text-sm text-gray-500">{education.level}</span>

      {/* Name & Institute */}
      <h3 className="font-semibold text-gray-700">{education.educationName}</h3>
      {/* <p className="text-gray-600 text-sm">{education.instituteName}</p> */}
      {(education.level === "Higher Education" || education.level === "Professional Qualification")  && education.grade && (
        <p className="text-gray-600 text-sm">{education.instituteName}</p>
      )}

      {/* Grade if Higher Education */}
      {education.level === "Higher Education" && education.grade && (
        <p className="text-gray-500 text-sm">Grade: {education.grade}</p>
      )}

      {/* Address & Year */}
      <p className="text-gray-400 text-sm">{education.address}</p>
      {/* <p className="text-gray-400 text-sm">
        {education.startYear} - {education.endYear}
      </p> */}
      {(education.level === "Higher Education" || education.level === "School Education")  && education.startYear && education.endYear && (
        <p className="text-gray-400 text-sm">
          {education.startYear} - {education.endYear}
        </p>
      )}

      {education.level === "Professional Qualification" && education.duration && (
        <p className="text-gray-400 text-sm">{education.duration}</p>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2 mt-3">
        <button
          onClick={() => onEdit(education)}
          className="bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 text-sm"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(education.id)}
          className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default EducationCard;
