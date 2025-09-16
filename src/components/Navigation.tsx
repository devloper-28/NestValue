import { Button } from "./ui/button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const { theme, setTheme, actualTheme } = useTheme();
  
  const pages = [
    { id: 'home', label: 'Home' },
    { id: 'input', label: 'Plan Investment' },
    { id: 'results', label: 'Results' },
    { id: 'about', label: 'About' }
  ];

  const toggleTheme = () => {
    setTheme(actualTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-sm">FI</span>
            </div>
            <span className="font-semibold text-lg text-foreground">FinanceIQ</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {pages.map((page) => (
                <Button
                  key={page.id}
                  variant={currentPage === page.id ? "default" : "ghost"}
                  onClick={() => onPageChange(page.id)}
                  className="px-4 py-2"
                >
                  {page.label}
                </Button>
              ))}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="ml-2 p-2"
              title={`Switch to ${actualTheme === 'light' ? 'dark' : 'light'} mode`}
            >
              {actualTheme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}