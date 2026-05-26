import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { forgotPassword } from "../api/authApi";
import logo from "../assets/Logoo.png";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { toast } from "react-toastify";

/**
 * ForgotPassword - Premium glassmorphism interface
 */
export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const error = !email.trim()
        ? "Email is required"
        : !emailPattern.test(email)
            ? "Enter a valid email address"
            : "";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);

        if (error) return;
        try {
            setLoading(true);
            const res = await forgotPassword({ email });
            toast.success(res?.message || "Verification link sent! Check your inbox.");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to trigger recovery request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/40 backdrop-blur-md animate-in fade-in duration-300">
            <Card className="w-full max-w-md rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                <CardContent className="p-8">
                    {/* Background Visual Glow */}
                    <div className="absolute top-0 left-1/4 -translate-y-1/2 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Logo & Header */}
                    <div className="flex items-center gap-3.5 mb-8 relative z-10">
                        <img src={logo} alt="logo" className="w-12 h-12 object-contain" />
                        <div className="leading-tight">
                            <h1 className="text-xl font-bold tracking-tight text-foreground">Forgot Password</h1>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Enter your email to receive recovery link
                            </p>
                        </div>
                    </div>

                    {/* Form Controls */}
                    <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-muted-foreground tracking-wide uppercase pl-1">Registered Email Address</Label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <Mail size={16} />
                                </span>
                                <Input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-2xl border border-border/85 bg-background/50 pl-11 pr-4 py-6 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-200"
                                />
                            </div>
                            {submitted && error && (
                                <p className="text-xs text-destructive pl-1">{error}</p>
                            )}
                        </div>

                        {/* Submit button */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/95 rounded-2xl font-semibold shadow-md shadow-primary/10 hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                        >
                            <span>{loading ? "Sending link..." : "Send Recovery Instructions"}</span>
                            {!loading && <Send size={14} />}
                        </Button>
                    </form>

                    {/* Navigation Actions */}
                    <div className="mt-6 pt-1 text-center relative z-10 border-t border-border/40">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary hover:underline transition-all"
                        >
                            <ArrowLeft size={13} />
                            Back to authentication login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}