import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../store/slices/authSlice";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import logo from "../assets/Logoo.png";
import { toast } from "react-toastify";

/**
 * LoginPage - Upgraded SaaS-style high-fidelity login experience
 */
export default function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: "", password: "" });
    const [submitted, setSubmitted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { error: authError, isAuthenticated, loading } = useSelector((state) => state.auth);

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
            toast.success("Welcome back! Workspace loaded.");
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
                ? "Invalid security pattern credentials"
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-md rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden flex flex-col justify-center animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                {/* Visual Glow Layer */}
                <div className="absolute top-0 left-1/4 -translate-y-1/2 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 translate-y-1/2 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Brand Header */}
                <div className="flex items-center gap-3.5 mb-8 relative z-10">
                    <img src={logo} alt="logo" className="w-12 h-12 object-contain" />
                    <div className="leading-tight">
                        <h1 className="text-xl font-bold tracking-tight text-foreground">Welcome Back</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Sign in to access your scraping workspace
                        </p>
                    </div>
                </div>

                {/* Form controls */}
                <form className="space-y-4 relative z-10" onSubmit={handleSubmit} noValidate>
                    {authError && (
                        <div className="bg-destructive/10 border border-destructive/15 text-destructive text-xs font-medium px-4 py-3 rounded-2xl animate-shake">
                            {authError}
                        </div>
                    )}

                    {/* Email Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground tracking-wide uppercase pl-1">Email Address</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                <Mail size={16} />
                            </span>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange("email")}
                                className="w-full rounded-2xl border border-border/85 bg-background/50 pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                            />
                        </div>
                        {submitted && errors.email && (
                            <p className="text-xs text-destructive pl-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">Password</label>
                            <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:underline transition">
                                Forgot?
                            </Link>
                        </div>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                <Lock size={16} />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={form.password}
                                onChange={handleChange("password")}
                                className="w-full rounded-2xl border border-border/85 bg-background/50 pl-11 pr-11 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                            />
                            <button
                                type="button"
                                className="absolute top-1/2 right-3.5 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer transition"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {submitted && errors.password && (
                            <p className="text-xs text-destructive pl-1">{errors.password}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-primary text-primary-foreground py-3.5 text-sm font-semibold hover:bg-primary/95 shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span>{loading ? "Authenticating..." : "Sign In to Scraper"}</span>
                        {!loading && <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                {/* Footer anchor */}
                <p className="mt-6 text-xs text-muted-foreground text-center relative z-10">
                    New here?{" "}
                    <Link to="/signup" className="text-primary hover:underline font-bold">
                        Create workspace account
                    </Link>
                </p>
            </div>
        </div>
    );
}
