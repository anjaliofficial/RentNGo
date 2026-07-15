"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";

import authService from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginSchema) => {
    try {
      setLoading(true);
      const res = await authService.login(data);
      setAuth(res.data.data.user, res.data.data.accessToken, res.data.data.refreshToken);
      toast.success("Welcome back!");
      router.push("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-2 gap-12 px-6">
        
        {/* LEFT SIDE */}
        <div className="hidden items-center justify-center lg:flex">
          <div className="max-w-xl">
            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              Secure Equipment Rental
            </span>
            <h1 className="mt-8 text-6xl font-black leading-tight text-slate-900">
              Rent.<br />Share.<br />Explore.
            </h1>
            <p className="mt-8 text-lg leading-8 text-slate-600">
              Join Nepal's trusted marketplace for renting cameras, drones, tools, camping gear and more.
            </p>
            <div className="mt-12 space-y-6">
              {["Verified Owners", "Secure Payments", "Damage Protection"].map((item) => (
                <div key={item} className="flex items-center gap-4">
                  <ShieldCheck className="text-blue-600" size={28} />
                  <p className="text-lg">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-lg rounded-3xl border border-white/40 bg-white/90 p-12 shadow-2xl backdrop-blur-xl">
            
            <div className="mb-8 text-center">
              <h2 className="text-4xl font-black text-slate-900">Welcome Back 👋</h2>
              <p className="mt-3 text-gray-500">Login to continue your RentNGo journey.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 py-4 pl-12 pr-4 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>
                {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 py-4 pl-12 pr-12 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>}
              </div>

              {/* Options */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> Remember me
                </label>
                <Link href="#" className="font-semibold text-blue-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>

              {/* Submit */}
              <button
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-4 font-bold text-white transition duration-300 hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Logging In..." : "Login"}
                {!loading && <ArrowRight size={20} />}
              </button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center">
              <div className="h-px flex-1 bg-gray-300" />
              <span className="mx-4 text-sm text-gray-500">OR</span>
              <div className="h-px flex-1 bg-gray-300" />
            </div>

            {/* Register Link */}
            <p className="text-center text-gray-600">
              Don't have an account?
              <Link href="/register" className="ml-2 font-bold text-blue-600 hover:underline">
                Create Account
              </Link>
            </p>

          </div>
        </div>
      </div>
    </section>
  );
}
