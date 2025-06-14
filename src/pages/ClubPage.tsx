import React from "react";
import { useParams } from "react-router-dom";

const ClubPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-3xl font-bold text-gray-900">Club: {slug}</h1>
            <div className="mt-4">
              <p className="text-gray-500">
                Welcome to the club page. This is a dynamic page for club:{" "}
                {slug}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubPage;
