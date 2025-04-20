import React from "react";
import HomeSlider from "./components/homeSlider";
import axios from "axios";
import AfterBanner from "./components/afterBanner";
import HomeAbout from "./components/About/homeAbout";
import HomeServices from "./components/services";
import ContactUs from "./components/contactUs";
import ShopCTA from "./components/ShopCTA";
import CoreValues from "./components/coreValues";
axios.defaults.baseURL = import.meta.env.my_default_url;

const Home = () => {
  return (
    <div className="App">
      <HomeSlider />
      <AfterBanner />
      <HomeAbout />
      <HomeServices />
      <ShopCTA />
      <CoreValues />
      <ContactUs />
    </div>
  );
};

export default Home;
