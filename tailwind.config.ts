import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2bee79',
        'background-light': '#f6f8f7',
        'background-dark': '#102217',
        'surface-dark': '#1A2C23',
      },
      fontFamily: {
        display: ['Spline Sans', 'Noto Sans KR', 'sans-serif'],
        body: ['Noto Sans KR', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
}

export default config

