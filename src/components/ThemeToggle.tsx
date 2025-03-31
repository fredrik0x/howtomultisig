
import { Moon, Sun, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/ThemeProvider"

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="nav" size="sm" className={`text-slate-900 dark:text-white ${className}`}>
          {theme === "light" && <Sun className="h-4 w-4 text-amber-500" />}
          {theme === "dark" && <Moon className="h-4 w-4 text-primary" />}
          {theme === "system" && <Monitor className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border-accent/30">
        <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer hover:bg-accent/10">
          <Sun className="mr-2 h-4 w-4 text-amber-500" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer hover:bg-accent/10">
          <Moon className="mr-2 h-4 w-4 text-primary" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer hover:bg-accent/10">
          <Monitor className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
