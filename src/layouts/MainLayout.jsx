import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "../components/common/AppSidebar.jsx";
import Navbar from "../components/common/Navbar.jsx";

function MainLayout() {
    return (
        <SidebarProvider>
            <div className="flex min-h-svh w-full bg-background">
                {/* Sidebar — always visible (shows behind popup) */}
                <AppSidebar />

                <div className="flex min-w-0 flex-1 flex-col">
                    {/* Navbar — always visible (shows behind popup) */}
                    <Navbar />

                    <main className="flex-1 overflow-x-hidden bg-background">
                        <Outlet />
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}

export default MainLayout;
