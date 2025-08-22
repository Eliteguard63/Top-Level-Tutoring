module.exports = {
  content: [
    "./index.html",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/**/*.html" // include static HTML too
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "Apple Color Emoji",
          "Segoe UI Emoji"
        ]
      },
      screens: {
        // ultra-wide only (use like: ultra:block)
        ultra: "1800px"
      }
    }
  },
  safelist: [
    { pattern: /(^|\:)(w|h|min-w|min-h|max-w|max-h|text|bg|drop-shadow|mix-blend)-.*/ },
    { pattern: /\[(.+)\]/ }
  ],
  plugins: []
};