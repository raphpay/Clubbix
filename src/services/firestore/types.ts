export interface UserData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "member";
  clubId?: string;
  createdAt: Date;
}

export interface ClubData {
  name: string;
  formattedName: string;
  logoUrl?: string;
  createdBy: string;
  inviteCode: string;
  members: string[];
  plan?: string; // e.g., 'starter', 'pro', 'elite'
  billingCycle?: string; // e.g., 'monthly', 'annual'
  createdAt: Date;
}

export interface ClubWebsiteContent {
  id: string;
  clubId: string;
  clubName: string;
  headline: string;
  subtext: string;
  bannerImageUrl: string;
  logoUrl?: string;
  gallery: {
    id: string;
    imageUrl: string;
    caption: string;
    order: number;
  }[];
  events: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    date: Date;
    isPublished: boolean;
  }[];
  updatedAt: Date;
  createdAt: Date;
}
