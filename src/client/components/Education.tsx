import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase/config";

interface Education {
  id: string;
  level: "Higher Education" | "Professional Qualification" | "School Education";
  educationName: string;
  grade?: string;
  instituteName?: string;
  logoUrl?: string;
  address: string;
  startYear?: string;
  endYear?: string;
  duration?: string;
}

const EducationSection: React.FC = () => {
  const [educations, setEducations] = useState<Education[]>([]);

  useEffect(() => {
    const fetchEducations = async () => {
      const ref = doc(db, "portfolio", "educations");
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setEducations(data.items || []);
      }
    };
    fetchEducations();
  }, []);

  if (educations.length === 0) return null;

  // Group by level
  const grouped = educations.reduce<Record<string, Education[]>>((acc, edu) => {
    if (!acc[edu.level]) acc[edu.level] = [];
    acc[edu.level].push(edu);
    return acc;
  }, {});

  const levelsOrder = [
    "Higher Education",
    "School Education",
    "Professional Qualification",
  ];

  return (
    <section id="education" className="py-16 px-6">
      <div className="text-center mb-12">
        <p className="text-gray-600 dark:text-gray-400 text-lg">My Educational</p>
        <h2 className="text-4xl font-bold">Qualification's</h2>
      </div>

      <div className="max-w-6xl mx-auto space-y-10">
        {levelsOrder.map(
          (level) =>
            grouped[level]?.length > 0 && (
              <div key={level}>
                <h3 className="text-xl font-semibold mb-4">{level}</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {grouped[level].map((edu) => (
                    <div
                      key={edu.id}
                      className="flex items-center gap-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 shadow hover:shadow-md transition"
                    >
                      {/* Logo */}
                      {edu.logoUrl && (
                        <img
                          src={edu.logoUrl}
                          alt={edu.educationName}
                        //   className="w-16 h-16 object-contain rounded-md border border-gray-200 dark:border-gray-600"
                        className="w-16 h-16 object-contain rounded-md"
                        />
                      )}

                      {/* Details */}
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                          {edu.educationName}
                          {edu.instituteName && (
                            <>
                              {" "}
                              -{" "}
                              <span className="font-normal text-gray-700 dark:text-gray-300">
                                {edu.instituteName}
                              </span>
                            </>
                          )}
                        </h4>

                        {edu.level === "Higher Education" && edu.grade && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Grade - {edu.grade}
                          </p>
                        )}

                        {/* {edu.duration && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Duration - {edu.duration}
                          </p>
                        )} */}

                        {edu.level === "School Education" && edu.address && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {edu.address}
                          </p>
                        )}

                        {(edu.startYear || edu.endYear) && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {edu.startYear && edu.endYear
                              ? `${edu.startYear} - ${edu.endYear}`
                              : edu.startYear}
                          </p>
                        )}

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
        )}
      </div>
    </section>
  );
};

export default EducationSection;
