import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";

interface Achievements {
  id: string;
  achievementName: string;
  year: string;
  photoUrl?: string;
  createdAt?: any;
  updatedAt?: any;
}

const AwardsSection: React.FC = () => {
    const [achievements, setAchievements] = useState<Achievements[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAchievements = async () => {
        try {
            const snap = await getDoc(doc(db, "portfolio", "achievements"));
            if (snap.exists()) {
            const data = snap.data();
            const allachievements = data.items || [];

            const reversed = [...allachievements].reverse();

            setAchievements(reversed);
            }
        } catch (error) {
            console.error("Error fetching achievements:", error);
        } finally {
            setLoading(false);
        }
        };
        fetchAchievements();
    }, []);

    if (loading) {
        return (
        <section className="py-8 px-6 text-center">
            <p className="text-gray-500 dark:text-gray-400"></p>
        </section>
        );
    }

    if (achievements.length === 0) return null;

    return (
        <section id="achievements" className="py-16 px-6">
            {/* <h3 className="text-3xl font-bold mb-10 text-center text-gray-800 dark:text-white">
                My Achievements
            </h3> */}
            <div className="text-center mb-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">My</p>
                <h2 className="text-4xl font-bold">Achievements</h2>
            </div>

            {/* <div className="flex justify-center">
                <div className="w-full max-w-6xl overflow-x-auto scroll-smooth px-2 [scrollbar-width:none] [ms-overflow-style:none]">
                    <div className="flex gap-8 justify-center flex-wrap">

                        {achievements.map((achievement) => (
                        <div
                            key={achievement.id}
                            className="flex flex-col items-center"
                        >
                            <img
                                src={achievement.photoUrl || "/placeholder.jpg"}
                                alt={achievement.year}
                                className="w-48 h-48 object-cover rounded-lg dark:shadow-gray-800"
                            />
                            <div className="mt-3 text-center">
                                <h4 className="text-base font-semibold text-gray-800 dark:text-white">
                                {achievement.achievementName}
                                </h4>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                {achievement.year}
                                </p>

                            </div>
                        </div>
                        ))}

                    </div>
                </div> */}

                {/* Desktop scroll view */}
                <div className="hidden sm:block">
                    <div className="w-full max-w-6xl mx-auto overflow-x-auto scroll-smooth px-2 [scrollbar-width:none] [ms-overflow-style:none]">
                    <div className="flex gap-8 justify-start">
                        {achievements.map((achievement) => (
                        <div
                            key={achievement.id}
                            className="flex flex-col items-center flex-shrink-0"
                        >
                            <img
                                src={achievement.photoUrl || "/placeholder.jpg"}
                                alt={achievement.achievementName}
                                className="w-48 h-48 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                            />
                            <div className="mt-3 text-center">
                                <h4 className="text-base font-semibold text-gray-800 dark:text-white">
                                    {achievement.achievementName}
                                </h4>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    {achievement.year}
                                </p>
                            </div>
                        </div>
                        ))}
                    </div>
                    </div>
                </div>

                {/* Mobile grid view */}
                <div className="sm:hidden grid grid-cols-3 gap-6 justify-items-center">
                    {achievements.map((achievement) => (
                    <div
                        key={achievement.id}
                        className="flex flex-col items-center"
                    >
                        <img
                        src={achievement.photoUrl || "/placeholder.jpg"}
                        alt={achievement.achievementName}
                        className="w-36 h-36 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                        />
                        <div className="mt-2 text-center">
                        <h4 className="text-sm font-semibold text-gray-800 dark:text-white">
                            {achievement.achievementName}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">
                            {achievement.year}
                        </p>
                        </div>
                    </div>
                ))}



            </div>

        </section>
    );
};

export default AwardsSection;
