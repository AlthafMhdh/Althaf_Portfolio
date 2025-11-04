// import { doc, getDoc, setDoc } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import { db } from "../../firebase/config";
// import Toast from "./toast";
// import { BsEye, BsEyeFill } from "react-icons/bs";
// import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword } from "firebase/auth";

// const Settings: React.FC = () => {
//     const [formData, setFormData] = useState({
//         appName: "",
//     });

//      const [isOpen, setIsOpen] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [passwordData, setPasswordData] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
//   };
    
//     const [loading, setLoading] = useState(false);
//     const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

//     useEffect(() => {
//         const fetchContact = async () => {
//             const contactRef = doc(db, "portfolio", "settings");
//             const contactSnap = await getDoc(contactRef);
//             if (contactSnap.exists()) {
//                 const data = contactSnap.data();
//                 setFormData({
//                     appName: data.appName || "",
//                 });
//             }
//         };
//         fetchContact();
//     }, []);

//     const validate = () => {
//         const newErrors: Record<string, string> = {};
    
//         if (!formData.appName.trim()) newErrors.appName = "appName is required.";
    
//         //setErrors(newErrors);
//         const firstErrorKey = Object.keys(newErrors)[0];
//     if (firstErrorKey) {
//       showToast(newErrors[firstErrorKey], "error");
//     }
//         return Object.keys(newErrors).length === 0;
//     };

//     const showToast = (message: string, type: "success" | "error") => {
//         setToast({ message, type });
//     };
    
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!validate()) return;
//         setLoading(true);
    
//         try{    
//             await setDoc(doc(db, "portfolio", "settings"), {
//                 ...formData,
//                 updatedAt: new Date(),
//             });
//             showToast(" saved successfully!", "success");
//             //alert("Contact details saved successfully!");   
//         }
//         catch (error){
//             console.error("Error saving profile:", error);
//             showToast("Failed to save contact details. Try again.", "error");
//             //alert("Failed to save profile");
//         }
//         finally{
//             setLoading(false);
//         }
//     };


//     const handlePasswordChange = async (e: React.FormEvent) => {
//         e.preventDefault();

//         const { currentPassword, newPassword, confirmPassword } = passwordData;
//         const auth = getAuth();
//         const user = auth.currentUser;

//         if (!user) {
//             showToast("No user logged in.", "error");
//             return;
//         }

//         if (!currentPassword || !newPassword || !confirmPassword) {
//             showToast("All fields are required.", "error");
//             return;
//         }

//         if (newPassword !== confirmPassword) {
//             showToast("New passwords do not match.", "error");
//             return;
//         }

//         try {
//             const credential = EmailAuthProvider.credential(user.email!, currentPassword);
//             await reauthenticateWithCredential(user, credential);
//             await updatePassword(user, newPassword);
//             showToast("Password updated successfully!", "success");

//             setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
//         } catch (error: any) {
//             console.error("Error updating password:", error);
//             if (error.code === "auth/wrong-password") {
//             showToast("Incorrect current password.", "error");
//             } else {
//             showToast("Failed to update password. Try again.", "error");
//             }
//         }
//     };


//     return (
//         //bg-white rounded-xl shadow-lg
//         <div className="w-full max-w-7xl mx-auto p-2 sm:p-2">
            
//             <div className="flex flex-col items-center mb-6 sm:mb-0">
//                 <h2 className="text-2xl font-semibold text-gray-700 mb-0">
//                     Settings
//                 </h2>

//                 <form className="w-full mt-6 space-y-3">
//                     {toast && (
//                         <Toast
//                         message={toast.message}
//                         type={toast.type}
//                         onClose={() => setToast(null)}
//                         />
//                     )}
//                     <div>
//                         <label className="block text-gray-700 font-medium mb-1">App Name</label>
//                         <input
//                         type="text"
//                         placeholder="Enter your app name"
//                         value={formData.appName}
//                         onChange={(e) => setFormData({...formData, appName: e.target.value})}
//                         className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
//                         />
//                     </div>

//                     <button 
//                         type="submit"
//                         onClick={handleSubmit}
//                         disabled={loading}
//                         className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 mt-4 sm:mt-2"
//                     >
//                         {loading ? "Saving..." : "Save Changes"}
//                     </button>
//                 </form>

//                 <button
//                     onClick={() => setIsOpen(!isOpen)}
//                     className="flex items-center justify-between w-full text-left focus:outline-none"
//                 >
//                     <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
//                     {/* <Lock className="mr-2 text-indigo-500" /> */}
//                      Change Password
//                     </h2>
//                     <span
//                     className={`transform transition-transform duration-300 ${
//                         isOpen ? "rotate-180" : "rotate-0"
//                     }`}
//                     >
//                     ▼
//                     </span>
//                 </button>


//                 {/* Dropdown Content */}
//       {isOpen && (
//         <form onSubmit={handlePasswordChange} className="mt-6 space-y-4 animate-fadeIn">
//           {/* Current Password */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Current Password
//             </label>
//             <input
//               type={showPassword ? "text" : "password"}
//               name="currentPassword"
//               value={passwordData.currentPassword}
//               onChange={handleChange}
//               className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-600"
//               required
//             />
//           </div>

//           {/* New Password */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               New Password
//             </label>
//             <input
//               type={showPassword ? "text" : "password"}
//               name="newPassword"
//               value={passwordData.newPassword}
//               onChange={handleChange}
//               className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-600"
//               required
//             />
//           </div>

//           {/* Confirm Password */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Confirm Password
//             </label>
//             <input
//               type={showPassword ? "text" : "password"}
//               name="confirmPassword"
//               value={passwordData.confirmPassword}
//               onChange={handleChange}
//               className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-600"
//               required
//             />
//           </div>

//           {/* Toggle Show Password */}
//           <div
//             className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 cursor-pointer"
//             onClick={() => setShowPassword(!showPassword)}
//           >
//             {showPassword ? (
//               <BsEyeFill className="w-4 h-4 mr-1" />
//             ) : (
//               <BsEye className="w-4 h-4 mr-1" />
//             )}
//             {showPassword ? "Hide Passwords" : "Show Passwords"}
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition duration-300"
//           >
//             Update Password
//           </button>
//         </form>
//       )}



//             </div>
//         </div>
//     );
// };

// export default Settings;


import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import Toast from "./toast";
import { BsEye, BsEyeFill } from "react-icons/bs";
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

const Settings: React.FC = () => {
  const [formData, setFormData] = useState({
    appName: "",
  });

  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

      <h2 className="text-2xl font-semibold text-gray-700 dark:text-white text-center mb-8">
        Settings
      </h2>

      {/* Stack cards vertically */}
      <div className="flex flex-col space-y-6">
        {/* App Settings Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            App Settings
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
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

        {/* Change Password Dropdown */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between w-full text-left focus:outline-none"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
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
            <form
              onSubmit={handlePasswordChange}
              className="mt-6 space-y-4 animate-fadeIn"
            >
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>

              {/* Toggle Password Visibility */}
              <div
                className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <BsEyeFill className="w-4 h-4 mr-1" />
                ) : (
                  <BsEye className="w-4 h-4 mr-1" />
                )}
                {showPassword ? "Hide Passwords" : "Show Passwords"}
              </div>

              {/* Submit */}
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
