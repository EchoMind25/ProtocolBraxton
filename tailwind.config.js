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
          850: '#141412',
          900: '#0e0e0c',
          950: '#0a0a0a',
        },
        gold: {
          DEFAULT: '#e0b050',
          dim: '#9a7530',
          bright: '#f0c860',
          faint: 'rgba(224,176,80,0.06)',
          glow: 'rgba(224,176,80,0.15)',
        },
        cream: {
          DEFAULT: '#f0ece4',
          dim: '#a89e8c',
        },
        iron: '#6b6560',
        border: {
          DEFAULT: '#2a2724',
          light: '#3a3632',
        },
        push: '#d08040',
        pull: '#5a9fc0',
        legs: '#4a9a5a',
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
