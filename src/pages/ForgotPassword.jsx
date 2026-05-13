import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { forgotPassword } from "../api/authApi";
import logo from "../assets/Logoo.png";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const error = !email.trim()
        ? "Email is required"
        : !emailPattern.test(email)
            ? "Enter a valid email"
            : "";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);

        if (error) return;
        try {
            setLoading(true);
            const res = await forgotPassword({ email });
            alert(res.message); // backend already message ape chhe

        } catch (err) {
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/20 backdrop-blur-[3px]">

            <Card className="w-full max-w-md rounded-2xl border border-border shadow-2xl">

                <CardContent className="p-6 sm:p-8">

                    {/* 🔥 Header with Logo (same as login) */}
                    <div className="flex items-center gap-3 mb-6">
                        <img
                            src={logo}
                            alt="logo"
                            className="w-12 h-12 object-contain flex-shrink-0"
                        />
                        <div className="leading-tight">
                            <h1 className="text-2xl font-semibold">Forgot Password</h1>
                            <p className="text-sm text-muted-foreground">
                                Enter your email to receive reset link
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {submitted && error && (
                                <p className="text-xs text-destructive">{error}</p>
                            )}
                        </div>

                        <Button type="submit" disabled={loading} className="w-full cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>
                            {loading ? "Sending..." : "Send Reset Link"}
                        </Button>

                    </form>

                    {/* Footer */}
                    <p className="mt-4 text-sm text-muted-foreground text-center">
                        Remember password?{" "}
                        <Link to="/login" className="text-primary hover:underline">
                            Back to Login
                        </Link>
                    </p>

                </CardContent>
            </Card>
        </div>
    );
}