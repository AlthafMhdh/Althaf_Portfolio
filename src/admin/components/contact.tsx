import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db } from "../../firebase/config";
import Toast from "./toast";

const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        address: "",
        facebook: "",
        whatsapp: "",
        instagram: "",
        tiktok: "",
    });
    
    const [loading, setLoading] = useState(false);
    const [showSocial, setShowSocial] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const socialRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchContact = async () => {
            const contactRef = doc(db, "portfolio", "contact");
            const contactSnap = await getDoc(contactRef);
            if (contactSnap.exists()) {
                const data = contactSnap.data();
                setFormData({
                    email: data.email || "",
                    phone: data.phone || "",
                    address: data.address || "",
                    facebook: data.facebook || "",
                    whatsapp: data.whatsapp || "",
                    instagram: data.instagram || "",
                    tiktok: data.instagram || "",
                });
            }
        };
        fetchContact();
    }, []);

    const validate = () => {
        const newErrors: Record<string, string> = {};
    
        if (!formData.email.trim()) newErrors.email = "Email address is required.";
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    
        //setErrors(newErrors);
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
            await setDoc(doc(db, "portfolio", "contact"), {
                ...formData,
                updatedAt: new Date(),
            });
            showToast("Contact details saved successfully!", "success");
            //alert("Contact details saved successfully!");   
        }
        catch (error){
            console.error("Error saving profile:", error);
            showToast("Failed to save contact details. Try again.", "error");
            //alert("Failed to save profile");
        }
        finally{
            setLoading(false);
        }
    };

    const handleShowSocial = () => {
        setShowSocial(true);
        setTimeout(() => {
        socialRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 200);
    };

    return (
        //bg-white rounded-xl shadow-lg
        <div className="w-full max-w-7xl mx-auto p-6 sm:p-6">
            
            <div className="flex flex-col items-center mb-6 sm:mb-0">
                <h2 className="text-2xl font-semibold text-gray-700 mb-0">
                Contact Section
                </h2>
                <p className="text-gray-500">Here you can customize your contact info.</p>

                <form className="w-full mt-6 space-y-3">
                    {toast && (
                        <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                        />
                    )}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Email</label>
                        <input
                        type="text"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                        />
                        {/* {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email}</p>
                        )} */}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
                        <input
                        type="text"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                        />
                        {/* {errors.phone && (
                            <p className="text-red-500 text-sm">{errors.phone}</p>
                        )} */}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Address</label>
                        <input
                        type="text"
                        placeholder="Address"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                        />
                    </div>

                    {!showSocial && (
                        <button
                        type="button"
                        onClick={handleShowSocial}
                        className="w-full border-2 border-dashed border-green-400 text-green-700 py-2 rounded hover:bg-green-50 font-medium transition"
                        >
                        + Add Social Links
                        </button>
                    )}

                    {showSocial && (
                    <div
                        ref={socialRef}
                        className="border-2 border-dashed border-green-400 rounded-xl p-4 mt-4 space-y-3 bg-green-50 transition-all duration-500"
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-green-700 mb-2">Social Links</h3>
                            
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Facebook</label>
                            <input
                            type="text"
                            placeholder="Facebook"
                            value={formData.facebook}
                            onChange={(e) => setFormData({...formData, facebook: e.target.value})}
                            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Whatsapp</label>
                            <input
                            type="text"
                            placeholder="Whatsapp"
                            value={formData.whatsapp}
                            onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Instagram</label>
                            <input
                            type="text"
                            placeholder="Instagram"
                            value={formData.instagram}
                            onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Tiktok</label>
                            <input
                            type="text"
                            placeholder="Tiktok"
                            value={formData.tiktok}
                            onChange={(e) => setFormData({...formData, tiktok: e.target.value})}
                            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                            />
                        </div>
                    </div>
                    )}

                    <button 
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 mt-4 sm:mt-2"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </form>

            </div>
        </div>
    );
};

export default Contact;
