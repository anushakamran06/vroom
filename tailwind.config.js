/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './types/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: '#C8A96E',
        silver: '#8A8A8A',
        dark: '#0A0A0A',
        'dark-surface': '#111111',
        'dark-border': '#1A1A1A',
        'dark-hover': '#222222',
      },
    },
  },
  plugins: [],
};
