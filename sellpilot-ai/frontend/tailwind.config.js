/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'sp-base': '#0A0B14',
        'sp-elevated': '#12131F',
        'sp-sidebar': '#0D0E18',
        'sp-input': '#1A1B2A',
        'sp-hover': '#1E1F32',
        'sp-active': '#252641',
        'sp-primary': '#5B6EF5',
        'sp-primary-light': '#7B8AF7',
        'sp-primary-dark': '#4A5DE0',
        'sp-text': '#F0F1F5',
        'sp-text-secondary': '#8B8FA3',
        'sp-text-muted': '#5C5F73',
        'sp-success': '#34D399',
        'sp-warning': '#FBBF24',
        'sp-danger': '#F87171',
        'sp-info': '#60A5FA',
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
