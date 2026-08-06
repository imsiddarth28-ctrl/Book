import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        paper: {
          50: "#FDFCFA",
          100: "#FBF9F5",
          200: "#F5F0E8",
          300: "#EDE6D9",
          400: "#E2D8C6",
        },
        sepia: {
          50: "#FAF6EF",
          100: "#F4ECD8",
          200: "#E8D9B8",
          300: "#D4C09A",
        },
        ink: {
          50: "#8C8478",
          100: "#6B6358",
          200: "#4A443C",
          300: "#2E2A24",
          400: "#1A1714",
        },
        midnight: {
          50: "#2A2A2A",
          100: "#1E1E1E",
          200: "#161616",
          300: "#121212",
          400: "#0A0A0A",
        },
      },
      fontFamily: {
        serif: ["var(--font-lora)", "Georgia", "Times New Roman", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        book: "0 2px 8px -2px rgba(0,0,0,0.08), 0 4px 16px -4px rgba(0,0,0,0.06)",
        "book-hover":
          "0 8px 24px -4px rgba(0,0,0,0.12), 0 12px 32px -8px rgba(0,0,0,0.08)",
        soft: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
