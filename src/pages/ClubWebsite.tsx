import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getClubWebsiteContent } from "../services/firestore/clubWebsiteService";
import { ClubWebsiteContent } from "../services/firestore/types";

const ClubWebsite: React.FC = () => {
  const { t } = useTranslation("website");
  const { clubId } = useParams<{ clubId: string }>();
  const [content, setContent] = useState<ClubWebsiteContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      if (!clubId) return;
      try {
        const websiteContent = await getClubWebsiteContent(clubId);
        setContent(websiteContent);
      } catch (err) {
        setError(t("error.load"));
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadContent();
  }, [clubId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 dark:text-gray-100">
        {t("loading")}
      </div>
    );
  }
  if (error || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 dark:bg-gray-900 dark:text-red-400">
        {error || t("error.notFound")}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Helmet>
        <title>{content.headline}</title>
        <meta name="description" content={content.subtext} />
        {content.bannerImageUrl && (
          <meta property="og:image" content={content.bannerImageUrl} />
        )}
      </Helmet>

      {/* Navbar (Logo + Club Name) */}
      <nav className="flex items-center justify-between px-6 py-4 border-b bg-white dark:bg-gray-900 dark:border-gray-700">
        <div className="flex items-center gap-3">
          {content.logoUrl && (
            <img
              src={content.logoUrl}
              alt="Club Logo"
              className="h-12 w-12 rounded-full object-cover border dark:border-gray-700"
            />
          )}
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {content.clubName}
          </span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gray-50 dark:bg-gray-800">
        {content.bannerImageUrl && (
          <img
            src={content.bannerImageUrl}
            alt="Banner"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            style={{ zIndex: 0 }}
          />
        )}
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 drop-shadow-lg dark:text-gray-100">
            {content.headline}
          </h1>
          <p className="text-lg md:text-2xl text-gray-700 mb-8 drop-shadow-lg dark:text-gray-300">
            {content.subtext}
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      {content.gallery && content.gallery.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16" id="gallery">
          <h2 className="text-3xl font-bold mb-8 text-center dark:text-gray-100">
            Gallery
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.gallery.map((image) => (
              <div
                key={image.id}
                className="relative group rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800"
              >
                <img
                  src={image.imageUrl}
                  alt={image.caption}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white text-sm">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Events Section */}
      {content.events &&
        content.events.filter((e) => e.isPublished).length > 0 && (
          <section
            className="max-w-6xl mx-auto px-4 py-16 bg-gray-50 dark:bg-gray-800"
            id="events"
          >
            <h2 className="text-3xl font-bold mb-8 text-center dark:text-gray-100">
              Upcoming Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {content.events
                .filter((event) => event.isPublished)
                .sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                )
                .map((event) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden dark:bg-gray-800"
                  >
                    {event.imageUrl && (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 mb-4 dark:text-gray-300">
                        {event.description}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(event.date).toLocaleDateString(undefined, {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

      {/* Footer */}
      <footer className="bg-white border-t mt-16 dark:bg-gray-900 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {content.logoUrl && (
              <img
                src={content.logoUrl}
                alt="Club Logo"
                className="h-8 w-8 rounded-full object-cover border dark:border-gray-700"
              />
            )}
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {content.clubName}
            </span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} {content.clubName}. All rights
            reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClubWebsite;
