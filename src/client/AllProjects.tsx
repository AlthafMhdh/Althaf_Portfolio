// import { useState } from "react";

// interface Project {
//   id: string;
//   title: string;
//   description: string;
//   image: string;
//   link: string;
// }

// const AllProjects: React.FC = () => {
//   const [searchTerm, setSearchTerm] = useState("");

//   // 🔹 Example data — replace with your real project list or fetched data
//   const projects: Project[] = [
//     {
//       id: "1",
//       title: "Portfolio Website",
//       description: "A personal portfolio built with React and Firebase.",
//       image: "/images/portfolio.png",
//       link: "https://yourportfolio.com",
//     },
//     {
//       id: "2",
//       title: "E-commerce Dashboard",
//       description: "Admin dashboard for managing products and orders.",
//       image: "/images/dashboard.png",
//       link: "#",
//     },
//     {
//       id: "3",
//       title: "Resume Builder App",
//       description: "A web app to create professional resumes instantly.",
//       image: "/images/resume-builder.png",
//       link: "#",
//     },
//     {
//       id: "4",
//       title: "Chat App",
//       description: "A real-time chat app with Firebase authentication.",
//       image: "/images/chatapp.png",
//       link: "#",
//     },
//   ];

//   // 🔍 Filter projects based on search input
//   const filteredProjects = projects.filter((p) =>
//     p.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="px-6 md:px-12 py-10">
//       {/* Page Title */}
//       <h1 className="text-3xl font-bold mb-6 text-center">My All Projects</h1>

//       {/* Search Bar */}
//       <div className="max-w-md mx-auto mb-10">
//         <input
//           type="text"
//           placeholder="Search projects..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
//         />
//       </div>

//       {/* Projects Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//         {filteredProjects.map((project) => (
//           <div
//             key={project.id}
//             className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
//           >
//             <img
//               src={project.image}
//               alt={project.title}
//               className="w-full h-48 object-cover"
//             />
//             <div className="p-4">
//               <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
//               <p className="text-gray-600 dark:text-gray-300 mb-3">
//                 {project.description}
//               </p>
//               <a
//                 href={project.link}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-block mt-2 px-4 py-2 border border-black rounded-full text-sm font-semibold hover:bg-black hover:text-white transition"
//               >
//                 View Project
//               </a>
//             </div>
//           </div>
//         ))}

//         {filteredProjects.length === 0 && (
//           <p className="text-center text-gray-500 col-span-full">
//             No projects found.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllProjects;



import { doc, getDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { FaMoon, FaSun, FaGithub, FaLinkedin } from "react-icons/fa";
import { db } from "../firebase/config";

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
      const fetchProjects = async () => {
        try {
          const snap = await getDoc(doc(db, "portfolio", "projects"));
          if (snap.exists()) {
            const data = snap.data();
            const allProjects = data.items || [];
            // Sort by date (newest first)
            const sorted = allProjects.sort(
              (a: Project, b: Project) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            // Take the latest 3
            setProjects(sorted.slice(0, 3));
          }
        } catch (error) {
          console.error("Error fetching projects:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProjects();
    }, []);

 
  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"} transition-all duration-300`}>
      {/* Navbar */}
      {/* <header className="flex justify-between items-center px-6 py-4 border-b border-gray-300 dark:border-gray-700"> */}
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

      {/* Project Section */}
      <section className="flex flex-col mt-16 sm:mt-16  sm:flex-row items-center justify-center py-16 px-6 sm:gap-x-10 lg:gap-x-10">
        {/* {profile && (
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

              <div className="flex justify-center mt-6 sm:justify-start sm:hidden space-x-4">
                <a
                  href={profile.resumeUrl} // link to resume PDF
                  target="_blank"
                  rel="noopener noreferrer"
                  //className="px-6 py-2 border font-bold rounded-full text-black bg-gray-200 border-black transition-colors duration-300 hover:bg-black hover:text-white dark:bg-gray-800 dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
                className="px-6 py-2 font-bold rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  View Resume
                </a>
              </div>
            </div>
          </>
        )} */}
            <div className="px-6 md:px-12 py-10">
            {/* Page Title */}
                <h1 className="text-3xl font-bold mb-6 text-center">My All Projects</h1>

                {/* Search Bar */}
                <div className="max-w-md mx-auto mb-10">
                    <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                </div>
            </div>
        </section>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-gray-300 dark:border-gray-700">
        <p>© {new Date().getFullYear()} Muhammadh Althaf. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AllProjects;
