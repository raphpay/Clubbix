import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useClubStore } from "../../stores/useClubStore";
import { useWebsitePageStore } from "../../stores/useWebsitePageStore";

import FirestoreService from "../../lib/FirestoreService";
import type { Club } from "../../types/Club";

import ClubWebsitePageForm from "./ClubWebsitePageForm";
import ClubWebsitePagePreview from "./ClubWebsitePagePreview";

import ButtonPrimary from "../../components/ButtonPrimary";

const ClubConfiguration = () => {
  const { isEditing, setIsEditing } = useWebsitePageStore((state) => state);
  const { currentClubId, setCurrentClub } = useClubStore();

  const clubCollection = new FirestoreService<Club>("clubs");
  // const websiteCollection = new FirestoreService<WebsitePage>(
  //   `clubs/${currentClubId}/websitePage`
  // );

  const { data: club } = useQuery<Club>({
    queryKey: ["club", currentClubId],
    queryFn: async () => {
      if (!currentClubId) throw new Error("Club ID is null");
      const result = await clubCollection.read(currentClubId);
      if (!result) throw new Error("Club not found");
      return result;
    },
    enabled: !!currentClubId,
  });

  useEffect(() => {
    setCurrentClub(club);
  }, [club]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Start section switch */}
      <section className="flex justify-center items-center gap-4 pb-6">
        Mode : {isEditing ? "Edition" : "Preview"}
        <ButtonPrimary
          title={isEditing ? "Preview" : "Editer"}
          action={() => setIsEditing(!isEditing)}
        />
      </section>
      {/* End section switch */}

      {isEditing ? <ClubWebsitePageForm /> : <ClubWebsitePagePreview />}
    </div>
  );
};
export default ClubConfiguration;
