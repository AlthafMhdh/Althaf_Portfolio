import React, { useEffect } from "react";

type ToastProps = {
  message: string;
  type: "success" | "error";
  onClose: () => void;
};

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const bgColor = type === "success" ? "bg-green-100" : "bg-red-100";
  const textColor = type === "success" ? "text-green-800" : "text-red-800";
  const borderColor = type === "success" ? "border-green-300" : "border-red-300";

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`${bgColor} ${textColor} ${borderColor} border-l-4 p-2 px-6 rounded-md mt-4 mb-4 flex justify-between items-center shadow-md animate-slideDown`}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-4 font-bold text-lg focus:outline-none"
      >
        ×
      </button>

      <style>
        {`
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10x); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slideDown {
            animation: slideDown 0.3s ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default Toast;
