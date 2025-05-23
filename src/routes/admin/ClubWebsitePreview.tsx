import { Bike, Dumbbell, Mountain, PersonStanding } from "lucide-react";
import PresentationWithIcon from "../../components/PresentationWithIcon";
import { useClubWebsiteStore } from "../../stores/useClubWebsiteStore";

const ClubWebsitePreview = () => {
  const {
    clubName,
    logoUrl,
    navLinks,
    heroImageUrl,
    heroTitle,
    heroDescription,
    activities,
    email,
    phone,
  } = useClubWebsiteStore();

  const iconMap = {
    bike: Bike,
    mountain: Mountain,
    fitness: Dumbbell,
    community: PersonStanding,
  };

  const colClass =
    {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
    }[activities.length] || "grid-cols-1"; // fallback

  return (
    <div>
      {/* Header */}
      <header className="w-full flex items-center justify-between px-8 py-4 bg-white shadow-md mb-2">
        <div className="flex items-center gap-3">
          {/* {logoUrl && (
            <img
              src={logoUrl}
              alt="Club Logo"
              className="h-10 w-10 object-contain"
            />
          )} */}
          <span className="font-bold text-xl">{clubName}</span>
        </div>

        <nav className="hidden md:flex gap-6">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="hover:text-blue-600 transition"
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

      {/* Start Hero section */}
      <section
        className="relative h-[80vh] flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImageUrl})` }}
      >
        <div className="bg-black/50 p-8 rounded-xl w-full h-full flex flex-col justify-center items-start text-white">
          <h1 className="text-4xl font-bold mb-4">{heroTitle}</h1>
          <p className="text-lg">{heroDescription}</p>
        </div>
      </section>

      {/* Start Activities section */}
      {activities.length > 0 && (
        <section className="py-6">
          <h2 className="text-3xl font-bold mb-4">Ce que l'on propose</h2>
          <div className={`grid gap-4 ${colClass}`}>
            {activities.map((activity, index) => {
              const IconComponent = iconMap[activity.icon]; // TODO: Correct the warning
              return (
                <PresentationWithIcon
                  id={index}
                  icon={<IconComponent />}
                  title={activity.title}
                  description={activity.description}
                />
              );
            })}
          </div>
        </section>
      )}
      {/* End Activities section */}

      {/* Start Footer */}
      <footer className="text-sm text-white pb-6 bg-gray-400 flex flex-col py-2">
        <div className="flex flex-col justify-center">
          {email && <p>Email de contact: {email}</p>}
          {phone && <p>Numéro de contact: {phone}</p>}
        </div>
        © {new Date().getFullYear()} Clubbix. Tous droits réservés.
      </footer>
      {/* End Footer */}
    </div>
  );
};

export default ClubWebsitePreview;
