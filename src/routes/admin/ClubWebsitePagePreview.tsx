import ButtonPrimary from "../../components/ButtonPrimary";
import { useClubStore } from "../../stores/useClubStore";
import type { Club } from "../../types/Club";

type WebsitePreviewHeaderProps = {
  clubLogoPath?: string;
  currentClub?: Club;
};

const WebsitePreviewHeader = ({
  clubLogoPath,
  currentClub,
}: WebsitePreviewHeaderProps) => {
  return (
    <header className="w-full flex items-center justify-between px-8 py-4 mb-4 shadow-md sticky top-0 bg-white z-50">
      {clubLogoPath && (
        <img
          src={clubLogoPath}
          alt="Logo actuel"
          className="mt-2 max-h-32 object-contain"
        />
      )}
      <div className="text-xl font-bold">
        <span>{currentClub?.name ?? "No club name"}</span>
      </div>

      <div className="flex gap-4">
        <button className="cursor-pointer items-center" onClick={() => {}}>
          <img
            src="/assets/instagram-logo.jpg"
            alt="Instagram Logo"
            className="w-[25px] h-[25px] object-contain"
          />
        </button>
        <button className="cursor-pointer items-center" onClick={() => {}}>
          <img
            src="/assets/facebook-logo.jpg"
            alt="Facebook Logo"
            className="w-[25px] h-[25px] object-contain"
          />
        </button>

        <ButtonPrimary action={() => {}}>Nous rejoindre</ButtonPrimary>
      </div>
    </header>
  );
};

const ClubWebsitePagePreview = () => {
  const { currentClub, clubLogoPath } = useClubStore();

  return (
    <div className="border-1 border-black/50 h-full w-full">
      <p>Hello</p>
      {/* Header */}
      <WebsitePreviewHeader
        clubLogoPath={clubLogoPath}
        currentClub={currentClub}
      />

      {/* Hero */}
    </div>
  );
};
export default ClubWebsitePagePreview;
