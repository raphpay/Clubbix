import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useClubStore } from "../../stores/useClubStore";

import FirestoreService from "../../lib/FirestoreService";
import StorageService from "../../lib/StorageService";
import type { Club, ClubUpdateInput } from "../../types/Club";

import ButtonPrimary from "../../components/ButtonPrimary";
import Input from "../../components/Input";

const ClubWebsitePageForm = () => {
  const { currentClubId, clubLogoPath, setClubLogoPath } = useClubStore();

  const clubCollection = new FirestoreService<Club>("clubs");

  const [clubName, setClubName] = useState<string>("");
  const [clubFacebookUrl, setClubFacebookUrl] = useState<string>("");
  const [clubInstagramUrl, setClubInstagramUrl] = useState<string>("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [logoDownloadUrl, setLogoDownloadUrl] = useState<string | null>(null);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImagePreviewUrl, setHeroImagePreviewUrl] = useState<string | null>(
    null
  );
  const [heroImageDownloadUrl, setHeroImageDownloadUrl] = useState<
    string | null
  >(null);

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

  async function handleSubmit() {
    try {
      await updateClub();
      await updateWebsitePage();
    } catch (error) {
      console.log("Error submitting info", error);
    }
  }

  async function updateClub() {
    if (club) {
      const clubUpdateInput: ClubUpdateInput = {
        name: clubName,
        socialAccounts: {
          facebookUrl: clubFacebookUrl ?? "",
          instagramUrl: clubInstagramUrl ?? "",
        },
      };

      if (currentClubId) {
        try {
          await clubCollection.update(currentClubId, clubUpdateInput);
        } catch (error) {
          throw error;
        }
      }
    }
  }

  async function updateWebsitePage() {
    if (club?.websitePageId) {
    }
  }

  async function fetchClubInfo() {
    if (club) {
      setClubName(club.name);
      setClubFacebookUrl(club.socialAccounts?.facebookUrl ?? "");
      setClubInstagramUrl(club.socialAccounts?.instagramUrl ?? "");

      // Check cache first
      const cached = localStorage.getItem(`logo-url-${club.id}`);
      if (cached) {
        setLogoDownloadUrl(cached);
        setClubLogoPath(cached);
      } else {
        const url = await StorageService.getDownloadUrl(
          `clubs/${currentClubId}/public/logo.png`
        );
        setLogoDownloadUrl(url);
        setClubLogoPath(url);
        localStorage.setItem(`logo-url-${club.id}`, url); // cache it
      }
    }
  }

  useEffect(() => {
    fetchClubInfo();
  }, [club]);

  return (
    <form className="space-y-4">
      {/* Club information */}
      <h2 className="text-lg font-semibold">Les informations du club</h2>
      <Input
        label="Nom du club"
        type="text"
        placeholder="Cornillon BMX"
        value={clubName}
        onChange={(e) => setClubName(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="flex flex-col items-center">
          <label className="block font-medium mb-1">Logo du club</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                const file = e.target.files[0];
                setLogoFile(file);
                setLogoPreviewUrl(URL.createObjectURL(file));
              }
            }}
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md p-2"
          />
          {logoPreviewUrl ? (
            <img
              src={logoPreviewUrl}
              alt="Preview du logo"
              className="mt-2 max-h-32 object-contain"
            />
          ) : clubLogoPath ? (
            <img
              src={clubLogoPath}
              alt="Logo actuel"
              className="mt-2 max-h-32 object-contain"
            />
          ) : null}
        </div>
        <div className="flex flex-col items-center">
          <label className="block font-medium mb-1">
            Image de fond du site web
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                const file = e.target.files[0];
                setHeroImageFile(file);
                setHeroImagePreviewUrl(URL.createObjectURL(file));
              }
            }}
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md p-2"
          />
          {heroImagePreviewUrl ? (
            <img
              src={heroImagePreviewUrl}
              alt="Preview de l'image de fond"
              className="mt-2 max-h-32 object-contain"
            />
          ) : heroImageDownloadUrl ? (
            <img
              src={heroImageDownloadUrl}
              alt="Image de fond actuelle"
              className="mt-2 max-h-32 object-contain"
            />
          ) : null}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <Input
          label="Lien facebook"
          type="text"
          placeholder="https://www.facebook.com/cornillon-bmx"
          value={clubFacebookUrl}
          onChange={(e) => setClubFacebookUrl(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Input
          label="Lien Instagram"
          type="text"
          placeholder="https://www.instagram.com/cornillon-bmx"
          value={clubInstagramUrl}
          onChange={(e) => setClubInstagramUrl(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Separator */}
      <div className="h-[2px] w-full bg-black/50"></div>

      <ButtonPrimary action={handleSubmit}>
        Sauvegarder les informations
      </ButtonPrimary>
    </form>
  );
};
export default ClubWebsitePageForm;
