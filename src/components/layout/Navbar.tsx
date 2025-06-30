import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { Logo } from "../ui/Logo";

interface NavItem {
  label: string;
  href: string;
}

interface CTAButton {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "outline";
}

interface NavbarProps {
  items: NavItem[];
  ctaButtons?: CTAButton[];
  children?: React.ReactNode;
}

export const Navbar: React.FC<NavbarProps> = ({
  items,
  ctaButtons = [],
  children,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900/80 dark:backdrop-blur-sm shadow-sm">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <Link to="/">
            <Logo />
          </Link>
          <div className="hidden md:flex items-center space-x-3">
            {items.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/book-demo"
              className="px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Book a demo
            </Link>
            {children}
            {ctaButtons.length > 0 && (
              <>
                {ctaButtons.map((cta, index) => (
                  <Link key={index} to={cta.href}>
                    <Button
                      key={index}
                      variant={cta.variant || "primary"}
                      size="sm"
                    >
                      {cta.label}
                    </Button>
                  </Link>
                ))}
              </>
            )}
          </div>
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
              aria-label="toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 right-0 w-full bg-white md:hidden dark:bg-gray-900"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {items.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-white hover:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/book-demo"
                  className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-white hover:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Book a demo
                </Link>
                <div className="mt-3 space-y-2">
                  {children}
                  {ctaButtons.length > 0 && (
                    <div className="mt-4 px-4 space-y-3">
                      {ctaButtons.map((cta, index) => (
                        <Link key={index} to={cta.href}>
                          <Button variant={cta.variant || "primary"} fullWidth>
                            {cta.label}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};
