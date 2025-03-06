/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito_Sans: ["Nunito-sans", "sans-serif"],
      },
      colors: {
        "greenish": "#117768",
        "greenish-hold": "#0d594e",
        "backgroundish": "#F5F5F4",
        "inputBackgroundish": "#F3F5F6",
        "holdish": "#F8F7F1",
        "bleh": "#BBCAB0",
        "roundish": "#E9F2F2",
      }
    },
  },
  plugins: [],
}