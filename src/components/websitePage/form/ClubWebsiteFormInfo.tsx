import { useClubWebsiteStore } from "../../../stores/useClubWebsiteStore";

const ClubWebsiteFormInfo = () => {
  const { clubName, setClubName } = useClubWebsiteStore();

  return (
    <div>
      <h2 className="text-2xl font-bold">Modifier le site du club</h2>

      {/* Club Name */}
      <div>
        <label className="block font-semibold">Nom du Club</label>
        <input
          type="text"
          value={clubName ?? ""}
          onChange={(e) => setClubName(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
        />
      </div>
    </div>
  );
};

export default ClubWebsiteFormInfo;
