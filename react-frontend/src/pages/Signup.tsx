import { Link, useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import {Card,CardContent,CardDescription,CardHeader,CardTitle,} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { useSignupMutation } from "@/APIs/auth/authApi";
import { useState } from "react";
import { setCredentials } from "@/APIs/auth/authSlice";
import { useDispatch } from "react-redux";

export default function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [signup, { isLoading }] = useSignupMutation();
  
    const [form, setForm] = useState({
      email: "",
      password: "",
      password_confirmation:""
    });
  
    const [error, setError] = useState("");
  
    const handleChange = (event) => {
      const { name, value } = event.target;
  
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      setError("");
  
      if(form.password !== form.password_confirmation){
        setError("Password and password confirmation is not similar")
        return
      }

      try {
        const response = await signup(form).unwrap();
  
        dispatch(setCredentials(response));
  
        navigate("/dashboard");
      } catch (error) {
        setError(
          error?.data?.message ||
          "Invalid email or password."
        );
      }
    };

  return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              Create an account
            </CardTitle>

            <CardDescription>
              Create your account to start managing your orders.
            </CardDescription>

            {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          </CardHeader>

          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name
                </Label>

                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  autoComplete="name"
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email
                </Label>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  onChange={handleChange}
                  disabled={isLoading}
                  
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password
                </Label>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              {/* Confirm password */}
              <div className="space-y-2">
                <Label htmlFor="password_confirmation">
                  Confirm password
                </Label>

                <Input
                  id="password_confirmation"
                  type="password"
                  name="password_confirmation"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  className="mt-0.5"
                />

                <Label
                  htmlFor="terms"
                  className="text-sm font-normal leading-5"
                >
                  I agree to the terms and conditions.
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full"
              >
                Create account
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:underline"
              >
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}