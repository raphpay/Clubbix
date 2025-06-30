const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface CreateCheckoutSessionParams {
  plan: "starter" | "pro" | "elite";
  billingCycle: "monthly" | "annual";
  userId: string;
  email: string;
  clubId: string;
}

export interface CheckoutSessionResponse {
  url: string;
  sessionId: string;
}

// Price ID mapping - Replace these with your actual Stripe Price IDs
// const PRICE_IDS = {
//   starter: {
//     monthly: "price_1RecG2PsFlms57nuEd3bjIkg", // Stripe price ID for Starter Monthly
//     annual: "price_1RecGhPsFlms57nuMDCYumUm", // Stripe price ID for Starter Yearly
//   },
//   pro: {
//     monthly: "price_1RecJJPsFlms57nudWe8PRgq", // Stripe price ID for Pro Monthly
//     annual: "price_1RecJsPsFlms57nu66Jg8ZTP", // Replace with your actual Stripe price ID for Pro Yearly
//   },
//   elite: {
//     monthly: "price_1RecKUPsFlms57nuYH1ZCUns", // Replace with your actual Stripe price ID for Elite Monthly
//     annual: "price_1RecKyPsFlms57nuiNZwwTzN", // Replace with your actual Stripe price ID for Elite Yearly
//   },
// };

// With two sandbox prices
const PRICE_IDS = {
  starter: {
    monthly: "price_1RfaiCPsFlms57nuAe7Q9mcB",
    annual: "price_1RfaiVPsFlms57nuZaSF0DnS",
  },
  pro: {
    monthly: "price_1RfaiCPsFlms57nuAe7Q9mcB",
    annual: "price_1RfaiVPsFlms57nuZaSF0DnS",
  },
  elite: {
    monthly: "price_1RfaiCPsFlms57nuAe7Q9mcB",
    annual: "price_1RfaiVPsFlms57nuZaSF0DnS",
  },
};

// Price ID mapping based on your naming convention (fallback)
const getPriceId = (plan: string, billingCycle: string): string => {
  // First try to use the real Stripe price IDs
  const realPriceId =
    PRICE_IDS[plan as keyof typeof PRICE_IDS]?.[
      billingCycle as keyof typeof PRICE_IDS.starter
    ];
  if (realPriceId && !realPriceId.startsWith("price_XXXXX")) {
    return realPriceId;
  }

  // Fallback to naming convention (for development/testing)
  const billingSuffix = billingCycle === "annual" ? "yearly" : "monthly";
  return `${plan}_2606_${billingSuffix}`;
};

export const createCheckoutSession = async (
  params: CreateCheckoutSessionParams
): Promise<CheckoutSessionResponse> => {
  const price_id = getPriceId(params.plan, params.billingCycle);

  const response = await fetch(`${API_BASE_URL}/api/stripe/checkout-sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      price_id,
      success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${window.location.origin}/cancel`,
      customer_email: params.email,
      mode: "subscription",
      metadata: {
        userId: params.userId,
        clubId: params.clubId,
        plan: params.plan,
        billingCycle: params.billingCycle,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create checkout session");
  }

  const data = await response.json();
  return {
    url: data.url,
    sessionId: data.sessionId || data.session_id,
  };
};

export const getCheckoutSession = async (sessionId: string) => {
  const response = await fetch(
    `${API_BASE_URL}/api/stripe/checkout-sessions/${sessionId}`
  );

  if (!response.ok) {
    throw new Error("Failed to retrieve checkout session");
  }

  const data = await response.json();
  return data;
};

export const createCustomerPortalSession = async (
  email: string,
  customerId: string
): Promise<{ url: string }> => {
  const returnUrl = "http://localhost:5173/admin/dashboard/profile";
  const response = await fetch(`${API_BASE_URL}/api/stripe/customer-portal`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customer_email: email,
      customer_id: customerId,
      return_url: returnUrl,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create customer portal session");
  }

  const data = await response.json();
  return { url: data.url };
};
