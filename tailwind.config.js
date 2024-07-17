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
        customGreen: '#3ddc97',
        customBlue: '#256EFF',
        customRed: '#ff495c',
        customPurple: '#46237a',
      },
      borderRadius: {
        'xl': '1.5rem',
      },
      borderWidth: {
        '3': '3px',
      },
      boxShadow: {
        'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
};
