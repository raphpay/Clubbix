import { Bike, Dumbbell, Mountain, PersonStanding } from "lucide-react";
import { useClubWebsiteStore } from "../../../stores/useClubWebsiteStore";
import type { Activity } from "../../../types/WebsitePage";

const availableIcons: { name: string; Icon: typeof Bike }[] = [
  { name: "bike", Icon: Bike },
  { name: "fitness", Icon: Dumbbell },
  { name: "mountain", Icon: Mountain },
  { name: "community", Icon: PersonStanding },
];

const ClubWebsiteFormActivities = () => {
  const { activities, setActivities } = useClubWebsiteStore();

  const handleActivityChange = (
    index: number,
    field: "title" | "description" | "icon",
    value: string
  ) => {
    const newActivities = [...activities];
    newActivities[index][field] = value;
    setActivities(newActivities);
  };

  function addActivity() {
    const newActivity: Activity = {
      icon: "bike",
      title: "",
      description: "",
    };
    setActivities([...activities, newActivity]);
  }

  function removeNavLink(index: number) {
    const newActivities = [...activities];
    newActivities.splice(index, 1);
    setActivities(newActivities);
  }

  return (
    <div>
      {/* Activities */}
      <label className="block font-semibold mb-2">Activités du club</label>
      {activities.map((activity: any, index: number) => (
        <div
          key={index}
          className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4 items-center"
        >
          <div className="flex items-center gap-2">
            <select
              value={activity.icon}
              onChange={(e) =>
                handleActivityChange(index, "icon", e.target.value)
              }
              className="border px-2 py-1 rounded"
            >
              {availableIcons.map(({ name }) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            {(() => {
              const SelectedIcon = availableIcons.find(
                (i) => i.name === activity.icon
              )?.Icon;
              return SelectedIcon ? (
                <SelectedIcon className="w-4 h-4 text-blue-600" />
              ) : null;
            })()}
          </div>
          <input
            type="text"
            value={activity.title}
            onChange={(e) =>
              handleActivityChange(index, "title", e.target.value)
            }
            placeholder="BMX Race"
            className="flex-1 border px-2 py-1 rounded"
          />
          <input
            type="text"
            value={activity.description}
            onChange={(e) =>
              handleActivityChange(index, "description", e.target.value)
            }
            placeholder="Des cours de BMX Race pour tous"
            className="flex-1 border px-2 py-1 rounded"
          />
          <button
            onClick={() => removeNavLink(index)}
            className="text-red-600 px-2"
            type="button"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addActivity}
        disabled={activities.length >= 3}
        className="mt-2 text-sm text-blue-600 underline disabled:text-gray-500"
      >
        + Ajouter une activité ( 3 max )
      </button>
    </div>
  );
};

export default ClubWebsiteFormActivities;
