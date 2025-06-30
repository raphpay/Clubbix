import React from "react";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  sections: FooterSection[];
  logo?: React.ReactNode;
  socialLinks?: {
    label: string;
    href: string;
    icon: React.ReactNode;
  }[];
  copyright?: string;
}

export const Footer: React.FC<FooterProps> = ({
  sections,
  logo,
  socialLinks,
  copyright = `© ${new Date().getFullYear()} Your Company. All rights reserved.`,
}) => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Logo and social links */}
          <div className="space-y-8 xl:col-span-1">
            {logo && <div className="flex-shrink-0">{logo}</div>}
            {socialLinks && (
              <div className="flex space-x-6">
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <span className="sr-only">{item.label}</span>
                    {item.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Navigation sections */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {sections.map((section, index) => (
                <div
                  key={section.title}
                  className={index === 0 ? "mt-12 md:mt-0" : "mt-12"}
                >
                  <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase dark:text-gray-200">
                    {section.title}
                  </h3>
                  <ul className="mt-4 space-y-4">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
          <p className="text-base text-gray-400 text-center">{copyright}</p>
        </div>
      </div>
    </footer>
  );
};
