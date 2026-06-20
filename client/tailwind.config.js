/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          100: '#1A1A1A',
          200: '#111111',
          300: '#090909',
        },
        primary: {
          DEFAULT: '#8B5CF6',
          hover: '#7C3AED',
        },
        accent: {
          blue: '#3B82F6',
          cyan: '#06B6D4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}