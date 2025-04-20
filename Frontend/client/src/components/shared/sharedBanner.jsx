import React from "react";
import BannerImage from "../../assets/banner.jpg";

export default function ShardBanner({ title }) {
  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-96 flex items-center justify-center bg-gray-900 text-white">
        <div className="absolute inset-0 z-10 bg-black opacity-70"></div>
        <div
          className="absolute inset-0 bg-cover bg-center "
          style={{ backgroundImage: `url(${BannerImage})` }}
        ></div>{" "}
        <div className="relative z-10 text-center space-y-6 px-4">
          <h1 className="text-3xl md:text-5xl font-bold animate-fade-in-up">
            <span className="text-white">{title}</span>
          </h1>
        </div>
      </section>
    </div>
  );
}
