import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { Home, Plus, BarChart, LogOut, Sparkles } from "lucide-react";

import { useSidebar } from "../ui/sidebar";

import { useSelector, useDispatch } from "react-redux";

import { logout } from "../../store/slices/authSlice";

import logo from "../../assets/Logoo.png";

export default function AppSidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const { state, setOpenMobile, isMobile } = useSidebar();

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const isCollapsed = state === "collapsed";

    const menuItems = [
        { title: "Dashboard", url: "/", icon: Home },
        { title: "Create Scraper Job", url: "/create", icon: Plus },
        { title: "Jobs", url: "/jobs", icon: BarChart },
    ];

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();

            if (isMobile) setOpenMobile(false);

            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <Sidebar
            collapsible="icon"
            className="border-r border-sidebar-border/60 bg-sidebar backdrop-blur-xl"
        >
            <SidebarContent className="flex flex-col">

                {/* Header */}
                <div className={`border-b border-sidebar-border/60 ${isCollapsed ? "px-2 py-5" : "px-4 py-5"}`}>
                    <Link
                        to="/"
                        className={`group flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}
                    >
                        <div className="relative shrink-0">
                            <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-lg opacity-70 transition-opacity duration-300 group-hover:opacity-100" />

                            <div
                                className={`relative flex items-center justify-center rounded-2xl transition-all duration-300 ${isCollapsed ? "h-11 w-11" : "h-12 w-12"}`}
                            >
                                <img
                                    src={logo}
                                    alt="logo"
                                    className={`object-contain transition-all duration-300 ${isCollapsed ? "h-10 w-10" : "h-10 w-10"}`}
                                />
                            </div>
                        </div>

                        {!isCollapsed && (
                            <div className="flex min-w-0 flex-col">
                                <span className="truncate text-base font-bold tracking-tight text-sidebar-foreground">
                                    Universal
                                </span>

                                <span className="truncate text-xs text-sidebar-foreground/60">
                                    Web Scraper Platform
                                </span>
                            </div>
                        )}
                    </Link>
                </div>

                {/* Workspace */}
                {/* {!isCollapsed && (
                    <div className="mx-3 mt-4 rounded-2xl border border-sidebar-border/60 bg-sidebar-accent/20 p-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 rounded-lg bg-primary/10 p-2">
                                <Sparkles className="h-4 w-4 text-primary" />
                            </div>

                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-sidebar-foreground">
                                    Workspace Active
                                </span>

                                <span className="mt-1 text-xs leading-5 text-sidebar-foreground/60">
                                    All scraping systems are running smoothly.
                                </span>
                            </div>
                        </div>
                    </div>
                )} */}

                {/* Navigation */}
                <SidebarGroup className="mt-3 px-3">
                    {!isCollapsed && (
                        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-sidebar-foreground/40">
                            Navigation
                        </p>
                    )}

                    <SidebarMenu className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;

                            const isActive =
                                item.url === "/jobs"
                                    ? location.pathname.startsWith("/jobs") ||
                                    location.pathname.startsWith("/results")
                                    : location.pathname === item.url;

                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive}
                                        tooltip={item.title}
                                        className={`group h-12 rounded-2xl border border-transparent transition-all duration-200 hover:bg-sidebar-accent/40 hover:text-sidebar-accent-foreground data-[active=true]:border-primary/10 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow-lg data-[active=true]:shadow-primary/10 ${isCollapsed ? "justify-center px-0" : "px-3"}`}
                                    >
                                        <Link
                                            to={item.url}
                                            className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}
                                            onClick={() => isMobile && setOpenMobile(false)}
                                        >
                                            <div
                                                className={`flex items-center justify-center rounded-xl transition-colors ${isCollapsed ? "h-10 w-10" : "h-8 w-8"
                                                    } ${isCollapsed
                                                        ? ""
                                                        : isActive
                                                            ? "bg-white/10"
                                                            : "bg-sidebar-accent/30 group-hover:bg-sidebar-accent/50"
                                                    }`}
                                            >
                                                <Icon size={17} />
                                            </div>

                                            {!isCollapsed && (
                                                <span className="text-sm font-medium">
                                                    {item.title}
                                                </span>
                                            )}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>

                <div className="flex-1" />
            </SidebarContent>

            {/* Footer */}
            {isAuthenticated && (
                <SidebarFooter className="border-t border-sidebar-border/60 p-3">
                    <button
                        onClick={handleLogout}
                        className={`group flex h-12 w-full items-center rounded-2xl border border-transparent text-sm font-medium text-sidebar-foreground transition-all duration-200 hover:bg-red-500/10 hover:text-red-500 ${isCollapsed ? "justify-center px-0" : "gap-3 px-3"}`}
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sidebar-accent/30 transition-colors group-hover:bg-red-500/10">
                            <LogOut size={17} />
                        </div>

                        {!isCollapsed && <span>Log Out</span>}
                    </button>
                </SidebarFooter>
            )}
        </Sidebar>
    );
}