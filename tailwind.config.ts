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
        primary: "#404769",
        secondary: "#4E61AB",
        secondaryText: "#6F7BB1",
        secondaryBg: '#E1E5F2',
        approve: '#30AC25',
        reject: '#FA3636',
        bg3: '#ECEFFF',
        bg4: '#D7DCF4',
        user1: '#83AB8B',
        user2: '#C8EDCF',
        user3: '#468A53',
        userWarn1: '#FFEBDD',
        userWarn2: '#735C48'
      },
    },
  },
  plugins: [],
};
export default config;
