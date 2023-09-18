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
    },
  },
  plugins: [],
};
