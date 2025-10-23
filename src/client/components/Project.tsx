import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";

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

const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <section className="py-16 px-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">Loading projects...</p>
      </section>
    );
  }

  return (
    <section id="projects" className="py-16 px-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <h3 className="text-3xl font-bold mb-10 text-center text-gray-800 dark:text-white">
            My Latest Projects
        </h3>

        <div className="overflow-x-auto scroll-smooth [scrollbar-width:none] [ms-overflow-style:none]">
            <div className="max-w-6xl mx-auto flex gap-6 px-2 [scrollbar-width:none]">

                {projects.map((project) => (
                <div
                    key={project.id}
                    className="min-w-[280px] sm:min-w-[320px] bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1 duration-300"
                >
                    <img
                        src={project.photoUrl || "/placeholder.jpg"}
                        alt={project.projectName}
                        className="w-full h-40 object-cover rounded-t-2xl"
                    />
                    <div className="p-4">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {project.projectName}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 line-clamp-3">
                        {project.about}
                        </p>
                        <p className="text-xs text-indigo-500 mt-2 font-medium">
                        {project.technologies}
                        </p>

                        <div className="flex gap-4 mt-4">
                        {project.github && (
                            <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="GitHub"
                            className="text-indigo-500 hover:text-indigo-400 text-sm font-semibold"
                            >
                            GitHub
                            </a>
                        )}
                        {project.website && (
                            <a
                            href={project.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Live Demo"
                            className="text-indigo-500 hover:text-indigo-400 text-sm font-semibold"
                            >
                            Live Demo
                            </a>
                        )}
                        </div>
                    </div>
                </div>
                ))}

                <div
                    onClick={() => (window.location.href = "/projects")}
                    className="min-w-[280px] sm:min-w-[320px] flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl text-white cursor-pointer shadow hover:shadow-xl hover:-translate-y-1 transition duration-300"
                >
                    <p className="text-xl font-bold">View All Projects →</p>
                </div>
            </div>
        </div>
    </section>
  );
};

export default ProjectsSection;
