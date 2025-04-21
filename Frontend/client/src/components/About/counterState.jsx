import React, { useState, useEffect } from "react";
import ScrollTrigger from "react-scroll-trigger";
import CountUp from "react-countup";
import axios from "axios";
import { FaHospital, FaHandshake, FaUsers } from "react-icons/fa";

export default function CounterState() {
  const [counterState, setCounterState] = useState(false);
  const [customersCount, setCustomersCount] = useState(0);
  const [partnersCount, setPartnersCount] = useState(0);
  const serverHost = import.meta.env.VITE_REACT_APP_SERVER;

  const currentYear = new Date().getFullYear();
  const yearsInBusiness = currentYear - 2020;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersResponse = await axios.get(
          `${serverHost}/customersCount`
        );
        const partnersResponse = await axios.get(`${serverHost}/supplierCount`);

        setCustomersCount(customersResponse.data.length);
        setPartnersCount(partnersResponse.data.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [serverHost]);

  return (
    <div className="pt-8">
      <ScrollTrigger onEnter={() => setCounterState(true)}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Years in Business */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-primaryColor/30 transition-all border border-gray-100">
            <div className="text-primaryColor flex justify-center mb-4">
              <FaHospital className="text-4xl" />
            </div>
            <div className="text-4xl font-bold text-center text-primaryColor mb-2">
              {counterState && (
                <CountUp start={0} end={yearsInBusiness} duration={2} />
              )}
              +
            </div>
            <h3 className="text-lg font-semibold text-center text-gray-700">
              Years in Operation
            </h3>
          </div>

          {/* Hospitals Served */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-primaryColor/30 transition-all border border-gray-100">
            <div className="text-primaryColor flex justify-center mb-4">
              <FaUsers className="text-4xl" />
            </div>
            <div className="text-4xl font-bold text-center text-primaryColor mb-2">
              {counterState && (
                <CountUp start={0} end={customersCount} duration={2} />
              )}
              +
            </div>
            <h3 className="text-lg font-semibold text-center text-gray-700">
              Customers
            </h3>
          </div>

          {/* Devices Installed */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-primaryColor/30 transition-all border border-gray-100">
            <div className="text-primaryColor flex justify-center mb-4">
              <FaHandshake className="text-4xl" />
            </div>
            <div className="text-4xl font-bold text-center text-primaryColor mb-2">
              {counterState && (
                <CountUp start={0} end={partnersCount} duration={2} />
              )}
              +
            </div>
            <h3 className="text-lg font-semibold text-center text-gray-700">
              Partners
            </h3>
          </div>
        </div>
      </ScrollTrigger>
    </div>
  );
}
