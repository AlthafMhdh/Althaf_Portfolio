import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, storage } from "../../firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Toast from "./toast";

const Projects: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  useEffect(() => {
    const fetchProfile = async () => {
      const projectRef = doc(db, "portfolio", "projects");
      const projectSnap = await getDoc(projectRef);
      if (projectSnap.exists()) {
        const data = projectSnap.data();
        setFormData({
          projectName: data.projectName || "",
          about: data.about || "",
          technologies: data.technologies || "",
          github: data.github || "",
          website: data.website || "",
        });
        if (data.photoUrl) setPreview(data.photoUrl);
      }
    };
    fetchProfile();
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, photo: "Only image files are allowed" }));
        return;
      }
      setPhoto(file);
      setErrors((prev) => ({ ...prev, photo: "" }));
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!preview) newErrors.photo = "Profile photo is required.";
    if (!formData.projectName.trim()) newErrors.projectName = "Project Name is required.";
    if (!formData.about.trim()) newErrors.about = "About project is required.";
    if (!formData.technologies.trim()) newErrors.technologies = "Used technologies are required.";

    setErrors(newErrors);
    const firstErrorKey = Object.keys(newErrors)[0];
    if (firstErrorKey) {
      showToast(newErrors[firstErrorKey], "error");
    }
    return Object.keys(newErrors).length === 0;
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;
      setLoading(true);
  
      try{
        let photoUrl = preview || '';
  
        if (photo) {
          const photoRef = ref(storage, 'photoes/${Date.now()}_${photo.name}');
          await uploadBytes(photoRef, photo);
          photoUrl = await getDownloadURL(photoRef);
        }
  
        await setDoc(doc(db, "portfolio", "project"), {
          ...formData,
          photoUrl,
          updatedAt: new Date(),
        });
        //showToast("Profile saved successfully!", "success");
        setIsModalOpen(false);
        alert("Project saved successfully!");
      }
      catch (error){
        console.error("Error saving profile:", error);
        //showToast("Failed to save profile. Try again.", "error");
        alert("Failed to save project");
      }
      finally{
        setFormData({
          projectName: "",
          about: "",
          technologies: "",
          github: "",
          website: "",
        });
        setPreview(null);
        setPhoto(null);
        setLoading(false);
      }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg w-full max-w-7xl mx-auto p-6 sm:p-10">
      <div className="flex flex-col mb-6 sm:mb-0">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          My Projects
        </h2>
      </div>

      <div className="flex justify-end items-center">
        <button 
          type="submit"
          onClick={() => setIsModalOpen(true)}
          className=" bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 sm:mt-2"
        >
          +Add New Project
        </button>
      </div>



      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative animate-slideIn">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-4 text-gray-600 text-2xl font-bold hover:text-red-500"
            >
              ×
            </button>

            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Add New Project
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Project Image */}
              <label className="relative flex flex-col items-center justify-center w-full h-40 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <span className="text-4xl text-gray-600">+</span>
                    <p className="text-sm text-gray-500 mt-1">Add Project Image</p>
                  </div>
                )}
                <input
                  type="file"
                  className="absolute inset-0 opacity-0"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              </label>

              {toast && (
                <Toast
                  message={toast.message}
                  type={toast.type}
                  onClose={() => setToast(null)}
                />
              )}

              <input
                type="text"
                placeholder="Project Name *"
                value={formData.projectName}
                onChange={(e) =>
                  setFormData({ ...formData, projectName: e.target.value })
                }
                className="w-full border rounded px-3 py-2 focus:ring focus:ring-indigo-200"
              />

              <textarea
                rows={4}
                placeholder="About Project *"
                value={formData.about}
                onChange={(e) =>
                  setFormData({ ...formData, about: e.target.value })
                }
                className="w-full border rounded px-3 py-2 focus:ring focus:ring-indigo-200"
              />

              <input
                type="text"
                placeholder="Used Technologies (comma separated)"
                value={formData.technologies}
                onChange={(e) =>
                  setFormData({ ...formData, technologies: e.target.value })
                }
                className="w-full border rounded px-3 py-2 focus:ring focus:ring-indigo-200"
              />

              <input
                type="text"
                placeholder="GitHub Link"
                value={formData.github}
                onChange={(e) =>
                  setFormData({ ...formData, github: e.target.value })
                }
                className="w-full border rounded px-3 py-2 focus:ring focus:ring-indigo-200"
              />

              <input
                type="text"
                placeholder="Website Link"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                className="w-full border rounded px-3 py-2 focus:ring focus:ring-indigo-200"
              />

              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>

          {/* Animation style */}
          <style>
            {`
              @keyframes slideIn {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .animate-slideIn {
                animation: slideIn 0.3s ease-out;
              }
            `}
          </style>
        </div>
      )}


    </div>
  );
};

export default Projects;
