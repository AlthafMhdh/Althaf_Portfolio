import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, storage } from "../../firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Toast from "./toast";
import CertificateCart from "./ui/certifcateCart";

interface Certificate {
  id: string;
  courseName: string;
  duration: string;
  photoUrl?: string;
  createdAt?: any;
  updatedAt?: any;
}

const Certification: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [photo, setPhoto] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [certificates, setCertificates] = useState<any[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        courseName: "",
        duration: "",
    });
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const certificateRef = doc(db, "portfolio", "certificates");
    useEffect(() => {
        const fetchCertificates = async () => {
        const snap = await getDoc(certificateRef);
        if (snap.exists()) {
            const data = snap.data();
            setCertificates(data.items || []);
        }
        };
        fetchCertificates();
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
        if (!formData.courseName.trim()) newErrors.courseName = "Completed course name or certificate is required.";

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
    
            const newCertificate: Certificate = {
              id: editingIndex !== null ? certificates[editingIndex].id : Date.now().toString(),
              ...formData,
              photoUrl,
              updatedAt: new Date(),
              createdAt: editingIndex !== null ? certificates[editingIndex].createdAt : new Date(),
            };
    
            let updatedCertificates = [...certificates];
            if (editingIndex !== null) {
              updatedCertificates[editingIndex] = newCertificate;
            } else {
              updatedCertificates.push(newCertificate);
            }
    
            await setDoc(certificateRef, { items: updatedCertificates });
            setCertificates(updatedCertificates);
            alert(editingIndex !== null ? "Certificate updated successfully!" : "Certificate added successfully!");
            setIsModalOpen(false);
            resetForm();
    
        }
        catch (error){
            console.error("Error saving profile:", error);
            //showToast("Failed to save profile. Try again.", "error");
            alert("Failed to save Certificate");
        }
        finally{
            setFormData({
              courseName: "",
              duration: "",
            });
            setPreview(null);
            setPhoto(null);
            //setLoading(false);
        }
    };
    
    const resetForm = () => {
        setFormData({
          courseName: "",
          duration: "",
        });
        setPreview(null);
        setPhoto(null);
        setEditingIndex(null);
    };

    const handleEdit = (certificate: Certificate) => {
        const index = certificates.findIndex((p) => p.id === certificate.id);
        setEditingIndex(index);
        setFormData({
          courseName: certificate.courseName,
          duration: certificate.duration,
        });
        setPreview(certificate.photoUrl || null);
        setIsModalOpen(true);
    };
    
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this course or certification?")) return;
        const updatedCertificates = certificates.filter((p) => p.id !== id);
        await updateDoc(certificateRef, { items: updatedCertificates });
        setCertificates(updatedCertificates);
        //showToast("Project deleted successfully!", "success");
        alert("Certification deleted successfully!");
    };

    return (
        //bg-white rounded-xl shadow-lg
        <div className="w-full max-w-7xl mx-auto p-6 sm:p-10">
            <div className="flex flex-col mb-6 sm:mb-0">
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                My Completed Certifications
                </h2>
            </div>

            <div className="flex justify-end items-center">
                <button 
                type="submit"
                onClick={() => setIsModalOpen(true)}
                className=" bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 sm:mt-2"
                >
                +New Certification
                </button>
            </div>

            {certificates.length === 0 ? (
                <div className="text-center text-gray-500 mt-4 mb-6">
                    <p>You don't have completed courses or certifications. Add your first certification.</p>
                </div>
            ): null}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map((certificate) => (
                    <CertificateCart
                        key={certificate.id}
                        certificate={certificate}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

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
                        {editingIndex ? "Edit Certicitation" : "Add New Certification"}
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
                                    <p className="text-sm text-gray-500 mt-1">Add Certificate Image</p>
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
                                placeholder="Course or Certificate Name *"
                                value={formData.courseName}
                                onChange={(e) =>
                                setFormData({ ...formData, courseName: e.target.value })
                                }
                                className="w-full border rounded px-3 py-2 focus:ring focus:ring-indigo-200"
                            />

                            <input
                                type="text"
                                placeholder="Duration"
                                value={formData.duration}
                                onChange={(e) =>
                                setFormData({ ...formData, duration: e.target.value })
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
                                {editingIndex ? "Update Certification" : "Save Certification"}
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

export default Certification;
