"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";

import { registerSchema, RegisterSchema } from "@/lib/validators";
import authService from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export default function RegisterForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

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
      const res = await authService.register(data);
      setAuth(res.data.data.user, res.data.data.accessToken, res.data.data.refreshToken);
      toast.success(res.data.message || "Registration successful!");
      router.push("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-2 gap-12 px-8">
        
        {/* LEFT PANEL */}
        <div className="hidden items-center justify-center lg:flex">
          <div className="max-w-xl">
            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              Join RentNGo Today
            </span>
            <h1 className="mt-8 text-6xl font-black leading-tight text-slate-900">
              Start Renting<br />In Minutes.
            </h1>
            <p className="mt-8 text-lg leading-8 text-slate-600">
              Discover cameras, drones, tools, camping gear and hundreds of verified equipment from trusted owners across Nepal.
            </p>
            <div className="mt-12 space-y-6">
              {["Verified Community", "Secure Payments", "Damage Protection"].map((item) => (
                <div key={item} className="flex items-center gap-4">
                  <ShieldCheck className="text-blue-600" size={28} />
                  <p className="text-lg">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-2xl rounded-3xl border border-white/40 bg-white/90 p-14 shadow-2xl backdrop-blur-xl">
            
            <div className="mb-10 text-center">
              <h1 className="text-4xl font-black text-slate-900">Create Account 🚀</h1>
              <p className="mt-3 text-gray-500">Join the trusted equipment rental community.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
              {/* Full Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Full Name</label>
                <div className="relative">
                  <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...register("fullName")}
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 py-4 pl-12 pr-4 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>
                {errors.fullName && <p className="mt-2 text-sm text-red-500">{errors.fullName.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
                <div className="relative">
                  <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 py-4 pl-12 pr-4 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>
                {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="Create password"
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

              {/* Terms */}
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <input type="checkbox" required className="mt-1" />
                <p>
                  I agree to the{" "}
                  <span className="font-semibold text-blue-600">Terms & Conditions</span> and{" "}
                  <span className="font-semibold text-blue-600">Privacy Policy</span>.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-4 font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Create Account"}
                {!loading && <ArrowRight size={20} />}
              </button>
            </form>

            {/* Divider */}
            <div className="my-10 flex items-center">
              <div className="h-px flex-1 bg-gray-300" />
              <span className="mx-4 text-sm text-gray-500">OR</span>
              <div className="h-px flex-1 bg-gray-300" />
            </div>

            {/* Login Link */}
            <p className="text-center text-gray-600">
              Already have an account?
              <Link href="/login" className="ml-2 font-bold text-blue-600 hover:underline">
                Login
              </Link>
            </p>

          </div>
        </div>
      </div>
    </section>
  );
}
