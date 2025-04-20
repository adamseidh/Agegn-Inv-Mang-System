/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryColor: "#184784",
        secondaryColor: "#EB1F26",
      },
      keyframes: {
        slideRight: {
          "0%": { transform: "translateX(-4rem)" },
          "100%": { transform: "translateX(0)" },
        },

        slideLeft: {
          "0%": { transform: "translateX(4rem)" },
          "100%": { transform: "translateX(0)" },
        },

        slideUp: {
          "0%": { transform: "translateY(4rem)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        slideRight: "slideRight 0.7s ease-in-out",
        slideLeft: "slideLeft 0.7s ease-in-out",
        slideUp: "slideUp 0.7s ease-in-out",
      },

      fontFamily: {
        satisfy: ["Satisfy", "cursive"],
        lora: ["lora", "serif"],
      },

      textAlign: {
        justify: "justify",
      },

      boxShadow: {
        "black-border": "0 0 10px 7px rgba(0, 0, 0, 0.8)", // Custom white shadow with 50% transparency
      },
    },
  },
  plugins: [],
};
