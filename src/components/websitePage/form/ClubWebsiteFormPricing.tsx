import { useClubWebsiteStore } from "../../../stores/useClubWebsiteStore";

import type { PricingPlan } from "../../../types/WebsitePage";

import Input from "../../Input";
import NumberInput from "../../inputs/NumberInput";

const ClubWebsiteFormPricing = () => {
  const { pricingPlans, setPricingPlans } = useClubWebsiteStore();

  function addPricingPlan() {
    const newPricingPlan: PricingPlan = {
      title: "",
      features: [],
      featured: false,
    };
    setPricingPlans([...pricingPlans, newPricingPlan]);
  }

  function removePricingPlan(index: number) {
    const newActivities = [...pricingPlans];
    newActivities.splice(index, 1);
    setPricingPlans(newActivities);
  }

  function handlePricingPlanTitleChange(index: number, value: string) {
    const newPricingPlans = [...pricingPlans];
    newPricingPlans[index].title = value;
    setPricingPlans(newPricingPlans);
  }

  function handlePricingPlanDescriptionChange(index: number, value: string) {
    const newPricingPlans = [...pricingPlans];
    newPricingPlans[index].description = value;
    setPricingPlans(newPricingPlans);
  }

  function handlePricingPlanPricePerMonthChange(index: number, value: number) {
    const newPricingPlans = [...pricingPlans];
    newPricingPlans[index].pricePerMonth = value;
    setPricingPlans(newPricingPlans);
  }

  function handlePricingPlanPricePerYearChange(index: number, value: number) {
    const newPricingPlans = [...pricingPlans];
    newPricingPlans[index].pricePerYear = value;
    setPricingPlans(newPricingPlans);
  }

  function handlePricingPlanFeaturesChange(index: number, value: string[]) {
    const newPricingPlans = [...pricingPlans];
    newPricingPlans[index].features = value;
    setPricingPlans(newPricingPlans);
  }

  function handlePricingPlanFeaturedChange(index: number, value: boolean) {
    const newPricingPlans = [...pricingPlans];
    newPricingPlans[index].featured = value;
    setPricingPlans(newPricingPlans);
  }

  return (
    <div>
      <label className="block font-semibold mb-2">
        Prix d'abonnements du club
      </label>
      {pricingPlans.map((plan: any, index: number) => (
        <div key={index} className="flex gap-2 items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
            <Input
              label="Titre"
              value={plan.title ?? ""}
              onChange={(e) =>
                handlePricingPlanTitleChange(index, e.target.value)
              }
              placeholder="Plan débutant"
            />

            <NumberInput
              label="Prix par mois"
              value={plan.pricePerMonth}
              onChange={(e) =>
                handlePricingPlanPricePerMonthChange(index, e.target.value)
              }
              placeholder="49"
            />
          </div>
          <button
            onClick={() => removePricingPlan(index)}
            className="text-red-600 px-2"
            type="button"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addPricingPlan}
        disabled={pricingPlans.length >= 3}
        className="mt-2 text-sm text-blue-600 underline disabled:text-gray-500"
      >
        + Ajouter un plan d'abonnement ( 3 max )
      </button>
    </div>
  );
};

export default ClubWebsiteFormPricing;
