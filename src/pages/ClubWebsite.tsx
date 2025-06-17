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
    return <div>{t("loading")}</div>;
  }

  if (error) {
    return <div className="text-red-500">{t("error.load")}</div>;
  }

  if (!content) {
    return <div>{t("error.notFound")}</div>;
  }

  return (
    <>
      <Helmet>
        <title>{content.headline}</title>
        <meta name="description" content={content.subtext} />
        {content.bannerImageUrl && (
          <meta property="og:image" content={content.bannerImageUrl} />
        )}
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative">
          {content.bannerImageUrl && (
            <div className="absolute inset-0">
              <img
                src={content.bannerImageUrl}
                alt="Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50" />
            </div>
          )}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <h1 className="text-4xl font-bold text-white mb-4">
              {content.headline}
            </h1>
            <p className="text-xl text-white">{content.subtext}</p>
          </div>
        </div>

        {/* Gallery Section */}
        {content.gallery.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-bold mb-8">Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.gallery.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.imageUrl}
                    alt={image.caption}
                    className="w-full h-64 object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent rounded-b-lg">
                    <p className="text-white text-sm">{image.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Events Section */}
        {content.events.filter((event) => event.isPublished).length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
            <h2 className="text-3xl font-bold mb-8">Upcoming Events</h2>
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
                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                  >
                    {event.imageUrl && (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{event.description}</p>
                      <p className="text-sm text-gray-500">
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
      </div>
    </>
  );
};

export default ClubWebsite;
