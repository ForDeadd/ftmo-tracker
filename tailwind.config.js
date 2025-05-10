/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // ← cette ligne est la clé !
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}