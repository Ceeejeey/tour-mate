/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#F0F7F2',
          100: '#D9EBDE',
          200: '#B3D7BD',
          300: '#7FBA91',
          400: '#4A9D65',
          500: '#2D8F5E',
          600: '#1E6B4A',
          700: '#1B5E3B',
          800: '#153D28',
          900: '#0F2E1E',
          950: '#091A11',
        },
        earth: {
          50: '#FDF8F0',
          100: '#F9EDDA',
          200: '#F2D7AD',
          300: '#E8B86A',
          400: '#E8A838',
          500: '#D4922A',
          600: '#B47620',
          700: '#8F5C19',
          800: '#6B4513',
          900: '#4A2F0D',
        },
        sky: {
          50: '#EFF8FF',
          100: '#D6EDFF',
          200: '#A8D8FF',
          300: '#6BB8F0',
          400: '#4AADE5',
          500: '#2196D4',
          600: '#1A78AB',
        },
        sand: {
          50: '#FAFAF5',
          100: '#F5F5EB',
          200: '#E8E8D6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
