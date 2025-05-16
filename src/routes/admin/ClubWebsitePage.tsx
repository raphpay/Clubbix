type ClubWebsiteProps = {
  logoUrl: string;
  clubName: string;
  navLinks: { label: string; href: string }[];
  heroImageUrl: string;
  heroTitle: string;
  heroDescription: string;
};

const ClubWebsitePage = ({
  logoUrl,
  clubName,
  navLinks,
  heroImageUrl,
  heroTitle,
  heroDescription,
}: ClubWebsiteProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full flex items-center justify-between px-8 py-4 bg-white shadow-md">
        <div className="flex items-center gap-3">
          <img
            src={logoUrl}
            alt="Club Logo"
            className="h-10 w-10 object-contain"
          />
          <span className="font-bold text-xl">{clubName}</span>
        </div>

        <nav className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-blue-600 transition"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Join Now
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative h-[80vh] w-full flex items-center justify-center text-center px-6 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImageUrl})` }}
      >
        <div className="bg-black/50 p-8 rounded-xl text-white w-full h-full flex flex-col items-start justify-center">
          <h1 className="text-4xl font-bold mb-4">{heroTitle}</h1>
          <p className="text-lg">{heroDescription}</p>
        </div>
      </section>
    </div>
  );
};

export default ClubWebsitePage;
