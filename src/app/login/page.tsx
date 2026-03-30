"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = login(email, password);
    if (result.success) {
      if (email === "admin@gmail.com") {
        router.push("/admin");
      } else {
        router.push("/profile");
      }
    } else {
      setError(result.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-main p-6">
      <Card className="w-full max-w-md shadow-2xl border-neutral-main">
        <CardHeader className="text-center">
          <CardTitle className="font-playfair text-3xl font-bold text-text-main">
            Welcome Back
          </CardTitle>
          <CardDescription>
            Log in to access your personalized ritual calendar and proxy services.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
            <Button type="submit" className="w-full font-bold py-6 text-lg">
              Log In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t border-neutral-main/30 pt-6">
          <Link
            href="/signup"
            className="text-sm text-primary hover:underline text-center block w-full transition-all"
          >
            Don't have an account? Sign up
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
