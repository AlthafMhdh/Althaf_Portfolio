import { useState } from "react";
import { FaBars } from "react-icons/fa";
import Sidebar from "./components/sidebar";
import ProfileForm from "./components/profile";
import AboutMe from "./components/aboutme";
import Skills from "./components/skills";
import Projects from "./components/projects";
import Education from "./components/education";
import Contact from "./components/contact";
import Experiences from "./components/experience";
import Certification from "./components/certifications";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("Profile");

  const handleMenuClick = (page: string) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar (desktop always visible, mobile slide-in) */}
      <Sidebar 
        isOpen={sidebarOpen} 
        closeSidebar={() => setSidebarOpen(false)} 
        onMenuClick={handleMenuClick} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header (visible on mobile only) */}
        <header className="md:hidden flex items-center justify-between bg-gray-200 p-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded hover:bg-gray-300 text-gray-700"
          >
            <FaBars />
          </button>
          <h1 className="text-sm font-semibold">
            Customize Your Portfolio Website
          </h1>
          <div></div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <h2 className="hidden md:block text-center text-gray-700 font-semibold border-b pb-2 mb-6">
            Customize Your Portfolio Website
          </h2>
          
          {activePage === "Profile" && <ProfileForm/>}
          {activePage === "About Me" && <AboutMe/>}
          {activePage === "Skills" && <Skills/>}
          {activePage === "Experience" && <Experiences/>}
          {activePage === "Projects" && <Projects/>}
          {activePage === "Certifications" && <Certification/>}
          {activePage === "Education" && <Education/>}
          {activePage === "Contact" && <Contact/>}
          {activePage === "Logout" && <div>Logout clicked</div>}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
