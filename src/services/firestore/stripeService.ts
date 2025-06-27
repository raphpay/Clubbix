import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import {
  ClubData,
  ClubSubscriptionData,
  StripeCustomerData,
  StripeInvoiceData,
  StripeSessionData,
  WebhookEventData,
} from "./types";

// Save Stripe session data
export const saveStripeSession = async (
  sessionData: Omit<StripeSessionData, "createdAt" | "expiresAt"> & {
    expiresAt: Date;
  }
) => {
  const sessionRef = doc(db, "stripe_sessions", sessionData.sessionId);

  const dataToSave = {
    ...sessionData,
    createdAt: serverTimestamp(),
    expiresAt: sessionData.expiresAt,
  };

  await setDoc(sessionRef, dataToSave);
  console.log("Stripe session saved:", sessionData.sessionId);
  return sessionData.sessionId;
};

// Save subscription data
export const saveSubscription = async (
  subscriptionData: Omit<
    ClubSubscriptionData,
    "createdAt" | "updatedAt" | "currentPeriodStart" | "currentPeriodEnd"
  > & {
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
  }
) => {
  const subscriptionRef = doc(
    db,
    "subscriptions",
    subscriptionData.subscriptionId
  );

  const dataToSave = {
    ...subscriptionData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    currentPeriodStart: subscriptionData.currentPeriodStart,
    currentPeriodEnd: subscriptionData.currentPeriodEnd,
  };

  await setDoc(subscriptionRef, dataToSave);
  console.log("Subscription saved:", subscriptionData.subscriptionId);
  return subscriptionData.subscriptionId;
};

// Update subscription data
export const updateSubscription = async (
  subscriptionId: string,
  updates: Partial<Omit<ClubSubscriptionData, "createdAt" | "updatedAt">>
) => {
  const subscriptionRef = doc(db, "subscriptions", subscriptionId);

  await updateDoc(subscriptionRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });

  console.log("Subscription updated:", subscriptionId);
};

// Save customer data
export const saveCustomer = async (
  customerData: Omit<StripeCustomerData, "createdAt">
) => {
  const customerRef = doc(db, "customers", customerData.customerId);

  const dataToSave = {
    ...customerData,
    createdAt: serverTimestamp(),
  };

  await setDoc(customerRef, dataToSave);
  console.log("Customer saved:", customerData.customerId);
  return customerData.customerId;
};

// Save invoice data
export const saveInvoice = async (
  invoiceData: Omit<StripeInvoiceData, "createdAt" | "paidAt"> & {
    paidAt?: Date;
  }
) => {
  const invoiceRef = doc(db, "invoices", invoiceData.invoiceId);

  const dataToSave = {
    ...invoiceData,
    createdAt: serverTimestamp(),
    ...(invoiceData.paidAt && { paidAt: invoiceData.paidAt }),
  };

  await setDoc(invoiceRef, dataToSave);
  console.log("Invoice saved:", invoiceData.invoiceId);
  return invoiceData.invoiceId;
};

// Update club with subscription info
export const updateClubSubscription = async (
  clubId: string,
  subscriptionData: Partial<ClubSubscriptionData>
) => {
  const clubRef = doc(db, "clubs", clubId);

  await updateDoc(clubRef, {
    subscription: {
      ...subscriptionData,
      updatedAt: serverTimestamp(),
    },
  });

  console.log("Club subscription updated:", clubId);
};

// Update club with Stripe session info
export const updateClubStripeSession = async (
  clubId: string,
  sessionData: Partial<StripeSessionData>
) => {
  const clubRef = doc(db, "clubs", clubId);

  await updateDoc(clubRef, {
    stripeSession: {
      ...sessionData,
      createdAt: serverTimestamp(),
    },
  });

  console.log("Club Stripe session updated:", clubId);
};

// Get subscription by ID
export const getSubscription = async (
  subscriptionId: string
): Promise<ClubSubscriptionData | null> => {
  const subscriptionRef = doc(db, "subscriptions", subscriptionId);
  const subscriptionDoc = await getDoc(subscriptionRef);

  if (subscriptionDoc.exists()) {
    return subscriptionDoc.data() as ClubSubscriptionData;
  }

  return null;
};

// Get subscription by club ID
export const getSubscriptionByClubId = async (
  clubId: string
): Promise<ClubSubscriptionData | null> => {
  const subscriptionsRef = collection(db, "subscriptions");
  const q = query(subscriptionsRef, where("clubId", "==", clubId), limit(1));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data() as ClubSubscriptionData;
  }

  return null;
};

// Get active subscriptions
export const getActiveSubscriptions = async (): Promise<
  ClubSubscriptionData[]
> => {
  const subscriptionsRef = collection(db, "subscriptions");
  const q = query(
    subscriptionsRef,
    where("status", "==", "active"),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => doc.data() as ClubSubscriptionData);
};

// Get subscriptions expiring soon (within 7 days)
export const getSubscriptionsExpiringSoon = async (): Promise<
  ClubSubscriptionData[]
> => {
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

  const subscriptionsRef = collection(db, "subscriptions");
  const q = query(
    subscriptionsRef,
    where("status", "==", "active"),
    where("currentPeriodEnd", "<=", sevenDaysFromNow),
    orderBy("currentPeriodEnd", "asc")
  );
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => doc.data() as ClubSubscriptionData);
};

// Get customer by ID
export const getCustomer = async (
  customerId: string
): Promise<StripeCustomerData | null> => {
  const customerRef = doc(db, "customers", customerId);
  const customerDoc = await getDoc(customerRef);

  if (customerDoc.exists()) {
    return customerDoc.data() as StripeCustomerData;
  }

  return null;
};

// Get customer by club ID
export const getCustomerByClubId = async (
  clubId: string
): Promise<StripeCustomerData | null> => {
  const customersRef = collection(db, "customers");
  const q = query(customersRef, where("clubId", "==", clubId), limit(1));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data() as StripeCustomerData;
  }

  return null;
};

// Save webhook event for audit trail
export const saveWebhookEvent = async (
  eventData: Omit<WebhookEventData, "timestamp">
) => {
  const eventRef = doc(collection(db, "webhook_events"));

  const dataToSave = {
    ...eventData,
    timestamp: serverTimestamp(),
  };

  await setDoc(eventRef, dataToSave);
  console.log("Webhook event saved:", eventData.eventId);
  return eventRef.id;
};

// Get club with subscription data
export const getClubWithSubscription = async (
  clubId: string
): Promise<ClubData | null> => {
  const clubRef = doc(db, "clubs", clubId);
  const clubDoc = await getDoc(clubRef);

  if (clubDoc.exists()) {
    return clubDoc.data() as ClubData;
  }

  return null;
};

// Get revenue analytics
export const getRevenueAnalytics = async (startDate: Date, endDate: Date) => {
  const invoicesRef = collection(db, "invoices");
  const q = query(
    invoicesRef,
    where("status", "==", "paid"),
    where("createdAt", ">=", startDate),
    where("createdAt", "<=", endDate),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);

  const invoices = querySnapshot.docs.map(
    (doc) => doc.data() as StripeInvoiceData
  );

  const totalRevenue = invoices.reduce(
    (sum, invoice) => sum + invoice.amount,
    0
  );
  const invoiceCount = invoices.length;

  return {
    totalRevenue,
    invoiceCount,
    invoices,
  };
};
