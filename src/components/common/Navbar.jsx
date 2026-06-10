import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { LogOut, Moon, Sun, Activity, Search } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "react-router-dom";
import { setJobSearch } from "../../store/slices/jobSlice";

const Navbar = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { theme, setTheme } = useTheme();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const isJobsPage = location.pathname === "/jobs";

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    const handleLogout = () => {
        dispatch(logout());

        toast.info("Logged out successfully");

        navigate("/login", { replace: true });
    };

    const initial = user?.name
        ? user.name.charAt(0).toUpperCase()
        : "U";

    return (
        <nav className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 gap-2">

                {/* Left */}
                <div className="flex items-center gap-3">
                    <SidebarTrigger className="h-9 w-9 rounded-xl border border-transparent text-muted-foreground transition-all duration-200 hover:border-border hover:bg-muted hover:text-foreground" />

                    {/* Workspace Status */}
                    <div className="hidden md:flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1.5">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>

                        <span className="text-xs font-medium text-muted-foreground">
                            Workspace Active
                        </span>
                    </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-2 w-[70%] sm:w-auto justify-end md:w-auto">
                    {/* Search (only on Jobs page) */}
                    {isJobsPage && (
                        <div className="relative w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search jobs..."
                                className="pl-10 pr-9 bg-muted/50 placeholder:text-muted-foreground focus:bg-muted/50"
                                onChange={(e) =>
                                    dispatch(setJobSearch(e.target.value))
                                }
                            />
                        </div>
                    )}

                    {/* Theme Toggle */}
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleTheme}
                        className="h-9 w-9 rounded-xl border-border bg-background/60 transition-all duration-200 hover:bg-muted active:scale-95"
                    >
                        {theme === "dark" ? (
                            <Sun className="h-4 w-4 text-amber-500" />
                        ) : (
                            <Moon className="h-4 w-4 text-indigo-600" />
                        )}
                    </Button>

                    {/* User */}
                    {isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="group relative cursor-pointer">
                                    <div className="absolute-inset-0.5 rounded-full from-primary/40 to-indigo-500/40 opacity-0 blur transition duration-300 group-hover:opacity-100" />

                                    <Avatar className="relative h-9 w-9 border border-border bg-card shadow-sm">
                                        <AvatarFallback className="bg-primary items-center text-md font-semibold text-primary-foreground">
                                            {initial}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="end"
                                className="w-64 rounded-2xl border border-border/80 bg-card/95 p-2 backdrop-blur-xl"
                            >
                                <DropdownMenuLabel className="p-3">
                                    <div className="flex flex-col space-y-1">
                                        <span className="text-sm font-semibold text-foreground">
                                            {user?.name || "User"}
                                        </span>

                                        <span className="truncate text-xs text-muted-foreground">
                                            {user?.email || "user@example.com"}
                                        </span>
                                    </div>
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="mt-1 cursor-pointer rounded-xl p-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 focus:bg-destructive/10"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout Session
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                onClick={() => navigate("/login")}
                            >
                                Log In
                            </button>

                            <button
                                type="button"
                                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 active:scale-95"
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