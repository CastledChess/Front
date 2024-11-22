import tailwindAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'castled-primary': '#1B1919',
        'castled-secondary': '#272424',
        'castled-tertiary': '#343536',
        'castled-gray': '#D5D4CF',
        'castled-btn-primary': '#ECECEC',
        'castled-btn-orange': '#F68C41',
        'castled-btn-purple': '#646ADA',
        'castled-btn-red': '#EA0909',
        'castled-accent': '#EC9E67',
      },
    },
    // Change the font (maybe)
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
  },
  plugins: [tailwindAnimate],
};