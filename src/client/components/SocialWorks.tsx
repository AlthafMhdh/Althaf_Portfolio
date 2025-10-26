import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase/config";

interface SocialWork {
  id: string;
  soceityName: string;
  position: string;
  logoUrl: string;
  startDate: string;
  endDate: string;
  weblink?: string;
  present: boolean;
  createdAt?: any;
  updatedAt?: any;
}

const SocialWorkSection: React.FC = () => {
  const [socialworks, setSocialWorks] = useState<SocialWork[]>([]);

  useEffect(() => {
    const fetchSocialWorks = async () => {
      try {
        const ref = doc(db, "portfolio", "socialworks");
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setSocialWorks(data.items || []);
        }
      } catch (err) {
        console.error("Error fetching socialworks:", err);
      }
    };
    fetchSocialWorks();
  }, []);

  if (socialworks.length === 0) return null;

    const formatMonthYear = (value: string) => {
        if (!value) return "";
        const [year, month] = value.split("-");
        const date = new Date(Number(year), Number(month) - 1);
        return date.toLocaleString("en-US", { month: "short", year: "numeric" });
    };


  return (
    <section id="socialworks" className="py-8 px-6">
        {/* <h3 className="text-3xl font-bold mb-10 text-center">My SocialWorks</h3> */}

        <div className="text-center mb-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">My Social</p>
            <h2 className="text-4xl font-bold"> Contributions</h2>
            {/* <h2 className="text-4xl font-bold">Community Involvement</h2> */}
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {socialworks.map((exp) => (
            <div key={exp.id} className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 shadow hover:shadow-lg transition">
                <div className="flex justify-left items-center gap-6">
   
                    {/* Logo */}
                    {exp.logoUrl && (
                    <div className="flex justify-center mb-4">
                        <img
                        src={exp.logoUrl}
                        alt={exp.soceityName}
                        // className="w-20 h-20 object-contain rounded-full border border-gray-300 dark:border-gray-700"
                        className="w-20 h-20 object-contain rounded-md"
                        />
                    </div>
                    )}
                    <div>
                        <h4 className="text-md font-semibold text-left md:text-left">
                            {exp.soceityName}
                        </h4>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 text-left md:text-left">
                            {exp.position}
                        </p>
                        {/* <p className="text-indigo-500 mt-1 mb-2 text-left md:text-left">
                            {exp.startDate
                            ? `${exp.startDate} – ${exp.present ? "Present" : exp.endDate}`
                            : ""}
                        </p> */}
                        <p className="mt-1 mb-2 text-left md:text-left">
                            {exp.startDate
                            ? `${formatMonthYear(exp.startDate)} – ${
                                exp.present ? "Present" : formatMonthYear(exp.endDate)
                            }`
                            : ""}
                        </p>


                        {exp.weblink && (
                            <a
                                href={exp.weblink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                            >
                                Visit Website
                            </a>
                        )}
                    </div>
                </div>
            </div>
        ))}
      </div>
    </section>
  );
};

export default SocialWorkSection;
