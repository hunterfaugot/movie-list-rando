// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customBlue: '#256EFF',
      },
      borderRadius: {
        'xl': '1.5rem',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
};
