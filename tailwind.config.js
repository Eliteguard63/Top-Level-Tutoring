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
      // ultra-wide only (use like: ultra:block)
      screens: {
        ultra: "1600px"
      },

      /* 👇 Added for floating bubbles */
      keyframes: {
        floatY: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-60px)" }
        },
        floatXY: {
          "0%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(50px, -60px)" },
          "100%": { transform: "translate(0, 0)" }
        },
        slowSpin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        }
      },
      animation: {
        floatY: "floatY 10s ease-in-out infinite",
        floatXY: "floatXY 12s ease-in-out infinite",
        spinSlow: "slowSpin 80s linear infinite"
      }
      /* 👆 Added for floating bubbles */
    }
  },
  safelist: [
    { pattern: /(^|\:)(w|h|min-w|min-h|max-w|max-h|text|bg|drop-shadow|mix-blend)-.*/ },
    { pattern: /\[(.+)\]/ }
  ],
  plugins: []
};