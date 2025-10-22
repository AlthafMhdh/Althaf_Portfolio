import { doc, getDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { FaMoon, FaSun, FaGithub, FaLinkedin } from "react-icons/fa";
import { db } from "../firebase/config";

const Home: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(
    localStorage.getItem("theme") === "dark"
  );

  const [profile, setProfile] = useState<any>(null);
  const [clickCount, setClickCount] = useState(0);
  const [showLogin, setShowLogin] = useState(false);

  const handleSecretClick = () => {
    setClickCount((prev) => {
      const newCount = prev + 1;
      const count = clickCount + 1;
      console.log(count);
      if (newCount >= 3) {
        setShowLogin(true);
        setClickCount(0);
      }
      return newCount;
    });
  };

  // Hide login button after 5 seconds
  useEffect(() => {
    if (showLogin) {
      const timer = setTimeout(() => setShowLogin(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showLogin]);

  // handle theme toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const fetchProfile = async () => {
      const docRef = doc(db, "portfolio", "profile");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
    };
    fetchProfile();
  }, []);


  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"} transition-all duration-300`}>
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-gray-300 dark:border-gray-700">
        <h1 className="text-2xl font-bold">Althaf Portfolio</h1>
        <div className="flex justify-between items-center gap-x-4 ">

          {showLogin ? (
            <button
              type="button"
              onClick={() => (window.location.href = "/login")}
              className="px-4 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
              title="Go to Login"
            >
              Login
            </button>
          ): 
            <button
              onClick={handleSecretClick}
              title="Hidden Area"
              className="w-6 h-6 rounded-full bg-transparent hover:bg-transparent focus:outline-none"
            >
            </button>
          } 

          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            title="Toggle Theme"
          >
            {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-700" />}
          </button>
        </div>
      </header>

      {/* Profile Section */}
      <section className="flex flex-col sm:flex-row items-center justify-center py-16 px-6 sm:gap-x-10 lg:gap-x-10">
        {profile && (
          <>
            <img
              src={profile.photoUrl ||"/profile.jpg"}
              alt="Profile"
              //className="w-40 h-40 sm:w-84 sm:h-84 rounded-full object-cover shadow-lg border-4 border-indigo-500 mb-6 sm:mb-0 sm:mr-10"
              className="w-44 h-44 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full object-cover shadow-2xl border-4 border-indigo-500 mb-6 sm:mb-0 transition-transform duration-300 hover:scale-105"
            />
            <div className="text-center sm:text-left max-w-xl">
              <p className="text-2xl font-medium mb-2">{profile.startNote}</p>
              <h1 className="text-4xl font-bold mb-3">{profile.name}</h1>
              <p className="text-2xl text-indigo-500 font-medium mb-2">{profile.position}</p>
              <p className="opacity-80 mb-4">{profile.note}</p>
              <div className="flex justify-center sm:justify-start space-x-4">
                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    title="GitHub"
                    rel="noopener noreferrer"
                  >
                    <FaGithub className="text-4xl hover:text-indigo-500" />
                  </a>
                )}
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    title="Linkedin"
                    rel="noopener noreferrer"
                  >
                    <FaLinkedin className="text-4xl hover:text-indigo-500" />
                  </a>
                )}
              </div>
            </div>
          </>
        )}
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-6 bg-gray-100 dark:bg-gray-800">
        <h3 className="text-3xl font-bold mb-6 text-center">About Me</h3>
        <p className="max-w-3xl mx-auto text-center opacity-80 leading-relaxed">
          I’m a self-driven software developer with experience in modern
          full-stack technologies. I love solving challenging problems,
          optimizing performance, and collaborating with teams to build
          innovative solutions.
        </p>
      </section>

      {/* Qualification */}
      <section id="education" className="py-16 px-6">
        <h3 className="text-3xl font-bold mb-10 text-center">Education</h3>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold">BSc in Computer Science</h4>
            <p className="text-indigo-500">University of Colombo (2019–2023)</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold">Diploma in Software Engineering</h4>
            <p className="text-indigo-500">IJSE — 2022</p>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="py-16 px-6 bg-gray-100 dark:bg-gray-800">
        <h3 className="text-3xl font-bold mb-10 text-center">Experience</h3>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold">Full Stack Developer - Freelance</h4>
            <p className="text-indigo-500 mb-2">2023 – Present</p>
            <p className="opacity-80">
              Worked on multiple web applications using React, Next.js, NestJS,
              Firebase, and MongoDB. Focused on responsive UI, backend APIs, and
              cloud integration.
            </p>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="py-16 px-6">
        <h3 className="text-3xl font-bold mb-10 text-center">Skills</h3>
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-center">
          {["React", "Next.js", "NestJS", "Firebase", "MongoDB", "Node.js", "MySQL", "TailwindCSS"].map(skill => (
            <div
              key={skill}
              className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-lg hover:scale-105 transition"
            >
              {skill}
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 px-6 bg-gray-100 dark:bg-gray-800">
        <h3 className="text-3xl font-bold mb-10 text-center">Contact</h3>
        <form className="max-w-lg mx-auto bg-white dark:bg-gray-900 p-8 rounded-xl shadow space-y-4">
          <input type="text" placeholder="Your Name" className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800" />
          <input type="email" placeholder="Your Email" className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800" />
          <textarea placeholder="Your Message" className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 h-32" />
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium">
            Send Message
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-gray-300 dark:border-gray-700">
        <p>© {new Date().getFullYear()} Muhammadh Althaf. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
