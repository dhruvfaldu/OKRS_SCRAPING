import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { resetPassword } from "../services/sacrperAuth";
import logo from "../assets/Logoo.png";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";

/**
 * ResetPassword - SaaS-style high-end password change interface
 */
export default function ResetPassword() {
  const navigate = useNavigate();

  // Token + Email state from query params
  const [tokenData] = useState(() => {
    const query = new URLSearchParams(window.location.search);
    return {
      token: query.get("token") || "",
      email: query.get("email") || "",
    };
  });

  // Password fields
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  // Redirect if missing credentials
  useEffect(() => {
    if (!tokenData.token || !tokenData.email) {
      toast.error("Invalid reset link. Redirecting back...");
      navigate("/login");
    }
  }, [tokenData, navigate]);

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

  const errors = {
    password: !form.password
      ? "Password is required"
      : !passwordPattern.test(form.password)
        ? "Must include uppercase, lowercase, number & special character"
        : "",
    confirmPassword: !form.confirmPassword
      ? "Confirm password is required"
      : form.password !== form.confirmPassword
        ? "Passwords do not match"
        : "",
  };

  const hasError = Boolean(errors.password || errors.confirmPassword);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (hasError) return;

    try {
      setLoading(true);

      await resetPassword({
        token: tokenData.token,
        email: tokenData.email,
        password: form.password,
        password_confirmation: form.confirmPassword,
      });

      toast.success("Security keys changed! Please log in.");
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err) {
      toast.error(err.response?.data?.message || "Verification token expired or invalid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/40 backdrop-blur-md animate-in fade-in duration-300">
      <Card className="w-full max-w-md rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <CardContent className="p-8">

          {/* Background Visual Glow */}
          <div className="absolute top-0 right-1/4 -translate-y-1/2 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          {/* Logo & Header */}
          <div className="flex items-center gap-3.5 mb-6 relative z-10">
            <img src={logo} alt="logo" className="w-12 h-12 object-contain" />
            <div className="leading-tight">
              <h1 className="text-xl font-bold tracking-tight text-foreground">Reset Password</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Define your secure configuration parameters
              </p>
              {tokenData.email && (
                <div className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full text-[10px] font-semibold mt-2 select-none">
                  <ShieldCheck size={10} />
                  <span>{tokenData.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleReset} className="space-y-4 relative z-10">
            {/* New Password */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground tracking-wide uppercase pl-1">New Password</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Lock size={15} />
                </span>
                <Input
                  type={showPassword.password ? "text" : "password"}
                  placeholder="Enter new password"
                  value={form.password}
                  onChange={handleChange("password")}
                  className="w-full rounded-2xl border border-border/85 bg-background/50 pl-11 pr-11 py-6 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-200"
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
                <p className="text-xs text-destructive pl-1 leading-normal">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground tracking-wide uppercase pl-1">Verify Password</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Lock size={15} />
                </span>
                <Input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={form.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  className="w-full rounded-2xl border border-border/85 bg-background/50 pl-11 pr-11 py-6 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-200"
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
                <p className="text-xs text-destructive pl-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit change */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/95 rounded-2xl font-semibold shadow-md shadow-primary/10 hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {loading ? "Reconfiguring..." : "Update Security Settings"}
            </Button>
          </form>

          {/* Footer Back Link */}
          <div className="mt-6 pt-1 text-center relative z-10 border-t border-border/40">
            <Link
              to="/login"
              className="text-xs font-bold text-muted-foreground hover:text-primary hover:underline transition-all"
            >
              Back to Login screen
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}