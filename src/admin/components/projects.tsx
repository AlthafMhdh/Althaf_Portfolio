import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, storage } from "../../firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Toast from "./toast";
import ProjectCart from "./ui/projectCart";

interface Project {
  id: string;
  projectName: string;
  about: string;
  technologies: string;
  github?: string;
  website?: string;
  photoUrl?: string;
  createdAt?: any;
  updatedAt?: any;
}

const Projects: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    projectName: "",
    about: "",
    technologies: "",
    github: "",
    website: "",
  });
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const projectRef = doc(db, "portfolio", "projects");

  useEffect(() => {
    const fetchProjects = async () => {
      const snap = await getDoc(projectRef);
      if (snap.exists()) {
        const data = snap.data();
        setProjects(data.items || []);
      }
    };
    fetchProjects();
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        showToast("Only image files are allowed" , "error");
        return;
      }
      setPhoto(file);
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
  
      try{
        let photoUrl = preview || '';

        if (photo) {
          const photoRef = ref(storage, `photos/${Date.now()}_${photo.name}`);
          await uploadBytes(photoRef, photo);
          photoUrl = await getDownloadURL(photoRef);
        }

        const newProject: Project = {
          id: editingIndex !== null ? projects[editingIndex].id : Date.now().toString(),
          ...formData,
          photoUrl,
          updatedAt: new Date(),
          createdAt: editingIndex !== null ? projects[editingIndex].createdAt : new Date(),
        };

        let updatedProjects = [...projects];
        if (editingIndex !== null) {
          updatedProjects[editingIndex] = newProject;
        } else {
          updatedProjects.push(newProject);
        }

        await setDoc(projectRef, { items: updatedProjects });
        setProjects(updatedProjects);
        //showToast(editingIndex !== null ? "Project updated!" : "Project added!", "success");
        alert(editingIndex !== null ? "Project updated successfully!" : "Project added successfully!");
        setIsModalOpen(false);
        resetForm();

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
        //setLoading(false);
      }
  };

  const resetForm = () => {
    setFormData({
      projectName: "",
      about: "",
      technologies: "",
      github: "",
      website: "",
    });
    setPreview(null);
    setPhoto(null);
    setEditingIndex(null);
  };

  const handleEdit = (project: Project) => {
    const index = projects.findIndex((p) => p.id === project.id);
    setEditingIndex(index);
    setFormData({
      projectName: project.projectName,
      about: project.about,
      technologies: project.technologies,
      github: project.github || "",
      website: project.website || "",
    });
    setPreview(project.photoUrl || null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const updatedProjects = projects.filter((p) => p.id !== id);
    await updateDoc(projectRef, { items: updatedProjects });
    setProjects(updatedProjects);
    //showToast("Project deleted successfully!", "success");
    alert("Project deleted successfully!");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg w-full max-w-7xl mx-auto p-6 sm:p-10">
      <div className="flex flex-col mb-6 sm:mb-0">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          My Projects
        </h2>
      </div>

      {/* <div className="flex justify-end items-center">
        <button 
          type="submit"
          onClick={() => setIsModalOpen(true)}
          className=" bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 sm:mt-2"
        >
          +Add New Project
        </button>
      </div> */}

      {projects.length === 0 ? (
        <div className="text-center text-gray-500 mb-6">
          <p>You have no projects. Please add your first project.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            + Add New Project
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              + Add New Project
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCart
                key={project.id}
                project={project}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex p-6 justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative animate-slideIn">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-4 text-gray-600 text-2xl font-bold hover:text-red-500"
            >
              ×
            </button>

            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              {editingIndex ? "Edit Project" : "Add New Project"}
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
                  {editingIndex ? "Update Project" : "Save Project"}
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
