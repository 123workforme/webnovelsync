module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "white",
        foreground: "#0f172a",
        primary: {
          DEFAULT: "#4895ef",
          light: "#4cc9f0",
          dark: "#3f37c9",
          foreground: "white",
        },
        secondary: {
          DEFAULT: "#2dd4bf",
          foreground: "white",
        },
        warning: {
          DEFAULT: "#f72585",
          foreground: "white",
        },
        danger: {
          DEFAULT: "#ef4444",
          foreground: "white",
        },
        muted: {
          DEFAULT: "#f1f5f9",
          foreground: "#64748b",
        },
        border: "#e2e8f0",
        webnovel: {
          primary: "#4895ef",
          "primary-light": "#4cc9f0",
          "primary-dark": "#3f37c9",
          success: "#2dd4bf",
          warning: "#f72585",
          danger: "#ef4444",
          light: "#f8f9fa",
          dark: "#212529",
        }
      },
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1400px",
        },
      },
      fontFamily: {
        'webnovel': ['Segoe UI', '-apple-system', 'BlinkMacSystemFont', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'webnovel': '6px',
      },
      transitionProperty: {
        'webnovel': 'all',
      },
      transitionDuration: {
        'webnovel': '200ms',
      },
      transitionTimingFunction: {
        'webnovel': 'ease',
      },
    },
  },
  plugins: [],
}
