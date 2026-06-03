import React from "react";
import Loader from "./Loader";
import logo from "../../assets/Logoo.png";

/**
 * PageLoader - Premium SaaS Centered Page Loader
 */
export default function PageLoader({ message = "Loading workspace..." }) {
    return (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background/80 backdrop-blur-md transition-all duration-300">
            <div className="flex flex-col items-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
                {/* Pulsating logo + rotating border container */}
                <div className="relative flex items-center justify-center">
                    <div className="absolute -inset-4 rounded-full border-2 border-primary/20 border-t-primary animate-spin duration-1000" />
                    <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center shadow-lg relative overflow-hidden">
                        <img src={logo} alt="logo" className="w-10 h-10 object-contain animate-pulse" />
                    </div>
                </div>

                {/* Message */}
                <div className="text-center space-y-2">
                    <p className="text-sm font-semibold tracking-wide text-foreground uppercase animate-pulse">
                        {message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Please wait while we sync dashboard metrics
                    </p>
                </div>
            </div>
        </div>
    );
}
