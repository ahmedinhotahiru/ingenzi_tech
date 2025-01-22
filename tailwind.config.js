/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary-color)",
        "primary-var": {
          50: "var(--primary-variable-color-50)",
          100: "var(--primary-variable-color-100)",
          200: "var(--primary-variable-color-200)",
          300: "var(--primary-variable-color-300)",
          400: "var(--primary-variable-color-400)",
          500: "var(--primary-variable-color-500)",
          600: "var(--primary-variable-color-600)",
          700: "var(--primary-variable-color-700)",
          800: "var(--primary-variable-color-800)",
          900: "var(--primary-variable-color-900)",
        },
        background: "var(--background-color)",
      },

      fontFamily: {
        primary: "var(--font-primary)",
      },
    },
  },
  plugins: [],
};
