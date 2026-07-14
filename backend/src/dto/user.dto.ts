export interface UpdateProfileDto {
  fullName: string;

  phone?: string;

  address?: string;

  bio?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;

  newPassword: string;

  confirmPassword: string;
}

export interface UpdateAvatarDto {
  avatar: string;
}

export interface VerifyGovernmentIdDto {
  governmentIdUrl: string;
}