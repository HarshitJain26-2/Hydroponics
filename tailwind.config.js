/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F7F9F7',
        surface: {
          main: '#FFFFFF',
          secondary: '#F3F6F4',
          card: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#16A34A',
          deep: '#166534',
          hover: '#15803D',
          soft: '#EAF7EE',
          dim: 'rgba(22, 163, 74, 0.08)',
        },
        text: {
          primary: '#18221C',
          secondary: '#647067',
          muted: '#89938B',
        },
        border: {
          DEFAULT: '#E5EAE6',
          light: '#F0F3F1',
        },
        warning: {
          DEFAULT: '#F59E0B',
          soft: '#FEF3C7',
          text: '#B45309',
        },
        critical: {
          DEFAULT: '#DC2626',
          soft: '#FEE2E2',
          text: '#B91C1C',
        },
        info: {
          DEFAULT: '#2563EB',
          soft: '#DBEAFE',
          text: '#1D4ED8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 4px 12px 0 rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
