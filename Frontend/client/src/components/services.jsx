import React from "react";
import {
  FaMicroscope,
  FaHeartbeat,
  FaClinicMedical,
  FaTools,
  FaUserMd,
  FaShieldAlt,
  FaSyringe,
  FaHospital,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function HomeServices() {
  const navigate = useNavigate();
  const services = [
    {
      title: "Medical Equipment Supply",
      icon: <FaHeartbeat className="text-white text-5xl mb-4" />,
      description:
        "Comprehensive range of diagnostic and therapeutic medical devices from global manufacturers. Certified quality assurance.",
    },
    {
      title: "Laboratory Reagents",
      icon: <FaMicroscope className="text-white text-5xl mb-4" />,
      description:
        "High-precision reagents for clinical laboratories. Strict cold-chain logistics for sensitive materials.",
    },
    {
      title: "Equipment Installation",
      icon: <FaClinicMedical className="text-white text-5xl mb-4" />,
      description:
        "Certified installation of biomedical devices with full calibration and staff training.",
    },
    {
      title: "Preventive Maintenance",
      icon: <FaTools className="text-white text-5xl mb-4" />,
      description:
        "Scheduled maintenance programs to ensure optimal equipment performance and longevity.",
    },
    {
      title: "Technical Training",
      icon: <FaUserMd className="text-white text-5xl mb-4" />,
      description:
        "Specialized training for hospital technicians on equipment operation and troubleshooting.",
    },
    {
      title: "Emergency Repair",
      icon: <FaShieldAlt className="text-white text-5xl mb-4" />,
      description:
        "24/7 rapid response team for critical equipment failures with guaranteed SLAs.",
    },
  ];

  return (
    <div className="py-16 bg-gradient-to-br from-primaryColor to-blue-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our Biomedical Services
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Comprehensive solutions for healthcare technology management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="relative group bg-white/10 backdrop-blur-sm rounded-xl p-8 transition-all duration-300 hover:bg-white/20 border border-white/20 hover:border-white/40"
            >
              <div className="flex flex-col items-center text-center h-full">
                <div className="mb-6 transform group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {service.title}
                </h3>
                <p className="text-blue-100 leading-relaxed flex-grow">
                  {service.description}
                </p>
                <button
                  onClick={() => navigate("/about")}
                  className="mt-6 px-6 py-2 bg-white text-primaryColor rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
