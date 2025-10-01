import type { Config } from "tailwindcss";

const config: Config = {
  // This tells Tailwind to enable dark mode when the 'dark' class is present on the html tag
  darkMode: "class",
  
  // This is the most important part. It tells Tailwind which files to scan for CSS classes.
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // You can add custom theme colors, fonts, etc. here in the future
    },
  },
  plugins: [],
};
export default config;