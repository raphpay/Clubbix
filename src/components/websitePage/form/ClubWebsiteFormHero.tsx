import { useClubWebsiteStore } from "../../../stores/useClubWebsiteStore";

const ClubWebsiteFormHero = () => {
  const {
    heroTitle,
    heroDescription,
    heroImageFile,
    heroImageUrl,
    setHeroTitle,
    setHeroDescription,
    setHeroImageUrl,
    setSameHeroImageUploaded,
  } = useClubWebsiteStore();

  function onFileChange(currentFile: File) {
    if (
      currentFile &&
      heroImageFile &&
      currentFile.name === heroImageFile.name &&
      currentFile.size === heroImageFile.size
    ) {
      setSameHeroImageUploaded(true);
      return;
    }

    setSameHeroImageUploaded(false);
    const url = URL.createObjectURL(currentFile);
    setHeroImageUrl(url); // Update Zustand
  }

  return (
    <div>
      {/* Hero Title */}
      <div>
        <label className="block font-semibold">
          Titre de la bannière principale
        </label>
        <input
          type="text"
          value={heroTitle ?? ""}
          onChange={(e) => setHeroTitle(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
        />
      </div>

      {/* Hero Description */}
      <div>
        <label className="block font-semibold">
          Description de la bannière principale
        </label>
        <textarea
          value={heroDescription ?? ""}
          onChange={(e) => setHeroDescription(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
          rows={3}
        />
      </div>

      {/* Hero Background Image */}
      <div>
        <label className="block font-semibold">
          Image de fond de la bannière principale
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            onFileChange(file);
          }}
          className="w-full border rounded px-3 py-2"
        />
        {heroImageUrl && (
          <img src={heroImageUrl} alt="" className="mt-2 h-16 object-contain" />
        )}
      </div>
    </div>
  );
};

export default ClubWebsiteFormHero;
