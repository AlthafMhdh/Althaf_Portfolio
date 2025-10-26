import React from "react";

interface SocialWork {
  id: string;
  soceityName: string;
  position: string;
  logoUrl: string;
  startDate: string;
  endDate: string;
  weblink?: string;
  present: boolean;
  createdAt?: any;
  updatedAt?: any;
}

interface SocialCardProps {
  social: SocialWork;
  onEdit: (social: SocialWork) => void;
  onDelete: (id: string) => void;
}

const SocialCard: React.FC<SocialCardProps> = ({ social, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center text-center relative">
        {/* Logo */}
        {social.logoUrl ? (
            <img
            src={social.logoUrl}
            alt={`${social.soceityName} Logo`}
            className="w-20 h-20 rounded-full object-cover mb-3"
            />
        ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-3">
            <span className="text-gray-500 text-2xl">{social.soceityName?.[0]}</span>
            </div>
        )}

        <h3 className="font-semibold text-gray-700">{social.soceityName}</h3>

        <p className="text-gray-400 text-sm">{social.position}</p>

        <p className="text-gray-400 text-sm">
          {social.startDate} - {social.endDate}
        </p>

        <p className="text-gray-400 text-sm">{social.weblink}</p>

      {/* Action Buttons */}
      <div className="flex space-x-2 mt-3">
        <button
          onClick={() => onEdit(social)}
          className="bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 text-sm"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(social.id)}
          className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default SocialCard;
