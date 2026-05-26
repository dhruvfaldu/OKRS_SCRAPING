import React from "react";
import { SearchCode, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

/**
 * NoDataFound - Premium SaaS Empty State View
 */
export default function NoDataFound({
    title = "No records located",
    description = "No active data points met your dashboard search criteria.",
    actionText = "Create scraping job",
    actionUrl = "/create",
    onActionClick,
}) {
    return (
        <div className="w-full bg-card border border-border border-dashed rounded-3xl p-10 text-center flex flex-col items-center justify-center space-y-5 animate-in fade-in-50 duration-300">
            {/* Icon Badge */}
            <div className="w-16 h-16 rounded-2xl bg-muted/60 border border-border flex items-center justify-center text-muted-foreground relative">
                <SearchCode size={28} />
                {/* Sparkle decorative */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-ping duration-1000" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />
            </div>

            {/* Info details */}
            <div className="space-y-1.5 max-w-sm">
                <h3 className="text-base font-bold text-foreground tracking-tight">
                    {title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Action triggers */}
            {(onActionClick || actionUrl) && (
                <div className="pt-1">
                    {onActionClick ? (
                        <Button
                            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm hover:shadow-md cursor-pointer flex items-center gap-1.5"
                            onClick={onActionClick}
                        >
                            <Plus size={14} />
                            {actionText}
                        </Button>
                    ) : (
                        <Link
                            to={actionUrl}
                            className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm hover:shadow-md transition-all"
                        >
                            <Plus size={14} />
                            {actionText}
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
