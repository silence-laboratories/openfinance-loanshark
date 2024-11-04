/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#404769",
        secondary: "#4E61AB",
        secondaryText: "#6F7BB1",
        secondaryBg: "#E1E5F2",
        approve: "#30AC25",
        reject: "#FA3636",
      },
    },
  },
  plugins: [],
};
