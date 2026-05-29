import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          dark: "#1B3A2D",
          mid: "#2D5A3D",
          light: "#3D7A52",
          pale: "#EBF5EE",
        },
        amber: {
          DEFAULT: "#B5783A",
          light: "#D4944A",
          pale: "#FBF3E8",
        },
        ace: "#E31837",
        cream: "#F8F5F0",
        charcoal: "#1A1A1A",
        warm: "#6B6560",
      },
      fontFamily: {
        serif: ["Georgia", "Times New Roman", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #1B3A2D 0%, #2D5A3D 60%, #1B3A2D 100%)",
        "amber-gradient": "linear-gradient(135deg, #B5783A 0%, #D4944A 100%)",
      },
      boxShadow: {
        "card": "0 4px 20px rgba(27, 58, 45, 0.12)",
        "card-hover": "0 12px 40px rgba(27, 58, 45, 0.2)",
      },
    },
  },
  plugins: [],
};
export default config;
