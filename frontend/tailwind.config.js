/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a", // Official Blue
        },
        secondary: {
          50: "#ffffeb",
          100: "#fefcbf",
          200: "#fbd38d",
          300: "#f6ad55",
          400: "#ed8936",
          500: "#dd6b20", // Official Orange-ish
          600: "#c05621",
          700: "#9c4221",
          800: "#7b341e",
          900: "#652b19",
        },
        vgec: {
          blue: "#1e3a8a",
          orange: "#eb5d1e",
          light: "#f8f9fa",
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
    },
  },
  plugins: [],
};
