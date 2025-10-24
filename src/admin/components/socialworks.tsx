import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, storage } from "../../firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import ExperienceCard from "./ui/experienceCard";
import Toast from "./toast";

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

const SocialService: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logo, setLogo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    companyName: "",
    position: "",
    projectInvolvement: "",
    address: "",
    startDate: "",
    endDate: "",
    duration: "",
    present: false,
  });

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  
  const experianceRef = doc(db, "portfolio", "experiances");
  useEffect(()=>{
    const fetchExperiance = async ()=>{
      const snap = await getDoc(experianceRef);
      if (snap.exists()) {
        const data = snap.data();
        setExperiences(data.items || []);
      }
    };
    fetchExperiance();
  },[]);

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
    if (!formData.companyName) errors.push("Company name is required");
    if (!formData.address) errors.push("Company address is required");
    if (!formData.position) errors.push("YOur Job role/ position required");
    if (!formData.projectInvolvement) errors.push("Project Involvement required");
    if (!formData.startDate) errors.push("Start Date is required");
    if (!formData.present && !formData.endDate) errors.push("End Date is required");
    if (!formData.duration) errors.push("duration is required");

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
          //const logoRef = ref(storage, `logos/${Date.now()}_${logo.name}`);
          const logoRef = ref(storage, `logos/${logo.name}`);
          await uploadBytes(logoRef, logo);
          logoUrl = await getDownloadURL(logoRef);
        }
  
        const newExperience: Experience = {
          id: editingIndex !== null ? experiences[editingIndex].id : Date.now().toString(),
          companyName: formData.companyName!,
          position: formData.position,
          projectInvolvement: formData.projectInvolvement,
          address: formData.address!,
          startDate: formData.startDate,
          endDate: formData.endDate,
          duration: formData.duration,
          present: formData.present,
          logoUrl,
          createdAt: editingIndex !== null ? experiences[editingIndex].createdAt : new Date(),
          updatedAt: new Date(),
        };
  
        const updatedExperiences = [...experiences];
        if (editingIndex !== null) updatedExperiences[editingIndex] = newExperience;
        else updatedExperiences.push(newExperience);
  
        await setDoc(experianceRef, { items: updatedExperiences });
        setExperiences(updatedExperiences);
        alert(editingIndex !== null ? "Experience details updated successfully!" : "Experience details added successfully!");
        setIsModalOpen(false);
        resetForm();
      } catch (err) {
        console.error(err);
        //showToast("Failed to save education", "error");
        alert("Failed to save experience details");
      }
    };
  
    const resetForm = () => {
      setFormData({
        companyName: "",
        position: "",
        projectInvolvement: "",
        address: "",
        startDate: "",
        endDate: "",
        duration: "",
        present: false,
      });
      setPreview(null);
      setLogo(null);
      setEditingIndex(null);
    };

    const handleEdit = (experience: Experience) => {
      const index = experiences.findIndex((e) => e.id === experience.id);
      setEditingIndex(index);
      setFormData({ ...experience });
      setPreview(experience.logoUrl || null);
      setIsModalOpen(true);
    };
    
    const handleDelete = async (id: string) => {
      if (!confirm("Are you sure you want to delete this experience?")) return;
      const updatedExperiences = experiences.filter((e) => e.id !== id);
      await updateDoc(experianceRef, { items: updatedExperiences });
      setExperiences(updatedExperiences);
      //showToast("Education deleted!", "success");
      alert("Experience details deleted successfully!");
    };

  const handlePresentToggle = (checked: boolean) => {
    setFormData((prev) => {
      const updated = { ...prev, present: checked };
      if (checked) updated.endDate = "";
      updated.duration = calculateDuration(
        updated.startDate,
        checked ? new Date().toISOString().slice(0, 7) : updated.endDate
      );
      return updated;
    });
  };

  const handleDateChange = (field: string, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Recalculate duration whenever start or end changes
      if (updated.startDate && (updated.endDate || updated.present)) {
        const endDate = updated.present ? new Date().toISOString().slice(0, 7) : updated.endDate;
        updated.duration = calculateDuration(updated.startDate, endDate);
      }

      return updated;
    });
  };

  // const calculateDuration = (start: string, end: string | undefined) => {
  //   if (!start || !end) return "";
  //   const startDate = new Date(start + "-01");
  //   const endDate = new Date(end + "-01");
  //   const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
  //   if (months < 0) return "";
  //   const years = Math.floor(months / 12);
  //   const remainingMonths = months % 12;
  //   return `${years > 0 ? years + " year " : ""}${remainingMonths > 0 ? remainingMonths + " month" : ""}`;
  // };

  const calculateDuration = (start: string, end: string | undefined) => {
    if (!start || !end) return "";
    const startDate = new Date(start);
    const endDate = new Date(end);
    const months =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());
    if (months < 0) return "";
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return `${years > 0 ? years + " year " : ""}${remainingMonths > 0 ? remainingMonths + " month" : ""}`;
  };


  return (
    //bg-white rounded-xl shadow-lg
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">My Social Service</h2>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true)
          }}
          className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700"
        >
          + Add
        </button>
      </div>

      {experiences.length === 0 && (
        <div className="text-center text-gray-500 mt-4 mb-6">
          <p>No social service records yet. Add your first one.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiences.map((experience) => (
          <ExperienceCard
            key={experience.id}
            experience={experience}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-40 flex p-6 items-center justify-center z-50">
          {/* max-h-[90vh] overflow-y-auto */}
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative animate-slideIn">
            <button
              onClick={() => {
                resetForm();
                setIsModalOpen(false);
              }}
              className="absolute top-3 right-4 text-gray-600 text-2xl font-bold hover:text-red-500"
            >
              ×
            </button>

            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              {editingIndex !== null ? "Edit Experience" : "Add Experience"}
            </h3>

            {toast && (
              <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(null)}
                />
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                className="w-full border rounded px-3 py-2 focus:ring focus:ring-indigo-200"
              />

              <input
                type="text"
                placeholder="Position"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                className="w-full border rounded px-3 py-2 focus:ring focus:ring-indigo-200"
              />

              <div>
                <textarea
                  rows={6}
                  placeholder="Write about your experience and project involvement..."
                  value={formData.projectInvolvement}
                  onChange={(e) => setFormData({...formData, projectInvolvement: e.target.value})}
                  className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                />
              </div>

              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full border rounded px-3 py-2 focus:ring focus:ring-indigo-200"
              />

              <div className="flex space-x-2">
                <input
                  type="date"
                  placeholder="Start Date"
                  value={formData.startDate}
                  onChange={(e) => handleDateChange("startDate", e.target.value)}
                  //onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-1/2 border rounded px-3 py-2 focus:ring focus:ring-indigo-200"
                />
                <input
                  type="date"
                  placeholder="End Date"
                  value={formData.endDate}
                  onChange={(e) => handleDateChange("endDate", e.target.value)}
                  //onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  //className="w-1/2 border rounded px-3 py-2 focus:ring focus:ring-indigo-200"
                  className={`w-1/2 border rounded px-3 py-2 focus:ring focus:ring-indigo-200 ${
                    formData.present ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  disabled={formData.present}
                />
              </div>

              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="present"
                  checked={formData.present}
                  onChange={(e) => handlePresentToggle(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="present" className="text-gray-700">Currently working here</label>
              </div>

                {/* <input
                  type="text"
                  placeholder="Duration"
                  value={formData.duration}
                  //onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  readOnly
                  className="w-full border rounded px-3 py-2 focus:ring focus:ring-indigo-200"
                /> */}

              {/* Logo Upload */}
              <label className="relative flex flex-col items-center justify-center w-full h-35 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
                {preview ? (
                  <img
                    src={preview}
                    alt="Logo Preview"
                    className="w-full h-full rounded-lg object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <span className="text-4xl text-gray-600">+</span>
                    <p className="text-sm text-gray-500 mt-1">Add Company Logo</p>
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

export default SocialService;
