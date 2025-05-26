import ClubWebsitePreviewActivities from "../../components/websitePage/preview/ClubWebsitePreviewActivities";
import ClubWebsitePreviewFooter from "../../components/websitePage/preview/ClubWebsitePreviewFooter";
import ClubWebsitePreviewHeader from "../../components/websitePage/preview/ClubWebsitePreviewHeader";
import ClubWebsitePreviewHero from "../../components/websitePage/preview/ClubWebsitePreviewHero";

const ClubWebsitePreview = () => {
  return (
    <div>
      <ClubWebsitePreviewHeader />

      <ClubWebsitePreviewHero />

      <ClubWebsitePreviewActivities />

      <ClubWebsitePreviewFooter />
    </div>
  );
};

export default ClubWebsitePreview;
