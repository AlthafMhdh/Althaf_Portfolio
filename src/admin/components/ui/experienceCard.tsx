import React from "react";

interface Experience {
  id: string;
  companyName: string;
  position: string;
  projectInvolvement: string;
  logoUrl: string;
  address: string;
  startDate: string;
  endDate: string;
  duration: string;
  present: boolean;
  createdAt?: any;
  updatedAt?: any;
}

interface ExperienceCardProps {
  experience: Experience;
  onEdit: (experience: Experience) => void;
  onDelete: (id: string) => void;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-row items-center justify-between text-left relative">
      {/* Left - Logo */}
      <div className="flex flex-row items-center space-x-4 mb-3 mb-0">
        {experience.logoUrl ? (
          <img
            src={experience.logoUrl}
            alt={`${experience.companyName} Logo`}
            className="w-20 h-20 rounded-full object-cover mx-auto sm:mx-0"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mx-auto sm:mx-0">
            <span className="text-gray-500 text-2xl">{experience.companyName?.[0]}</span>
          </div>
        )}

        {/* Middle - Details */}
        <div className="mt-2 ml-6 sm:mt-0">
          <h3 className="font-semibold text-gray-700 text-lg">{experience.companyName}</h3>
          <p className="text-gray-500 text-sm">{experience.position}</p>
          <p className="text-gray-400 text-sm">{experience.address}</p>
          <p className="text-gray-400 text-sm">
            {experience.startDate} - {experience.present ? "Present" : experience.endDate}
          </p>
          <p className="text-gray-400 text-xs italic">{experience.duration}</p>

          <div className="flex justify-center space-x-2 mt-3">
            <button
              onClick={() => onEdit(experience)}
              className="bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(experience.id)}
              className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ExperienceCard;
