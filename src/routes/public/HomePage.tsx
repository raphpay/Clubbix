import { Link } from "react-router-dom";
import Header from "../../components/Header";

const HomePage = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden text-gray-800 font-sans">
      {/* Image background */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/assets/background.jpg"
          alt="Nature background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />
      </div>

      {/* Header */}
      <Header />

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-12 pb-20">
        <h2 className="text-4xl md:text-5xl font-bold leading-tight max-w-3xl">
          Gérez votre club <span className="text-primary">BMX ou VTT</span> sans
          prise de tête
        </h2>
        <p className="mt-6 text-lg text-gray-600 max-w-xl">
          Une plateforme moderne pour les associations sportives : membres,
          événements, paiements... tout y est.
        </p>
        <Link
          to="/login"
          className="mt-8 bg-primary text-white px-6 py-3 rounded-xl text-lg font-medium shadow hover:bg-blue-700 transition"
        >
          Démarrer maintenant
        </Link>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto px-6 pb-20 text-center">
        {[
          {
            title: "Gestion des adhérents",
            desc: "Ajoutez, suivez et filtrez vos membres facilement.",
          },
          {
            title: "Événements simplifiés",
            desc: "Compétitions, stages ou sorties… tout est centralisé.",
          },
          {
            title: "Trésorerie intégrée",
            desc: "Suivez cotisations et dépenses en toute clarté.",
          },
        ].map((f, i) => (
          <div
            key={i}
            className="bg-white/70 backdrop-blur rounded-xl p-6 shadow hover:shadow-md transition"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {f.title}
            </h3>
            <p className="text-gray-600 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 pb-6">
        © {new Date().getFullYear()} Clubbix. Tous droits réservés.
      </footer>
    </div>
  );
};

export default HomePage;
