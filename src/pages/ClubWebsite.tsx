import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { Section } from "../components/layout/Section";
import {
  getClubWebsiteContent,
  getSections,
} from "../services/firestore/clubWebsiteService";
import { getClubWithSubscription } from "../services/firestore/stripeService";
import { ClubData } from "../services/firestore/types/club";
import {
  ClubWebsiteContent,
  ClubWebsiteSection,
} from "../services/firestore/types/clubWebsite";

const ClubWebsite: React.FC = () => {
  const { t } = useTranslation("website");
  const { clubId } = useParams<{ clubId: string }>();
  const [content, setContent] = useState<ClubWebsiteContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sections, setSections] = useState<ClubWebsiteSection[]>([]);
  const [sectionsLoading, setSectionsLoading] = useState(true);
  const [club, setClub] = useState<ClubData | null>(null);
  const [clubLoading, setClubLoading] = useState(true);

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

  useEffect(() => {
    if (!clubId) return;
    setSectionsLoading(true);
    getSections(clubId)
      .then(setSections)
      .catch(() => setSections([]))
      .finally(() => setSectionsLoading(false));
  }, [clubId]);

  useEffect(() => {
    if (!clubId) return;
    setClubLoading(true);
    getClubWithSubscription(clubId)
      .then(setClub)
      .catch(() => setClub(null))
      .finally(() => setClubLoading(false));
  }, [clubId]);

  if (isLoading || sectionsLoading || clubLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 dark:text-gray-100">
        {t("loading")}
      </div>
    );
  }
  if (error || !content || !club) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 dark:bg-gray-900 dark:text-red-400">
        {error || t("error.notFound")}
      </div>
    );
  }

  function handleNav(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  const inviteCode = club.inviteCode;
  const hasSections = sections.length > 0;

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
      <nav className="flex items-center justify-between px-4 py-3 border-b bg-white dark:bg-gray-900 dark:border-gray-700 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          {content.logoUrl && (
            <img
              src={content.logoUrl}
              alt="Club Logo"
              className="h-10 w-10 rounded-full object-cover border dark:border-gray-700"
            />
          )}
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {content.clubName}
          </span>
        </div>
        {hasSections && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide mx-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleNav(section.id)}
                className="px-3 py-1 rounded text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                {section.title}
              </button>
            ))}
          </div>
        )}
        {inviteCode ? (
          <Link
            to={`/register?invite=${inviteCode}`}
            className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 transition"
          >
            {t("join")}
          </Link>
        ) : (
          <button
            className="ml-4 px-4 py-2 bg-gray-300 text-gray-500 rounded font-semibold cursor-not-allowed"
            disabled
          >
            {t("join")}
          </button>
        )}
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
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 drop-shadow-lg dark:text-gray-100">
            {content.headline}
          </h1>
          <p className="text-lg md:text-2xl text-gray-700 mb-8 drop-shadow-lg dark:text-gray-300">
            {content.subtext}
          </p>
        </div>
      </section>

      {!hasSections && (
        <div className="max-w-2xl mx-auto py-24 text-center text-gray-400 dark:text-gray-500 text-lg">
          {t("empty.sections")}
        </div>
      )}

      {sections.map((section, i) => (
        <Section
          key={section.id}
          id={section.id}
          title={section.title}
          subtitle={section.description}
          background={i % 2 === 0 ? "white" : "gray"}
          fullWidth={true}
        >
          {section.cards && section.cards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.cards.map((card) => (
                <div
                  key={card.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col gap-3"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {card.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {card.body}
                    </p>
                  </div>
                  {card.imageUrl && (
                    <img
                      src={card.imageUrl}
                      alt={card.title}
                      className="w-full h-40 object-cover rounded mt-2"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : null}
        </Section>
      ))}

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
