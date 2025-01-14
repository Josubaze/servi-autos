import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'black-nav': '#161616',
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(90deg, #000020, #0a0210, #180020, #0a0210, #000020)',
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",      
      },
      fontFamily: {
        knewave: ['var(--font-Knewave)'],
      },
      animation: {
        gradient: "gradient-move 5s infinite",
      },
      keyframes: {
        "gradient-move": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui(),
    function ({ addComponents } : any) {
      addComponents({
        '.scrollbar-custom::-webkit-scrollbar': {
          width: '8px', // Ancho de la barra
        },
        '.scrollbar-custom::-webkit-scrollbar-thumb': {
          backgroundColor: '#6b7280', // Color del thumb
          borderRadius: '4px', // Esquinas redondeadas
        },
        '.scrollbar-custom::-webkit-scrollbar-track': {
          backgroundColor: '#f3f4f6', // Color de la pista
        },
        '.scrollbar-custom::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#4b5563', // Color del thumb al hacer hover
        },
      });
    },
  ],
};

export default config;
