/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'text-[#344736]',
    'text-[#342e29]',
    'text-[#86312b]',
    'text-[#002140]',
    'text-[#4b3c35]',
    'text-[#9e3430]',
    'text-[#415c43]',
    'text-[#00385e]',
    'text-[#ffc083]',
    'text-[#ff774a]',
    'text-[#b8dc99]',
    'text-[#b0ddf1]',
    'text-[#51514d]',
    'text-[#e7e4df]',
    'text-[#fdfbf7]',
    'bg-[#344736]',
    'bg-[#342e29]',
    'bg-[#4b3c35]',
    'bg-[#e7e4df]',
    'bg-[#fdfbf7]',
    'border-[#e7e4df]',
    'border-[#342e29]',
  ],
  theme: {
    extend: {
      colors: {
        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--input) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "#344736", // Forest Green
          foreground: "#fdfbf7", // Off White
        },
        secondary: {
          DEFAULT: "#e7e4df", // Soft Gray
          foreground: "#342e29", // Dark Earth
        },
        destructive: {
          DEFAULT: "#86312b", // Rich Red
          foreground: "#fdfbf7", // Off White
        },
        muted: {
          DEFAULT: "#f9f7f3", // Lighter Off White
          foreground: "#51514d", // Charcoal Gray
        },
        accent: {
          DEFAULT: "#ffc083", // Warm Yellow
          foreground: "#342e29", // Dark Earth
        },
        popover: {
          DEFAULT: "rgb(var(--popover) / <alpha-value>)",
          foreground: "rgb(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "#fdfbf7", // Off White
          foreground: "#342e29", // Dark Earth
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        serif: ['var(--font-serif)', 'serif'],
      },
      fontSize: {
        'xs': '0.75rem', // 12px
        'sm': '0.875rem', // 14px
        'base': '1rem', // 16px
        'lg': '1.125rem', // 18px
        'xl': '1.25rem', // 20px
        '2xl': '1.5rem', // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem', // 36px
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 