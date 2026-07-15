"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import { useRouter } from "next/navigation";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  registerSchema,
  RegisterSchema,
} from "@/lib/validators";

import authService from "@/services/auth.service";

export default function RegisterForm() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (
    data: RegisterSchema
  ) => {
    try {
      setLoading(true);

      const res =
        await authService.register(data);

      toast.success(res.data.message);

      router.push("/login");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ??
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

      <h1 className="mb-2 text-center text-3xl font-bold">
        Create Account
      </h1>

      <p className="mb-8 text-center text-gray-500">
        Join RentNGo today
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div>
          <input
            {...register("fullName")}
            placeholder="Full Name"
            className="w-full rounded-lg border p-3"
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.fullName?.message}
          </p>
        </div>

        <div>
          <input
            {...register("email")}
            placeholder="Email"
            className="w-full rounded-lg border p-3"
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
            className="w-full rounded-lg border p-3"
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.password?.message}
          </p>
        </div>

        <button
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
        >
          {loading
            ? "Creating Account..."
            : "Register"}
        </button>
      </form>

      <p className="mt-6 text-center">
        Already have an account?

        <Link
          href="/login"
          className="ml-2 text-blue-600"
        >
          Login
        </Link>
      </p>
    </div>
  );
}