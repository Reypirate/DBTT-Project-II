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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export default function SignUpPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    subscribeNewsletter: false,
    agreePrivacyPolicy: false,
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!formData.agreePrivacyPolicy) {
      setError("You must agree to the privacy policy.");
      return;
    }

    const { confirmPassword, ...registerData } = formData;
    const result = register(registerData);

    if (result.success) {
      router.push("/profile");
    } else {
      setError(result.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-main p-6 py-12">
      <Card className="w-full max-w-lg shadow-2xl border-neutral-main">
        <CardHeader className="text-center">
          <CardTitle className="font-playfair text-3xl font-bold text-text-main">
            Create Account
          </CardTitle>
          <CardDescription>
            Join our heritage community and manage your ritual reminders.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Full Shipping Address</Label>
              <Textarea
                id="address"
                placeholder="Block 123, Street Name, #01-01, Singapore 123456"
                required
                className="min-h-[100px]"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="subscribeNewsletter"
                  checked={formData.subscribeNewsletter}
                  onChange={(e: any) =>
                    setFormData({ ...formData, subscribeNewsletter: e.target.checked })
                  }
                />
                <Label
                  htmlFor="subscribeNewsletter"
                  className="text-xs text-text-main/70 leading-normal cursor-pointer"
                >
                  Subscribe me to the newsletter for updates and happenings.
                </Label>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="agreePrivacyPolicy"
                  required
                  checked={formData.agreePrivacyPolicy}
                  onChange={(e: any) =>
                    setFormData({ ...formData, agreePrivacyPolicy: e.target.checked })
                  }
                />
                <Label
                  htmlFor="agreePrivacyPolicy"
                  className="text-xs text-text-main/70 leading-normal cursor-pointer"
                >
                  I have read and agree to the{" "}
                  <Link href="/privacy-policy" className="text-primary hover:underline font-bold">
                    Privacy Policy
                  </Link>
                  .
                </Label>
              </div>
            </div>

            {error && <p className="text-sm text-red-500 font-medium text-center">{error}</p>}

            <Button
              type="submit"
              className="w-full font-bold py-6 text-lg"
              disabled={!formData.agreePrivacyPolicy}
            >
              Sign Up
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t border-neutral-main/30 pt-6">
          <Link
            href="/login"
            className="text-sm text-primary hover:underline text-center block w-full transition-all"
          >
            Already have an account? Log in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
