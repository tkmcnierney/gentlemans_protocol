/** @type {import('tailwindcss').Config} */
export default {
  content: ['./*.html', './scripts/*.js'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FAF9F6',
          100: '#F5F3EF',
          200: '#EBE7DF',
          300: '#DDD7CB'
        },
        charcoal: {
          800: '#212529',
          900: '#15181B'
        },
        bronze: {
          600: '#9E6B48',
          700: '#845333',
          800: '#6B4024',
          900: '#4D2B14'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif']
      }
    }
  },
  plugins: []
};
