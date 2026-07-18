"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";

import { registerSchema, RegisterSchema } from "../../lib/validators";
import { apiClient } from "../../lib/api-client";

const TRUST_POINTS = ["Verified Community", "Secure Escrow Payments", "Damage Protection"];

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterSchema) => {
    try {
      setLoading(true);
      const res = await apiClient.post("/api/auth/register", {
        name: data.fullName,
        email: data.email,
        password: data.password,
      });
      toast.success(res.data.message ?? "Registration successful!");
      router.push("/login?registered=1");
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-neutral-50">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-12 px-8 lg:grid-cols-2">
        {/* LEFT PANEL */}
        <div className="hidden items-center justify-center bg-primary-900 lg:flex">
          <div className="max-w-md px-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-label text-xs font-semibold uppercase tracking-wide text-tertiary-300">
              Join RentNGo Today
            </span>
            <h1 className="mt-8 font-headline text-5xl font-bold leading-tight text-white">
              Start Renting
              <br />
              In Minutes.
            </h1>
            <p className="mt-6 text-base leading-relaxed text-primary-200">
              Discover cameras, drones, tools, camping gear and hundreds of
              verified equipment from trusted owners.
            </p>
            <div className="mt-10 space-y-5">
              {TRUST_POINTS.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-tertiary-500/20">
                    <ShieldCheck className="h-4.5 w-4.5 text-tertiary-400" />
                  </span>
                  <p className="text-sm text-white">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex items-center justify-center py-12">
          <div className="w-full max-w-md">
            <Link href="/" className="mb-8 flex items-center justify-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-900">
                <ShieldCheck className="h-5 w-5 text-tertiary-400" />
              </span>
              <span className="font-headline text-xl font-bold text-primary-900">RentNGo</span>
            </Link>

            <div className="card">
              <div className="text-center">
                <h1 className="font-headline text-xl font-bold text-primary-900">
                  Create your account
                </h1>
                <p className="mt-1 text-sm text-neutral-500">
                  Identity verification unlocks lower deposits as your trust score grows.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block font-label text-xs font-semibold text-primary-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                    <input
                      {...register("fullName")}
                      placeholder="Jamie Lee"
                      className="w-full rounded-lg border border-neutral-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-secondary-500"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block font-label text-xs font-semibold text-primary-700">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="email"
                      {...register("email")}
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-neutral-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-secondary-500"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block font-label text-xs font-semibold text-primary-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="At least 8 characters"
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

                <label className="flex items-start gap-2.5 pt-1 text-xs text-neutral-500">
                  <input type="checkbox" required className="mt-0.5 accent-secondary-500" />
                  I agree to the{" "}
                  <span className="font-semibold text-secondary-600">Terms & Conditions</span>{" "}
                  and <span className="font-semibold text-secondary-600">Privacy Policy</span>.
                </label>

                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? "Creating Account..." : "Create Account"}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>
            </div>

            <p className="mt-6 text-center text-sm text-neutral-500">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-secondary-600 hover:text-secondary-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
