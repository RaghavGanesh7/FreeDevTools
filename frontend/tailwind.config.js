/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // or 'media'
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './public/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        // Neon/Blue palette
        neon: {
          DEFAULT: '#1e88e5', // Vibrant Neon Blue
          dark: '#2196f3',
          light: '#1e88e5',
          glow: '#1e88e5', // For shadows, glows, etc.
        },
        primary: {
          50: '#e3f6fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#2196f3', // Standard Blue
          600: '#1e88e5',
          700: '#1976d2',
          800: '#1565c0',
          900: '#0d47a1',
          neon: '#1e88e5', // Using neon as accent
        },
        // Useful background shades
        background: {
          light: '#f7fafc',
          dark: '#1a202c',
        },
        // Useful text shades
        text: {
          light: '#1a202c',
          dark: '#f7fafc',
        },
      },
      boxShadow: {
        neon: '0 0 10px #1e88e5, 0 0 40px #1e88e5',
      },
    },
  },
  plugins: [],
};
