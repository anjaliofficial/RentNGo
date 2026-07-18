"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Camera, Star } from "lucide-react";

import { loginSchema, LoginSchema } from "../../lib/validators";
import { apiClient } from "../../lib/api-client";
import { useAuth } from "./AuthProvider";

const SIDE_FEATURES = [
  { icon: ShieldCheck, title: "Secure Payments", description: "Escrow-protected transactions with verified users." },
  { icon: Camera, title: "Thousands of Listings", description: "Rent professional equipment anytime, anywhere." },
  { icon: Star, title: "Trusted Community", description: "A live trust score keeps every exchange accountable." },
];

export default function LoginForm() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginSchema) => {
    try {
      setLoading(true);
      const res = await apiClient.post("/api/auth/login", data);

      if (res.data.mfaRequired) {
        setMfaRequired(true);
        toast("Enter your MFA code to continue", { icon: "🔐" });
        return;
      }

      await refresh();
      toast.success(res.data.message ?? "Welcome back!");
      router.replace("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-primary-900">
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-secondary-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-tertiary-500/20 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
        {/* LEFT */}
        <div className="hidden lg:block">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 font-label text-xs font-semibold uppercase tracking-wide text-tertiary-300">
            <ShieldCheck className="h-4 w-4" />
            Community-Verified Rentals
          </div>

          <h1 className="mt-8 font-headline text-6xl font-bold leading-[1.05] text-white">
            Rent. Share.
            <br />
            Explore.
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-primary-300">
            Discover cameras, drones, camping gear, musical instruments, and
            tools from verified, trust-scored owners.
          </p>

          <div className="mt-12 space-y-6">
            {SIDE_FEATURES.map((f) => (
              <div key={f.title} className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <f.icon className="h-5 w-5 text-tertiary-400" />
                </span>
                <div>
                  <h3 className="font-headline text-sm font-semibold text-white">{f.title}</h3>
                  <p className="text-xs text-primary-300">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="flex justify-center py-16">
          <div className="w-full max-w-md rounded-card border border-neutral-100 bg-white p-8 shadow-xl">
            <div className="mb-8 text-center">
              <h2 className="font-headline text-2xl font-bold text-primary-900">Welcome back</h2>
              <p className="mt-2 text-sm text-neutral-500">Sign in to manage your rentals and trust score.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="mb-1.5 block font-label text-xs font-semibold text-primary-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    {...register("email")}
                    className="w-full rounded-lg border border-neutral-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-secondary-500"
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <label className="mb-1.5 block font-label text-xs font-semibold text-primary-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className="w-full rounded-lg border border-neutral-200 py-2.5 pl-10 pr-10 text-sm outline-none focus:border-secondary-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              {mfaRequired && (
                <div>
                  <label className="mb-1.5 block font-label text-xs font-semibold text-primary-700">
                    MFA Code
                  </label>
                  <input
                    maxLength={6}
                    placeholder="6-digit code"
                    className="w-full rounded-lg border border-neutral-200 py-2.5 px-3 text-sm tracking-widest outline-none focus:border-secondary-500"
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-neutral-500">
                  <input type="checkbox" className="accent-secondary-500" />
                  Remember me
                </label>
                <Link href="/forgot-password" className="text-xs font-semibold text-secondary-600 hover:text-secondary-700">
                  Forgot Password?
                </Link>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Signing In..." : "Sign In"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-neutral-500">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold text-secondary-600 hover:text-secondary-700">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
