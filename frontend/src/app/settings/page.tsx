"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Camera, KeyRound, LogOut, MailCheck, ShieldCheck } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, Avatar, Badge } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/components/auth/AuthProvider";
import userService from "@/services/user.service";
import uploadService from "@/services/upload.service";
import { resolveMediaUrl } from "@/utils/format";
import {
  changePasswordSchema,
  ChangePasswordSchema,
  profileSchema,
  ProfileSchema,
} from "@/lib/validators";

export default function SettingsPage() {
  const { user, refresh, logout } = useAuth();
  const router = useRouter();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profileForm = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    values: user
      ? {
          fullName: user.fullName,
          phone: user.phone ?? "",
          address: user.address ?? "",
          bio: user.bio ?? "",
        }
      : undefined,
  });

  const passwordForm = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSaveProfile = async (data: ProfileSchema) => {
    try {
      await userService.updateProfile(data);
      await refresh();
      toast.success("Profile updated");
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Could not update profile");
    }
  };

  const onChangePassword = async (data: ChangePasswordSchema) => {
    try {
      await userService.changePassword(data);
      toast.success("Password changed");
      passwordForm.reset();
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Could not change password");
    }
  };

  const onSelectAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    try {
      setUploadingAvatar(true);
      const { data } = await uploadService.uploadSingle(file);
      await userService.updateAvatar(data.data.imageUrl);
      await refresh();
      toast.success("Avatar updated");
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Could not update avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <DashboardLayout crumb="Settings">
      <div>
        <h1 className="font-headline text-2xl font-bold text-primary-900">Settings</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Manage your profile, account security, and preferences.
        </p>
      </div>

      <Card className="flex flex-wrap items-center gap-5">
        <div className="relative">
          <Avatar
            name={user?.fullName ?? "User"}
            src={resolveMediaUrl(user?.avatar)}
            size={72}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingAvatar}
            aria-label="Change photo"
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary-900 text-white shadow hover:bg-primary-700 disabled:opacity-50"
          >
            <Camera className="h-3.5 w-3.5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={onSelectAvatar}
          />
        </div>
        <div>
          <p className="font-headline text-base font-semibold text-primary-900">
            {user?.fullName}
          </p>
          <p className="text-sm text-neutral-500">{user?.email}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge tone="trust">Trust {user?.trustScore}/100</Badge>
            {user?.emailVerified && (
              <span className="flex items-center gap-1 rounded-full bg-tertiary-50 px-2 py-1 text-[11px] font-semibold text-tertiary-700">
                <MailCheck className="h-3 w-3" /> Email Verified
              </span>
            )}
            {user?.verificationStatus === "approved" && (
              <span className="flex items-center gap-1 rounded-full bg-tertiary-50 px-2 py-1 text-[11px] font-semibold text-tertiary-700">
                <ShieldCheck className="h-3 w-3" /> ID Verified
              </span>
            )}
          </div>
        </div>
      </Card>

      <Card className="max-w-2xl">
        <h2 className="font-headline text-sm font-semibold text-primary-900">Profile</h2>
        <form
          onSubmit={profileForm.handleSubmit(onSaveProfile)}
          className="mt-4 space-y-4"
        >
          <Input
            label="Full name"
            {...profileForm.register("fullName")}
            error={profileForm.formState.errors.fullName?.message}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Phone" {...profileForm.register("phone")} />
            <Input label="Address" {...profileForm.register("address")} />
          </div>
          <label className="flex flex-col gap-1.5">
            <span className="font-label text-xs font-semibold text-primary-700">Bio</span>
            <textarea
              rows={3}
              placeholder="Tell renters a bit about yourself..."
              {...profileForm.register("bio")}
              className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:border-secondary-500 focus:outline-none"
            />
            {profileForm.formState.errors.bio && (
              <span className="text-xs text-red-500">
                {profileForm.formState.errors.bio.message}
              </span>
            )}
          </label>
          <Button type="submit" disabled={profileForm.formState.isSubmitting}>
            {profileForm.formState.isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </Card>

      <Card className="max-w-2xl">
        <h2 className="flex items-center gap-2 font-headline text-sm font-semibold text-primary-900">
          <KeyRound className="h-4 w-4" />
          Change Password
        </h2>
        <form
          onSubmit={passwordForm.handleSubmit(onChangePassword)}
          className="mt-4 space-y-4"
        >
          <Input
            label="Current password"
            type="password"
            {...passwordForm.register("currentPassword")}
            error={passwordForm.formState.errors.currentPassword?.message}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="New password"
              type="password"
              {...passwordForm.register("newPassword")}
              error={passwordForm.formState.errors.newPassword?.message}
            />
            <Input
              label="Confirm new password"
              type="password"
              {...passwordForm.register("confirmPassword")}
              error={passwordForm.formState.errors.confirmPassword?.message}
            />
          </div>
          <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
            {passwordForm.formState.isSubmitting ? "Updating..." : "Update password"}
          </Button>
        </form>
      </Card>

      <Card className="max-w-2xl">
        <h2 className="font-headline text-sm font-semibold text-primary-900">Account</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Sign out of RentNGo on this device.
        </p>
        <Button variant="danger" className="mt-4" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </Card>
    </DashboardLayout>
  );
}
