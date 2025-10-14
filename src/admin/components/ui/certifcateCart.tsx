import React from "react";
import { FaEdit } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";

type CartProps = {
  certificate: {
    id: string;
    courseName: string;
    duration: string;
    photoUrl?: string;
  };
  onEdit: (certificate: any) => void;
  onDelete: (id: string) => void;
};

const CertificateCart: React.FC<CartProps> = ({ certificate, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition p-4 flex flex-col">
      {/* certificate Image */}
      {certificate.photoUrl && (
        <img
          src={certificate.photoUrl}
          alt={certificate.courseName}
          className="w-full h-48 object-cover rounded-lg mb-3"
        />
      )}

      {/* certificate Info */}
      <h3 className="text-lg font-semibold text-gray-800 mb-1">
        {certificate.courseName}
      </h3>
      <p className="text-gray-600 text-sm mb-2 line-clamp-3">{certificate.duration}</p>

      {/* Edit/Delete Buttons */}
      <div className="flex justify-end space-x-3 mt-auto">
        <button
          onClick={() => onEdit(certificate)}
          className="text-blue-600 hover:text-blue-800"
          title="Edit certificate"
        >
          <FaEdit size={20} />
        </button>
        <button
          onClick={() => onDelete(certificate.id)}
          className="text-red-600 hover:text-red-800"
          title="Delete Certificate"
        >
          <FiTrash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default CertificateCart;
