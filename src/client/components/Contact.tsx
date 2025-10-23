import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
  FaLinkedin,
  FaMapMarkerAlt,
} from "react-icons/fa";

const ClientContactView: React.FC = () => {
  const [contact, setContact] = useState<any>(null);

  useEffect(() => {
    const fetchContact = async () => {
      const docRef = doc(db, "portfolio", "contact");
      const snap = await getDoc(docRef);
      if (snap.exists()) setContact(snap.data());
    };
    fetchContact();
  }, []);

  if (!contact) return null;

  return (
    <section
      id="contact"
      className="py-16 px-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
    >
      <div className="text-center mb-12">
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Get In Touch
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">
          Contact Me
        </h2>
      </div>

      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-2xl p-8 md:p-10 transition-all">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 text-center">
          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="flex flex-col items-center space-y-3 group transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 group-hover:bg-blue-200 dark:group-hover:bg-blue-700 transition">
                <FaPhoneAlt className="text-blue-600 dark:text-blue-300 text-2xl" />
              </div>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {contact.phone}
              </p>
            </a>
          )}

          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="flex flex-col items-center space-y-3 group transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-700 transition">
                <FaEnvelope className="text-indigo-600 dark:text-indigo-300 text-2xl" />
              </div>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {contact.email}
              </p>
            </a>
          )}

          {/* {contact.address && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                contact.address
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center space-y-3 group transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 group-hover:bg-green-200 dark:group-hover:bg-green-700 transition">
                <FaMapMarkerAlt className="text-green-600 dark:text-green-300 text-2xl" />
              </div>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {contact.address}
              </p>
            </a>
          )} */}
        </div>

        {(contact.facebook ||
          contact.instagram ||
          contact.whatsapp ||
          contact.tiktok ||
          contact.linkedin) && (
          <div className="mt-10 flex justify-center space-x-6">
            {contact.facebook && (
              <a
                href={contact.facebook}
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-700 transition"
              >
                <FaFacebook className="text-blue-600 dark:text-blue-300 text-xl" />
              </a>
            )}

            {contact.instagram && (
              <a
                href={contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-100 hover:bg-pink-200 dark:bg-pink-900 dark:hover:bg-pink-700 transition"
              >
                <FaInstagram className="text-pink-600 dark:text-pink-300 text-xl" />
              </a>
            )}

            {contact.whatsapp && (
              <a
                href={`https://wa.me/${contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-700 transition"
              >
                <FaWhatsapp className="text-green-600 dark:text-green-300 text-xl" />
              </a>
            )}

            {contact.tiktok && (
              <a
                href={contact.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                title="TikTok"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 transition"
              >
                <FaTiktok className="text-gray-900 dark:text-white text-xl" />
              </a>
            )}

            {contact.linkedin && (
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-700 transition"
              >
                <FaLinkedin className="text-blue-600 dark:text-blue-300 text-xl" />
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ClientContactView;
