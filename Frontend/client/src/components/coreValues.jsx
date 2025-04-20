import React from "react";
import {
  FaShieldAlt,
  FaMicroscope,
  FaHandsHelping,
  FaUserMd,
  FaChartLine,
  FaHeartbeat,
} from "react-icons/fa";

export default function CoreValues() {
  const values = [
    {
      icon: <FaShieldAlt className="text-4xl text-primaryColor" />,
      title: "Integrity",
      description:
        "We maintain the highest ethical standards in all our biomedical solutions and business practices.",
    },
    {
      icon: <FaMicroscope className="text-4xl text-primaryColor" />,
      title: "Precision",
      description:
        "Every product and service meets exacting technical specifications for reliable healthcare outcomes.",
    },
    {
      icon: <FaHandsHelping className="text-4xl text-primaryColor" />,
      title: "Partnership",
      description:
        "We collaborate closely with medical institutions to understand and solve their unique challenges.",
    },
    {
      icon: <FaUserMd className="text-4xl text-primaryColor" />,
      title: "Expertise",
      description:
        "Our team combines deep biomedical knowledge with practical engineering experience.",
    },
    {
      icon: <FaChartLine className="text-4xl text-primaryColor" />,
      title: "Innovation",
      description:
        "We continuously adopt emerging technologies to advance healthcare delivery.",
    },
    {
      icon: <FaHeartbeat className="text-4xl text-primaryColor" />,
      title: "Patient-Centric",
      description:
        "Ultimately, all our work serves to improve patient care and diagnostic accuracy.",
    },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our <span className="text-primaryColor">Core Values</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The principles that guide every solution we provide to the
            healthcare community
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 w-20 h-20 rounded-full bg-primaryColor/10 flex items-center justify-center">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-xl text-gray-600 mb-8">
            These values ensure we deliver exceptional biomedical solutions you
            can trust.
          </p>
          <a
            href="/about"
            className="inline-block bg-primaryColor hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Learn More About Our Company
          </a>
        </div>
      </div>
    </div>
  );
}
