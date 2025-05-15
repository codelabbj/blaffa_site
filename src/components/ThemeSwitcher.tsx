"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "./ui/Button"

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex gap-2">
      <Button 
        variant={theme === 'light' ? 'default' : 'outline'} 
        onClick={() => setTheme('light')}
      >
        Light
      </Button>

      <Button 
        variant={theme === 'dark' ? 'default' : 'outline'} 
        onClick={() => setTheme('dark')}
      >
        Dark
      </Button>

      <Button 
        variant={theme === 'system' ? 'default' : 'outline'} 
        onClick={() => setTheme('system')}
      >
        System
      </Button>
    </div>
  )
}