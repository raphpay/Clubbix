import ClubWebsitePreviewActivities from "../../components/websitePage/preview/ClubWebsitePreviewActivities";
import ClubWebsitePreviewFooter from "../../components/websitePage/preview/ClubWebsitePreviewFooter";
import ClubWebsitePreviewHeader from "../../components/websitePage/preview/ClubWebsitePreviewHeader";
import ClubWebsitePreviewHero from "../../components/websitePage/preview/ClubWebsitePreviewHero";
import ClubWebsitePreviewPricingPlans from "../../components/websitePage/preview/ClubWebsitePreviewPricingPlans";

const ClubWebsitePreview = () => {
  return (
    <div>
      <ClubWebsitePreviewHeader />

      <ClubWebsitePreviewHero />

      <ClubWebsitePreviewActivities />

      <ClubWebsitePreviewPricingPlans />

      <ClubWebsitePreviewFooter />
    </div>
  );
};

export default ClubWebsitePreview;
