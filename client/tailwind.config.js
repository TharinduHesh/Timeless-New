/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors from existing theme
        'bg-900': '#0b0b0c',
        'bg-800': '#0f0f10',
        'card': '#121214',
        'muted': '#bdb6b0',
        'accent': '#c7a17a', // gold
        'accent-strong': '#b78f62',
        'gold': '#c7a17a',
        'gold-light': '#d4b08c',
        'gold-dark': '#b18c68',
      },
      fontFamily: {
        'primary': ['Montserrat', 'sans-serif'],
        'secondary': ['Open Sans', 'sans-serif'],
        'display': ['Playfair Display', 'Georgia', 'serif'],
      },
      borderRadius: {
        'custom': '12px',
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(180deg, #0b0b0c 0%, #0f0f10 100%)',
        'gradient-gold': 'linear-gradient(90deg, #c7a17a, #b78f62)',
      },
      boxShadow: {
        'gold': '0 10px 30px rgba(199, 161, 122, 0.12)',
        'gold-hover': '0 14px 36px rgba(199, 161, 122, 0.2)',
      },
    },
  },
  plugins: [],
}
