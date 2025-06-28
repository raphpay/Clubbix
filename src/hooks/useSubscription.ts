import { useCallback, useEffect, useState } from "react";
import {
  ClubSubscriptionData,
  getSubscriptionByClubId,
} from "../services/firestore";
import { useClub } from "./useClub";

export const useSubscription = () => {
  const { club } = useClub();
  const [subscription, setSubscription] = useState<ClubSubscriptionData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    if (!club?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const subscriptionData = await getSubscriptionByClubId(club.id);
      setSubscription(subscriptionData);
    } catch (err) {
      console.error("Error fetching subscription:", err);
      setError("Failed to load subscription data");
    } finally {
      setIsLoading(false);
    }
  }, [club?.id]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const isActive = subscription?.status === "active";
  const isExpired =
    subscription?.status === "past_due" || subscription?.status === "unpaid";
  const isCancelled = subscription?.status === "cancelled";
  const isIncomplete = subscription?.status === "incomplete";

  const daysUntilExpiry = subscription?.currentPeriodEnd
    ? Math.ceil(
        (subscription.currentPeriodEnd.toDate().getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 7;

  return {
    subscription,
    isLoading,
    error,
    isActive,
    isExpired,
    isCancelled,
    isIncomplete,
    daysUntilExpiry,
    isExpiringSoon,
    refetch: fetchSubscription,
  };
};
