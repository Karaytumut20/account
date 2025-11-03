// tailwind.config.mjs

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      colors: {
        // YENİ PALET: Sadece Mor ve Koyu Tonlar
        background: '#0a0014', // Çok koyu, zengin bir mor
        foreground: '#c4b5fd', // Varsayılan metin rengi (Açık Mor / violet-300)
        primary: {
          DEFAULT: '#8b5cf6', // Ana mor (Vurgu / violet-500)
          light: '#a78bfa',   // Daha açık mor (violet-400)
          dark: '#4c1d95',    // Çok koyu mor (violet-900)
        },
        secondary: '#6366f1', // İkincil vurgu (indigo-500)
        gray: {
          // Gri paletini de mor tonlarıyla eziyoruz
          100: '#ddd6fe', // violet-200
          200: '#c4b5fd', // violet-300 (Soluk metinler)
          300: '#a78bfa', // violet-400
          400: '#8b5cf6', // violet-500
          500: '#3730a3', // indigo-800 (Arayüz elemanları)
          600: '#281e5d', // Daha koyu
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        'xl': '24px',
      },
    },
  },
  plugins: [],
};

export default config;