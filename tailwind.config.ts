import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#a04100",
        "primary-container": "#ff6b00",
        "primary-fixed": "#ffdbcc",
        "primary-fixed-dim": "#ffb693",
        "on-primary": "#ffffff",
        "on-primary-container": "#572000",
        "on-primary-fixed": "#351000",
        "on-primary-fixed-variant": "#7a3000",
        "inverse-primary": "#ffb693",

        "secondary": "#5f5e5e",
        "secondary-container": "#e5e2e1",
        "secondary-fixed": "#e5e2e1",
        "secondary-fixed-dim": "#c8c6c5",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#656464",
        "on-secondary-fixed": "#1c1b1b",
        "on-secondary-fixed-variant": "#474646",

        "tertiary": "#934b19",
        "tertiary-container": "#da834d",
        "tertiary-fixed": "#ffdbc9",
        "tertiary-fixed-dim": "#ffb68c",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#532300",
        "on-tertiary-fixed": "#321200",
        "on-tertiary-fixed-variant": "#753401",

        "background": "#fbf9f5",
        "on-background": "#1b1c1a",
        "surface": "#fbf9f5",
        "surface-bright": "#fbf9f5",
        "surface-dim": "#dbdad6",
        "surface-variant": "#e4e2de",
        "surface-tint": "#a04100",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f5f3ef",
        "surface-container": "#efeeea",
        "surface-container-high": "#eae8e4",
        "surface-container-highest": "#e4e2de",
        "on-surface": "#1b1c1a",
        "on-surface-variant": "#5a4136",
        "inverse-surface": "#30312e",
        "inverse-on-surface": "#f2f0ed",

        "outline": "#8e7164",
        "outline-variant": "#e2bfb0",

        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",

        "brand-amber": "#FF6B00",
        "brand-cream": "#FDFBF7",
        "brand-charcoal": "#121212",
        "brand-surface": "#FFFFFF",
      },
      fontFamily: {
        sans: ["'Cairo'", "'Plus Jakarta Sans'", "sans-serif"],
        display: ["'Alexandria'", "'Cairo'", "'Plus Jakarta Sans'", "sans-serif"],
        arabic: ["'Cairo'", "'Alexandria'", "sans-serif"],
      },
      borderRadius: {
        "sm": "0.25rem",
        "DEFAULT": "0.5rem",
        "md": "0.75rem",
        "lg": "1rem",
        "xl": "1.25rem",
        "2xl": "1.5rem",
        "full": "9999px",
      },
      boxShadow: {
        "card-soft": "0px 4px 20px rgba(18, 18, 18, 0.04)",
        "card-elevated": "0px 8px 30px rgba(18, 18, 18, 0.08)",
        "amber-glow": "0 0 20px rgba(255, 107, 0, 0.15)",
        "amber-glow-strong": "0 0 25px rgba(255, 107, 0, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
