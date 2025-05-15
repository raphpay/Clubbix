import { Check } from "lucide-react";
// TODO: To be added to backend
type Pricing = {
  id: number;
  name: string;
  description: string;
  price: number;
  features: string[];
};

const plans: Pricing[] = [
  {
    id: 1,
    name: "Basic",
    description: "Parfait pour les petits clubs",
    price: 2,
    features: ["Feature A", "Feature B"],
  },
  {
    id: 2,
    name: "Pro",
    description: "Pour les assos qui grandissent",
    price: 5,
    features: ["Feature A", "Feature B", "Feature C"],
  },
  {
    id: 3,
    name: "Big-Boss",
    description: "Pour les clubs qui visent la lune",
    price: 9,
    features: ["Feature A", "Feature B", "Feature C", "Feature D"],
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 bg-gray-100 px-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold">Tarifs</h2>
        <p className="text-gray-600 mt-2">
          Choisissez le plan qui vous convient le mieux
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          return (
            <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
              <h3 className="text-2xl font-semibold md:text-left w-full">
                {plan.name}
              </h3>
              <p className="text-gray-500 w-full md:text-left">
                {plan.description}
              </p>
              <p className="text-4xl font-bold my-4 w-full md:text-left">
                {plan.price}€
                <span className="text-sm text-gray-500">/an/membre</span>
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
  );
};

export default PricingSection;
