import { BadgeCheck, Building, CalendarPlus, UserPen } from "lucide-react";

import type { HomeCard } from "../../../../types/HomeCard";

const steps: HomeCard[] = [
  {
    id: 1,
    title: "Créer votre compte club",
    description: "Entrez les informations de votre club et son branding.",
    icon: "building",
  },
  {
    id: 2,
    title: "Invitez vos membres",
    description: "Importez vos membres ou créez-en de nouveau.",
    icon: "user-pen",
  },
  {
    id: 3,
    title: "Créez des événements",
    description: "Créez des événements et gérez les inscriptions.",
    icon: "calendar-plus",
  },
  {
    id: 4,
    title: "Commmencez à utiliser Clubbix",
    description: "Tout en un seul endroit, prêt à l'emploi.",
    icon: "badge-check",
  },
];

const GettingStartedSection = () => {
  const iconMap = {
    building: Building,
    "user-pen": UserPen,
    "calendar-plus": CalendarPlus,
    "badge-check": BadgeCheck,
  };

  return (
    <section id="getting-started" class="py-20 bg-white px-12">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold">Commencez en quelques minutes</h2>
        <p class="text-gray-600 mt-2">
          Des étapes simples et rapides pour vous lancer avec Clubbix.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mx-auto px-4">
        {steps.map((step) => {
          const IconComponent = iconMap[step.icon]; // TODO: Correct the warning
          return (
            <div
              key={step.id}
              className=" mb-6 flex items-center flex-col gap-6"
            >
              <div className="bg-blue-200 w-[50px] h-[50px] rounded-full p-2 flex items-center justify-center">
                {IconComponent && <IconComponent className="text-blue-600" />}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default GettingStartedSection;
