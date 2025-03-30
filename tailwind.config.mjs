/** @type {import('tailwindcss').Config} */
const daisyuiPlugin = require("daisyui");
const daisyuiThemes = require("daisyui/src/theming/themes"); // Import base themes correctly

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class", // Enable class-based dark mode

  theme: {
    // Use extend to ADD to Tailwind's defaults, not replace them
    extend: {
      colors: {
        // Your custom non-theme-specific color
        "about-section": "#191E24",
        // Note: "about-text" is defined within the DaisyUI themes below
        // because its value seems intended to change based on the theme.
        // If it were a fixed color regardless of theme, you'd put it here too.
      },
      // You can extend other theme properties here (spacing, fonts, etc.)
      // spacing: {
      //   '128': '32rem',
      // }
    },
  },

  plugins: [
    daisyuiPlugin, // Add DaisyUI plugin
  ],

  // DaisyUI specific configuration
  daisyui: {
    // themes: Defines the list of themes available in your application.
    themes: [
      {
        // Custom light theme definition
        light: {
          // Theme name is 'light'
          ...daisyuiThemes["light"], // Start with DaisyUI's default light theme...
          primary: "#004DA5", // ...override the primary color
          // Define your custom semantic color variable here
          // It's better to map it to a semantic name if possible,
          // but using a custom name is allowed.
          "about-text": "#333333", // Example: Darker text for light theme
          // Add other overrides like secondary, accent, base-100, base-content etc.
          // "base-100": "#ffffff",
          // "base-content": "#333333",
        },
      },
      {
        // Custom dark theme definition
        dark: {
          // Theme name is 'dark'
          ...daisyuiThemes["dark"], // Start with DaisyUI's default dark theme...
          primary: "#A1C6EA", // ...override the primary color
          // Define your custom semantic color variable here
          "about-text": "#E0E0E0", // Custom color value for dark theme
          // Add other overrides
          // "base-100": "#1d232a",
          // "base-content": "#a6adbb",
        },
      },
      // You can include other built-in themes if you want them selectable
      // "cupcake",
      // "business",
    ],

    // darkTheme: Specifies which of the themes above is activated by `class="dark"`
    darkTheme: "dark", // Use the 'dark' theme you defined above as the default dark mode

    // lightTheme: Specifies which theme is used by default (without `class="dark"`)
    lightTheme: "light", // Use the 'light' theme you defined above as the default light mode

    // base: Apply base styles? (Usually true)
    base: true,

    // styled: Apply DaisyUI component styles? (Usually true)
    styled: true,

    // utils: Add DaisyUI utility classes? (Usually true)
    utils: true,

    // logs: Show DaisyUI logs during build? (Helpful for debugging)
    logs: true,
  },
};
