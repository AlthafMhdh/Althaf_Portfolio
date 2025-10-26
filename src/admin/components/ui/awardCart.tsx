import React from "react";
import { FaEdit } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";

type CartProps = {
  achievement: {
    id: string;
    achievementName: string;
    year: string;
    photoUrl?: string;
  };
  onEdit: (achievement: any) => void;
  onDelete: (id: string) => void;
};

const AwardCart: React.FC<CartProps> = ({ achievement, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition p-4 flex flex-col">
      {/* certificate Image */}
      {achievement.photoUrl && (
        <img
          src={achievement.photoUrl}
          alt={achievement.achievementName}
          className="w-full h-48 object-cover rounded-lg mb-3"
        />
      )}

      {/* certificate Info */}
      <h3 className="text-lg font-semibold text-gray-800 mb-1">
        {achievement.achievementName}
      </h3>
      <p className="text-gray-600 text-sm mb-2 line-clamp-3">{achievement.year}</p>

      {/* Edit/Delete Buttons */}
      <div className="flex justify-end space-x-3 mt-auto">
        <button
          onClick={() => onEdit(achievement)}
          className="text-blue-600 hover:text-blue-800"
          title="Edit certificate"
        >
          <FaEdit size={20} />
        </button>
        <button
          onClick={() => onDelete(achievement.id)}
          className="text-red-600 hover:text-red-800"
          title="Delete Certificate"
        >
          <FiTrash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default AwardCart;
