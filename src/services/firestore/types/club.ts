import { Timestamp } from "firebase/firestore";

export interface ClubData {
  id?: string;
  name: string;
  formattedName: string;
  logoUrl?: string;
  createdBy: string;
  inviteCode: string;
  members: string[];
  createdAt: Timestamp;
  subscription?: ClubSubscriptionData;
}

export interface ClubSubscriptionData {
  subscriptionId?: string; // "sub_..."
  customerId: string; // cus_...
  priceId: string; // price_...
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
