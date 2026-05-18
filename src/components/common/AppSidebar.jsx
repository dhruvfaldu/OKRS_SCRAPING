import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton, } from "@/components/ui/sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Plus, BarChart, LogOut } from "lucide-react";
import { useSidebar } from "../ui/sidebar";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import logo from "../../assets/Logoo.png";

export default function AppSidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { state, setOpenMobile, isMobile } = useSidebar();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const dispatch = useDispatch();
    const isCollapsed = state === "collapsed";

    const handleLogout = async () => {
        try {
            // Wait until API call and Redux state update complete
            await dispatch(logout()).unwrap();

            // Close mobile sidebar if open
            if (isMobile) {
                setOpenMobile(false);
            }

            // Redirect after successful logout
            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const menuItems = [
        { title: "Home", url: "/", icon: Home },
        { title: "Create Job", url: "/create", icon: Plus },
        { title: "Jobs", url: "/jobs", icon: BarChart },
    ];

    return (
        <Sidebar collapsible="icon" className="bg-sidebar text-sidebar-foreground border-r border-sidebar-border min-h-screen">
            <SidebarContent >
                {/* HEADER */}
                <div className="p-4">
                    {!isCollapsed && (
                        <div className="flex items-center justify-between mt-2 mb-4">
                            <Link to="/" className="flex items-center gap-2 min-w-0">
                                {/* <div className="w-9 h-9 bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center rounded-lg shrink-0">
                                    🕷
                                </div> */}
                                <img src={logo} alt="logo" className="w-11 h-11 object-contain" />
                                <div className="flex flex-col min-w-0">
                                    <span className="font-bold text-sidebar-foreground text-xl truncate">Universal</span>
                                    <span className="text-xs text-sidebar-foreground/70 truncate">Web Scraper</span>
                                </div>
                            </Link>
                        </div>
                    )}
                </div>
                {/*MENU */}
                <SidebarGroup>
                    <SidebarMenu>
                        {menuItems.map((item) => {
                            const isJobsItem = item.url === "/jobs";
                            const isActive = isJobsItem
                                ? location.pathname.startsWith("/jobs") || location.pathname.startsWith("/results")
                                : location.pathname === item.url;
                            const Icon = item.icon;

                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive}
                                        tooltip={item.title}
                                        className="transition-all text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground data-[active=true]:hover:bg-sidebar-primary/90 data-[state=collapsed]:justify-center"
                                    >
                                        <Link
                                            to={item.url}
                                            className="flex items-center gap-3 px-3 py-2 rounded-md mb-2"
                                            onClick={() => {
                                                if (isMobile) {
                                                    setOpenMobile(false);
                                                }
                                            }}
                                        >
                                            <Icon size={18} />
                                            <span className="data-[state=collapsed]:hidden">
                                                {item.title}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer — Logout button */}
            {isAuthenticated && (
                <SidebarFooter className="p-3 border-t border-sidebar-border">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground transition-colors cursor-pointer"
                    >
                        <LogOut size={18} className="shrink-0" />
                        {!isCollapsed && <span>Log Out</span>}
                    </button>
                </SidebarFooter>
            )}
        </Sidebar>
    );
}