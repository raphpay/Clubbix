import { Switch } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export type BillingCycle = "monthly" | "annual";

export interface PricingPlan {
  id: string;
  name: string;
  maxMembers: string;
  features: string[];
  monthlyPrice: number;
  annualPrice: number;
  tag?: string;
  popular?: boolean;
}

interface PricingSectionProps {
  id?: string;
}

const PricingSection: React.FC<PricingSectionProps> = ({ id }) => {
  const { t } = useTranslation("pricing");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const navigate = useNavigate();

  const plans: PricingPlan[] = [
    {
      id: "starter",
      name: t("plans.starter.name"),
      maxMembers: t("plans.starter.maxMembers"),
      features: t("plans.starter.features", {
        returnObjects: true,
      }) as string[],
      monthlyPrice: 21,
      annualPrice: 199,
    },
    {
      id: "pro",
      name: t("plans.pro.name"),
      maxMembers: t("plans.pro.maxMembers"),
      features: t("plans.pro.features", { returnObjects: true }) as string[],
      monthlyPrice: 55,
      annualPrice: 499,
      tag: t("plans.pro.tag"),
      popular: true,
    },
    {
      id: "elite",
      name: t("plans.elite.name"),
      maxMembers: t("plans.elite.maxMembers"),
      features: t("plans.elite.features", { returnObjects: true }) as string[],
      monthlyPrice: 65,
      annualPrice: 599,
    },
  ];

  const getCurrentPrice = (plan: PricingPlan) => {
    return billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice;
  };

  const getSavings = (plan: PricingPlan) => {
    const annualSavings = plan.monthlyPrice * 12 - plan.annualPrice;
    return Math.round(annualSavings);
  };

  const handlePlanSelect = (planId: string) => {
    const url = `/signup?plan=${planId}&billing=${billingCycle}`;
    navigate(url);
  };

  return (
    <div id={id} className="bg-white py-6 sm:py-12 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">
            {t("subtitle")}
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
            {t("title")}
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="mt-16 flex justify-center">
          <div className="flex items-center space-x-4">
            <motion.span
              key={`monthly-${billingCycle}`}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: billingCycle === "monthly" ? 1 : 0.5 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-medium text-gray-900 dark:text-gray-200"
            >
              {t("billing.monthly")}
            </motion.span>
            <Switch
              checked={billingCycle === "annual"}
              onChange={(checked) =>
                setBillingCycle(checked ? "annual" : "monthly")
              }
              className={`${
                billingCycle === "annual"
                  ? "bg-indigo-600"
                  : "bg-gray-200 dark:bg-gray-700"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2`}
            >
              <motion.span
                layout
                className="inline-block h-4 w-4 rounded-full bg-white"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{
                  x: billingCycle === "annual" ? 20 : 4,
                }}
              />
            </Switch>
            <motion.span
              key={`annual-${billingCycle}`}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: billingCycle === "annual" ? 1 : 0.5 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-medium text-gray-900 dark:text-gray-200"
            >
              {t("billing.annual")}
            </motion.span>
            <AnimatePresence>
              {billingCycle === "annual" && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/50 dark:text-green-300"
                >
                  {t("billing.save")}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan) => {
            const currentPrice = getCurrentPrice(plan);
            const savings = getSavings(plan);
            const isAnnual = billingCycle === "annual";

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10 dark:bg-gray-800/50 dark:ring-gray-700 ${
                  plan.popular
                    ? "ring-2 ring-indigo-600 shadow-lg dark:ring-indigo-500"
                    : "shadow-sm"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-2 text-sm font-medium text-white text-center">
                    {plan.tag}
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-lg font-semibold leading-8 text-gray-900 dark:text-gray-100">
                    {plan.name}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-400">
                    {plan.maxMembers}
                  </p>
                  <div className="mt-6 flex items-baseline gap-x-1">
                    <motion.span
                      key={`price-${plan.id}-${billingCycle}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
                    >
                      €{currentPrice}
                    </motion.span>
                    <motion.span
                      key={`period-${plan.id}-${billingCycle}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-400"
                    >
                      /{isAnnual ? "year" : "month"}
                    </motion.span>
                  </div>
                  <AnimatePresence>
                    {isAnnual && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-2 text-sm text-green-600 overflow-hidden dark:text-green-400"
                      >
                        {t("billing.saveAmount", { amount: savings })}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={() => handlePlanSelect(plan.id)}
                  className={`block w-full rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    plan.popular
                      ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-indigo-600 dark:hover:bg-indigo-500"
                      : "bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-indigo-600 dark:hover:bg-indigo-500"
                  }`}
                >
                  {t("cta.continue")}
                </button>

                <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <svg
                        className="h-6 w-5 flex-none text-indigo-600 dark:text-indigo-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("additionalInfo")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
