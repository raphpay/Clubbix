import { Bike, Dumbbell, Mountain, PersonStanding } from "lucide-react";
import { useClubWebsiteStore } from "../../../stores/useClubWebsiteStore";
import PresentationWithIcon from "../../PresentationWithIcon";

const ClubWebsitePreviewActivities = () => {
  const { activities } = useClubWebsiteStore();

  const iconMap = {
    bike: Bike,
    mountain: Mountain,
    fitness: Dumbbell,
    community: PersonStanding,
  };

  const colClass =
    {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
    }[activities.length] || "grid-cols-1"; // fallback

  return (
    <div>
      {/* Start Activities section */}
      {activities.length > 0 && (
        <section className="py-6">
          <h2 className="text-3xl font-bold mb-4">Ce que l'on propose</h2>
          <div className={`grid gap-4 ${colClass}`}>
            {activities.map((activity, index) => {
              const IconComponent = iconMap[activity.icon]; // TODO: Correct the warning
              return (
                <PresentationWithIcon
                  id={index}
                  icon={<IconComponent />}
                  title={activity.title}
                  description={activity.description}
                />
              );
            })}
          </div>
        </section>
      )}
      {/* End Activities section */}
    </div>
  );
};

export default ClubWebsitePreviewActivities;
