import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0D1B3E',
          light: '#1a2d5a',
          deep: '#080f22',
        },
        red: {
          DEFAULT: '#C8102E',
          dark: '#a00d24',
        },
        steel: '#8A9BB5',
        mist: '#D1D9E8',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: [
          'var(--font-barlow-condensed)',
          'Barlow Condensed',
          'system-ui',
          'sans-serif',
        ],
      },
      fontSize: {
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '0.95' }],
        '10xl': ['10rem', { lineHeight: '0.9' }],
      },
      spacing: {
        section: '7.5rem', // 120px — desktop section rhythm
      },
      // Color-opacity modifiers read from theme.opacity, so the fine-grained
      // steps the design uses (white/8, red/12, mist/85) must live here.
      opacity: {
        3: '0.03',
        8: '0.08',
        12: '0.12',
        15: '0.15',
        35: '0.35',
        45: '0.45',
        65: '0.65',
        85: '0.85',
      },
      maxWidth: {
        editorial: '78rem',
      },
      transitionTimingFunction: {
        cinema: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      backdropBlur: {
        card: '12px',
      },
      borderColor: {
        hairline: 'rgba(255,255,255,0.08)',
      },
      keyframes: {
        beatTextIn: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        redPulse: {
          '0%, 100%': { backgroundColor: 'rgba(200,16,46,0.10)' },
          '50%': { backgroundColor: 'rgba(200,16,46,0.30)' },
        },
        scrollBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(8px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
      },
      animation: {
        beatTextIn: 'beatTextIn 0.5s cubic-bezier(0.16,1,0.3,1) both',
        redPulse: 'redPulse 0.9s ease-in-out infinite',
        scrollBounce: 'scrollBounce 1.8s ease-in-out infinite',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
