import {
  Calendar,
  ChartLine,
  CreditCard,
  FileText,
  Globe,
  Users,
} from "lucide-react";
import type { HomeCard } from "../../../../types/HomeCard";

const features: HomeCard[] = [
  {
    id: 1,
    title: "Gestion des membres",
    description:
      "Gérez les adhérents, les membres et leurs statu dans un dashboard.",
    icon: "users",
  },
  {
    id: 2,
    title: "Événements",
    description: "Organisez et gérez vos événements en toute simplicité.",
    icon: "calendar",
  },
  {
    id: 3,
    title: "Paiements",
    description: "Suivez et gérez les paiements/dépenses du club.",
    icon: "credit-card",
  },
  {
    id: 4,
    title: "Documents et certificats",
    description: "Stockez et gérez les documents importants du club.",
    icon: "file-text",
  },
  {
    id: 5,
    title: "Site web personnalisé",
    description: "Un site-web beau et moderne pour votre club.",
    icon: "globe",
  },
  {
    id: 6,
    title: "Analyses et rapports",
    description:
      "Obtenez des analyses et des rapports détaillés pour faire grandir le club.",
    icon: "chart-line",
  },
];

const FeaturesSection = () => {
  const iconMap = {
    users: Users,
    calendar: Calendar,
    "credit-card": CreditCard,
    "file-text": FileText,
    globe: Globe,
    "chart-line": ChartLine,
  };

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Fonctionnalités</h1>
        <h2 className="text-gray-600 mt-2">
          Tout ce que votre club a besoin - en un seul endroit
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
        {features.map((feature) => {
          const IconComponent = iconMap[feature.icon]; // TODO: Correct the warning
          return (
            <div
              key={feature.id}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition mb-6 flex items-start flex-col gap-2"
            >
              {IconComponent && <IconComponent className="text-blue-600" />}
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-start">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturesSection;
