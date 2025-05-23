import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import ButtonPrimary from "../../components/ButtonPrimary";
import ButtonSecondary from "../../components/ButtonSecondary";
import { downloadFile } from "../../lib/downloadFile";
import FirestoreService from "../../lib/FirebaseService";
import { useClubWebsiteStore } from "../../stores/useClubWebsiteStore";
import type { Club } from "../../types/Club";
import type { WebsitePage } from "../../types/WebsitePage";
import ClubWebsiteForm from "./ClubWebsiteForm";
import ClubWebsitePreview from "./ClubWebsitePreview";

const ClubWebsite = () => {
  const {
    isEditing,
    logoFile,
    heroTitle,
    heroDescription,
    heroImageFile,
    clubName,
    email,
    phone,
    instagramLink,
    facebookLink,
    activities,
    setIsEditing,
    setClubName,
    setLogoPath,
    setLogoFile,
    setHeroImageUrl,
    setHeroTitle,
    setHeroDescription,
    setLogoUrl,
    setHeroImagePath,
    setHeroImageFile,
    setEmail,
    setPhone,
    setInstagramLink,
    setFacebookLink,
    setActivities,
  } = useClubWebsiteStore();

  const clubId = "6HRbFwNVA2INAaoxAbyu"; // TODO: To be loaded dynamically
  const clubCollection = new FirestoreService<Club>(`clubs/`);
  const websitePageCollection = new FirestoreService<WebsitePage>(
    `clubs/${clubId}/websitePage`
  );

  async function saveChanges() {
    // TODO: Find a way to not save the logo each time a save is done
    // if (logoFile) {
    //   console.log("logo");
    //   const logoPath = `clubs/${clubId}/logo.jpg`;
    //   await uploadImage(logoFile, logoPath);
    //   await clubCollection.update(clubId, { logoPath });
    // }

    // if (heroImageFile) {
    //   console.log("hero");
    //   const heroImagePath = `clubs/${clubId}/websitePage/default/heroImage.jpg`;
    //   await uploadImage(heroImageFile, heroImagePath);
    //   await websitePageCollection.update("default", { heroImagePath });
    // }

    try {
      await clubCollection.update(clubId, {
        name: clubName ?? "",
      });
      const websitePage: WebsitePage = {
        id: "default",
        title: heroTitle ?? "",
        description: heroDescription ?? "",
        activities,
        pricing: [],
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
      console.log("new", websitePage);
      const clubData = await clubCollection.read(clubId);
      if (clubData?.websitePage) {
        await websitePageCollection.update("default", websitePage);
      } else {
        console.log("create");
        await websitePageCollection.create("default", websitePage);
      }
    } catch (error) {
      console.log("Error updating data", error);
    }
  }

  const { data: club } = useQuery<Club>({
    queryKey: ["club", clubId],
    queryFn: async () => {
      const result = await clubCollection.read(clubId);
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
        downloadFile(club.logoPath, "logo.jpg").then((file) => {
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
        downloadFile(websitePage.heroImagePath, "heroImage.jpg").then(
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
