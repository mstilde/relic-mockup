import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1c1c1a",
        paper: "#f5f3ed",
        moss: "#445747",
        rust: "#a14d2d",
        sand: "#d8cdb8",
      },
      boxShadow: { soft: "0 16px 40px rgba(28,28,26,.07)" },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
        display: ["var(--font-cormorant)", "serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
