import { useClubWebsiteStore } from "../../../stores/useClubWebsiteStore";

const ClubWebsiteFormLogo = () => {
  const { logoUrl, logoFile, setSameLogoUploaded, setLogoUrl } =
    useClubWebsiteStore();

  function onFileChange(currentFile: File) {
    if (
      currentFile &&
      logoFile &&
      currentFile.name === logoFile.name &&
      currentFile.size === logoFile.size
    ) {
      setSameLogoUploaded(true);
      return;
    }

    setSameLogoUploaded(false);
    const url = URL.createObjectURL(currentFile);
    setLogoUrl(url); // Update Zustand
  }

  return (
    <div>
      {/* Logo URL */}
      <label className="block font-semibold mb-1">Logo</label>
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
      {logoUrl && (
        <img src={logoUrl} alt="" className="mt-2 h-16 object-contain" />
      )}
    </div>
  );
};

export default ClubWebsiteFormLogo;
