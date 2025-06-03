import { useClubWebsiteStore } from "../../../stores/useClubWebsiteStore";

const days = [
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
  "dimanche",
];

const ClubWebsiteFormSchedule = () => {
  const { schedule, addTimeRange, updateTimeRange, removeTimeRange } =
    useClubWebsiteStore();

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold">Horaires d'ouverture</h2>

      {days.map((day) => (
        <div key={day}>
          <div className="flex items-center justify-between mb-1">
            <label className="capitalize font-medium">{day}</label>
            <button
              onClick={() => addTimeRange(day)}
              className="text-sm text-blue-500 hover:underline"
              type="button"
            >
              + Ajouter une plage
            </button>
          </div>

          {(schedule[day] || []).map((range, index) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-2 items-center mb-2"
            >
              <input
                type="time"
                value={range.open}
                onChange={(e) =>
                  updateTimeRange(day, index, "open", e.target.value)
                }
                className="border rounded px-2 py-1"
              />
              <input
                type="time"
                value={range.close}
                onChange={(e) =>
                  updateTimeRange(day, index, "close", e.target.value)
                }
                className="border rounded px-2 py-1"
              />
              <button
                onClick={() => removeTimeRange(day, index)}
                className="text-red-500 text-sm hover:underline"
                type="button"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      ))}
    </section>
  );
};

export default ClubWebsiteFormSchedule;
