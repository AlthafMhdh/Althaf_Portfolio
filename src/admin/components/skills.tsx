import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import Toast from "./toast";
import { FiTrash2 } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";


interface Skill {
  id: string;
  name: string;
  category: "Frontend" | "Backend";
  level: "Basic" | "Intermediate" | "Experienced";
  createdAt?: any;
  updatedAt?: any;
}

const Skills: React.FC = () => {
  const [isModalOpen, setIsModalOpen] =useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Skill>>({
    name: "",
    category: "Frontend",
    level: "Basic",
  });
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const skillRef = doc(db, "portfolio", "skills");
  useEffect(()=>{
    const fetchSkills = async () => {
      const snap = await getDoc(skillRef);
      if (snap.exists()) {
        const data = snap.data();
        setSkills(data.items || []);
      }
    };
    fetchSkills();
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const validate = () => {
    const errors: string[] = [];
    if (!formData.name) errors.push("Skill name is required");
    if (!formData.category) errors.push("Categories is required");
    if (!formData.level) errors.push("Skill level is required");

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
  
        const newSkill: Skill = {
          id: editingIndex !== null ? skills[editingIndex].id : Date.now().toString(),
          name: formData.name!,
          category: formData.category!,
          level: formData.level!,
          createdAt: editingIndex !== null ? skills[editingIndex].createdAt : new Date(),
          updatedAt: new Date(),
        };
  
        const updatedSkills = [...skills];
        if (editingIndex !== null) updatedSkills[editingIndex] = newSkill;
        else updatedSkills.push(newSkill);
  
        await setDoc(skillRef, { items: updatedSkills });
        setSkills(updatedSkills);
        alert(editingIndex !== null ? "Skill details updated successfully!" : "Skill details added successfully!");
        setIsModalOpen(false);
        resetForm();
      } catch (err) {
        console.error(err);
        alert("Failed to save skill details");
      }
    };
  
    const resetForm = () => {
      setFormData({
        name: "",
        category: "Frontend",
        level: "Basic",
      });
      setEditingIndex(null);
    };

    const handleEdit = (skill: Skill) => {
      const index = skills.findIndex((s) => s.id === skill.id);
      setEditingIndex(index);
      setFormData({ ...skill });
      setIsModalOpen(true);
    };
    
    const handleDelete = async (id: string) => {
      if (!confirm("Are you sure you want to delete this skill?")) return;
      const updatedSkills = skills.filter((s) => s.id !== id);
      await updateDoc(skillRef, { items: updatedSkills });
      setSkills(updatedSkills);
      alert("Skill deleted successfully!");
    };


  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-2">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">My Skills</h2>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true)
          }}
          className="bg-indigo-600 text-white p-2 px-4 rounded-lg hover:bg-indigo-700"
        >
          + Add Skill
        </button>
      </div>

      {skills.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Skill Name</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Level</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill) => (
                <tr key={skill.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{skill.name}</td>
                  <td className="py-3 px-4">{skill.category}</td>
                  <td className="py-3 px-4">{skill.level}</td>
                  <td className="py-3 px-4 text-center sm:mt-auto sm:space-x-3">
                    <button
                      onClick={() => handleEdit(skill)}
                      className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-800 text-sm"
                      title="Edit"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-800 text-sm"
                      title="Delete"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-6">No skills added yet.</p>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-40 flex p-6 items-center justify-center z-50">
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
              {editingIndex !== null ? "Edit Skill" : "Add Skill"}
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
                placeholder="Skill Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border rounded px-3 py-2 focus:ring focus:ring-indigo-200"
              />

              <select
                title="select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full border rounded px-3 py-2 focus:ring focus:ring-indigo-200"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
              </select>

              <select
                title="select"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                className="w-full border rounded px-3 py-2 focus:ring focus:ring-indigo-200"
              >
                <option value="Basic">Basic</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Experienced">Experienced</option>
              </select>

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
                  {editingIndex !== null ? "Update Skill" : "Save Skill"}
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

export default Skills;
