import ButtonPrimary from "../../../../components/ButtonPrimary";
import ButtonSecondary from "../../../../components/ButtonSecondary";

const HomeHero = () => {
  return (
    <section className="relative h-screen flex items-center justify-between px-12 bg-cover bg-center">
      <div className="absolute inset-0 -z-10 h-3/4">
        <img
          src="/assets/background.jpg"
          alt="Club background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />
      </div>
      <div className="w-1/2 flex flex-col gap-6 items-center">
        <h1 className="text-5xl font-bold text-black">
          Une plateforme tout-en-un pour les clubs de sports
        </h1>
        <p className="text-lg text-gray-700 max-w-md">
          Gérer les membres, les événements et les paiements en toute
          simplicité.
        </p>
        <div className="flex gap-4">
          <ButtonPrimary title="Réserver une démo" action={() => {}} />
          <ButtonSecondary title="Commencer" action={() => {}} />
        </div>
      </div>

      {/* TODO: Uncomment the following div to add a screenshot when the design is done */}
      {/* <div className="w-1/2">
        <img
          src="/path-to-screenshot.png"
          alt="App Screenshot"
          className="rounded-xl shadow-2xl"
        />
      </div> */}
    </section>
  );
};

export default HomeHero;
