export interface ReviewUser {
  id: string;
  username: string;
  avatar: string | null;
  walletAddress: string | null;
}

export interface ReviewResponseDto {
  id: string;
  modelId: string;
  content: string;
  user: ReviewUser;
  createdAt: string;
  updatedAt: string;
}

export interface RatingSummaryDto {
  average: number;
  count: number;
}

export interface UserProfileDto {
  id: string;
  fullName: string | null;
  website: string | null;
  twitter: string | null;
  github: string | null;
  walletAddress: string | null;
}

export interface ProfileResponseDto {
  id: string;
  username: string;
  email: string | null;
  bio: string | null;
  avatar: string | null;
  profile: UserProfileDto | null;
  createdAt: string;
}

export interface DashboardAnalyticsDto {
  totalModels: number;
  totalNftModels: number;
  totalUsers: number;
  totalInferences: number;
  averageRating: number;
}
