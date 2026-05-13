import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { resetPassword } from "../api/authApi";
import logo from "../assets/Logoo.png";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  // 🔐 token + email state
  const [tokenData, setTokenData] = useState({
    token: "",
    email: "",
  });

  // 🔑 form state
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // 📥 Read token + email from URL
  useEffect(() => {
    const query = new URLSearchParams(location.search);

    const token = query.get("token");
    const email = query.get("email");

    if (!token || !email) {
      alert("Invalid or expired reset link");
      navigate("/login");
      return;
    }

    setTokenData({ token, email });

    console.log("Token Data:", { token, email }); // debug
  }, [location, navigate]);

  // 🔐 password validation
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

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

  // 🔄 handle input change
  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  // 🚀 reset password API call
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

      alert("Password updated successfully!");

      // redirect after success
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err) {
      alert(
        err.response?.data?.message || "Invalid or expired token"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/20 backdrop-blur-[3px]">

      <Card className="w-full max-w-md rounded-2xl border border-border shadow-2xl">

        <CardContent className="p-6 sm:p-8">

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <img
              src={logo}
              alt="logo"
              className="w-12 h-12 object-contain"
            />
            <div>
              <h1 className="text-2xl font-semibold">Reset Password</h1>
              <p className="text-sm text-muted-foreground">
                Enter your new password
              </p>

              {/* 👇 show email */}
              {tokenData.email && (
                <p className="text-xs text-muted-foreground mt-1">
                  Resetting for:{" "}
                  <span className="font-medium">
                    {tokenData.email}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleReset} className="space-y-4">

            {/* New Password */}
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="password"
                placeholder="Enter new password"
                value={form.password}
                onChange={handleChange("password")}
              />
              {submitted && errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input
                type="password"
                placeholder="Confirm password"
                value={form.confirmPassword}
                onChange={handleChange("confirmPassword")}
              />
              {submitted && errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Button */}
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>

          </form>

          {/* Footer */}
          <p className="mt-4 text-sm text-muted-foreground text-center">
            Back to{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>

        </CardContent>
      </Card>
    </div>
  );
}