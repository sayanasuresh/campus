/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#16233F',
        inkdeep: '#0F1A30',
        amber: '#E8A33D',
        sand: '#F7F5F1',
        slate: '#2B2D33',
        teal: '#3E7C74',
        violet: '#5B4B8A',
        alert: '#C1443C',
        line: '#E4E0D6',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      maxWidth: {
        prose: '68ch',
      },
    },
  },
  plugins: [],
};
