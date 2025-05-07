import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export default function ThemeSwitcher() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    } else {
      // Defina o modo de acordo com a preferência do sistema
      setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <Button
      onClick={() => setDarkMode(!darkMode)}
    >
      {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    </Button>
  );
}
