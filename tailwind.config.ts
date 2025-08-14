import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
  'burgundy-primary': '#B94A5F',
  'burgundy-dark': '#962E44',
  'burgundy-light': '#F6EDE6',
      },
    },
  },
  plugins: [],
};

export default config;
