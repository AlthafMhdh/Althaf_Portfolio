import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import Toast from "./toast";

const Footer: React.FC = () => {
    const [formData, setFormData] = useState({
        copyright: "",
        developedby: "",
    });
    
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    useEffect(() => {
        const fetchContact = async () => {
            const contactRef = doc(db, "portfolio", "footer");
            const contactSnap = await getDoc(contactRef);
            if (contactSnap.exists()) {
                const data = contactSnap.data();
                setFormData({
                    copyright: data.copyright || "",
                    developedby: data.developedby || "",
                });
            }
        };
        fetchContact();
    }, []);

    const validate = () => {
        const newErrors: Record<string, string> = {};
    
        if (!formData.copyright.trim()) newErrors.email = "Copy right is required.";
        //if (!formData.developedby.trim()) newErrors.phone = "developer name is required.";
    
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
            await setDoc(doc(db, "portfolio", "footer"), {
                ...formData,
                updatedAt: new Date(),
            });
            showToast("Footer details saved successfully!", "success");
            //alert("Footer details saved successfully!");   
        }
        catch (error){
            console.error("Error saving footer:", error);
            showToast("Failed to save footer details. Try again.", "error");
            //alert("Failed to save footer");
        }
        finally{
            setLoading(false);
        }
    };

    return (
        //bg-white rounded-xl shadow-lg
        <div className="w-full max-w-7xl mx-auto p-2 sm:p-2">
            
            <div className="flex flex-col items-center mb-6 sm:mb-0">
                <h2 className="text-2xl font-semibold text-gray-700 mb-0">
                Footer Section
                </h2>
                <p className="text-gray-500">Here you can customize your footer details.</p>

                <form className="w-full mt-6 space-y-3">
                    {toast && (
                        <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                        />
                    )}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Copy Right</label>
                        <input
                        type="text"
                        placeholder="© 20XX XXXXXXX All rights reserved"
                        value={formData.copyright}
                        onChange={(e) => setFormData({...formData, copyright: e.target.value})}
                        className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Developed By</label>
                        <input
                        type="text"
                        placeholder="Developer name or company name"
                        value={formData.developedby}
                        onChange={(e) => setFormData({...formData, developedby: e.target.value})}
                        className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                        />
                    </div>
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

export default Footer;
