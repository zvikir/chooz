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
        border: '#e5e7eb',
        surface: '#ffffff',
        muted: '#6b7280',
        primary: {
          DEFAULT: '#2563eb',
          foreground: '#ffffff',
        },
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.05), 0 1px 6px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
} satisfies Config


