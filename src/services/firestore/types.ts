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
  plan?: "starter" | "pro" | "elite";
  billingCycle?: "monthly" | "annual";
  subscription?: ClubSubscriptionData;
  stripeSession?: StripeSessionData;
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

export interface StripeSessionData {
  // Core session info
  sessionId: string; // cs_test_...
  customerId: string; // cus_...
  subscriptionId: string; // sub_...

  // Payment details
  amount: number; // Amount in euros
  currency: string; // 'eur', 'usd', etc.
  paymentStatus: string; // 'paid', 'pending', 'failed'

  // Subscription details
  plan: string; // 'starter', 'pro', 'elite'
  billingCycle: string; // 'monthly', 'annual'
  interval: string; // 'month', 'year'

  // Customer info
  customerEmail: string;

  // Your app metadata
  userId: string;
  clubId: string;

  // Timestamps
  createdAt: Timestamp;
  expiresAt: Timestamp;

  // Status tracking
  status: "active" | "cancelled" | "past_due" | "unpaid";
}

export interface ClubSubscriptionData {
  subscriptionId: string; // "sub_..."
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

export interface ClubSubscriptionHistory {
  customerId: string;
  email: string;
  userId: string;
  clubId: string;
  createdAt: Timestamp;
}

// New interfaces for better organization
export interface StripeCustomerData {
  customerId: string; // "cus_..."
  email: string;
  userId: string;
  clubId: string;
  createdAt: Timestamp;
}

export interface StripeInvoiceData {
  invoiceId: string; // "in_..."
  subscriptionId: string; // "sub_..."
  customerId: string; // "cus_..."
  amount: number; // Amount in cents
  currency: string;
  status: "paid" | "open" | "void" | "uncollectible";
  createdAt: Timestamp;
  paidAt?: Timestamp;
}

// Webhook event types
export interface WebhookEventData {
  eventType: string;
  eventId: string;
  timestamp: Timestamp;
  data: any;
  processed: boolean;
  error?: string;
}
