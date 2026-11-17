/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0B110E',
        surface: {
          main: '#121A15',
          secondary: '#18231C',
          card: '#16211A',
        },
        accent: {
          DEFAULT: '#36D17C',
          hover: '#4AE695',
          dim: 'rgba(54, 209, 124, 0.12)',
        },
        text: {
          primary: '#F0F5F1',
          secondary: '#95A69A',
          muted: '#627768',
        },
        border: {
          DEFAULT: '#27352D',
          light: '#35483D',
        },
        warning: {
          DEFAULT: '#F5B942',
          dim: 'rgba(245, 185, 66, 0.15)',
        },
        critical: {
          DEFAULT: '#EF6464',
          dim: 'rgba(239, 100, 100, 0.15)',
        },
        info: {
          DEFAULT: '#64B5F6',
          dim: 'rgba(100, 181, 246, 0.15)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'glow-green': '0 0 15px rgba(54, 209, 124, 0.25)',
      }
    },
  },
  plugins: [],
}
