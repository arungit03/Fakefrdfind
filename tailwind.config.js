/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        vibe: {
          violet: {
            50: '#f5f3ff',
            100: '#ede9fe',
            200: '#ddd6fe',
            300: '#c4b5fd',
            400: '#a78bfa',
            500: '#8b5cf6',
            600: '#7c3aed',
            700: '#6d28d9',
            800: '#5b21b6',
            900: '#4c1d95',
          },
          indigo: {
            400: '#818cf8',
            500: '#6366f1',
            600: '#4f46e5',
            700: '#4338ca',
          },
          pink: {
            300: '#f9a8d4',
            400: '#f472b6',
            500: '#ec4899',
            600: '#db2777',
          },
          coral: {
            300: '#fda4a4',
            400: '#fb7185',
            500: '#f43f5e',
          },
          peach: {
            200: '#fed7c3',
            300: '#fdba8c',
            400: '#fb923c',
          },
          mint: {
            300: '#6ee7b7',
            400: '#34d399',
            500: '#10b981',
          },
          cyan: {
            300: '#67e8f9',
            400: '#22d3ee',
            500: '#06b6d4',
          },
          yellow: {
            300: '#fde047',
            400: '#facc15',
          },
          cream: '#fffaf3',
          lavender: '#f6f4ff',
          navy: {
            800: '#161233',
            900: '#0e0b21',
            950: '#080615',
          },
        },
      },
      fontFamily: {
        display: ['"Baloo 2"', '"Poppins"', 'system-ui', 'sans-serif'],
        sans: ['"Poppins"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'vibe-radial': 'radial-gradient(circle at 20% 20%, rgba(139,92,246,0.25), transparent 40%), radial-gradient(circle at 80% 30%, rgba(244,114,182,0.2), transparent 40%), radial-gradient(circle at 50% 90%, rgba(52,211,153,0.18), transparent 45%)',
        'vibe-gradient': 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 45%, #ec4899 100%)',
        'vibe-gradient-warm': 'linear-gradient(135deg, #fb7185 0%, #fb923c 50%, #facc15 100%)',
        'vibe-gradient-cool': 'linear-gradient(135deg, #22d3ee 0%, #6366f1 50%, #8b5cf6 100%)',
      },
      boxShadow: {
        glow: '0 0 40px rgba(139, 92, 246, 0.35)',
        'glow-pink': '0 0 40px rgba(236, 72, 153, 0.3)',
        soft: '0 10px 40px -10px rgba(76, 29, 149, 0.25)',
        card: '0 4px 24px -4px rgba(76, 29, 149, 0.12)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'float-slower': 'float 12s ease-in-out infinite',
        'float-med': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 14s linear infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        'gradient-move': 'gradient-move 8s ease infinite',
        wiggle: 'wiggle 1.2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0) rotate(0deg)' },
          '33%': { transform: 'translateY(-18px) translateX(8px) rotate(4deg)' },
          '66%': { transform: 'translateY(10px) translateX(-10px) rotate(-3deg)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'gradient-move': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
    },
  },
  plugins: [],
}
