/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        asphalt: {
          950: '#14171B',
          900: '#1B1F24',
          800: '#242931',
          700: '#323844',
        },
        signal: {
          400: '#F5B94D',
          500: '#F2A93B',
          600: '#D6892A',
        },
        route: {
          teal: '#3E8E7E',
          red: '#D64545',
          blue: '#3E6E9E',
        },
        paper: '#F6F5F2',
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
