import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/Logo.jpg";
import CounterState from "./counterState";

export default function HomeAbout() {
  return (
    <div className="bg-gray-50 py-12">
      {" "}
      {/* Light background for contrast */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Logo/Image Section - Improved Styling */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative h-80 w-80 rounded-xl overflow-hidden shadow-xl border-4 border-white">
              <img
                className="w-full h-full object-cover"
                src={Logo}
                alt="Agegn Biomedical Logo"
              />
              <div className="absolute inset-0 bg-primaryColor opacity-10 mix-blend-multiply"></div>
            </div>
          </div>

          {/* About Text Section */}
          <div className="mt-10 lg:mt-0">
            <h2 className="text-4xl font-bold text-primaryColor mb-6">
              About Us
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Agegn General Biomedical Engineering PLC is a leading provider of
              high-quality medical devices, laboratory reagents, and biomedical
              engineering services in Ethiopia. Established in 2023, we
              specialize in equipment maintenance, installation, and technical
              support for healthcare institutions, ensuring reliable and
              cutting-edge solutions for modern medical needs.
            </p>

            <CounterState />

            {/* Read More Button */}
            <div className="flex justify-center lg:justify-start mt-8">
              <Link
                to="/about"
                className="px-8 py-3 bg-primaryColor text-white font-semibold rounded-lg shadow-md hover:bg-opacity-90 transition duration-300 hover:shadow-lg"
              >
                Read More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
