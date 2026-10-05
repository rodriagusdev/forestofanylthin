/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '440px',
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      boxShadow: {
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.4)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.4)',
        'glow-purple': '0 0 25px -5px rgba(168, 85, 247, 0.4)',
        'glow-gold': '0 0 30px -5px rgba(245, 158, 11, 0.5)',
        'glow-crimson': '0 0 30px -5px rgba(239, 68, 68, 0.5)',
        'ornate-panel': '0 10px 30px -5px rgba(0,0,0,0.8), inset 0 0 15px rgba(217, 119, 6, 0.15)',
      },
    },
  },
  plugins: [],
}
