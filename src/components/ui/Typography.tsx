import React, { ElementType } from "react";

type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "body1"
  | "body2";

interface TypographyProps {
  variant: TypographyVariant;
  children: React.ReactNode;
  className?: string;
}

export const Typography: React.FC<TypographyProps> = ({
  variant,
  children,
  className = "",
}) => {
  const baseClasses = "text-gray-900 dark:text-gray-100";

  const variantClasses: Record<TypographyVariant, string> = {
    h1: "text-4xl font-extrabold sm:text-5xl md:text-6xl",
    h2: "text-3xl font-extrabold sm:text-4xl",
    h3: "text-2xl font-bold sm:text-3xl",
    h4: "text-xl font-bold sm:text-2xl",
    h5: "text-lg font-bold sm:text-xl",
    h6: "text-base font-bold sm:text-lg",
    body1: "text-base sm:text-lg text-gray-500 dark:text-gray-400",
    body2: "text-sm sm:text-base text-gray-500 dark:text-gray-400",
  };

  const tagMapping: Record<TypographyVariant, ElementType> = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    body1: "p",
    body2: "p",
  };

  const Component = tagMapping[variant];

  return (
    <Component
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </Component>
  );
};
