"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import authService from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();

  const setAuth = useAuthStore(
    (state) => state.setAuth
  );

  const [loading, setLoading] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (
    data: LoginSchema
  ) => {
    try {
      setLoading(true);

      const res =
        await authService.login(data);

      setAuth(
        res.data.data.user,
        res.data.data.accessToken,
        res.data.data.refreshToken
      );

      toast.success(res.data.message);

      router.push("/");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ??
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
      <h1 className="mb-2 text-center text-3xl font-bold">
        Welcome Back
      </h1>

      <p className="mb-8 text-center text-gray-500">
        Login to your RentNGo account
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div>
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-600"
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.email?.message}
          </p>
        </div>

        <div>
          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-600"
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.password?.message}
          </p>
        </div>

        <button
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {loading
            ? "Logging In..."
            : "Login"}
        </button>
      </form>

      <p className="mt-6 text-center text-gray-600">
        Don't have an account?

        <Link
          href="/register"
          className="ml-2 font-semibold text-blue-600 hover:underline"
        >
          Register
        </Link>
      </p>
    </div>
  );
}