// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
          text:{
              DEFAULT: "rgb(var(--text) / <alpha-value>)",
              muted: "rgb(var(--text-muted) / <alpha-value>)",
          },
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
          foreground: "rgb(var(--secondary-foreground) / <alpha-value>)",
        },
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
      },
      spacing: {
        container: "2rem",
        "container-lg": "4rem",
      },
      maxWidth: {
        container: "80rem",
      },
    },
  },
  plugins: [],
};
