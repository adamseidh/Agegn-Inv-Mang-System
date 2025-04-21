import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faHome } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookSquare,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import {
  faSignInAlt,
  faInfoCircle,
  faHospital,
  faMicroscope,
  faTools,
  faShoppingCart,
  faPhoneAlt,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/Logo.jpg";
import { useState } from "react";
import Login from "./login";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

export default function Navbar({ fixed }) {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);

  const openLoginDialog = () => setLoginOpen(true);
  const closeLogin = () => setLoginOpen(false);
  const [userId, setUserId] = useState(null);

  const closeMobileMenu = () => {
    setNavbarOpen(false);
  };

  useState(() => {
    setUserId(sessionStorage.getItem("customerId"));
  }, [userId]);

  return (
    <>
      <nav className="flex flex-wrap items-center justify-between px-2 py-0 bg-gradient-to-br from-[#0f5abd] to-[#184784] mb-0 sticky top-0 -inset-0 z-50">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <a
              className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white flex items-center"
              href="/"
            >
              <img
                src={logo}
                alt="Agegn Biomedical Logo"
                className="h-10 w-10 mr-2 rounded-lg p-0"
              />
            </a>
            <button
              className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
          </div>
          <div
            className={
              "lg:flex flex-grow items-center" +
              (navbarOpen ? " flex" : " hidden")
            }
          >
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
              <li className="nav-item">
                <HashLink
                  to="/#"
                  className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                  onClick={closeMobileMenu}
                >
                  <FontAwesomeIcon
                    icon={faHome}
                    className="text-lg leading-lg text-white opacity-75"
                  />
                  <span className="ml-2">Home</span>
                </HashLink>
              </li>
              <li className="nav-item">
                <Link
                  to="/about"
                  className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                  onClick={closeMobileMenu}
                >
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="text-lg leading-lg text-white opacity-75"
                  />
                  <span className="ml-2">About</span>
                </Link>
              </li>
              <li className="nav-item">
                <HashLink
                  to="/resources"
                  className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                  onClick={closeMobileMenu}
                >
                  <FontAwesomeIcon
                    icon={faMicroscope}
                    className="text-lg leading-lg text-white opacity-75"
                  />
                  <span className="ml-2">Resources</span>
                </HashLink>
              </li>
              <li className="nav-item">
                <Link
                  to="/market"
                  className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                  onClick={closeMobileMenu}
                >
                  <FontAwesomeIcon
                    icon={faShoppingCart}
                    className="text-lg leading-lg text-white opacity-75"
                  />
                  <span className="ml-2">Shop</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/contacts"
                  className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                  onClick={closeMobileMenu}
                >
                  <FontAwesomeIcon
                    icon={faPhoneAlt}
                    className="text-lg leading-lg text-white opacity-75"
                  />
                  <span className="ml-2">Contact</span>
                </Link>
              </li>
              {userId ? (
                <li className="nav-item">
                  <a
                    className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                    href="/account"
                  >
                    <FontAwesomeIcon
                      icon={faUserShield}
                      className="text-lg leading-lg text-white opacity-75"
                    />
                    <span className="ml-2">Account</span>
                  </a>
                </li>
              ) : (
                <li className="nav-item">
                  <a
                    className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      openLoginDialog();
                      closeMobileMenu();
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faUserShield}
                      className="text-lg leading-lg text-white opacity-75"
                    />
                    <span className="ml-2">Login</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <Login isOpen={isLoginOpen} close={closeLogin} />
    </>
  );
}
