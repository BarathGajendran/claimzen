/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#b8dcff',
          300: '#7abeff',
          400: '#339cff',
          500: '#0a7eff',
          600: '#0061d6',
          700: '#004da8',
          800: '#00428a',
          900: '#063873',
          950: '#04224d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(0, 97, 214, 0.08), 0 2px 8px -1px rgba(0, 0, 0, 0.04)',
        'premium-hover': '0 12px 30px -4px rgba(0, 97, 214, 0.14), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
        'premium-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.3), 0 2px 8px -1px rgba(0, 0, 0, 0.2)',
      }
    },
  },
  plugins: [],
}
