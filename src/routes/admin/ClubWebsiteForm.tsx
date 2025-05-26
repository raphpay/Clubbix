import ClubWebsiteFormActivities from "../../components/websitePage/form/ClubWebsiteFormActivities";
import ClubWebsiteFormContact from "../../components/websitePage/form/ClubWebsiteFormContact";
import ClubWebsiteFormHero from "../../components/websitePage/form/ClubWebsiteFormHero";
import ClubWebsiteFormInfo from "../../components/websitePage/form/ClubWebsiteFormInfo";
import ClubWebsiteFormLogo from "../../components/websitePage/form/ClubWebsiteFormLogo";

const ClubWebsiteForm = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow space-y-6">
      {/* Basic info */}
      <ClubWebsiteFormInfo />

      {/* Logo URL */}
      <ClubWebsiteFormLogo />

      {/* Activities */}
      <ClubWebsiteFormActivities />

      {/* Hero */}
      <ClubWebsiteFormHero />

      {/* Contact */}
      <ClubWebsiteFormContact />
    </div>
  );
};

export default ClubWebsiteForm;
