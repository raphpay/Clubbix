import { Check } from "lucide-react";

import { useClubWebsiteStore } from "../../../stores/useClubWebsiteStore";

const ClubWebsitePreviewPricingPlans = () => {
  const { pricingPlans } = useClubWebsiteStore();

  const colClass =
    {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
    }[pricingPlans.length] || "grid-cols-1"; // fallback

  return (
    <div>
      {/* Start Pricing Plans section */}
      {pricingPlans.length > 0 && (
        <section className="py-6">
          <h2 className="text-3xl font-bold mb-4">Ce que l'on propose</h2>
          <div className={`grid gap-4 ${colClass}`}>
            {pricingPlans.map((plan, index) => {
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-lg flex flex-col md:text-left items-center "
                >
                  <h3 className="text-2xl font-semibold md:text-left w-full">
                    {plan.title}
                  </h3>
                  <p className="text-gray-500 w-full md:text-left">
                    {plan.description}
                  </p>
                  <p className="text-4xl font-bold my-4 w-full md:text-left">
                    {plan.pricePerMonth}€
                    <span className="text-sm text-gray-500">/mois</span>
                  </p>
                  <ul className="text-gray-500 mb-6 md:w-full md:text-left h-full">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check color="green" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                    Choisir ce plan
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}
      {/* End Pricing Plans section */}
    </div>
  );
};

export default ClubWebsitePreviewPricingPlans;
