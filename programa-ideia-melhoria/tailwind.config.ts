import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        colibri: {
          bg: "#F3F6F4",
          ink: "#16241E",
          green: "#1F6F54",
          greenDark: "#134A38",
          greenLight: "#DCEFE7",
          gold: "#C79A3B",
        },
      },
      fontFamily: {
        display: ["ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "14px",
      },
    },
  },
  plugins: [],
};

export default config;
