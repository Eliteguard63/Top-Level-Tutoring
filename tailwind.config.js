module.exports = {
  content: [
     "./index.html",
     "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/**/*.html"   // 👈 include your HTML files too
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Helvetica", "Arial", "Apple Color Emoji", "Segoe UI Emoji"]
      }
    }
  },
   safelist: [
    { pattern: /(^|\:)(w|h|min-w|min-h|max-w|max-h|text|bg|drop-shadow|mix-blend)-.*/ },
    { pattern: /\[(.+)\]/ }
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
