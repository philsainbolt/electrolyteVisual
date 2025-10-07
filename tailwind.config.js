/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'relyte-blue': '#1E3A8A',
        'relyte-accent': '#3B82F6',
        'relyte-light': '#EFF6FF',
      },
    },
  },
  plugins: [],
}
