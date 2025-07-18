import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const UnderConstructionPage: React.FC = () => {
  const { t } = useTranslation("underconstruction");
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-yellow-600">🚧</h1>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">
            {t("title")}
          </h2>
          <p className="mt-2 text-gray-600">{t("description")}</p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {t("buttons.back")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderConstructionPage;
