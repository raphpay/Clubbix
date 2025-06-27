import { Timestamp } from "firebase/firestore";

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
  createdAt: Date;
  subscriptionId?: string;
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

export interface ClubSubscriptionData {
  subscriptionId?: string; // "sub_..."
  clubId: string; // "firebase_club_id"
  plan: string; // "starter"
  billingCycle: string; // "monthly"
  status: "active" | "cancelled" | "past_due" | "unpaid" | "incomplete";
  currentPeriodStart: Timestamp;
  currentPeriodEnd: Timestamp;
  cancelAtPeriodEnd: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
