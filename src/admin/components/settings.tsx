import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import Toast from "./toast";
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword,} from "firebase/auth";

const Settings: React.FC = () => {
    const [formData, setFormData] = useState({
        appName: "",
    });

    const [isOpen, setIsOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(
        null
    );

    useEffect(() => {
        const fetchContact = async () => {
            const contactRef = doc(db, "portfolio", "settings");
            const contactSnap = await getDoc(contactRef);
            if (contactSnap.exists()) {
                const data = contactSnap.data();
                setFormData({
                appName: data.appName || "",
                });
            }
        };
        fetchContact();
    }, []);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
    };

    const validate = () => {
        if (!formData.appName.trim()) {
        showToast("App name is required.", "error");
        return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);

        try {
        await setDoc(doc(db, "portfolio", "settings"), {
            ...formData,
            updatedAt: new Date(),
        });
        showToast("Saved successfully!", "success");
        } catch (error) {
        console.error("Error saving profile:", error);
        showToast("Failed to save details. Try again.", "error");
        } finally {
        setLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        const { currentPassword, newPassword, confirmPassword } = passwordData;
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            showToast("No user logged in.", "error");
            return;
        }

        if (!currentPassword || !newPassword || !confirmPassword) {
            showToast("All fields are required.", "error");
            return;
        }

        if (newPassword !== confirmPassword) {
            showToast("New passwords do not match.", "error");
            return;
        }

        try {
            const credential = EmailAuthProvider.credential(user.email!, currentPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
            showToast("Password updated successfully!", "success");

            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setIsOpen(false);
            } catch (error: any) {
                console.error("Error updating password:", error);
            if (error.code === "auth/wrong-password") {
                showToast("Incorrect current password.", "error");
            } else {
                showToast("Failed to update password. Try again.", "error");
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-4 sm:p-6">
            {toast && (
                <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(null)}
                />
            )}

            <div className="flex flex-col space-y-6">

                <div className="bg-white rounded-2xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        App Settings
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                App Name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your app name"
                                value={formData.appName}
                                onChange={(e) =>
                                setFormData({ ...formData, appName: e.target.value })
                                }
                                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition duration-300"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </form>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-6">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center justify-between w-full text-left focus:outline-none"
                    >
                        <h3 className="text-lg font-semibold text-gray-800">
                            Change Password
                        </h3>
                        <span
                            className={`transform transition-transform duration-300 ${
                                isOpen ? "rotate-180" : "rotate-0"
                            }`}
                        >
                            ▼ 
                        </span>
                    </button>

                    {isOpen && (
                    <form onSubmit={handlePasswordChange} className="mt-6 space-y-4 animate-fadeIn" >
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Current Password
                            </label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                title="password"
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-600"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                New Password
                            </label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                title="password"
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-600"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                title="password"
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-600"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition duration-300"
                        >
                            Update Password
                        </button>
                    </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
