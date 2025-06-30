import React from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { SEO } from "../components/layout/SEO";

const CALENDLY_URL = import.meta.env.VITE_CALENDLY_LINK;

const BookDemoPage: React.FC = () => {
  const { t } = useTranslation(["common", "landing", "demo"]);

  const navItems = [
    { label: t("landing:nav.features"), href: "/#features" },
    { label: t("landing:nav.pricing"), href: "/#pricing" },
  ];

  const ctaButtons = [
    {
      label: t("landing:cta.login"),
      href: "/login",
      variant: "outline" as const,
    },
    {
      label: t("landing:cta.signup"),
      href: "/signup",
      variant: "primary" as const,
    },
  ];

  const footerSections = [
    {
      title: t("landing:footer.sections.product.title"),
      links: [
        {
          label: t("landing:footer.sections.product.links.features"),
          href: "/#features",
        },
        {
          label: t("landing:footer.sections.product.links.pricing"),
          href: "/#pricing",
        },
      ],
    },
    {
      title: t("landing:footer.sections.company.title"),
      links: [
        {
          label: t("landing:footer.sections.company.links.about"),
          href: "/about",
        },
      ],
    },
  ];

  const socialLinks = [];

  return (
    <>
      <SEO
        title={t("demo:seo.title")}
        description={t("demo:seo.description")}
      />
      <Navbar items={navItems} ctaButtons={ctaButtons}>
        <LanguageSwitcher />
      </Navbar>
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            {t("demo:title")}
          </h1>
          <p className="mt-4 text-xl text-gray-600">{t("demo:subtitle")}</p>
        </div>

        <div
          className="relative"
          style={{ paddingBottom: "56.25%", height: 0 }}
        >
          <iframe
            src={CALENDLY_URL}
            className="absolute top-0 left-0 w-full h-full"
            title="Calendly scheduling widget"
            allow="fullscreen"
          ></iframe>
        </div>

        <div className="mt-8 text-center text-gray-500">
          <noscript>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              {t("demo:js_disabled")}
            </a>
          </noscript>
          <p>
            {t("demo:widget_issue")}
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-indigo-600 hover:underline"
            >
              {t("demo:widget_issue_link_text")}
            </a>
          </p>
        </div>
      </main>
      <Footer
        sections={footerSections}
        socialLinks={socialLinks}
        copyright={t("landing:footer.copyright", {
          year: new Date().getFullYear(),
        })}
      />
    </>
  );
};

export default BookDemoPage;
