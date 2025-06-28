import React from "react";
import { useSubscription } from "../../hooks/useSubscription";

interface SubscriptionStatusProps {
  showDetails?: boolean;
  className?: string;
}

export const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({
  showDetails = true,
  className = "",
}) => {
  const {
    subscription,
    isLoading,
    error,
    isActive,
    isExpired,
    isCancelled,
    isIncomplete,
    daysUntilExpiry,
    isExpiringSoon,
  } = useSubscription();

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
        <span className="text-sm text-gray-600">Loading subscription...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center">
          <svg
            className="h-2 w-2 text-red-600"
            fill="currentColor"
            viewBox="0 0 8 8"
          >
            <path d="M4 0C1.79 0 0 1.79 0 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6.5c-1.38 0-2.5-1.12-2.5-2.5S2.62 1.5 4 1.5 6.5 2.62 6.5 4 5.38 6.5 4 6.5z" />
            <path d="M4 2.5c-.28 0-.5.22-.5.5v1.5c0 .28.22.5.5.5s.5-.22.5-.5V3c0-.28-.22-.5-.5-.5z" />
          </svg>
        </div>
        <span className="text-sm text-red-600">
          Failed to load subscription
        </span>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="h-4 w-4 rounded-full bg-gray-100 flex items-center justify-center">
          <svg
            className="h-2 w-2 text-gray-400"
            fill="currentColor"
            viewBox="0 0 8 8"
          >
            <path d="M4 0C1.79 0 0 1.79 0 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6.5c-1.38 0-2.5-1.12-2.5-2.5S2.62 1.5 4 1.5 6.5 2.62 6.5 4 5.38 6.5 4 6.5z" />
          </svg>
        </div>
        <span className="text-sm text-gray-500">No subscription found</span>
      </div>
    );
  }

  const getStatusColor = () => {
    if (isActive) return "bg-green-100 text-green-800";
    if (isExpired) return "bg-red-100 text-red-800";
    if (isCancelled) return "bg-gray-100 text-gray-800";
    if (isIncomplete) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = () => {
    if (isActive) {
      return (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    if (isExpired) {
      return (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    if (isCancelled) {
      return (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    return (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  const getStatusText = () => {
    if (isActive) return "Active";
    if (isExpired) return "Payment Failed";
    if (isCancelled) return "Cancelled";
    if (isIncomplete) return "Incomplete";
    return "Unknown";
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div
        className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}
      >
        {getStatusIcon()}
        <span>{getStatusText()}</span>
      </div>

      {showDetails && (
        <div className="text-sm text-gray-600">
          {subscription.plan && (
            <span className="capitalize">{subscription.plan} Plan</span>
          )}
          {subscription.billingCycle && (
            <span className="ml-1 capitalize">
              ({subscription.billingCycle})
            </span>
          )}

          {isActive && daysUntilExpiry !== null && (
            <span className="ml-2">
              {isExpiringSoon ? (
                <span className="text-orange-600">
                  Expires in {daysUntilExpiry} day
                  {daysUntilExpiry !== 1 ? "s" : ""}
                </span>
              ) : (
                <span className="text-gray-500">
                  Renews in {daysUntilExpiry} day
                  {daysUntilExpiry !== 1 ? "s" : ""}
                </span>
              )}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
