import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../components/ui/Button";
import { storage } from "../config/firebase";
import { useClub } from "../hooks/useClub";
import {
  addEvent,
  addGalleryImage,
  createClubWebsiteContent,
  getClubWebsiteContent,
  updateClubWebsiteContent,
  updateEvent,
  uploadWebsiteImage,
} from "../services/firestore/clubWebsiteService";
import { ClubWebsiteContent } from "../services/firestore/types";

const LOGO_SIZE = 256; // px, square
const BANNER_WIDTH = 1200;
const BANNER_HEIGHT = 400;

const ClubWebsiteManager: React.FC = () => {
  const { t } = useTranslation("website");
  const { club } = useClub();

  const [content, setContent] = useState<ClubWebsiteContent | null>(null);
  const [localContent, setLocalContent] = useState<ClubWebsiteContent | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      if (!club?.id) return;
      try {
        const websiteContent = await getClubWebsiteContent(club.id);
        if (!websiteContent) {
          // Initialize with default content if none exists
          const defaultContent = {
            headline: "Welcome to Our Club",
            subtext: "Join us in our journey",
            bannerImageUrl: "",
            gallery: [],
            events: [],
          };
          await createClubWebsiteContent(club.id, defaultContent);
          const newContent = {
            ...defaultContent,
            id: club.id,
            clubId: club.id,
            updatedAt: new Date(),
            createdAt: new Date(),
          };
          setContent(newContent);
          setLocalContent(newContent);
        } else {
          setContent(websiteContent);
          setLocalContent(websiteContent);
        }
      } catch (err) {
        setError(t("error.load"));
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [club?.id, t]);

  const handleContentChange = (updates: Partial<ClubWebsiteContent>) => {
    if (!localContent) return;
    setLocalContent({ ...localContent, ...updates });
  };

  const handlePublish = async () => {
    if (!club?.id || !localContent) return;
    setIsPublishing(true);
    try {
      await updateClubWebsiteContent(club.id, localContent);
      setContent(localContent);
      setError(null);
    } catch (err) {
      setError(t("error.update"));
      console.error(err);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleLogoImageUpload = async (file: File) => {
    if (!club?.id) return;
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError(t("logoImageTypeError"));
      return;
    }
    const img = new window.Image();
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      if (img.width !== LOGO_SIZE || img.height !== LOGO_SIZE) {
        setError(t("logoImageSizeError", { size: LOGO_SIZE }));
        return;
      }
      try {
        const fileName = `logo.png`;
        const logoRef = ref(storage, `clubs/${club.id}/public/${fileName}`);
        await deleteObject(logoRef).catch(() => {});
        await uploadBytes(logoRef, file);
        const url = await getDownloadURL(logoRef);
        setLocalContent((prev) => (prev ? { ...prev, logoUrl: url } : prev));
      } catch (err) {
        setError(t("error.upload"));
        console.error(err);
      }
    };
  };

  const handleBannerImageUpload = async (file: File) => {
    if (!club?.id) return;
    setError(null);
    // Validate type
    if (!file.type.startsWith("image/")) {
      setError(t("bannerImageTypeError"));
      return;
    }
    // Validate dimensions
    const img = new window.Image();
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      if (img.width !== BANNER_WIDTH || img.height !== BANNER_HEIGHT) {
        setError(
          t("bannerImageSizeError", {
            width: BANNER_WIDTH,
            height: BANNER_HEIGHT,
          })
        );
        return;
      }
      // Delete existing banner images
      const bannerRef = ref(storage, `clubs/${club.id}/website/banner`);
      const bannerList = await listAll(bannerRef);
      const deletePromises = bannerList.items.map((item) => deleteObject(item));
      await Promise.all(deletePromises);
      // Upload new banner image
      const imageUrl = await uploadWebsiteImage(club.id, file, "banner");
      handleContentChange({ bannerImageUrl: imageUrl });
    };
  };

  const handleGalleryImageUpload = async (file: File, caption: string) => {
    if (!club?.id) return;
    try {
      await addGalleryImage(club.id, file, caption);
      const updatedContent = await getClubWebsiteContent(club.id);
      if (updatedContent) {
        setContent(updatedContent);
        setLocalContent(updatedContent);
      }
    } catch (err) {
      setError(t("error.upload"));
      console.error(err);
    }
  };

  const handleEventCreate = async (event: {
    title: string;
    description: string;
    image: File;
    date: Date;
  }) => {
    if (!club?.id) return;
    try {
      await addEvent(club.id, event);
      const updatedContent = await getClubWebsiteContent(club.id);
      if (updatedContent) {
        setContent(updatedContent);
        setLocalContent(updatedContent);
      }
    } catch (err) {
      setError(t("error.create"));
      console.error(err);
    }
  };

  // Delete a gallery image from storage and Firestore
  const handleDeleteGalleryImage = async (
    imageId: string,
    imageUrl: string
  ) => {
    if (!club?.id || !localContent) return;
    setError(null);
    try {
      // Remove from storage
      const imageRef = ref(
        storage,
        imageUrl
          .replace(/^https?:\/\/[^/]+\/o\//, "")
          .replace(/\?.*$/, "")
          .replace(/%2F/g, "/")
      );
      await deleteObject(imageRef);
      // Remove from local state
      const updatedGallery = localContent.gallery.filter(
        (img) => img.id !== imageId
      );
      setLocalContent({ ...localContent, gallery: updatedGallery });
      // Optionally, update Firestore immediately or wait for publish
    } catch (err) {
      setError(t("error.upload"));
      console.error(err);
    }
  };

  // Delete the banner image from storage and local state
  const handleDeleteBannerImage = async () => {
    if (!club?.id || !localContent?.bannerImageUrl) return;
    setError(null);
    try {
      // Remove from storage
      const imageRef = ref(
        storage,
        localContent.bannerImageUrl
          .replace(/^https?:\/\/[^/]+\/o\//, "")
          .replace(/\?.*$/, "")
          .replace(/%2F/g, "/")
      );
      await deleteObject(imageRef);
      // Remove from local state
      setLocalContent({ ...localContent, bannerImageUrl: "" });
      // Optionally, update Firestore immediately or wait for publish
    } catch (err) {
      setError(t("error.upload"));
      console.error(err);
    }
  };

  // Delete the logo image from storage and local state
  const handleDeleteLogoImage = async () => {
    if (!club?.id || !localContent?.logoUrl) return;
    setError(null);
    try {
      const imageRef = ref(
        storage,
        localContent.logoUrl
          .replace(/^https?:\/\/[^/]+\/o\//, "")
          .replace(/\?.*$/, "")
          .replace(/%2F/g, "/")
      );
      await deleteObject(imageRef);
      setLocalContent((prev) => (prev ? { ...prev, logoUrl: "" } : prev));
    } catch (err) {
      setError(t("error.upload"));
      console.error(err);
    }
  };

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!localContent) {
    return <div>{t("error.notFound")}</div>;
  }

  const hasChanges = JSON.stringify(content) !== JSON.stringify(localContent);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">{t("title")}</h1>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        {/* Logo Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t("logo.title")}</h2>
          <div className="space-y-4">
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                {t("logoImage")}
              </label>
              <input
                type="file"
                id="logoImage"
                accept="image/png,image/jpeg"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleLogoImageUpload(file);
                }}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {localContent.logoUrl && (
                <div className="relative mt-2 inline-block">
                  <img
                    src={localContent.logoUrl}
                    alt="Logo"
                    className="h-24 w-24 object-cover rounded-full border"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-red-100"
                    title={t("logoImageDelete")}
                    onClick={handleDeleteLogoImage}
                  >
                    <span className="sr-only">{t("logoImageDelete")}</span>
                    <svg
                      className="w-5 h-5 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                PNG, {LOGO_SIZE}x{LOGO_SIZE}px
              </p>
            </div>
          </div>
        </section>

        {/* Basic Content Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold mb-4">{t("basicContent")}</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handlePublish}
                disabled={!hasChanges || isPublishing}
              >
                {isPublishing ? t("publishing") : t("publish")}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (!club?.id) return;
                  window.open(`/clubs/${club.id}`, "_blank");
                }}
              >
                {t("seeWebsite")}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("headline")}
              </label>
              <input
                type="text"
                value={localContent.headline}
                onChange={(e) =>
                  handleContentChange({ headline: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("subtext")}
              </label>
              <textarea
                value={localContent.subtext}
                onChange={(e) =>
                  handleContentChange({ subtext: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                rows={3}
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                {t("bannerImage")}
              </label>
              <input
                type="file"
                id="bannerImage"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleBannerImageUpload(file);
                }}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {localContent.bannerImageUrl && (
                <div className="relative mt-2 inline-block">
                  <img
                    src={localContent.bannerImageUrl}
                    alt="Banner"
                    className="h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-red-100"
                    title={t("bannerImageDelete")}
                    onClick={handleDeleteBannerImage}
                  >
                    <span className="sr-only">{t("bannerImageDelete")}</span>
                    <svg
                      className="w-5 h-5 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Image, {BANNER_WIDTH}x{BANNER_HEIGHT}px
              </p>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t("gallery.title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {localContent.gallery.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.imageUrl}
                  alt={image.caption}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <p className="mt-2 text-sm text-gray-600">{image.caption}</p>
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-red-100"
                  title={t("gallery.deleteImage")}
                  onClick={() =>
                    handleDeleteGalleryImage(image.id, image.imageUrl)
                  }
                >
                  <span className="sr-only">{t("gallery.deleteImage")}</span>
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <label
              htmlFor="galleryImage"
              className="block text-sm font-medium text-gray-700"
            >
              {t("gallery.addImage")}
            </label>
            <input
              type="file"
              id="galleryImage"
              accept="image/*"
              disabled={localContent.gallery.length >= 3}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleGalleryImageUpload(file, "");
              }}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-50"
            />
            {localContent.gallery.length >= 3 && (
              <p className="text-sm text-red-500 mt-2">
                {t("gallery.maxImages", { count: 3 })}
              </p>
            )}
          </div>
        </section>

        {/* Events Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">{t("events")}</h2>
          <div className="space-y-4">
            {localContent.events.map((event) => (
              <div key={event.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{event.title}</h3>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      event.isPublished
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {event.isPublished ? t("published") : t("draft")}
                  </span>
                </div>
                <p className="mt-2 text-gray-600">{event.description}</p>
                <p className="mt-1 text-sm text-gray-500">
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() =>
                      club?.id &&
                      updateEvent(club.id, event.id, {
                        isPublished: !event.isPublished,
                      })
                    }
                    className="px-3 py-1 text-sm rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                  >
                    {event.isPublished ? t("unpublish") : t("publish")}
                  </button>
                  <button
                    onClick={() => {
                      if (!club?.id) return;
                      const title = prompt(t("eventTitle"), event.title);
                      const description = prompt(
                        t("eventDescription"),
                        event.description
                      );
                      if (title && description) {
                        updateEvent(club.id, event.id, { title, description });
                      }
                    }}
                    className="px-3 py-1 text-sm rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    {t("edit")}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              const title = prompt(t("eventTitle"));
              const description = prompt(t("eventDescription"));
              const dateStr = prompt(t("eventDate"));
              const fileInput = document.createElement("input");
              fileInput.type = "file";
              fileInput.accept = "image/*";

              if (title && description && dateStr) {
                fileInput.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    handleEventCreate({
                      title,
                      description,
                      image: file,
                      date: new Date(dateStr),
                    });
                  }
                };
                fileInput.click();
              }
            }}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {t("addEvent")}
          </button>
        </section>
      </div>
    </div>
  );
};

export default ClubWebsiteManager;
