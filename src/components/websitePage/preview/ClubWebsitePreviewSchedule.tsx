import { useClubWebsiteStore } from "../../../stores/useClubWebsiteStore";

const daysFr: Record<string, string> = {
  lundi: "Lundi",
  mardi: "Mardi",
  mercredi: "Mercredi",
  jeudi: "Jeudi",
  vendredi: "Vendredi",
  samedi: "Samedi",
  dimanche: "Dimanche",
};

const ClubWebsitePreviewSchedule = () => {
  const { schedule } = useClubWebsiteStore();

  const orderedDays = [
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
    "dimanche",
  ];

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">Horaires d'ouverture</h2>
      <div className="divide-y divide-gray-200 border rounded-md">
        {orderedDays.map((day) => {
          const ranges = schedule[day];
          return (
            <div key={day} className="p-3 flex justify-between items-start">
              <span className="font-medium w-32">{daysFr[day]}</span>
              <div className="text-sm text-gray-700 space-y-1">
                {ranges && ranges.length > 0 ? (
                  ranges.map((range, idx) => (
                    <div key={idx}>
                      {range.open} — {range.close}
                    </div>
                  ))
                ) : (
                  <div className="italic text-gray-400">Fermé</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ClubWebsitePreviewSchedule;
