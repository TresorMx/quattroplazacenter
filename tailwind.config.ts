import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1440px' },
    },
    extend: {
      colors: {
        bg: {
          DEFAULT: '#FFFFFF',
          card: '#FFFFFF',
          soft: '#F8F8F8',
          deep: '#0E0E0E',
        },
        ink: {
          DEFAULT: '#0E0E0E',
          2: '#2A2823',
          3: '#6B6863',
          4: '#9A968D',
        },
        line: {
          DEFAULT: '#E0E0E0',
          2: '#EBEBEB',
        },
        accent: {
          DEFAULT: '#FAB413', // Quattro gold
          deep: '#C88C00',
          soft: '#FFEFC2',
        },
        status: {
          disponible: '#5E9A4B',
          apartado: '#D4A23A',
          vendido: '#C8543E',
          bloqueado: '#9A968D',
        },
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Cormorant Garamond', 'serif'],
        sans: ['var(--font-manrope)', 'Manrope', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'monospace'],
        display: ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
      },
      letterSpacing: {
        eyebrow: '0.32em',
        caps: '0.18em',
        tight: '-0.025em',
        tighter: '-0.04em',
      },
      borderWidth: {
        DEFAULT: '0.5px',
        0: '0px',
        1: '1px',
        2: '2px',
        4: '4px',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '10px',
        lg: '18px',
        xl: '28px',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.22, 1, 0.36, 1)',
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      maxWidth: {
        wrap: '1680px',
        wide: '1680px',
      },
      animation: {
        'fade-up': 'fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'hero-zoom': 'heroZoom 18s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        marquee: 'marquee 38s linear infinite',
        pulse: 'pulse 2.4s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        heroZoom: {
          '0%': { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulse: {
          '0%, 100%': { boxShadow: '0 0 0 3px rgba(94, 154, 75, 0)' },
          '50%': { boxShadow: '0 0 0 6px rgba(94, 154, 75, 0.18)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
