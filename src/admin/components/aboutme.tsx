import React, { useEffect, useState } from "react";
import { db, storage } from "../../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Toast from "./toast";

const AboutMe: React.FC = () => {
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    about: "",
    imagePosition: "left",
  });

  //const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const fetchAboutme = async () => {
      const aboutRef = doc(db, "portfolio", "about");
      const aboutSnap = await getDoc(aboutRef);
      if (aboutSnap.exists()) {
        const data = aboutSnap.data();
        setFormData({
          about: data.about || "",
          imagePosition: data.imagePosition || "left",
        });
        if (data.photoUrl) setPreview(data.photoUrl);
      }
    };
    fetchAboutme();
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        //setErrors((prev) => ({ ...prev, photo: "Only image files are allowed" }));
        showToast("Only image files are allowed" , "error");
        return;
      }
      setPhoto(file);
      //setErrors((prev) => ({ ...prev, photo: "" }));
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.about.trim()) newErrors.about = "About me details is required.";

    if (!preview)
      newErrors.photo = "Profile photo is required.";

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
      let photoUrl = preview || '';

      if (photo) {
        const photoRef = ref(storage, `photos/${Date.now()}_${photo.name}`);
        await uploadBytes(photoRef, photo);
        photoUrl = await getDownloadURL(photoRef);
      }

      await setDoc(doc(db, "portfolio", "about"), {
        ...formData,
        photoUrl,
        updatedAt: new Date(),
      });
      showToast("About details saved successfully!", "success");
      //alert("About details saved successfully!");

    }
    catch (error){
      console.error("Error saving profile:", error);
      showToast("Failed to save about details", "error");
      //alert("Failed to save about details");
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg w-full max-w-7xl mx-auto p-6 sm:p-10">
      <div className="flex flex-col items-center mb-6 sm:mb-0">
        <h5 className="text-xl font-semibold text-gray-700 mb-0">
          Tell me about my self 
        </h5>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="flex flex-col md:flex-row items-center md:items-start md:gap-10">
        <label className="relative flex flex-col items-center justify-center w-48 h-48 md:w-84 md:h-84 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 overflow-hidden">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="w-full h-full rounded-lg object-cover"
            />
          ) : (
            <div className="text-center">
              <span className="text-4xl text-gray-600">+</span>
              <p className="text-xs text-gray-500 mt-1">Add Photo</p>
            </div>
          )}
          <input
            type="file"
            className="absolute inset-0 opacity-0"
            accept="image/*"
            onChange={handlePhotoUpload}
          />
        </label>

        <form className="w-full mt-8 space-y-3">
          <div>
            <textarea
              rows={8}
              placeholder="Write something about yourself..."
              value={formData.about}
              onChange={(e) => setFormData({...formData, about: e.target.value})}
              className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Image Position
            </label>
            <div className="flex gap-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="imagePosition"
                  value="left"
                  checked={formData.imagePosition === "left"}
                  onChange={(e) =>
                    setFormData({ ...formData, imagePosition: e.target.value })
                  }
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Left</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="imagePosition"
                  value="right"
                  checked={formData.imagePosition === "right"}
                  onChange={(e) =>
                    setFormData({ ...formData, imagePosition: e.target.value })
                  }
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Right</span>
              </label>
            </div>
          </div>

          {/* <button 
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 mt-4 sm:mt-2"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button> */}
        </form>
      </div>
      <button 
        type="submit"
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 mt-8 sm:mt-10"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default AboutMe;