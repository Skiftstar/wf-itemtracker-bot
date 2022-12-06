/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'main-bg-color': '#201e2b',
        'secondary-color': '#4c4a57',
        'highlight-color': '#41A4C4',
        'text-color': 'rgb(189, 168, 168)',
      },
      animation: {
        slideRight: 'slideInFromRight 200ms ease-out 0s 1'
        // slideRight: 'wiggle 1s ease-in-out infinite'
      },
      keyframes: {
        slideInFromRight: {
          '0%': { transform: 'translateX(100%) translateY(-50%)' },
          '100%': { transform: 'translateX(-50%) translateY(-50%)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
    fontFamily: {
      'nunito': ['Nunito', 'sans-serif'],
      'bree': ['Bree Serif', 'serif']
    }
  },
  plugins: [],
}
