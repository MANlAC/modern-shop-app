import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="relative flex h-8 w-[56px] shrink-0 cursor-pointer items-center rounded-full border border-border/50 bg-secondary/80 px-1 transition-colors duration-300 hover:bg-secondary"
    >
      {/* Track glow */}
      <div
        className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
          theme === "dark"
            ? "bg-primary/5 opacity-100"
            : "bg-primary/5 opacity-0"
        }`}
      />

      {/* Sliding thumb */}
      <div
        className={`relative z-10 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          theme === "dark" ? "translate-x-[28px]" : "translate-x-0"
        }`}
      >
        {theme === "dark" ? (
          <Moon className="size-3" />
        ) : (
          <Sun className="size-3" />
        )}
      </div>

      {/* Fixed icons on each side */}
      <Sun
        className={`absolute left-[7px] size-3 transition-colors duration-300 ${
          theme === "light" ? "text-primary/40" : "text-muted-foreground/30"
        }`}
      />
      <Moon
        className={`absolute right-[7px] size-3 transition-colors duration-300 ${
          theme === "dark" ? "text-primary/40" : "text-muted-foreground/30"
        }`}
      />
    </button>
  );
}
