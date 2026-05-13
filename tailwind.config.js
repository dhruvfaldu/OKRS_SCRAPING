export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        bg: "var(--color-bg)",
        card: "var(--color-card)",
        text: "var(--color-text)",
        subtext: "var(--color-subtext)",
        border: "var(--color-border)",
        success: "var(--color-success)",
        error: "var(--color-error)",
        warning: "var(--color-warning)",
        info: "var(--color-info)",
      },
       fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
};