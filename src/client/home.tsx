// import React, { useEffect, useState } from "react";
// import { doc, getDoc } from "firebase/firestore";
// import { FaMoon, FaSun } from "react-icons/fa";
// import { db } from "../firebase/config";

// interface ProfileData {
//   name: string;
//   position: string;
//   startNote: string;
//   github: string;
//   linkedin: string;
//   photoUrl: string;
//   about?: string;
//   education?: { degree: string; institution: string; year: string }[];
//   experience?: { title: string; company: string; duration: string }[];
//   skills?: string[];
//   contact?: { email: string; phone: string; location: string };
// }

// const Home: React.FC = () => {
//   const [profile, setProfile] = useState<ProfileData | null>(null);
//   const [darkMode, setDarkMode] = useState<boolean>(
//     () => localStorage.getItem("theme") === "dark"
//   );

//   useEffect(() => {
//     const fetchData = async () => {
//       const docRef = doc(db, "portfolio", "profile");
//       const snap = await getDoc(docRef);
//       if (snap.exists()) setProfile(snap.data() as ProfileData);
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     document.documentElement.classList.toggle("dark", darkMode);
//     localStorage.setItem("theme", darkMode ? "dark" : "light");
//   }, [darkMode]);

//   if (!profile)
//     return (
//       <div className="flex items-center justify-center min-h-screen text-gray-500 dark:text-gray-300">
//         Loading portfolio...
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300 text-gray-800 dark:text-gray-200">
//       {/* Theme Toggle */}
//       <button
//         onClick={() => setDarkMode(!darkMode)}
//         title="Toggle theme"
//         className="fixed top-4 right-4 bg-gray-200 dark:bg-gray-700 p-2 rounded-full shadow-md hover:scale-105 transition"
//       >
//         {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
//       </button>

//       {/* Profile Header */}
//       <header className="flex flex-col items-center text-center pt-16 pb-10 px-4">
//         <img
//           src={profile.photoUrl}
//           alt="Profile"
//           className="w-32 h-32 sm:w-40 sm:h-40 rounded-full shadow-lg object-cover mb-4 border-4 border-indigo-500"
//         />
//         <h1 className="text-3xl sm:text-4xl font-bold">{profile.name}</h1>
//         <p className="text-indigo-600 dark:text-indigo-400 font-medium">
//           {profile.position}
//         </p>
//         <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">
//           {profile.startNote}
//         </p>
//         <div className="flex gap-4 mt-4">
//           <a
//             href={profile.github}
//             target="_blank"
//             rel="noreferrer"
//             className="text-indigo-500 hover:text-indigo-700"
//           >
//             GitHub
//           </a>
//           <a
//             href={profile.linkedin}
//             target="_blank"
//             rel="noreferrer"
//             className="text-indigo-500 hover:text-indigo-700"
//           >
//             LinkedIn
//           </a>
//         </div>
//       </header>

//       {/* About Section */}
//       {profile.about && (
//         <section className="max-w-4xl mx-auto px-6 py-10">
//           <h2 className="text-2xl font-semibold border-b-2 border-indigo-500 pb-2 mb-4">
//             About Me
//           </h2>
//           <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
//             {profile.about}
//           </p>
//         </section>
//       )}

//       {/* Education Section */}
//       {profile.education && profile.education.length > 0 && (
//         <section className="max-w-4xl mx-auto px-6 py-10">
//           <h2 className="text-2xl font-semibold border-b-2 border-indigo-500 pb-2 mb-4">
//             Education
//           </h2>
//           <div className="space-y-4">
//             {profile.education.map((edu, i) => (
//               <div
//                 key={i}
//                 className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-sm"
//               >
//                 <h3 className="font-semibold">{edu.degree}</h3>
//                 <p className="text-sm text-gray-500">
//                   {edu.institution} • {edu.year}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* Experience Section */}
//       {profile.experience && profile.experience.length > 0 && (
//         <section className="max-w-4xl mx-auto px-6 py-10">
//           <h2 className="text-2xl font-semibold border-b-2 border-indigo-500 pb-2 mb-4">
//             Experience
//           </h2>
//           <div className="space-y-4">
//             {profile.experience.map((exp, i) => (
//               <div
//                 key={i}
//                 className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-sm"
//               >
//                 <h3 className="font-semibold">{exp.title}</h3>
//                 <p className="text-sm text-gray-500">
//                   {exp.company} • {exp.duration}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* Skills Section */}
//       {profile.skills && profile.skills.length > 0 && (
//         <section className="max-w-4xl mx-auto px-6 py-10">
//           <h2 className="text-2xl font-semibold border-b-2 border-indigo-500 pb-2 mb-4">
//             Skills
//           </h2>
//           <div className="flex flex-wrap gap-3">
//             {profile.skills.map((skill, i) => (
//               <span
//                 key={i}
//                 className="px-4 py-2 bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 rounded-full text-sm font-medium"
//               >
//                 {skill}
//               </span>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* Contact Section */}
//       {profile.contact && (
//         <section className="max-w-4xl mx-auto px-6 py-10 text-center">
//           <h2 className="text-2xl font-semibold border-b-2 border-indigo-500 pb-2 mb-4">
//             Contact
//           </h2>
//           <p>{profile.contact.email}</p>
//           <p>{profile.contact.phone}</p>
//           <p>{profile.contact.location}</p>
//         </section>
//       )}

//       {/* Footer */}
//       <footer className="text-center py-6 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
//         © {new Date().getFullYear()} {profile.name}. All Rights Reserved.
//       </footer>
//     </div>
//   );
// };

// export default Home;


import React, { useState, useEffect } from "react";
import { FaMoon, FaSun, FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Home: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(
    localStorage.getItem("theme") === "dark"
  );

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

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"} transition-all duration-300`}>
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-gray-300 dark:border-gray-700">
        <h1 className="text-2xl font-bold">Althaf Portfolio</h1>
        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          title="Toggle Theme"
        >
          {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-700" />}
        </button>
      </header>

      {/* Profile Section */}
      <section className="flex flex-col sm:flex-row items-center justify-center py-16 px-6">
        <img
          src="/profile.jpg" // replace with your hosted profile image
          alt="Profile"
          className="w-40 h-40 sm:w-56 sm:h-56 rounded-full object-cover shadow-lg border-4 border-indigo-500 mb-6 sm:mb-0 sm:mr-10"
        />
        <div className="text-center sm:text-left max-w-xl">
          <h2 className="text-3xl font-bold mb-3">Muhammadh Althaf</h2>
          <p className="text-indigo-500 font-medium mb-2">Full Stack Developer</p>
          <p className="opacity-80 mb-4">
            Passionate about building modern, scalable web applications using
            React, Next.js, NestJS, and Firebase. Dedicated to crafting clean
            and user-friendly interfaces.
          </p>
          <div className="flex justify-center sm:justify-start space-x-4">
            <a href="mailto:althaf@example.com"><FaEnvelope className="text-2xl hover:text-indigo-500" /></a>
            <a href="https://github.com/althafmhdh" target="_blank"><FaGithub className="text-2xl hover:text-indigo-500" /></a>
            <a href="https://linkedin.com/in/althaf" target="_blank"><FaLinkedin className="text-2xl hover:text-indigo-500" /></a>
          </div>
        </div>
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
