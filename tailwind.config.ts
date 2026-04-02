import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./models/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff7ff",
          100: "#dbeefe",
          200: "#bfdefe",
          300: "#93c8fd",
          400: "#60a8fa",
          500: "#3b82f6",
          600: "#2f69e8",
          700: "#2855d5",
          800: "#2746ad",
          900: "#253f88"
        }
      },
      boxShadow: {
        soft: "0 20px 50px -20px rgba(15, 23, 42, 0.25)"
      },
      borderRadius: {
        xl2: "1.25rem"
      },
      backgroundImage: {
        "grid-light":
          "linear-gradient(to right, rgba(148, 163, 184, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.12) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
