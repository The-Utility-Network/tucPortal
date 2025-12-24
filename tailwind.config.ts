import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        emerald: {
          "50": "#ffe5e0",
          "100": "#ffccc0",
          "200": "#ffb3a1",
          "300": "#ff9981",
          "400": "#ff8062",
          "500": "#F54029",  // Base color (Preserved)
          "600": "#db3924",
          "700": "#b3311f",
          "800": "#8a291a",
          "900": "#622016"
        },
        "solar-green": "#0F4C3A",
        "solar-gold": "#C5A059",
        "solar-gold-light": "#E8C885",
        "solar-night": "#021210",
        "solar-accent": "#F54029",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
export default config;