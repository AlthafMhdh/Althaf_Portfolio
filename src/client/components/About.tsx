import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase/config";

interface AboutData {
  about: string;
  photoUrl?: string;
  imagePosition: "left" | "right";
}

const AboutSection: React.FC = () => {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);

  useEffect(() => {
    const fetchAbout = async () => {
      const aboutRef = doc(db, "portfolio", "about");
      const aboutSnap = await getDoc(aboutRef);
      if (aboutSnap.exists()) {
        setAboutData(aboutSnap.data() as AboutData);
      }
    };
    fetchAbout();
  }, []);

  if (!aboutData) return null;

  return (
    <section id="about" className="py-16 px-6">
        <h3 className="text-xl font-bold text-center">Get to Know More</h3>
        <h3 className="text-5xl font-bold mb-10 text-center">About Me</h3>
        <div
            className={`flex flex-col md:flex-row items-center justify-center gap-10 max-w-5xl mx-auto ${
            aboutData.imagePosition === "right" ? "md:flex-row-reverse" : ""
            }`}
        >
            {/* Image */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-left">
            <img
                src={aboutData.photoUrl || "/profile.jpg"}
                alt="About me"
                className="w-54 h-54 md:w-72 md:h-72 object-cover rounded-4xl shadow-2xl border-4 hover:scale-105 transition-transform duration-300"
            />
            </div>

            {/* About Text */}
            <div className="w-full md:w-1/2 text-center md:text-left">
            <p className="text-lg leading-relaxed opacity-90">
                {aboutData.about || "No description available."}
            </p>
            </div>
        </div>
    </section>
  );
};

export default AboutSection;
