import ClubWebsiteFormActivities from "../../components/websitePage/form/ClubWebsiteFormActivities";
import ClubWebsiteFormContact from "../../components/websitePage/form/ClubWebsiteFormContact";
import ClubWebsiteFormHero from "../../components/websitePage/form/ClubWebsiteFormHero";
import ClubWebsiteFormInfo from "../../components/websitePage/form/ClubWebsiteFormInfo";
import ClubWebsiteFormLogo from "../../components/websitePage/form/ClubWebsiteFormLogo";
import ClubWebsiteFormPricing from "../../components/websitePage/form/ClubWebsiteFormPricing";

const ClubWebsiteForm = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow space-y-6">
      {/* Basic info */}
      <ClubWebsiteFormInfo />

      {/* Separator */}
      <div className="h-[2px] w-full bg-black/50"></div>

      {/* Logo URL */}
      <ClubWebsiteFormLogo />

      {/* Separator */}
      <div className="h-[2px] w-full bg-black/50"></div>

      {/* Activities */}
      <ClubWebsiteFormActivities />

      {/* Separator */}
      <div className="h-[2px] w-full bg-black/50"></div>

      {/* Hero */}
      <ClubWebsiteFormHero />

      {/* Separator */}
      <div className="h-[2px] w-full bg-black/50"></div>

      <ClubWebsiteFormPricing />

      {/* Separator */}
      <div className="h-[2px] w-full bg-black/50"></div>

      {/* Contact */}
      <ClubWebsiteFormContact />
    </div>
  );
};

export default ClubWebsiteForm;
