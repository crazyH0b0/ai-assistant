"use client"
import { useTheme } from "next-themes"

export function useThemeMode() {
  const { setTheme, theme } = useTheme()
  return {
    setTheme,
    theme,
  }
  
}