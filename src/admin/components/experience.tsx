import { useState } from "react";

const Experiences: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState();
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    projectName: "",
    about: "",
    technologies: "",
    github: "",
    website: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  return (
    <div className="bg-white rounded-xl shadow-lg w-full max-w-7xl mx-auto p-6 sm:p-10">
      <div className="flex flex-col mb-6 sm:mb-0">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          My Experiences
        </h2>
      </div>

      <div className="flex justify-end items-center">
        <button 
          type="submit"
          className=" bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 sm:mt-2"
        >
          +Add Experience
        </button>
      </div>

    </div>
  );
};

export default Experiences;
