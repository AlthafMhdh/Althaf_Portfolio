import { doc, getDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { db } from "../firebase/config";
import { Link } from "react-router-dom";
import { IoIosClose } from "react-icons/io";

interface Project {
  id: string;
  projectName: string;
  about: string;
  technologies: string;
  github?: string;
  website?: string;
  photoUrl?: string;
  createdAt?: any;
  updatedAt?: any;
}

const AllProjects: React.FC = () => {
    const [darkMode, setDarkMode] = useState<boolean>(
        localStorage.getItem("theme") === "dark"
    );

    const [profile, setProfile] = useState<any>(null);
    const [clickCount, setClickCount] = useState(0);
    const [showLogin, setShowLogin] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [footer, setFooter] = useState<any>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
      const fetchProjects = async () => {
        try {
          const snap = await getDoc(doc(db, "portfolio", "projects"));
          if (snap.exists()) {
            const data = snap.data();
            const allProjects = data.items || [];
            // Sort by date (newest first)
            // const sorted = allProjects.sort(
            //   (a: Project, b: Project) =>
            //     new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            // );
            // setProjects(sorted);

            // Reverse order by index (last added first)
            const reversed = [...allProjects].reverse();

            setProjects(reversed);
          }
        } catch (error) {
          console.error("Error fetching projects:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProjects();
    }, []);

    const filteredProjects = projects.filter((p) =>
        p.projectName.toLowerCase().includes(searchTerm.toLowerCase())
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

            {/* Project Section */}
            <section className="py-16 px-6">
                <div className="px-6 md:px-12 py-10">
                    <h1 className="text-3xl font-bold mb-6 text-left">My All Projects</h1>

                    {/* Search Bar */}
                    <div className="max-w-4xl mb-2">
                        <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                </div>

                <div className="max-w-7xl sm:mx-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProjects.map((project) => (
                    <div
                        key={project.id}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
                    >
                        <img
                        src={project.photoUrl}
                        alt={project.projectName}
                        className="w-full h-48 object-cover"
                        onClick={() => setSelectedImage(project.photoUrl || "/placeholder.jpg")}
                        />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold mb-2">{project.projectName}</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-3">
                                {project.about}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300 mb-3">
                                {project.technologies}
                            </p>

                            <div className="flex justify-start sm:justify-start space-x-4">
                                {project.github && (
                                <a
                                    href={project.github}
                                    target="_blank"
                                    title="GitHub"
                                    rel="noopener noreferrer"
                                    className="inline-block mt-2 px-4 py-2 border border-black rounded-full text-sm font-semibold hover:bg-black hover:text-white transition dark:hover:bg-indigo-500"
                                >
                                    View Github
                                </a>
                                )}
                                {project.website && (
                                <a
                                    href={project.website}
                                    target="_blank"
                                    title="Website"
                                    rel="noopener noreferrer"
                                    className="inline-block mt-2 px-4 py-2 border border-black rounded-full text-sm font-semibold hover:bg-black hover:text-white transition dark:hover:bg-indigo-500"
                                >
                                    Live Demo
                                </a>
                                )}
                            </div>

                        </div>
                    </div>
                    ))}

                    {filteredProjects.length === 0 && (
                    <p className="text-center text-gray-500 col-span-full">
                        No projects found.
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


            {/* Image Popup Modal */}
                        {selectedImage && (
                            <div
                                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                                onClick={() => setSelectedImage(null)}
                            >
                                <div
                                    className="relative max-w-md w-100 mx-4 bg-white dark:bg-gray-900 rounded-lg p-1"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        onClick={() => setSelectedImage(null)}
                                        className="absolute top-3 right-3 bg-gray-200 dark:bg-gray-700 rounded-full text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                                    >
                                        {/* ✕ */} <IoIosClose size={20}/>
                                    </button>
                                    <img
                                        src={selectedImage}
                                        alt="Project"
                                        className="w-100 h-70 rounded-lg"
                                    />
                                </div>
                            </div>
                        )}

        </div>
    );
};

export default AllProjects;
