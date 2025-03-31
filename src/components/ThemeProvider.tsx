
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  // Force dark mode before initialization if system prefers it
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    }
  }, []);

  // Get the initial theme, with better system detection for first-time or private browsing
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem(storageKey) as Theme;
    
    // System preference check 
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // override default value to ensure we use system preference first
    defaultTheme = 'system';
    
    // If the stored theme exists, use it
    if (storedTheme) {
      return storedTheme;
    }
    
    // If defaultTheme is 'system' or no theme is stored, use system
    return 'system';
  });

  // Apply the theme to the document
  useEffect(() => {    
    const root = window.document.documentElement
    
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const systemTheme = mediaQuery.matches ? "dark" : "light"
      
      root.classList.add(systemTheme)
      
      // Force dark mode related styles when system prefers dark
      if (systemTheme === 'dark') {
        root.style.colorScheme = 'dark';
      }
      return
    }

    root.classList.add(theme)
  }, [theme])

  // Set up system theme listener
  useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      
      // Define the theme update function
      const updateTheme = (e: MediaQueryListEvent) => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(e.matches ? "dark" : "light");
      };
      
      // Event listener
      mediaQuery.addEventListener('change', updateTheme);
      
      // Clean up on unmount
      return () => mediaQuery.removeEventListener('change', updateTheme);
    }
  }, [theme]);

  // Apply the system theme immediately on first render
  useEffect(() => {
    if (theme === "system") {
      const root = window.document.documentElement;
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      
      // Ensure we're applying the system preference correctly on first render
      root.classList.remove("light", "dark");
      root.classList.add(isDark ? "dark" : "light");
    }
  }, []);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
