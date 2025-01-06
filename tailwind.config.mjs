/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [require("daisyui")],
  theme: {
    colors: {
      "about-section": "#191E24",
    },
  },
};

// daisyUI config (optional)
/** @type {import('daisyui').Config} */
export const daisyui = {
  themes: [
    {
      dark: {
        ...require("daisyui/src/theming/themes")["dark"],
        primary: "#A1C6EA",
        "about-text": "#E0E0E0 ",
      },
      light: {
        ...require("daisyui/src/theming/themes")["light"],
        primary: "#004DA5",
        "about-text": "#E0E0E0 ",
      },
    },
    "light",
    "dark"
  ],
};
