import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: { 950: "#0a0a0f", 975: "#050508" },
        glow: { cyan: "#00f5ff", violet: "#a78bfa", emerald: "#34d399" },
      },
      backdropBlur: { xs: "2px" },
      boxShadow: {
        "glow-cyan": "0 0 20px rgba(0, 245, 255, 0.3), 0 0 40px rgba(0, 245, 255, 0.15)",
        "glow-violet": "0 0 20px rgba(167, 139, 250, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
