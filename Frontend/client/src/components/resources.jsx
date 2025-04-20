import React from "react";
import {
  FaFilePdf,
  FaVideo,
  FaBook,
  FaMicroscope,
  FaTools,
  FaChartLine,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function ResourcesPage() {
  const navigate = useNavigate();
  // Sample resource data
  const technicalResources = [
    {
      id: 1,
      title: "Biomedical Equipment Maintenance Guide",
      type: "PDF",
      icon: <FaFilePdf className="text-red-500 text-2xl" />,
      category: "maintenance",
      description:
        "Comprehensive guide for preventive maintenance of common hospital equipment",
    },
    {
      id: 2,
      title: "Laboratory Equipment Calibration Tutorial",
      type: "Video",
      icon: <FaVideo className="text-blue-500 text-2xl" />,
      category: "tutorials",
      description:
        "Step-by-step video instructions for calibrating diagnostic devices",
    },
    {
      id: 3,
      title: "Medical Device Specifications Catalog",
      type: "PDF",
      icon: <FaFilePdf className="text-red-500 text-2xl" />,
      category: "specifications",
      description:
        "Technical specifications for all our available medical equipment",
    },
  ];

  const trainingMaterials = [
    {
      id: 4,
      title: "Biomedical Engineering Fundamentals",
      type: "E-book",
      icon: <FaBook className="text-green-500 text-2xl" />,
      category: "education",
      description: "Essential textbook for biomedical equipment technicians",
    },
    {
      id: 5,
      title: "Equipment Troubleshooting Handbook",
      type: "PDF",
      icon: <FaFilePdf className="text-red-500 text-2xl" />,
      category: "troubleshooting",
      description: "Common issues and solutions for critical care equipment",
    },
    {
      id: 6,
      title: "Annual Technology Trends Report",
      type: "PDF",
      icon: <FaFilePdf className="text-red-500 text-2xl" />,
      category: "research",
      description: "Latest advancements in medical technology for 2024",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-primaryColor mb-4 flex items-center justify-center">
            <FaMicroscope className="mr-3" />
            Biomedical Resources Center
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Technical documentation, training materials, and equipment resources
            for healthcare professionals
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Resource Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FaTools className="mr-2 text-primaryColor" />
                Categories
              </h2>
              <ul className="space-y-4">
                <li>
                  <Link
                    to="#technical"
                    className="flex items-center text-gray-700 hover:text-primaryColor transition-colors"
                  >
                    <FaMicroscope className="mr-3" />
                    Technical Manuals
                  </Link>
                </li>
                <li>
                  <Link
                    to="#training"
                    className="flex items-center text-gray-700 hover:text-primaryColor transition-colors"
                  >
                    <FaBook className="mr-3" />
                    Training Materials
                  </Link>
                </li>
                <li>
                  <Link
                    to="#specs"
                    className="flex items-center text-gray-700 hover:text-primaryColor transition-colors"
                  >
                    <FaChartLine className="mr-3" />
                    Product Specifications
                  </Link>
                </li>
              </ul>

              <div className="mt-10">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Need Specific Resources?
                </h3>
                <Link
                  to="/contacts"
                  className="inline-block bg-primaryColor text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Contact Our Team
                </Link>
              </div>
            </div>
          </div>

          {/* Resource Listings */}
          <div className="lg:col-span-2">
            {/* Technical Resources Section */}
            <section id="technical" className="mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                <FaTools className="mr-3 text-primaryColor" />
                Technical Resources
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {technicalResources.map((resource) => (
                  <div
                    key={resource.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-start">
                        <div className="mr-4">{resource.icon}</div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {resource.title}
                          </h3>
                          <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full mb-3">
                            {resource.type}
                          </span>
                          <p className="text-gray-600">
                            {resource.description}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={() => navigate("/contacts")}
                          className="text-primaryColor font-medium hover:underline"
                        >
                          Get Started
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Training Materials Section */}
            <section id="training" className="mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                <FaBook className="mr-3 text-primaryColor" />
                Training Materials
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trainingMaterials.map((resource) => (
                  <div
                    key={resource.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-start">
                        <div className="mr-4">{resource.icon}</div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {resource.title}
                          </h3>
                          <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full mb-3">
                            {resource.type}
                          </span>
                          <p className="text-gray-600">
                            {resource.description}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={() => navigate("/contacts")}
                          className="text-primaryColor font-medium hover:underline"
                        >
                          Get Started
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Call to Action */}
            <div className="bg-primaryColor rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Looking for Specific Technical Documents?
              </h2>
              <p className="text-blue-100 mb-6">
                Our biomedical engineering team can provide customized technical
                support and documentation.
              </p>
              <Link
                to="/contacts"
                className="inline-block bg-white text-primaryColor px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                Request Custom Resources
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
