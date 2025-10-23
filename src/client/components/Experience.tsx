import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase/config";

interface Experience {
  id: string;
  companyName: string;
  position: string;
  projectInvolvement: string;
  logoUrl: string;
  address: string;
  startDate: string;
  endDate: string;
  duration: string;
  present: boolean;
}

const ExperienceSection: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const ref = doc(db, "portfolio", "experiances");
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setExperiences(data.items || []);
        }
      } catch (err) {
        console.error("Error fetching experiences:", err);
      }
    };
    fetchExperiences();
  }, []);

  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="py-16 px-6">
      <h3 className="text-3xl font-bold mb-10 text-center">My Experience</h3>

      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-1 gap-6">
        {experiences.map((exp) => (
            <div key={exp.id} className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 shadow hover:shadow-lg transition">
                <div className="flex justify-left items-center gap-6">

            
                    {/* Logo */}
                    {exp.logoUrl && (
                    <div className="flex justify-center mb-4">
                        <img
                        src={exp.logoUrl}
                        alt={exp.companyName}
                        className="w-15 h-15 object-contain rounded-full border border-gray-300 dark:border-gray-700"
                        />
                    </div>
                    )}
                    <div>
                        <h4 className="text-xl font-semibold text-left md:text-left">
                            {exp.position} - {exp.companyName}
                        </h4>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 text-left md:text-left">
                            {exp.address}
                        </p>
                        <p className="text-indigo-500 mb-2 text-left md:text-left">
                            {exp.startDate
                            ? `${exp.startDate} – ${exp.present ? "Present" : exp.endDate}`
                            : ""}
                        </p>
                    </div>
                </div>

                {/* Project / Work Summary */}
                <p className="opacity-80 text-left md:text-left">
                {exp.projectInvolvement}
                </p>
            </div>
        ))}
      </div>
    </section>
  );
};

export default ExperienceSection;
