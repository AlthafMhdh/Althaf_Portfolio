import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, storage } from "../../firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Toast from "./toast";
import EducationCard from "./ui/educationalCard";

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
  createdAt?: any;
  updatedAt?: any;
}

const Education: React.FC = () => {
  const [isModalOpen, setIsModalOpen] =useState(false);
  const [logo, setLogo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [educations, setEducations] = useState<Education[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Education>>({
    level: "Higher Education",
    educationName: "",
    grade: "",
    instituteName: "",
    address: "",
    startYear: "",
    endYear: "",
    duration: "",
  });
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const educationRef = doc(db, "portfolio", "educations");
  useEffect(()=>{
    const fetchEducations = async () => {
      const snap = await getDoc(educationRef);
      if (snap.exists()) {
        const data = snap.data();
        setEducations(data.items || []);
      }
    };
    fetchEducations();
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        showToast("Only image files are allowed", "error");
        return;
      }
      setLogo(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const validate = () => {
    const errors: string[] = [];
    if (!formData.educationName) errors.push("Education name is required");
    if (!formData.address) errors.push("Address is required");

    if (
      (formData.level === "Higher Education" ||
        formData.level === "Professional Qualification") &&
      !formData.instituteName
    )
      errors.push("Institute/University name is required");

    if (formData.level === "Higher Education" && !formData.grade)
      errors.push("Grade is required for Higher Education");

    if (formData.level === "Professional Qualification" && !formData.duration)
      errors.push("Course duration is required");

    if (
      (formData.level === "Higher Education" ||
        formData.level === "School Education") &&
      !formData.startYear
    )
      errors.push("Start year is required");

    if (
      (formData.level === "Higher Education" ||
        formData.level === "School Education") &&
      !formData.endYear
    )
      errors.push("End year is required");

    if (!preview && !editingIndex) errors.push("Logo is required");

    if (errors.length) {
      showToast(errors[0], "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      let logoUrl = preview || "";

      if (logo) {
        const logoRef = ref(storage, `logos/${Date.now()}_${logo.name}`);
        await uploadBytes(logoRef, logo);
        logoUrl = await getDownloadURL(logoRef);
      }

      const newEducation: Education = {
        id: editingIndex !== null ? educations[editingIndex].id : Date.now().toString(),
        level: formData.level!,
        educationName: formData.educationName!,
        grade: formData.grade,
        instituteName: formData.instituteName,
        address: formData.address!,
        startYear: formData.startYear,
        endYear: formData.endYear,
        duration: formData.duration,
        logoUrl,
        createdAt: editingIndex !== null ? educations[editingIndex].createdAt : new Date(),
        updatedAt: new Date(),
      };

      const updatedEducations = [...educations];
      if (editingIndex !== null) updatedEducations[editingIndex] = newEducation;
      else updatedEducations.push(newEducation);

      await setDoc(educationRef, { items: updatedEducations });
      setEducations(updatedEducations);
      // showToast(editingIndex !== null ? "Education updated!" : "Education added!", "success");
      alert(editingIndex !== null ? "Education details updated successfully!" : "Education details added successfully!");
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error(err);
      //showToast("Failed to save education", "error");
      alert("Failed to save education details");
    }
  };

  const resetForm = () => {
    setFormData({
      level: "Higher Education",
      educationName: "",
      grade: "",
      instituteName: "",
      address: "",
      startYear: "",
      endYear: "",
      duration: "",
    });
    setPreview(null);
    setLogo(null);
    setEditingIndex(null);
  };

  const handleEdit = (education: Education) => {
    const index = educations.findIndex((e) => e.id === education.id);
    setEditingIndex(index);
    setFormData({ ...education });
    setPreview(education.logoUrl || null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education?")) return;
    const updatedEducations = educations.filter((e) => e.id !== id);
    await updateDoc(educationRef, { items: updatedEducations });
    setEducations(updatedEducations);
    //showToast("Education deleted!", "success");
    alert("Education details deleted successfully!");
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-10">
      {/* <div className="flex flex-col items-start mb-6 sm:mb-0">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          My Education
        </h2>
      </div>

      <div className="flex justify-end items-center">
        <button 
          type="submit"
          onClick={() => setIsModalOpen(true)}
          className=" bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 sm:mt-2"
        >
        + Add Education
        </button>
      </div> */}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">My Education</h2>
        <button
          // onClick={() => {
          //   resetForm();
          //   setIsModalOpen(true)
          // }}

          onClick={() => {
    resetForm();
    setIsModalOpen(true);
  }}
          className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700"
        >
          + Add Education
        </button>
      </div>

      {educations.length === 0 && (
        <div className="text-center text-gray-500 mt-4 mb-6">
          <p>No education records yet. Add your first education.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {educations.map((education) => (
          <EducationCard
            key={education.id}
            education={education}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-40 flex p-6 items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative animate-slideIn">
            <button
              // onClick={() => setIsModalOpen(false)}
              onClick={() => {
                resetForm();
                setIsModalOpen(false);
              }}
              className="absolute top-3 right-4 text-gray-600 text-2xl font-bold hover:text-red-500"
            >
              ×
            </button>

            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              {editingIndex !== null ? "Edit Education" : "Add Education"}
            </h3>

            {toast && (
              <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(null)}
                />
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Education Level */}
              <select
                title="select"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                className="w-full border rounded px-3 py-2 focus:ring focus:ring-indigo-200"
              >
                <option value="Higher Education">Higher Education</option>
                <option value="Professional Qualification">Professional Qualification</option>
                <option value="School Education">School Education</option>
              </select>

              {/* Dynamic fields */}
              <input
                type="text"
                placeholder={formData.level === "School Education" ? "School Name" : "Education Name "}
                value={formData.educationName}
                onChange={(e) => setFormData({ ...formData, educationName: e.target.value })}
                className="w-full border rounded px-3 py-2 focus:ring focus:ring-indigo-200"
              />
              
              {(formData.level === "Higher Education" || formData.level === "Professional Qualification") && (
                <input
                  type="text"
                  placeholder="Institute / University Name"
                  value={formData.instituteName}
                  onChange={(e) => setFormData({ ...formData, instituteName: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:ring focus:ring-indigo-200"
                />
              )}

              {formData.level === "Higher Education" && (
                <input
                  type="text"
                  placeholder="Grade"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:ring focus:ring-indigo-200"
                />
              )}

              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full border rounded px-3 py-2 focus:ring focus:ring-indigo-200"
              />

              {(formData.level === "Higher Education" || formData.level === "School Education") && (
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Start Year"
                  value={formData.startYear}
                  onChange={(e) => setFormData({ ...formData, startYear: e.target.value })}
                  className="w-1/2 border rounded px-3 py-2 focus:ring focus:ring-indigo-200"
                />
                <input
                  type="text"
                  placeholder="End Year"
                  value={formData.endYear}
                  onChange={(e) => setFormData({ ...formData, endYear: e.target.value })}
                  className="w-1/2 border rounded px-3 py-2 focus:ring focus:ring-indigo-200"
                />
              </div>
              )}

              {formData.level === "Professional Qualification" && (
                <input
                  type="text"
                  placeholder="Duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:ring focus:ring-indigo-200"
                />
              )}

              {/* Logo Upload */}
              <label className="relative flex flex-col items-center justify-center w-full h-40 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
                {preview ? (
                  <img
                    src={preview}
                    alt="Logo Preview"
                    className="w-full h-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <span className="text-4xl text-gray-600">+</span>
                    <p className="text-sm text-gray-500 mt-1">Add Logo</p>
                  </div>
                )}
                <input
                  type="file"
                  className="absolute inset-0 opacity-0"
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
              </label>

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
                  {editingIndex !== null ? "Update Education" : "Save Education"}
                </button>
              </div>
            </form>
          </div>

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

export default Education;
