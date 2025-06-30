import React from "react";
import { Typography } from "../ui/Typography";

interface SectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  background?: "white" | "gray" | "primary";
  fullWidth?: boolean;
  id?: string;
}

const getBackgroundClasses = (
  background: SectionProps["background"]
): string => {
  switch (background) {
    case "gray":
      return "bg-gray-50 dark:bg-gray-800";
    case "primary":
      return "bg-blue-50 dark:bg-gray-800";
    default:
      return "bg-white dark:bg-gray-900";
  }
};

export const Section: React.FC<SectionProps> = ({
  title,
  subtitle,
  children,
  className = "",
  background = "white",
  fullWidth = false,
  id,
}) => {
  const backgroundClasses = getBackgroundClasses(background);
  const widthClasses = fullWidth ? "w-full" : "max-w-7xl mx-auto";

  return (
    <section
      id={id}
      className={`py-12 sm:py-16 ${backgroundClasses} ${className}`}
    >
      <div className={`px-4 sm:px-6 lg:px-8 ${widthClasses}`}>
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <Typography variant="h2" className="mb-4">
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body1" className="max-w-2xl mx-auto">
                {subtitle}
              </Typography>
            )}
          </div>
        )}
        <div>{children}</div>
      </div>
    </section>
  );
};
