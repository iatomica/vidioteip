export type ThemeName = "editorial-calm" | "vox-editorial" | "news-modern" | "news-dark" | "news-clean";

export interface ThemeTokens {
  name: ThemeName;
  background: string;
  backgroundAlt: string;
  surface: string;
  surfaceBorder: string;
  foreground: string;
  foregroundMuted: string;
  accent: string;
  accentHover: string;
  accentSecondary: string;
  danger: string;
  warning: string;
  success: string;
  fontFamily: string;
  headlineFont: string;
  typography: {
    fontFamily: string;
    headlineFont: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadow: string;
  badgeBackground: string;
  tickerBackground: string;
  colors: {
    background: string;
    backgroundAlt: string;
    surface: string;
    border: string;
    foreground: string;
    mutedForeground: string;
    accent: string;
    accentSecondary: string;
    danger: string;
  };
  shadows: {
    card: string;
    glow: string;
    hard: string;
  };
}

export const THEMES: Record<ThemeName, ThemeTokens> = {
  // Calm, elegant, subtle editorial theme (designed for portals like ANBariloche)
  "editorial-calm": {
    name: "editorial-calm",
    background: "#0B0D12",
    backgroundAlt: "#12151B",
    surface: "rgba(18, 22, 30, 0.85)",
    surfaceBorder: "rgba(255, 255, 255, 0.12)",
    foreground: "#F8FAFC",
    foregroundMuted: "#A0AEC0",
    accent: "#D61B1F",          // ANBariloche brand red
    accentHover: "#B91418",
    accentSecondary: "#38BDF8", // Mountain lake cyan
    danger: "#EF4444",
    warning: "#F59E0B",
    success: "#10B981",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    headlineFont: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      headlineFont: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    borderRadius: {
      sm: "6px",
      md: "10px",
      lg: "16px",
      full: "9999px",
    },
    spacing: {
      xs: "8px",
      sm: "16px",
      md: "24px",
      lg: "40px",
      xl: "64px",
    },
    shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
    badgeBackground: "#D61B1F",
    tickerBackground: "#0B0D12",
    colors: {
      background: "#0B0D12",
      backgroundAlt: "#12151B",
      surface: "rgba(18, 22, 30, 0.85)",
      border: "rgba(255, 255, 255, 0.12)",
      foreground: "#F8FAFC",
      mutedForeground: "#A0AEC0",
      accent: "#D61B1F",
      accentSecondary: "#38BDF8",
      danger: "#EF4444",
    },
    shadows: {
      card: "0 20px 40px -15px rgba(0, 0, 0, 0.7)",
      glow: "0 0 35px rgba(214, 27, 31, 0.35)",
      hard: "0 10px 30px rgba(0, 0, 0, 0.5)",
    },
  },

  // Vox / The Verge inspired bold kinetic editorial theme
  "vox-editorial": {
    name: "vox-editorial",
    background: "#0C0D11",
    backgroundAlt: "#14151C",
    surface: "#1A1B24",
    surfaceBorder: "#2E3140",
    foreground: "#FFFFFF",
    foregroundMuted: "#9DA3B4",
    accent: "#D4FF00",          // Highlighter Lime
    accentHover: "#BBEE00",
    accentSecondary: "#FF462D", // Hot Tangerine
    danger: "#FF3344",
    warning: "#FFB800",
    success: "#00E599",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    headlineFont: "'Archivo Black', 'Inter', -apple-system, sans-serif",
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      headlineFont: "'Archivo Black', 'Inter', -apple-system, sans-serif",
    },
    borderRadius: {
      sm: "2px",
      md: "4px",
      lg: "8px",
      full: "9999px",
    },
    spacing: {
      xs: "8px",
      sm: "16px",
      md: "24px",
      lg: "40px",
      xl: "64px",
    },
    shadow: "0 20px 40px rgba(0, 0, 0, 0.7)",
    badgeBackground: "#D4FF00",
    tickerBackground: "#0C0D11",
    colors: {
      background: "#0C0D11",
      backgroundAlt: "#14151C",
      surface: "#1A1B24",
      border: "#2E3140",
      foreground: "#FFFFFF",
      mutedForeground: "#9DA3B4",
      accent: "#D4FF00",
      accentSecondary: "#FF462D",
      danger: "#FF3344",
    },
    shadows: {
      card: "6px 6px 0px #000000",
      glow: "0 0 35px rgba(212, 255, 0, 0.35)",
      hard: "5px 5px 0px #D4FF00",
    },
  },

  "news-modern": {
    name: "news-modern",
    background: "#0A0E1A",
    backgroundAlt: "#10172A",
    surface: "#1E293B",
    surfaceBorder: "rgba(56, 189, 248, 0.2)",
    foreground: "#F8FAFC",
    foregroundMuted: "#94A3B8",
    accent: "#38BDF8", // Electric cyan
    accentHover: "#0284C7",
    accentSecondary: "#818CF8",
    danger: "#EF4444",
    warning: "#F59E0B",
    success: "#10B981",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    headlineFont: "'Archivo', 'Inter', sans-serif",
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      headlineFont: "'Archivo', 'Inter', sans-serif",
    },
    borderRadius: {
      sm: "6px",
      md: "12px",
      lg: "20px",
      full: "9999px",
    },
    spacing: {
      xs: "8px",
      sm: "16px",
      md: "24px",
      lg: "40px",
      xl: "64px",
    },
    shadow: "0 20px 40px -15px rgba(0, 0, 0, 0.6)",
    badgeBackground: "#EF4444",
    tickerBackground: "#0284C7",
    colors: {
      background: "#0A0E1A",
      backgroundAlt: "#10172A",
      surface: "#1E293B",
      border: "rgba(56, 189, 248, 0.2)",
      foreground: "#F8FAFC",
      mutedForeground: "#94A3B8",
      accent: "#38BDF8",
      accentSecondary: "#818CF8",
      danger: "#EF4444",
    },
    shadows: {
      card: "0 20px 40px -15px rgba(0, 0, 0, 0.6)",
      glow: "0 0 35px rgba(56, 189, 248, 0.3)",
      hard: "4px 4px 0px #38BDF8",
    },
  },

  "news-dark": {
    name: "news-dark",
    background: "#0A0A0B",
    backgroundAlt: "#141416",
    surface: "#1B1B1E",
    surfaceBorder: "rgba(217, 119, 6, 0.25)",
    foreground: "#FAFAFA",
    foregroundMuted: "#A1A1AA",
    accent: "#F59E0B", // Amber Gold
    accentHover: "#D97706",
    accentSecondary: "#FB923C",
    danger: "#DC2626",
    warning: "#EA580C",
    success: "#16A34A",
    fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, sans-serif",
    headlineFont: "'Archivo', 'Roboto', sans-serif",
    typography: {
      fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, sans-serif",
      headlineFont: "'Archivo', 'Roboto', sans-serif",
    },
    borderRadius: {
      sm: "4px",
      md: "8px",
      lg: "16px",
      full: "9999px",
    },
    spacing: {
      xs: "8px",
      sm: "16px",
      md: "24px",
      lg: "36px",
      xl: "56px",
    },
    shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
    badgeBackground: "#F59E0B",
    tickerBackground: "#B45309",
    colors: {
      background: "#0A0A0B",
      backgroundAlt: "#141416",
      surface: "#1B1B1E",
      border: "rgba(217, 119, 6, 0.25)",
      foreground: "#FAFAFA",
      mutedForeground: "#A1A1AA",
      accent: "#F59E0B",
      accentSecondary: "#FB923C",
      danger: "#DC2626",
    },
    shadows: {
      card: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
      glow: "0 0 35px rgba(245, 158, 11, 0.3)",
      hard: "4px 4px 0px #F59E0B",
    },
  },

  "news-clean": {
    name: "news-clean",
    background: "#F8FAFC",
    backgroundAlt: "#F1F5F9",
    surface: "#FFFFFF",
    surfaceBorder: "rgba(15, 23, 42, 0.08)",
    foreground: "#0F172A",
    foregroundMuted: "#64748B",
    accent: "#E11D48", // Editorial crimson
    accentHover: "#BE123C",
    accentSecondary: "#475569",
    danger: "#E11D48",
    warning: "#D97706",
    success: "#059669",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    headlineFont: "'Inter', sans-serif",
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      headlineFont: "'Inter', sans-serif",
    },
    borderRadius: {
      sm: "4px",
      md: "8px",
      lg: "12px",
      full: "9999px",
    },
    spacing: {
      xs: "8px",
      sm: "14px",
      md: "20px",
      lg: "32px",
      xl: "48px",
    },
    shadow: "0 10px 30px -10px rgba(15, 23, 42, 0.1)",
    badgeBackground: "#E11D48",
    tickerBackground: "#0F172A",
    colors: {
      background: "#F8FAFC",
      backgroundAlt: "#F1F5F9",
      surface: "#FFFFFF",
      border: "rgba(15, 23, 42, 0.08)",
      foreground: "#0F172A",
      mutedForeground: "#64748B",
      accent: "#E11D48",
      accentSecondary: "#475569",
      danger: "#E11D48",
    },
    shadows: {
      card: "0 10px 30px -10px rgba(15, 23, 42, 0.1)",
      glow: "0 0 35px rgba(225, 29, 72, 0.2)",
      hard: "4px 4px 0px #0F172A",
    },
  },
};

export function getTheme(themeName?: ThemeName): ThemeTokens {
  if (!themeName || !THEMES[themeName]) {
    return THEMES["editorial-calm"];
  }
  return THEMES[themeName];
}

export const useTheme = getTheme;
