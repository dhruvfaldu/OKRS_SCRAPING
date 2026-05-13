import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react";

function NotFound() {
    return (
        <div className="flex items-center justify-center w-full min-h-[70vh] mx-auto px-4 py-8">
            <div className="w-full max-w-md flex flex-col items-center justify-center border gap-4 border-border rounded-2xl bg-card p-8 text-center shadow-sm">
                <div className="text-xs font-medium px-2 py-1 rounded-md bg-muted text-muted-foreground">
                    ERROR 404
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Page not found</h1>
                <p className="text-muted-foreground text-sm">
                    The page you are looking for does not exist or has been moved.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 border border-border px-4 py-2.5 bg-background rounded-xl hover:bg-muted transition-colors text-sm font-medium"
                >
                    <ArrowLeft size={16} />
                    Go to Home
                </Link>
            </div>
        </div>
    )
}

export default NotFound