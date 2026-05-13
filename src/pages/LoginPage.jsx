import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../store/slices/authSlice";
import { useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import logo from "../assets/Logoo.png";
import { toast } from "react-toastify";

export default function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: "", password: "" });
    const [submitted, setSubmitted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { error: authError, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (submitted && authError) {
            toast.error(authError);
        }
    }, [authError, submitted]);

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (submitted && !authError && isAuthenticated) {
            toast.success("Logged in successfully!");
        }
    }, [isAuthenticated, authError, submitted]);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    const errors = {
        email: !form.email.trim()
            ? "Email is required"
            : !emailPattern.test(form.email)
                ? "Enter a valid email address"
                : "",
        password: !form.password
            ? "Password is required"
            : !passwordPattern.test(form.password)
                ? "Password must be 8+ chars, include uppercase, lowercase, number & special character"
                : "",
    };
    const hasError = Boolean(errors.email || errors.password);

    const handleChange = (field) => (e) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        if (hasError) return;

        dispatch(login({
            email: form.email,
            password: form.password,
        }));
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/20 backdrop-blur-[3px]">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-2xl">

                <div className="flex items-center gap-3 mb-6">
                    <img src={logo} alt="logo" className="w-12 h-12 object-contain flex-shrink-0" />
                    <div className="leading-tight">
                        <h1 className="text-2xl font-semibold">Welcome back</h1>
                        <p className="text-sm text-muted-foreground">
                            Sign in to access your scraping workspace.
                        </p>
                    </div>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                    {authError && (
                        <div className="bg-destructive/10 text-destructive text-sm px-3 py-2 rounded-xl">
                            {authError}
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange("email")}
                            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                        />
                        {submitted && errors.email && (
                            <p className="text-xs text-destructive">{errors.email}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password"
                                value={form.password}
                                onChange={handleChange("password")}
                                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                            />
                            <button
                                type="button"
                                className="absolute top-1/2 right-3 -translate-y-1/2"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {submitted && errors.password && (
                            <p className="text-xs text-destructive">{errors.password}</p>
                        )}
                    </div>

                    <div className="text-right">
                        <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                        Sign In
                    </button>
                </form>

                <p className="mt-4 text-sm text-muted-foreground text-center">
                    New here?{" "}
                    <Link to="/signup" className="text-primary hover:underline font-medium">
                        Create account
                    </Link>
                </p>
            </div>
        </div>
    );
}
