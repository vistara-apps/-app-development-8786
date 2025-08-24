/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(210, 70%, 50%)',
          50: 'hsl(210, 70%, 95%)',
          100: 'hsl(210, 70%, 85%)',
          500: 'hsl(210, 70%, 50%)',
          600: 'hsl(210, 70%, 45%)',
          700: 'hsl(210, 70%, 40%)',
        },
        accent: {
          DEFAULT: 'hsl(160, 70%, 45%)',
          50: 'hsl(160, 70%, 95%)',
          100: 'hsl(160, 70%, 85%)',
          500: 'hsl(160, 70%, 45%)',
          600: 'hsl(160, 70%, 40%)',
        },
        bg: 'hsl(220, 20%, 98%)',
        surface: 'hsl(0, 0%, 100%)',
        text: 'hsl(220, 15%, 25%)',
        muted: 'hsl(220, 15%, 55%)',
        destructive: {
          DEFAULT: 'hsl(0, 84%, 60%)',
          50: 'hsl(0, 84%, 95%)',
          100: 'hsl(0, 84%, 85%)',
          500: 'hsl(0, 84%, 60%)',
          600: 'hsl(0, 84%, 55%)',
        },
        border: 'hsl(220, 13%, 91%)',
        input: 'hsl(220, 13%, 91%)',
        ring: 'hsl(210, 70%, 50%)',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
      },
      spacing: {
        'xs': '4px',
        'sm': '10px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 hsla(0, 0%, 0%, 0.05)',
        'md': '0 4px 6px -1px hsla(0, 0%, 0%, 0.1), 0 2px 4px -2px hsla(0, 0%, 0%, 0.1)',
        'lg': '0 10px 15px -3px hsla(0, 0%, 0%, 0.1), 0 4px 6px -4px hsla(0, 0%, 0%, 0.1)',
      },
      animation: {
        'fast': '100ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        'base': '200ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        'slow': '400ms cubic-bezier(0.2, 0.8, 0.2, 1)',
      }
    },
  },
  plugins: [],
}