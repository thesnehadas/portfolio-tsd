"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf3] px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border-2 border-[#4a3728] rounded-lg p-8 shadow-[4px_4px_0px_#4a3728]">
          {/* Retro Window Dots */}
          <div className="flex items-center gap-1.5 mb-6">
            <div className="w-2.5 h-2.5 rounded-full bg-[#e15b5b]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#f1c40f]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#2ecc71]"></div>
          </div>

          <h1 className="text-3xl font-serif font-semibold text-[#09090b] mb-2">
            Admin Login
          </h1>
          <p className="text-sm text-[#71717a] mb-8">
            Sign in to manage your portfolio
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#09090b] text-white hover:bg-[#09090b]/90"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
