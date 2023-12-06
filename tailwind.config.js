/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './src/lib/fonts.ts'
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      fontSize: {
        "7xs": "5px",
        "7xs": "6px",
        "6xs": "7px",
        "5xs": "8px",
        "4xs": "9px",
        "3xs": "10px",
        "2xs": "11px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      screens: {
        'print': { 'raw': 'print' },
      },
      height: {
        17: '4.25rem', // 68px
        18: '4.5rem', // 72px
        19: '4.75rem', // 76px
        20: '5rem', // 80px
        21: '5.25rem', // 84px
        22: '5.5rem', // 88px
      },
      width: {
        17: '4.25rem', // 68px
        18: '4.5rem', // 72px
        19: '4.75rem', // 76px
        20: '5rem', // 80px
        21: '5.25rem', // 84px
        22: '5.5rem', // 88px
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("daisyui"),
  ],
}