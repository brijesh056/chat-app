/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Manrope", "system-ui", "sans-serif"] },
      colors: {
        brand: {
          50: "#effaf7",
          100: "#d3f3ea",
          500: "#14a585",
          600: "#0e8a6f",
          700: "#0d6f5a",
          900: "#0a3d33",
        },
      },
    },
  },
  plugins: [],
};
