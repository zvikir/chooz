import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: '#1C2738',
        surface: '#0E1525',
        muted: '#A7B1C2',
        primary: {
          DEFAULT: '#7C5CFF',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#64D2FF',
        },
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
      },
      boxShadow: {
        card: '0 6px 24px -6px rgba(0,0,0,0.5), inset 0 0 0 1px #1C2738',
      },
    },
  },
  plugins: [],
} satisfies Config


