import React from "react";
import Navbar from "./components/navbar";
import { Outlet } from "react-router-dom";
import Footer from "./components/footer"
import ScrollToTop from "./components/utility/srollToTop";

export default function Layout() {
  return (
    <>
      <Navbar />
      <ScrollToTop/>
      <Outlet /> 
      <Footer/>
    </>
  );
}
