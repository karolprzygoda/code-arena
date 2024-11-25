"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Laptop, Moon, Sun } from "lucide-react";

const themes = ["system", "light", "dark"] as const;

const ThemeButton = () => {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={cn("flex items-center rounded-full border p-0.5")}>
      {themes.map((t) => {
        const isActive = theme === t;
        return (
          <button
            key={t}
            className={cn(
              "rounded-full p-1.5 transition hover:scale-110",
              isActive && "bg-secondary",
            )}
            onClick={() => setTheme(t)}
          >
            {t === "system" && <Laptop aria-hidden="true" className="size-4" />}
            {t === "light" && (
              <Sun
                aria-hidden="true"
                className={cn(
                  "size-4",
                  isActive && "fill-black dark:fill-white",
                )}
              />
            )}
            {t === "dark" && (
              <Moon
                aria-hidden="true"
                className={cn(
                  "size-4",
                  isActive && "fill-black dark:fill-white",
                )}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ThemeButton;
