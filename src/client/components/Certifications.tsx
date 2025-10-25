import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";

interface Certificate {
  id: string;
  courseName: string;
  duration: string;
  photoUrl?: string;
  createdAt?: any;
  updatedAt?: any;
}

const CertificationsSection: React.FC = () => {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCertificates = async () => {
        try {
            const snap = await getDoc(doc(db, "portfolio", "certificates"));
            if (snap.exists()) {
            const data = snap.data();
            const allcertificates = data.items || [];

            const reversed = [...allcertificates].reverse();

            setCertificates(reversed.slice(0,4));
            }
        } catch (error) {
            console.error("Error fetching certificates:", error);
        } finally {
            setLoading(false);
        }
        };
        fetchCertificates();
    }, []);

    if (loading) {
        return (
        <section className="py-16 px-6 text-center">
            <p className="text-gray-500 dark:text-gray-400"></p>
        </section>
        );
    }

    if (certificates.length === 0) return null;

    return (
        <section id="certificates" className="py-16 px-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <h3 className="text-3xl font-bold mb-10 text-center text-gray-800 dark:text-white">
                My Certificates
            </h3>
            {/* <div className="text-center mb-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">My Educational</p>
                <h2 className="text-4xl font-bold">Certificates</h2>
            </div> */}

            <div className="flex justify-center">
                <div className="w-full max-w-6xl overflow-x-auto scroll-smooth px-2 [scrollbar-width:none] [ms-overflow-style:none]">
                    <div className="flex gap-6">

                        {certificates.map((certificate) => (
                        <div
                            key={certificate.id}
                            className="min-w-[280px] sm:min-w-[320px] bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1 duration-300"
                        >
                            <img
                                src={certificate.photoUrl || "/placeholder.jpg"}
                                alt={certificate.courseName}
                                className="w-full h-40 object-cover rounded-t-2xl"
                            />
                            <div className="p-4">
                                <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                                {certificate.courseName}
                                </h4>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 line-clamp-3">
                                {certificate.duration}
                                </p>
                                <p className="text-xs text-indigo-500 mt-2 font-medium">
                                {certificate.duration}
                                </p>

                            </div>
                        </div>
                        ))}

                        {certificates.length >= 3 && (
                            <div
                                onClick={() => (window.location.href = "/certificates")}
                                className="min-w-[280px] sm:min-w-[320px] flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl text-white cursor-pointer shadow hover:shadow-xl hover:-translate-y-1 transition duration-300"
                            >
                                <p className="text-xl font-bold">View All Certificates →</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CertificationsSection;
