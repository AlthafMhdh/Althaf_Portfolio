import { doc, getDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { db } from "../../firebase/config";

const Navbar: React.FC = () => {
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
    <div>
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 shadow-sm backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
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

          <a
            href={profile?.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 font-bold rounded-full bg-blue-600 text-white hover:bg-blue-700 transition hidden sm:inline-block"
            //className="px-6 py-2 border font-bold rounded-full text-black bg-gray-200 border-black transition-colors duration-300 hover:bg-black hover:text-white dark:bg-gray-800 dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
            title="View Resume"
          >
            My Resume
          </a>

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
    </div>
  );
};

export default Navbar;
