import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, storage } from "../../firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Toast from "./toast";
import SocialCard from "./ui/socialCard";

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

const SocialService: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logo, setLogo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [socialworks, setSocialWorks] = useState<SocialWork[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    soceityName: "",
    position: "",
    startDate: "",
    endDate: "",
    weblink: "",
    present: false,
  });

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  
  const socialRef = doc(db, "portfolio", "socialworks");
  useEffect(()=>{
    const fetchSocialWork = async ()=>{
      const snap = await getDoc(socialRef);
      if (snap.exists()) {
        const data = snap.data();
        setSocialWorks(data.items || []);
      }
    };
    fetchSocialWork();
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
    if (!formData.soceityName) errors.push("Soceity or club name is required");
    if (!formData.position) errors.push("YOur Job role/ position required");
    if (!formData.startDate) errors.push("Start Date is required");
    if (!formData.present && !formData.endDate) errors.push("End Date is required");

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
  
        const newSocialWork: SocialWork = {
          id: editingIndex !== null ? socialworks[editingIndex].id : Date.now().toString(),
          soceityName: formData.soceityName!,
          position: formData.position,
          startDate: formData.startDate,
          endDate: formData.endDate,
          weblink: formData.weblink,
          present: formData.present,
          logoUrl,
          createdAt: editingIndex !== null ? socialworks[editingIndex].createdAt : new Date(),
          updatedAt: new Date(),
        };
  
        const updatedSocialWorks = [...socialworks];
        if (editingIndex !== null) updatedSocialWorks[editingIndex] = newSocialWork;
        else updatedSocialWorks.push(newSocialWork);
  
        await setDoc(socialRef, { items: updatedSocialWorks });
        setSocialWorks(updatedSocialWorks);
        alert(editingIndex !== null ? "Social Activity details updated successfully!" : "Social Activity details added successfully!");
        setIsModalOpen(false);
        resetForm();
      } catch (err) {
        console.error(err);
        //showToast("Failed to save social activity", "error");
        alert("Failed to save Social Activity details");
      }
    };
  
    const resetForm = () => {
      setFormData({
        soceityName: "",
        position: "",
        startDate: "",
        endDate: "",
        weblink: "",
        present: false,
      });
      setPreview(null);
      setLogo(null);
      setEditingIndex(null);
    };

    const handleEdit = (socialwork: SocialWork) => {
      const index = socialworks.findIndex((s) => s.id === socialwork.id);
      setEditingIndex(index);
      setFormData({
        soceityName: socialwork.soceityName,
        position: socialwork.position,
        startDate: socialwork.startDate,
        endDate: socialwork.endDate,
        weblink: socialwork.weblink || "",
        present: socialwork.present,
      });
      setPreview(socialwork.logoUrl || null);
      setIsModalOpen(true);
    };
    
    const handleDelete = async (id: string) => {
      if (!confirm("Are you sure you want to delete this record?")) return;
      const updatedSocialWorks = socialworks.filter((e) => e.id !== id);
      await updateDoc(socialRef, { items: updatedSocialWorks });
      setSocialWorks(updatedSocialWorks);
      //showToast("Social work society or clu deleted!", "success");
      alert("Social work society or clu details deleted successfully!");
    };

  const handlePresentToggle = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      present: checked,
      endDate: checked ? "" : prev.endDate,
    }));
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
          + Add Soceity
        </button>
      </div>

      {socialworks.length === 0 && (
        <div className="text-center text-gray-500 mt-4 mb-6">
          <p>No social work club or soceities or organization records yet. Add your first one.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {socialworks.map((social) => (
          <SocialCard
            key={social.id}
            social={social}
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
              {editingIndex !== null ? "Edit Social Activity" : "Add Social Activity"}
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
                placeholder="Soceity Name"
                value={formData.soceityName}
                onChange={(e) =>
                  setFormData({ ...formData, soceityName: e.target.value })
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

              <div className="flex space-x-2">
                <input
                  type="month"
                  placeholder="Start Date"
                  value={formData.startDate}
                  //onChange={(e) => handleDateChange("startDate", e.target.value)}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-1/2 border rounded px-3 py-2 focus:ring focus:ring-indigo-200"
                />
                <input
                  type="month"
                  placeholder="End Date"
                  value={formData.endDate}
                  //onChange={(e) => handleDateChange("endDate", e.target.value)}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
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
                <label htmlFor="present" className="text-gray-700">Currently i'm a member here</label>
              </div>

                <input
                  type="text"
                  placeholder="Weblink"
                  value={formData.weblink}
                  onChange={(e) => setFormData({ ...formData, weblink: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:ring focus:ring-indigo-200"
                />

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
                    <p className="text-sm text-gray-500 mt-1">Add Soceity or Club Logo</p>
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
                  {editingIndex !== null ? "Update" : "Save"}
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
