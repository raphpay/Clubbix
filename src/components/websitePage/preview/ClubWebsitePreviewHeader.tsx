import { useClubWebsiteStore } from "../../../stores/useClubWebsiteStore";

const ClubWebsitePreviewHeader = () => {
  const { clubName, logoUrl, navLinks } = useClubWebsiteStore();

  return (
    <div>
      {/* Header */}
      <header className="w-full flex items-center justify-between px-8 py-4 bg-white shadow-md mb-2">
        <div className="flex items-center gap-3">
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Club Logo"
              className="h-10 w-10 object-contain"
            />
          )}
          <span className="font-bold text-xl">{clubName}</span>
        </div>

        <nav className="hidden md:flex gap-6">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className={`flex items-center gap-2 p-2 rounded-md transition-colors duration-200 hover:bg-blue-300 ${
                index === 0 ? "bg-blue-100 text-blue-500" : "text-gray-700"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          Nous rejoindre
        </button>
      </header>
      {/* End Header */}
    </div>
  );
};

export default ClubWebsitePreviewHeader;
