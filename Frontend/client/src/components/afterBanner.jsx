import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicroscope,
  faSyringe,
  faHeartbeat,
  faHospital,
  faTools,
  faUserMd,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

function AfterBanner() {
  return (
    <>
      {/* Two featured service cards */}
      <div className="relative flex items-center justify-center md:px-14 -mt-14 px-2 z-10 md:mx-8 space-x-4 md:space-x-6">
        {/* Card 1: Medical Devices */}
        <div className="flex-1 flex-col h-28 bg-white flex items-center px-2 justify-center shadow-2xl rounded-es-3xl animate-slideRight hover:scale-110 md:hover:scale-105">
          <div className="flex space-x-2">
            <div className="flex-1">
              <FontAwesomeIcon
                icon={faHeartbeat} // Medical equipment icon
                className="h-8 w-8 md:h-10 md:w-10 text-primaryColor"
              />
            </div>
            <div className="flex-1 font-bold text-xl md:text-2xl text-primaryColor">
              Devices
            </div>
          </div>
          <div className="text-primaryColor md:text-xl">
            Advanced Medical Equipment
          </div>
        </div>

        {/* Card 2: Reagents */}
        <div className="flex-1 flex-col h-28 bg-white px-2 flex items-center justify-center shadow-2xl rounded-ee-3xl animate-slideLeft hover:scale-110 md:hover:scale-105">
          <div className="flex space-x-2">
            <div className="flex-1">
              <FontAwesomeIcon
                icon={faMicroscope} // Lab reagents icon
                className="h-8 w-8 md:h-10 md:w-10 text-primaryColor"
              />
            </div>
            <div className="flex-1 font-bold text-xl md:text-2xl text-primaryColor">
              Reagents
            </div>
          </div>
          <div className="text-primaryColor md:text-xl">
            Precision Lab Chemicals
          </div>
        </div>
      </div>

      {/* Main heading (using your configured primaryColor) */}
      <div className="flex font-satisfy my-8 text-3xl md:text-6xl text-primaryColor font-bold items-center justify-center">
        Agegn General Biomedical Engineering PLC
      </div>
    </>
  );
}

export default AfterBanner;
