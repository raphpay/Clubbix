import ClubWebsitePreviewActivities from "../../components/websitePage/preview/ClubWebsitePreviewActivities";
import ClubWebsitePreviewFooter from "../../components/websitePage/preview/ClubWebsitePreviewFooter";
import ClubWebsitePreviewHeader from "../../components/websitePage/preview/ClubWebsitePreviewHeader";
import ClubWebsitePreviewHero from "../../components/websitePage/preview/ClubWebsitePreviewHero";
import ClubWebsitePreviewPricingPlans from "../../components/websitePage/preview/ClubWebsitePreviewPricingPlans";
import ClubWebsitePreviewSchedule from "../../components/websitePage/preview/ClubWebsitePreviewSchedule";

const ClubWebsitePreview = () => {
  return (
    <div>
      <ClubWebsitePreviewHeader />

      <ClubWebsitePreviewHero />

      <ClubWebsitePreviewActivities />

      <ClubWebsitePreviewSchedule />

      <ClubWebsitePreviewPricingPlans />

      <ClubWebsitePreviewFooter />
    </div>
  );
};

export default ClubWebsitePreview;
