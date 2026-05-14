/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Paleta institucional UCN — colores en kebab-case para compatibilidad con @apply */
        'ucn-navy':       '#003057',   /* Pantone 540C — azul primario UCN */
        'ucn-teal':       '#3499AB',   /* Teal Escuela de Ingeniería */
        'ucn-teal-dark':  '#267A8A',
        'ucn-teal-light': '#E6F4F7',
        'ucn-dark':       '#001628',
        'ucn-gray':       '#3D3D3D',
        /* Escala primaria (alias de navy para compatibilidad interna) */
        primary: {
          50:  '#e6edf4',
          100: '#ccdae9',
          200: '#99b5d3',
          300: '#6690bd',
          400: '#336ba7',
          500: '#004b8d',
          600: '#003d75',
          700: '#003057',
          800: '#002340',
          900: '#001628',
          950: '#000d18',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':  'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
