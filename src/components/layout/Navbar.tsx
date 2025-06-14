import React, { useState } from "react";
import { Button } from "../ui/Button";

interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  items: NavItem[];
  logo?: React.ReactNode;
  cta?: {
    label: string;
    href: string;
  };
}

export const Navbar: React.FC<NavbarProps> = ({ items, logo, cta }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">{logo}</div>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          {cta && (
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Button variant="primary" size="sm">
                {cta.label}
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block pl-3 pr-4 py-2 text-base font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-50"
              >
                {item.label}
              </a>
            ))}
            {cta && (
              <div className="mt-4 px-4">
                <Button variant="primary" fullWidth>
                  {cta.label}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
