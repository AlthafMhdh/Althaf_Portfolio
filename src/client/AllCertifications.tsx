import { doc, getDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { db } from "../firebase/config";
import { Link } from "react-router-dom";

interface Certificate {
  id: string;
  courseName: string;
  duration: string;
  photoUrl?: string;
  createdAt?: any;
  updatedAt?: any;
}

const AllCertifications: React.FC = () => {
    const [darkMode, setDarkMode] = useState<boolean>(
        localStorage.getItem("theme") === "dark"
    );

    const [profile, setProfile] = useState<any>(null);
    const [clickCount, setClickCount] = useState(0);
    const [showLogin, setShowLogin] = useState(false);
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [footer, setFooter] = useState<any>(null);

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

    useEffect(() => {
        const fetchFooter = async () => {
          try {
            const footerRef = doc(db, "portfolio", "footer");
            const snap = await getDoc(footerRef);
            if (snap.exists()) {
              setFooter(snap.data());
            }
          } catch (error) {
            console.error("Error fetching footer:", error);
          }
        };
        fetchFooter();
      }, []);
  
    useEffect(() => {
      const fetchCertificates = async () => {
        try {
          const snap = await getDoc(doc(db, "portfolio", "certificates"));
          if (snap.exists()) {
            const data = snap.data();
            const allProjects = data.items || [];
            const reversed = [...allProjects].reverse();

            setCertificates(reversed);
          }
        } catch (error) {
          console.error("Error fetching projects:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchCertificates();
    }, []);

    const filteredCertificates = certificates.filter((c) =>
        c.courseName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
        <section className="py-16 px-6 text-center">
            <p className="text-gray-500 dark:text-gray-400"></p>
        </section>
        );
    }

 
    return (
        <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"} transition-all duration-300`}>
            {/* Navbar */}
            <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 shadow-sm backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
                <h1 className="text-2xl font-bold">
                    <Link
                        to="/"
                        className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
                    >
                        Althaf Portfolio
                    </Link>
                </h1>
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

            {/* Certificate Section */}
            <section className="py-16 px-6">
                <div className="px-6 md:px-12 py-10">
                    <h1 className="text-3xl font-bold mb-6 text-left">My All Certificates</h1>

                    {/* Search Bar */}
                    <div className="max-w-4xl mb-2">
                        <input
                        type="text"
                        placeholder="Search certificate..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                </div>

                <div className="max-w-7xl sm:mx-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredCertificates.map((certificate) => (
                    <div
                        key={certificate.id}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
                    >
                        <img
                        src={certificate.photoUrl}
                        alt={certificate.courseName}
                        className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold mb-2">{certificate.courseName}</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-3">
                                {certificate.duration}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300 mb-3">
                                {certificate.duration}
                            </p>
                        </div>
                    </div>
                    ))}

                    {filteredCertificates.length === 0 && (
                    <p className="text-center text-gray-500 col-span-full">
                        No certificates found.
                    </p>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-6 text-center border-t border-gray-300 dark:border-gray-700">
                {footer ? (
                <>
                    <p className="text-gray-700 dark:text-gray-300">
                    {footer.copyright || `© ${new Date().getFullYear()} Your Name. All rights reserved.`}
                    </p>
                    {footer.developedby && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Developed by {footer.developedby}
                    </p>
                    )}
                </>
                ) : (
                <p className="text-gray-500 dark:text-gray-400">
                    © {new Date().getFullYear()} Muhammadh Althaf. All rights reserved.
                </p>
                )}
            </footer>
        </div>
    );
};

export default AllCertifications;
