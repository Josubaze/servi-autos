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
        'black-nav': '#161616', 
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(90deg, #000000, #0a0010, #140020, #0a0010, #000000)',
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        knewave: ['var(--font-Knewave)'],  // Aquí agregamos Knewave
      },
    },
  },
  plugins: [],
};
export default config;