import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClinicMedical,
} from "react-icons/fa";
import Logo from "../assets/Logo.jpg";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/market" },
    { name: "shops", path: "/market" },
    { name: "Resources", path: "/resources" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contacts" },
  ];

  const services = [
    "Equipment Installation",
    "Preventive Maintenance",
    "Technical Training",
    "Emergency Repair",
    "Calibration Services",
    "Consultation",
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-800 to-gray-950 text-white pt-12 pb-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center">
              <img
                src={Logo}
                alt="Agegn Biomedical Logo"
                className="h-12 w-12 rounded-md mr-3"
              />
              <h2 className="text-xl font-bold">Agegn Biomedical</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Leading provider of biomedical engineering solutions, medical
              equipment, and laboratory reagents in Ethiopia.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaFacebook className="text-2xl" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaTwitter className="text-2xl" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaLinkedin className="text-2xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold flex items-center">
              <FaClinicMedical className="mr-2 text-primaryColor" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold">Our Services</h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primaryColor mr-2">•</span>
                  <span className="text-gray-300">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-primaryColor mt-1 mr-3" />
                <p className="text-gray-300">
                  Jimma Posta Office 3rd Floor
                  <br />
                  Near Ferenj Arada
                  <br />
                  Jimma, Oromia, Ethiopia
                </p>
              </div>
              <div className="flex items-center">
                <FaPhoneAlt className="text-primaryColor mr-3" />
                <a
                  href="tel:+251911123456"
                  className="text-gray-300 hover:text-white"
                >
                  +251 911 123 456
                </a>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="text-primaryColor mr-3" />
                <a
                  href="mailto:info@agegnbiomedical.com"
                  className="text-gray-300 hover:text-white"
                >
                  info@agegnbiomedical.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {currentYear} Agegn General Biomedical Engineering PLC. All
              rights reserved.
            </p>
            <div className="text-gray-400 text-sm">
              <span>Developed by </span>
              <a
                href="https://deboengineering.com"
                className="text-primaryColor hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Debo Engineering
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
