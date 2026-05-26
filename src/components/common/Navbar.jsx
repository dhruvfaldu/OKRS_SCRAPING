import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

const Navbar = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { theme, setTheme } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const handleLogout = () => {
        dispatch(logout());
        toast.info("Logged out successfully");
        navigate("/login", { replace: true });
    };

    const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

    const ghostBtn =
        "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-muted-foreground hover:bg-muted hover:text-foreground";

    return (
        <nav className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur-md transition-all duration-300">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6">

                {/* Left controls */}
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="h-9 w-9 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer" />
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-3">

                    {/* Theme switcher button */}
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleTheme}
                        className="h-9 w-9 rounded-xl cursor-pointer border border-border/80 bg-background/50 hover:bg-muted text-muted-foreground hover:text-foreground hover:scale-105 transition-all duration-300"
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {theme === 'dark' ? (
                            <Sun className="h-4.5 w-4.5 text-indigo-500 animate-in spin-in-90 duration-300" />
                        ) : (
                            <Moon className="h-4.5 w-4.5 text-indigo-600 animate-in spin-in-90 duration-300" />
                        )}
                    </Button>

                    {/* Authenticated user menu */}
                    {isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="relative cursor-pointer group">
                                    <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-primary to-indigo-600 opacity-60 blur-xs group-hover:opacity-100 transition duration-300" />
                                    <Avatar className="h-9 w-9 relative border border-border bg-card">
                                        <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold select-none">
                                            {initial}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-60 rounded-2xl p-1.5 border border-border/80 bg-card/95 backdrop-blur-md shadow-lg animate-in slide-in-from-top-4 duration-200">
                                <DropdownMenuLabel className="p-3">
                                    <div className="flex flex-col space-y-1">
                                        <span className="font-semibold text-foreground text-sm leading-none">{user?.name || "User"}</span>
                                        <span className="text-xs text-muted-foreground truncate leading-none mt-1">
                                            {user?.email || "user@example.com"}
                                        </span>
                                    </div>
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator className="my-2" />

                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="p-2.5 rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 cursor-pointer"
                                >
                                    <LogOut className="h-4 w-4 mr-2.5" />
                                    Logout Session
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="px-3.5 py-1.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200 cursor-pointer"
                                onClick={() => navigate("/login")}
                            >
                                Log In
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm shadow-primary/10 hover:scale-102 hover:shadow-md transition-all duration-200 cursor-pointer"
                                onClick={() => navigate("/signup")}
                            >
                                Sign Up
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;