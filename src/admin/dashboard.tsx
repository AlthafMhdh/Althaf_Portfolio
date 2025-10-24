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
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import Footer from "./components/footer";
import SocialService from "./components/socialworks";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("Profile");
  const navigate = useNavigate();

  const handleMenuClick = (page: string) => {
    if (page === "Logout") {
      signOut(auth)
        .then(() => {
          navigate("/login");
        })
        .catch((error) => console.error("Logout error:", error));
      return;
    }
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
        activePage={activePage}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header (visible on mobile only) */}
        <header className="md:hidden flex items-center justify-between bg-gray-200 p-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded hover:bg-gray-300 text-gray-700"
            title="Toggle Sidebar"
            aria-label="Toggle Sidebar"
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
          {activePage === "Footer" && <Footer/>}
          {activePage === "Social & Club" && <SocialService/>}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
