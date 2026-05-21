import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { register } from "../store/slices/authSlice";
import { useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import logo from "../assets/Logoo.png";
import { toast } from "react-toastify";

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
    }, [isAuthenticated, navigate])

    useEffect(() => {
        if (submitted && !authError && isAuthenticated) {
            toast.success("Account created successfully!");
        }
    }, [isAuthenticated, authError, submitted]);;

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
                ? "Password must be 8+ chars, include uppercase, lowercase, number & special character"
                : "",

        confirmPassword: !form.confirmPassword
            ? "Confirm password is required"
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

        // const prevUser = localStorage.getItem("currentUser");
        dispatch(register({
            name: form.fullName,
            email: form.email,
            password: form.password,
            password_confirmation: form.confirmPassword
        }));
        // const currUser = localStorage.getItem("currentUser");
        // if (!prevUser && currUser) {
        //     toast.success("Account created successfully!");
        // }
        navigate("", { replace: true });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/20 backdrop-blur-[3px]">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-2xl">

                <div className="flex items-center gap-3 mb-6">
                    <img
                        src={logo}
                        alt="logo"
                        className="w-12 h-12 object-contain flex-shrink-0"
                    />

                    <div className="leading-tight">
                        <h1 className="text-2xl font-semibold">Create account</h1>
                        <p className="text-sm text-muted-foreground">
                            Start building and monitoring scraping jobs in minutes.
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
                        <label className="text-sm font-medium">Full Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={form.fullName}
                            onChange={handleChange("fullName")}
                            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                        />
                        {submitted && errors.fullName && (
                            <p className="text-xs text-destructive">{errors.fullName}</p>
                        )}
                    </div>

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
                                type={showPassword.password ? "text" : "password"}
                                placeholder="Create password"
                                value={form.password}
                                onChange={handleChange("password")}
                                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(() => ({ ...showPassword, password: !showPassword.password }))}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            >
                                {showPassword.password ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {submitted && errors.password && (
                            <p className="text-xs text-destructive">{errors.password}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showPassword.confirmPassword ? "text" : "password"}
                                placeholder="Re-enter password"
                                value={form.confirmPassword}
                                onChange={handleChange("confirmPassword")}
                                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(() => ({ ...showPassword, confirmPassword: !showPassword.confirmPassword }))}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            >
                                {showPassword.confirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {submitted && errors.confirmPassword && (
                            <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                        Create Account
                    </button>
                </form>

                <p className="mt-4 text-sm text-muted-foreground text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline font-medium">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
