// Centralized theme configuration
export const theme = {
  colors: {
    primary: "#dc2626",
    primaryDark: "#b91c1c",
    primaryLight: "#fee2e2",
    background: "#ffffff",
    backgroundLight: "#f6f7f8",
    backgroundGray: "#fafafa",
    textDark: "#1f2937",
    textMedium: "#475569",
    textLight: "#64748b",
    textMuted: "#8c8c8c",
    border: "#e5e5e5",
    borderLight: "#e0e0e0",
    error: "#dc2626",
    errorLight: "#fee2e2",
    success: "#16a34a",
    successLight: "#dcfce7",
    warning: "#f59e0b",
    warningLight: "#fef3c7",
    info: "#3b82f6",
    infoLight: "#dbeafe",
    white: "#ffffff",
    black: "#000000",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "48px",
    "3xl": "64px",
  },
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0,0,0,0.05)",
    md: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
    lg: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
    xl: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
  },
  typography: {
    fontFamily: {
      sans: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    fontSize: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
  transitions: {
    fast: "0.15s ease-in-out",
    normal: "0.2s ease-in-out",
    slow: "0.3s ease-in-out",
  },
} as const;

export type Theme = typeof theme;
