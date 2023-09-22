/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bgColor: "#17143D",
        textColor: "#B5AEE4",
        btnNotifyColor: "#4E3A9B",
        purpleColor: "#6E1777",
      },
      fontFamily: {
        holtwood: ["'Holtwood One SC'", "serif"],
      },
      animation: {
        visibleHeroH2: "visibleHeroH2 0.7s ease-in forwards",
      },
      keyframes: {
        visibleHeroH2: {
          "0%": { opacity: 0, transform: "translateY(100%)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
