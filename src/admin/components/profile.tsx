import React, { useEffect, useState } from "react";
import { db, storage } from "../../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Toast from "./toast";


const ProfileForm: React.FC = () => {
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState<string>("");
  const [existingResumeUrl, setExistingResumeUrl] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    startNote: "",
    github: "",
    linkedin: "",
    resumeUrl: "",
  });

  //const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const profileRef = doc(db, "portfolio", "profile");
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        const data = profileSnap.data();
        setFormData({
          name: data.name || "",
          position: data.position || "",
          startNote: data.startNote || "",
          github: data.github || "",
          linkedin: data.linkedin || "",
          resumeUrl: data.resumeUrl || "",
        });
        if (data.photoUrl) setPreview(data.photoUrl);
        if (data.resumeUrl) {
          setExistingResumeUrl(data.resumeUrl);
          const decodedUrl = decodeURIComponent(data.resumeUrl);
          const match = decodedUrl.match(/\/o\/resumes\/([^?]+)/);
          const resumeFileName = match ? match[1] : "Uploaded Resume";
          setResumeName(resumeFileName);
        }
      }
    };
    fetchProfile();
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

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        showToast("Only Pdf files are allowed as resume", "error");
        return;
      }
      setResume(file);
      setResumeName(file.name);
      setExistingResumeUrl(""); 
    }
  };

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFormData({...formData, [e.target.placeholder.toLowerCase()]: e.target.value})
  // }

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!preview) newErrors.photo = "Profile photo is required.";
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.position.trim()) newErrors.position = "Position is required.";
    if (!formData.startNote.trim()) newErrors.startNote = "Start note is required.";
    if (!formData.github.trim()) newErrors.github = "Github link is required.";
    if (!formData.linkedin.trim()) newErrors.linkedin = "Linkedin url is required.";
    if (!formData.resumeUrl && !resume) newErrors.resume = "Resume is required.";

    const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;

    if (formData.github && !urlPattern.test(formData.github))
      newErrors.github = "Please enter a valid GitHub URL.";

    if (formData.linkedin && !urlPattern.test(formData.linkedin))
      newErrors.linkedin = "Please enter a valid LinkedIn URL.";

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
      let resumeUrl = formData.resumeUrl || "";

      if (photo) {
        const photoRef = ref(storage, `photos/${Date.now()}_${photo.name}`);
        await uploadBytes(photoRef, photo);
        photoUrl = await getDownloadURL(photoRef);
      }

      if (resume) {
        const resumeRef = ref(storage, `resumes/${resume.name}`);
        await uploadBytes(resumeRef, resume);
        resumeUrl = await getDownloadURL(resumeRef);
      }

      await setDoc(doc(db, "portfolio", "profile"), {
        ...formData,
        photoUrl,
        resumeUrl,
        updatedAt: new Date(),
      });
      showToast("Profile saved successfully!", "success");
      //alert("Profile saved successfully!");
    }
    catch (error){
      console.error("Error saving profile:", error);
      showToast("Failed to save profile. Try again.", "error");
      //alert("Failed to save profile");
    }
    finally{
      setLoading(false);
    }
  };

  return (
    //bg-white rounded-xl shadow-lg
    <div className="w-full max-w-7xl mx-auto p-6 sm:p-10">
      
      <div className="flex flex-col items-center mb-6 sm:mb-0">
        <label className="relative flex flex-col items-center justify-center w-32 h-32 md:w-48 md:h-48 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="text-center">
              <span className="text-4xl text-gray-600">+</span>
              <p className="text-xs text-gray-500 mt-1">Add Profile Photo</p>
            </div>
          )}
          <input
            type="file"
            className="absolute inset-0 opacity-0"
            accept="image/*"
            onChange={handlePhotoUpload}
          />
        </label>

        {/* {errors.photo && (
          <p className="text-red-500 text-sm mt-2">{errors.photo}</p>
        )} */}

        <form className="w-full mt-6 space-y-3">
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Currrent Job Position</label>
            <input
              type="text"
              placeholder="Position"
              value={formData.position}
              onChange={(e) => setFormData({...formData, position: e.target.value})}
              className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Start Note</label>
            <input
              type="text"
              placeholder="Start Note"
              value={formData.startNote}
              onChange={(e) => setFormData({...formData, startNote: e.target.value})}
              className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Github</label>
            <input
              type="text"
              placeholder="GitHub Url"
              value={formData.github}
              onChange={(e)=> setFormData({...formData, github: e.target.value})}
              className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">LinkedIn</label>
            <input
              type="text"
              placeholder="LinkedIn Url"
              value={formData.linkedin}
              onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
              className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Resume</label>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                id="resumeUpload"
                title="Upload Resume"
                aria-label="Upload Resume"
                className="block w-full text-sm text-gray-700 border rounded px-3 py-2 cursor-pointer focus:ring focus:ring-blue-200"
                accept=".pdf"
                onChange={handleResumeUpload}
              />
            </div>
            {resumeName && (
              existingResumeUrl ? (
                <p
                  className="text-indigo-600 text-xs mt-1 cursor-pointer hover:underline"
                  onClick={() => window.open(existingResumeUrl, "_blank")}
                >
                  {resumeName}
                </p>
              ) : (
                <p className="text-gray-500 text-xs mt-1">{resumeName}</p>
              )
            )}
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

export default ProfileForm;