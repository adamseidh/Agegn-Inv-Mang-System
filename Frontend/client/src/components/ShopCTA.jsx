import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaShoppingCart,
  FaMedal,
  FaHeadset,
  FaShieldAlt,
} from "react-icons/fa";

export default function ShopCTA() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-primaryColor to-blue-800 py-16 px-4 sm:px-6 lg:px-8 rounded-2xl shadow-xl my-16">
      {/* Decorative elements */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/5"></div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to Equip Your{" "}
              <span className="text-yellow-300">Medical Facility</span>?
            </h2>

            <p className="text-xl text-blue-100 mb-8 max-w-lg">
              Browse our premium selection of biomedical equipment and reagents
              - trusted by hospitals and labs nationwide.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <FaMedal className="text-yellow-300 text-2xl mr-3" />
                <span className="text-white font-medium">
                  Certified Quality
                </span>
              </div>
              <div className="flex items-center bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <FaHeadset className="text-yellow-300 text-2xl mr-3" />
                <span className="text-white font-medium">Expert Support</span>
              </div>
              <div className="flex items-center bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <FaShieldAlt className="text-yellow-300 text-2xl mr-3" />
                <span className="text-white font-medium">
                  Warranty Products
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/market"
                className="flex items-center justify-center bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span>Get Started Now</span>
                <FaArrowRight className="ml-2" />
              </Link>
              <Link
                to="/contacts"
                className="flex items-center justify-center bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold py-4 px-8 rounded-lg transition-all duration-300"
              >
                <FaHeadset className="mr-2" />
                <span>Need Help?</span>
              </Link>
            </div>
          </div>

          {/* Visual */}
          <div className="relative z-10 hidden lg:block">
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primaryColor rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
              <div className="relative bg-white p-6 rounded-2xl shadow-2xl transform rotate-2 hover:rotate-0 transition duration-500">
                <div className="bg-gray-100 rounded-lg overflow-hidden">
                  <div className="p-4 bg-primaryColor text-white">
                    <h3 className="font-bold flex items-center">
                      <FaShoppingCart className="mr-2" />
                      Featured Products
                    </h3>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <div className="w-3 h-3 bg-primaryColor rounded-full mr-3"></div>
                        <span>Diagnostic Equipment</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                        <span>Laboratory Reagents</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span>Surgical Instruments</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                        <span>Medical Consumables</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-gray-900 font-bold px-6 py-2 rounded-lg shadow-lg">
                  Special Offers!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
