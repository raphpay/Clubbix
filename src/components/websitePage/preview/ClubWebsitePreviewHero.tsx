import { useClubWebsiteStore } from "../../../stores/useClubWebsiteStore";

const ClubWebsitePreviewHero = () => {
  const { heroImageUrl, heroTitle, heroDescription } = useClubWebsiteStore();

  return (
    <section
      className="relative h-[80vh] flex items-center justify-center text-center bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImageUrl})` }}
    >
      <div className="bg-black/50 p-8 rounded-xl w-full h-full flex flex-col justify-center items-start text-white">
        <h1 className="text-4xl font-bold mb-4">{heroTitle}</h1>
        <p className="text-lg">{heroDescription}</p>
      </div>
    </section>
  );
};

export default ClubWebsitePreviewHero;
