import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { register } from "../store/slices/authSlice";
import { Eye, EyeOff, User, Mail, Lock, Sparkles } from "lucide-react";
import logo from "../assets/Logoo.png";
import { toast } from "react-toastify";

/**
 * SignupPage - High fidelity signup experience mirroring Linear/Clerk
 */
export default function SignupPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false,
    });
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
            toast.success("Welcome aboard! Scraper account ready.");
        }
    }, [isAuthenticated, authError, submitted]);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const errors = {
        fullName: !form.fullName.trim() ? "Full name is required" : "",
        email: !form.email.trim()
            ? "Email is required"
            : !emailPattern.test(form.email)
                ? "Enter a valid email address"
                : "",
        password: !form.password
            ? "Password is required"
            : !passwordPattern.test(form.password)
                ? "Must be 8+ characters with dynamic upper/lower/number/special case keys"
                : "",
        confirmPassword: !form.confirmPassword
            ? "Confirmation password is required"
            : form.password !== form.confirmPassword
                ? "Passwords do not match"
                : "",
    };

    const hasError = Boolean(
        errors.fullName || errors.email || errors.password || errors.confirmPassword
    );

    const handleChange = (field) => (e) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        if (hasError) return;

        dispatch(register({
            name: form.fullName,
            email: form.email,
            password: form.password,
            password_confirmation: form.confirmPassword
        }));
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-md rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden flex flex-col justify-center animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">

                {/* Visual Glow Layer */}
                <div className="absolute top-0 right-1/4 -translate-y-1/2 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 translate-y-1/2 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Header Logo */}
                <div className="flex items-center gap-3.5 mb-6 relative z-10">
                    <img src={logo} alt="logo" className="w-12 h-12 object-contain" />
                    <div className="leading-tight">
                        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-1.5">
                            Create Account
                            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                        </h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Setup dynamic scraping jobs in minutes
                        </p>
                    </div>
                </div>

                {/* Register Form */}
                <form className="space-y-3.5 relative z-10" onSubmit={handleSubmit} noValidate>
                    {authError && (
                        <div className="bg-destructive/10 border border-destructive/15 text-destructive text-xs font-medium px-4 py-3 rounded-2xl animate-shake">
                            {authError}
                        </div>
                    )}

                    {/* Name */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase pl-1">Full Name</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                <User size={15} />
                            </span>
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={form.fullName}
                                onChange={handleChange("fullName")}
                                className="w-full rounded-2xl border border-border/85 bg-background/50 pl-11 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                            />
                        </div>
                        {submitted && errors.fullName && (
                            <p className="text-xs text-destructive pl-1">{errors.fullName}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase pl-1">Email Address</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                <Mail size={15} />
                            </span>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange("email")}
                                className="w-full rounded-2xl border border-border/85 bg-background/50 pl-11 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                            />
                        </div>
                        {submitted && errors.email && (
                            <p className="text-xs text-destructive pl-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase pl-1">Secure Password</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                <Lock size={15} />
                            </span>
                            <input
                                type={showPassword.password ? "text" : "password"}
                                placeholder="Create password"
                                value={form.password}
                                onChange={handleChange("password")}
                                className="w-full rounded-2xl border border-border/85 bg-background/50 pl-11 pr-11 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(() => ({ ...showPassword, password: !showPassword.password }))}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer transition"
                            >
                                {showPassword.password ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>
                        {submitted && errors.password && (
                            <p className="text-xs text-destructive pl-1 leading-normal">{errors.password}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase pl-1">Verify Password</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                <Lock size={15} />
                            </span>
                            <input
                                type={showPassword.confirmPassword ? "text" : "password"}
                                placeholder="Re-enter password"
                                value={form.confirmPassword}
                                onChange={handleChange("confirmPassword")}
                                className="w-full rounded-2xl border border-border/85 bg-background/50 pl-11 pr-11 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(() => ({ ...showPassword, confirmPassword: !showPassword.confirmPassword }))}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer transition"
                            >
                                {showPassword.confirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>
                        {submitted && errors.confirmPassword && (
                            <p className="text-xs text-destructive pl-1">{errors.confirmPassword}</p>
                        )}
                    </div>

                    {/* Submit Register Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-primary text-primary-foreground py-3 text-sm font-semibold hover:bg-primary/95 shadow-md shadow-primary/10 hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed pt-2.5"
                    >
                        {loading ? "Creating Account..." : "Create Free Account"}
                    </button>
                </form>

                {/* Redirect Footer */}
                <p className="mt-5 text-xs text-muted-foreground text-center relative z-10">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline font-bold">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
