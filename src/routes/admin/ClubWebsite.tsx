import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import ButtonPrimary from "../../components/ButtonPrimary";
import ButtonSecondary from "../../components/ButtonSecondary";
import { downloadFile } from "../../lib/downloadFile";
import FirestoreService from "../../lib/FirebaseService";
import { useClubStore } from "../../stores/useClubStore";
import { useClubWebsiteStore } from "../../stores/useClubWebsiteStore";
import type { Club } from "../../types/Club";
import type { WebsitePage } from "../../types/WebsitePage";
import ClubWebsiteForm from "./ClubWebsiteForm";
import ClubWebsitePreview from "./ClubWebsitePreview";

const ClubWebsite = () => {
  const {
    isEditing,
    heroTitle,
    heroDescription,
    clubName,
    email,
    phone,
    instagramLink,
    facebookLink,
    activities,
    pricingPlans,
    setIsEditing,
    setClubName,
    setHeroTitle,
    setHeroDescription,
    setEmail,
    setPhone,
    setInstagramLink,
    setFacebookLink,
    setActivities,
    setLogoPath,
    setLogoFile,
    setLogoUrl,
    setHeroImagePath,
    setHeroImageFile,
    setHeroImageUrl,
    setPricingPlans,
  } = useClubWebsiteStore();

  const { currentClubId } = useClubStore();

  const clubCollection = new FirestoreService<Club>(`clubs/`);
  const websitePageCollection = new FirestoreService<WebsitePage>(
    `clubs/${currentClubId}/websitePage`
  );

  async function saveChanges() {
    if (currentClubId) {
      // TODO: Find a way to not save the images each time a save is done
      // if (logoFile && !sameLogoUploaded) {
      //   const logoPath = `clubs/${currentClubId}/public/logo.png`;
      //   await uploadImage(logoFile, logoPath);
      //   await clubCollection.update(currentClubId, { logoPath });
      // }

      // console.log("if", heroImageFile, sameHeroImageUploaded);
      // if (heroImageFile && !sameHeroImageUploaded) {
      //   const heroImagePath = `clubs/${currentClubId}/websitePage/default/heroImage.png`;
      //   await uploadImage(heroImageFile, heroImagePath);
      //   await websitePageCollection.update("default", { heroImagePath });
      // }

      try {
        await clubCollection.update(currentClubId, {
          name: clubName ?? "",
        });
        const websitePage: WebsitePage = {
          id: "default",
          clubId: currentClubId ?? "no-club-id",
          title: heroTitle ?? "",
          description: heroDescription ?? "",
          activities,
          pricing: pricingPlans,
          teamMembers: [],
          ridersShowcase: [],
          contact: {
            email: email ?? "",
            phone: phone ?? "",
            socials: {
              instagram: instagramLink ?? "",
              facebook: facebookLink ?? "",
            },
          },
        };

        const clubData = await clubCollection.read(currentClubId);
        if (clubData?.websitePageId) {
          await websitePageCollection.update("default", websitePage);
        } else {
          await websitePageCollection.create("default", websitePage);
        }
      } catch (error) {
        console.log("Error updating data", error);
      }
    }
  }

  const { data: club } = useQuery<Club>({
    queryKey: ["club", currentClubId],
    queryFn: async () => {
      const result = await clubCollection.read(currentClubId ?? "");
      if (!result) throw new Error("Club not found");
      return result;
    },
  });

  const { data: websitePage } = useQuery<WebsitePage>({
    queryKey: ["websitePage", "default"],
    queryFn: async () => {
      const result = await websitePageCollection.read("default");
      if (!result) throw new Error("Website page not found");
      return result;
    },
  });

  useEffect(() => {
    if (club) {
      setClubName(club.name);
      if (club.logoPath) {
        setLogoPath(club.logoPath);
        downloadFile(club.logoPath, "logo.png").then((file) => {
          const url = URL.createObjectURL(file);
          setLogoUrl(url);
          setLogoFile(file);
        });
      }
    }
  }, [club]);

  useEffect(() => {
    if (websitePage) {
      setHeroTitle(websitePage.title);
      setHeroDescription(websitePage.description);
      if (websitePage.heroImagePath) {
        setHeroImagePath(websitePage.heroImagePath);
        downloadFile(websitePage.heroImagePath, "heroImage.png").then(
          (file) => {
            const url = URL.createObjectURL(file);
            setHeroImageUrl(url);
            setHeroImageFile(file);
          }
        );
      }
      setEmail(websitePage.contact.email);
      setPhone(websitePage.contact.phone);
      setInstagramLink(websitePage.contact.socials.instagram);
      setFacebookLink(websitePage.contact.socials.facebook);
      setActivities(websitePage.activities ?? []);
      setPricingPlans(websitePage.pricing ?? []);
    }
  }, [websitePage]);

  return (
    <div className="min-h-screen flex flex-col">
      <section className="flex items-center gap-2 pb-4">
        Mode : {isEditing ? "Edition" : "Preview"}
        <ButtonSecondary
          title={isEditing ? "Preview" : "Modifier"}
          action={() => setIsEditing(!isEditing)}
        />
        <ButtonPrimary title="Sauvegarder" action={saveChanges} />
      </section>

      {isEditing ? <ClubWebsiteForm /> : <ClubWebsitePreview />}
    </div>
  );
};

export default ClubWebsite;
