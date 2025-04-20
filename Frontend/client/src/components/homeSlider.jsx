import React, { useState, useEffect } from "react";

const slides = [
  {
    image: "biomedical-equipment.jpg",
    title: "Premium Medical Devices",
    description:
      "High-quality diagnostic & lab equipment for hospitals and clinics.",
  },
  {
    image: "lab-217043_640.jpg",
    title: "Laboratory Reagents",
    description: "Reliable reagents for accurate test results.",
  },
  {
    image: "engineer-4915787_640.jpg",
    title: "Expert Maintenance Services",
    description:
      "Certified technicians for medical equipment repair & calibration.",
  },
  {
    image: "equipment-3089883_640.jpg",
    title: "Professional Installation",
    description: "Safe and compliant setup of biomedical devices.",
  },
];

const HomeSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Function to go to the next slide
  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(handleNext, 4000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div
      id="controls-carousel"
      className="relative w-full "
      data-carousel="static"
    >
      {/* Carousel wrapper */}
      <div className="relative h-56 overflow-hidden  md:h-96 my-0 py-0 ">
        <div className="absolute bg-black inset-0 opacity-60 z-10"></div>
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              alt={`Slide ${index + 1}`}
            />
            {/* Title and description centered */}
            <div className="relative z-20 text-center text-white">
              <h2 className="text-2xl md:text-4xl font-bold text-white">
                {slide.title}
              </h2>
              <p className="mt-2 text-sm md:text-lg text-white">
                {slide.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Slider controls */}
      <button
        type="button"
        className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={() =>
          setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
        }
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70">
          <svg
            className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>

      <button
        type="button"
        className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={() => handleNext()}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70">
          <svg
            className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>
  );
};

export default HomeSlider;
