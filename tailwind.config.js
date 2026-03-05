/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#0a0a0a',
        stone: {
          850: '#1c1a17',
          900: '#141310',
          950: '#0a0a0a',
        },
        gold: {
          DEFAULT: '#f0c050',
          dim: '#c8a044',
          bright: '#ffd470',
          faint: 'rgba(240,192,80,0.10)',
          glow: 'rgba(240,192,80,0.20)',
        },
        cream: {
          DEFAULT: '#f5f2eb',
          dim: '#d4cdbf',
        },
        iron: '#a8a090',
        border: {
          DEFAULT: '#3a3632',
          light: '#4a4640',
        },
        push: '#e89858',
        pull: '#70b8d8',
        legs: '#60b870',
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        body: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease forwards',
        'slide-up': 'slideUp 0.3s ease forwards',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
