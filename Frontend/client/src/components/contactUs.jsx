import React, { useState } from "react";
import {
  FaFacebookF,
  FaLinkedin,
  FaLocationDot,
  FaPhoneVolume,
  FaHospital,
  FaHospitalUser,
} from "react-icons/fa6";
import { faTools } from "@fortawesome/free-solid-svg-icons";
import { FaEnvelope } from "react-icons/fa";
import { BsChatRightDotsFill } from "react-icons/bs";
import axios from "axios";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "", // Changed from fullName to match backend
    email: "",
    phone: "",
    message_content: "", // Changed from message to match backend
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const serverHost = import.meta.env.VITE_REACT_APP_SERVER;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${serverHost}/messages`, {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message_content: formData.message_content,
      });

      if (response.data) {
        alert("Thank you for your message! We'll get back to you soon.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          message_content: "",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-900 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-white mb-4">
          Contact Us
        </h2>
        <p className="text-xl text-blue-100 text-center max-w-2xl mx-auto mb-12">
          Reach out for equipment inquiries, service requests, or technical
          support
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="flex items-center mb-6">
              <faTools className="text-3xl text-primaryColor mr-3" />
              <h3 className="text-2xl font-bold text-gray-800">
                Service Request Form
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                    placeholder="Full Name"
                    required
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                    placeholder="Phone Number"
                    required
                  />
                </div>
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                  placeholder="Email Address"
                  required
                />
              </div>

              <div>
                <textarea
                  rows={5}
                  name="message_content"
                  value={formData.message_content}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                  placeholder="Describe your biomedical equipment needs..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-primaryColor hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
              >
                Submit Request
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="flex items-center mb-6">
              <FaHospitalUser className="text-3xl text-primaryColor mr-3" />
              <h3 className="text-2xl font-bold text-gray-800">Our Contacts</h3>
            </div>

            <div className="space-y-6">
              <div className="flex items-start">
                <FaLocationDot className="text-2xl text-primaryColor mt-1 mr-4" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    Headquarters
                  </h4>
                  <p className="text-gray-600">
                    Jimma, Oromica, Ethiopia
                    <br />
                    Near Black Lion Hospital
                    <br />
                    Post Office, 3rd Floor
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <FaPhoneVolume className="text-2xl text-primaryColor mt-1 mr-4" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    Call Us
                  </h4>

                  <p className="text-gray-600 mt-2">+251 115 678 900</p>
                </div>
              </div>

              <div className="flex items-start">
                <FaEnvelope className="text-2xl text-primaryColor mt-1 mr-4" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">Email</h4>
                  <p className="text-gray-600">
                    Service Requests:
                    <br />
                    <a
                      href="mailto:service@agegnbiomedical.com"
                      className="text-blue-600 hover:underline"
                    >
                      service@agegnbiomedical.com
                    </a>
                  </p>
                  <p className="text-gray-600 mt-2">
                    Technical Support:
                    <br />
                    <a
                      href="mailto:support@agegnbiomedical.com"
                      className="text-blue-600 hover:underline"
                    >
                      support@agegnbiomedical.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="h-96 w-full relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.0615835236354!2d36.82980697500394!3d7.676528892340384!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x17adb90fa00889f3%3A0x190e9b00320515a!2sEthiopian%20postal%20service%20Jimma!5e0!3m2!1sen!2set!4v1745053325370!5m2!1sen!2set"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Agegn Biomedical Location"
            ></iframe>
            <div className="absolute inset-0 bg-primaryColor opacity-10 pointer-events-none"></div>
          </div>
          <div className="p-6 bg-gray-50">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <FaHospital className="mr-2 text-primaryColor" />
              Our Location
            </h3>
            <p className="text-gray-600 mt-2">
              Visit our showroom to see our range of medical equipment and meet
              our technical team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
