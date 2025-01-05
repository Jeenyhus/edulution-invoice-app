module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'media', // enables system-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0072cd',
          dark: '#005ba3',
        }
      }
    },
  },
  plugins: [],
}