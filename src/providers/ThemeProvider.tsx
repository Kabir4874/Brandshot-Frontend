"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Theme = "light" | "dark";
type ThemeCtx = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeCtx>({
  theme: "dark",
  setTheme: () => {},
  toggle: () => {},
});

const THEME_KEY = "nb.theme";

function applyTheme(t: Theme) {
  const root = document.documentElement;
  if (t === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  localStorage.setItem(THEME_KEY, t);
}

function readInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(THEME_KEY) as Theme | null;
  if (stored === "light" || stored === "dark") return stored;
  const prefersDark = window.matchMedia?.(
    "(prefers-color-scheme: dark)"
  )?.matches;
  return prefersDark ? "dark" : "light";
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<Theme>(() => readInitialTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => {
      const stored = localStorage.getItem(THEME_KEY) as Theme | null;
      if (!stored) {
        const next: Theme = media.matches ? "dark" : "light";
        applyTheme(next);
        setThemeState(next);
      }
    };
    media.addEventListener?.("change", listener);
    return () => media.removeEventListener?.("change", listener);
  }, []);

  const api = useMemo<ThemeCtx>(
    () => ({
      theme,
      setTheme: (t) => setThemeState(t),
      toggle: () => setThemeState((p) => (p === "dark" ? "light" : "dark")),
    }),
    [theme]
  );

  return <ThemeContext.Provider value={api}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
