import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";

interface Skill {
  id: string;
  name: string;
  category: "Frontend" | "Backend";
  level: "Basic" | "Intermediate" | "Experienced";
}

const ClientSkillsView: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const snap = await getDoc(doc(db, "portfolio", "skills"));
        if (snap.exists()) {
          const data = snap.data();
          setSkills(data.items || []);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  if (loading) {
    return (
      <section id="skills" className="py-16 px-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">Loading skills...</p>
      </section>
    );
  }

  if (skills.length === 0) {
    return (
      <section id="skills" className="py-16 px-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">No skills available.</p>
      </section>
    );
  }

  return (
    <section
      id="skills"
      className="py-16 px-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
    >
      <h3 className="text-3xl font-bold mb-10 text-center text-gray-800 dark:text-white">
        Skills
      </h3>

      <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-center">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-lg hover:scale-105 transition transform duration-200"
          >
            <p className="text-gray-800 dark:text-gray-200 font-semibold">
              {skill.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ClientSkillsView;
