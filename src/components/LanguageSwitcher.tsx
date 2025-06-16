import { Languages } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "en", label: "English" },
    { code: "fr", label: "Français" },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full"
        aria-label="Change language"
      >
        <Languages className="h-5 w-5" />
      </button>

      <div
        className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 transform transition-all duration-200 ease-out origin-top-right ${
          isOpen
            ? "scale-100 opacity-100 pointer-events-auto"
            : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <div className="py-1" role="menu" aria-orientation="vertical">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`${
                i18n.language === lang.code
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-700 hover:bg-gray-50"
              } block w-full text-left px-4 py-2 text-sm`}
              role="menuitem"
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
