import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        toast.info("Logged out successfully");
        navigate("/login", { replace: true });
    };

    const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

    const ghostBtn =
        "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-muted-foreground hover:bg-muted hover:text-foreground";

    return (
        <nav className="sticky top-0 z-50 bg-background border-b border-border">
            <div className="flex items-center justify-between h-16 px-3 sm:px-4">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="md:hidden" />
                    <SidebarTrigger className="hidden md:inline-flex" />
                </div>

                <div className="flex gap-2">
                    {isAuthenticated ? (
                        <DropdownMenu>
                            {/* Avatar Trigger */}
                            <DropdownMenuTrigger asChild>
                                <Avatar className="cursor-pointer h-9 w-9">
                                    <AvatarFallback className="bg-primary text-white">
                                        {initial}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>

                            {/* Dropdown Content */}
                            <DropdownMenuContent align="end" className="w-56">
                                {/* User Info */}
                                <DropdownMenuLabel>
                                    <div className="flex flex-col space-y-1">
                                        <span className="font-medium">{user?.name || "User"}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {user?.email || "user@example.com"}
                                        </span>
                                    </div>
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator />

                                {/* Logout */}
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="text-red-500 cursor-pointer"
                                >
                                    <LogOut size={15} className="mr-2" /> Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <button type="button" className={ghostBtn} onClick={() => navigate("/login")}>
                                Log In
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                                onClick={() => navigate("/signup")}
                            >
                                Sign Up
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;