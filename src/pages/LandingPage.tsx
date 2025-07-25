import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "../components/common/ThemeToggle";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { Section } from "../components/layout/Section";
import { SEO } from "../components/layout/SEO";
import PricingSection from "../components/PricingSection";

const LandingPage: React.FC = () => {
  const { t } = useTranslation("landing");
  const location = useLocation();

  // Handle anchor navigation and smooth scrolling
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        // Add a small delay to ensure the page is fully loaded
        setTimeout(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    }
  }, [location.hash]);

  const navItems = [
    { label: t("nav.features"), href: "#features" },
    { label: t("nav.pricing"), href: "#pricing" },
    { label: t("nav.testimonials"), href: "#testimonials" },
    { label: t("nav.faq"), href: "#faq" },
  ];

  const ctaButtons = [
    { label: t("cta.login"), href: "/login", variant: "outline" as const },
    { label: t("cta.signup"), href: "/signup", variant: "primary" as const },
  ];

  const footerSections = [
    {
      title: t("footer.sections.product.title"),
      links: [
        {
          label: t("footer.sections.product.links.features"),
          href: "#features",
        },
        { label: t("footer.sections.product.links.pricing"), href: "#pricing" },
        { label: t("footer.sections.product.links.demo"), href: "/book-demo" },
      ],
    },
    {
      title: t("footer.sections.support.title"),
      links: [
        { label: t("footer.sections.support.links.help"), href: "/help" },
        {
          label: t("footer.sections.support.links.contact"),
          href: "/book-demo",
        },
      ],
    },
    {
      title: t("footer.sections.legal.title"),
      links: [
        { label: t("footer.sections.legal.links.privacy"), href: "/privacy" },
        { label: t("footer.sections.legal.links.terms"), href: "/terms" },
      ],
    },
    {
      title: t("footer.sections.company.title"),
      links: [
        {
          label: t("footer.sections.company.links.about"),
          href: "https://www.linkedin.com/in/raphael-payet/",
        },
        { label: t("footer.sections.company.links.blog"), href: "/blog" },
      ],
    },
  ];

  const socialLinks = [
    {
      label: "Twitter",
      href: "https://twitter.com/clubbix",
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/company/clubbix",
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title="Clubbix - All-in-one platform for club management"
        description="Create and manage your club's digital presence with Clubbix. Build beautiful websites, manage members, and grow your community with our all-in-one platform."
        image="/images/og-image.jpg"
        url="https://clubbix.io"
      />
      <Navbar items={navItems} ctaButtons={ctaButtons}>
        <ThemeToggle />
        <LanguageSwitcher />
      </Navbar>

      {/* Hero Section */}
      <Section background="white" className="pt-20">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl dark:text-gray-100">
            <span className="block">{t("hero.title.line1")}</span>
            <span className="block text-indigo-600 dark:text-indigo-400">
              {t("hero.title.line2")}
            </span>
          </h1>
          <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:mx-auto md:mt-5 md:text-xl lg:mx-0 dark:text-gray-400">
            {t("hero.subtitle")}
          </p>
          <div className="mt-5 sm:mt-8 sm:flex sm:justify-center">
            <div className="rounded-md shadow">
              <Link
                to="/signup"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                {t("hero.buttons.createSite")}
              </Link>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <Link
                to="/book-demo"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10 dark:text-indigo-300 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                {t("hero.buttons.bookDemo")}
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Features Section */}
      <Section
        id="features"
        title={t("features.title")}
        subtitle={t("features.subtitle")}
        background="gray"
      >
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: t("features.items.website.title"),
              description: t("features.items.website.description"),
            },
            {
              title: t("features.items.members.title"),
              description: t("features.items.members.description"),
            },
            {
              title: t("features.items.calendar.title"),
              description: t("features.items.calendar.description"),
            },
            {
              title: t("features.items.payments.title"),
              description: t("features.items.payments.description"),
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {feature.title}
              </h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <PricingSection id="pricing" />

      {/* Testimonials Section */}
      <Section
        id="testimonials"
        title={t("testimonials.title")}
        background="gray"
      >
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              quote: t("testimonials.items.testimonial1.quote"),
              author: t("testimonials.items.testimonial1.author"),
              role: t("testimonials.items.testimonial1.role"),
            },
            {
              quote: t("testimonials.items.testimonial2.quote"),
              author: t("testimonials.items.testimonial2.author"),
              role: t("testimonials.items.testimonial2.role"),
            },
            {
              quote: t("testimonials.items.testimonial3.quote"),
              author: t("testimonials.items.testimonial3.author"),
              role: t("testimonials.items.testimonial3.role"),
            },
          ].map((testimonial) => (
            <div
              key={testimonial.author}
              className="bg-white rounded-lg shadow-lg p-6 dark:bg-gray-800"
            >
              <p className="text-gray-600 italic dark:text-gray-400">
                "{testimonial.quote}"
              </p>
              <div className="mt-4">
                <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                  {testimonial.author}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ Section */}
      <Section id="faq" title={t("faq.title")} background="white">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {[
            {
              question: t("faq.items.start.question"),
              answer: t("faq.items.start.answer"),
            },
            {
              question: t("faq.items.trial.question"),
              answer: t("faq.items.trial.answer"),
            },
            {
              question: t("faq.items.support.question"),
              answer: t("faq.items.support.answer"),
            },
            {
              question: t("faq.items.upgrade.question"),
              answer: t("faq.items.upgrade.answer"),
            },
          ].map((faq) => (
            <div key={faq.question}>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {faq.question}
              </h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Footer */}
      <Footer
        sections={footerSections}
        socialLinks={socialLinks}
        copyright={t("footer.copyright", { year: new Date().getFullYear() })}
      />
    </div>
  );
};

export default LandingPage;
