/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5",
          hover: "#4338CA",
          active: "#3730A3",
          light: "#EEF2FF",
          border: "#C7D2FE",
          accent: "#3525CD",
        },
        "primary-container": "#4F46E5",
        "on-primary": "#FFFFFF",
        "on-primary-container": "#DAD7FF",
        secondary: "#4648D4",
        "secondary-container": "#6063EE",
        tertiary: "#00505F",
        "tertiary-container": "#006A7C",
        surface: {
          DEFAULT: "#FAF8FF",
          container: "#EAEDFF",
          lowest: "#FFFFFF",
          low: "#F2F3FF",
          high: "#E2E7FF",
          highest: "#DAE2FD",
          variant: "#DAE2FD",
          dim: "#D2D9F4",
        },
        "on-surface": {
          DEFAULT: "#131B2E",
          variant: "#464555",
          muted: "#64748B",
        },
        outline: "#777587",
        "outline-variant": "#C7C4D8",
        background: "#FAF8FF",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      spacing: {
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "0.75rem",
        "space-lg": "1rem",
        "space-xl": "1.5rem",
        "space-2xl": "2rem",
        "space-3xl": "3rem",
      },
      boxShadow: {
        card: "0 20px 40px -15px rgba(15, 23, 42, 0.08), 0 8px 16px -6px rgba(79, 70, 229, 0.05)",
        floating: "0 4px 14px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04)",
      },
    },
  },
  plugins: [],
}
