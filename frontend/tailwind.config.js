/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "reloop-green": "#16A34A",
        "amazon-dark": "#131921",
        "link-blue": "#007185",
        "border-standard": "#DDDDDD",
        "surface-container-lowest": "#ffffff",
        "surface-bright": "#f7fafa",
        "surface-container": "#ebeeee",
        "surface-container-low": "#f1f4f4",
        "on-surface": "#181c1d",
        "on-surface-variant": "#44474c",
        "primary": "#0e1a28",
        "primary-container": "#232f3e",
        "on-primary": "#ffffff",
        "secondary-container": "#fe9800",
        "secondary-fixed": "#ffdcbd",
        "primary-fixed": "#d7e3f7",
        surface: "#f7fafa",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        "headline-lg": ["Inter", "sans-serif"],
        "headline-md": ["Inter", "sans-serif"],
        "headline-sm": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],
        "label-bold": ["Inter", "sans-serif"],
        "label-medium": ["Inter", "sans-serif"],
        "price-lg": ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
