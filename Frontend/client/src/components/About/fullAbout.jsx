import React from "react";
import {
  FaUsers,
  FaMicroscope,
  FaHospital,
  FaTools,
  FaCalendarAlt,
  FaStar,
  FaRocket,
  FaHeart,
  FaShieldAlt,
  FaClinicMedical,
} from "react-icons/fa";

import Logo from "../../assets/Logo.jpg";
import ShardBanner from "../shared/sharedBanner";

export default function FullAbout() {
  const teamMembers = [
    {
      name: "Liyat",
      role: "CEO & Founder",
      specialization: "Biomedical Engineering",
      image: "assets/team/team.jpg",
    },
    {
      name: "Eng. Selamawit Assefa",
      role: "Technical Director",
      specialization: "Medical Equipment Maintenance",
      image: "assets/team/team.jpg",
    },
    {
      name: "Dr. Yohannes Mekonnen",
      role: "Clinical Specialist",
      specialization: "Laboratory Diagnostics",
      image: "assets/team/team.jpg",
    },
  ];

  const coreValues = [
    {
      icon: <FaStar className="text-2xl" />,
      title: "Technical Excellence",
      description: "Precision in equipment calibration and maintenance",
    },
    {
      icon: <FaMicroscope className="text-2xl" />,
      title: "Innovation",
      description: "Adopting cutting-edge biomedical technologies",
    },
    {
      icon: <FaHeart className="text-2xl" />,
      title: "Patient-Centric",
      description: "Ensuring reliable diagnostics for better healthcare",
    },
    {
      icon: <FaShieldAlt className="text-2xl" />,
      title: "Integrity",
      description: "Ethical practices in all our operations",
    },
    {
      icon: <FaClinicMedical className="text-2xl" />,
      title: "Healthcare Partnership",
      description: "Collaborating with medical institutions",
    },
    {
      icon: <FaTools className="text-2xl" />,
      title: "Reliability",
      description: "24/7 support for critical equipment",
    },
  ];

  return (
    <div className="font-sans bg-gray-50">
      {/* Hero Banner */}
      <ShardBanner
        title={"About Us"}
        subtitle={"Precision in Biomedical Engineering"}
      />

      {/* Company Description */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              <FaHospital className="inline-block mr-3 text-primaryColor" />
              Agegn General Biomedical Engineering
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Established in 2020, Agegn Biomedical is Ethiopia's premier
              provider of medical equipment, laboratory reagents, and biomedical
              engineering services. We specialize in installation, maintenance,
              and technical support for hospitals and diagnostic centers
              nationwide, ensuring healthcare providers have access to reliable,
              cutting-edge technology.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden shadow-2xl border-4 border-white">
            <img
              src={Logo}
              alt="Biomedical Equipment"
              className="w-full h-96 object-contain bg-gray-100 p-4"
            />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-r from-primaryColor to-blue-800">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="p-8 bg-white rounded-2xl shadow-xl">
            <FaRocket className="text-4xl mb-6 text-primaryColor" />
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              Our Vision
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              To transform healthcare in Ethiopia through advanced biomedical
              engineering solutions, becoming the most trusted partner for
              medical institutions nationwide.
            </p>
          </div>

          <div className="p-8 bg-white rounded-2xl shadow-xl">
            <FaTools className="text-4xl mb-6 text-primaryColor" />
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              Our Mission
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              To provide comprehensive biomedical equipment services with
              technical excellence, ensuring uninterrupted diagnostic and
              therapeutic capabilities for healthcare providers.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section - Medical Professionals */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            <FaUsers className="inline-block mr-3 text-primaryColor" />
            Our Expert Team
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Certified biomedical engineers and clinical specialists dedicated to
            healthcare technology
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-gray-100"
              >
                <div className="w-40 h-40 rounded-full mx-auto mb-6 overflow-hidden border-4 border-primaryColor bg-gray-100">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  {member.name}
                </h3>
                <p className="text-primaryColor font-medium">{member.role}</p>
                <p className="text-gray-500 text-sm mt-2">
                  {member.specialization}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values - Medical Focus */}
      <section className="py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            <FaShieldAlt className="inline-block mr-3 text-primaryColor" />
            Our Principles
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            The foundation of our biomedical engineering services
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100"
              >
                <div className="w-12 h-12 rounded-full bg-primaryColor/10 flex items-center justify-center mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-800">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
