import Header from "../../../components/Header";
import FeaturesSection from "./components/FeaturesSection";
import GettingStartedSection from "./components/GettingStartedSection";
import HomeHero from "./components/HomeHero";
import PricingSection from "./components/PricingSection";

const HomePage = () => {
  return (
    <div className="min-h-screen w-full text-gray-800 font-sans">
      {/* Header */}
      <Header />

      {/* Hero */}
      <HomeHero />

      {/* Features */}
      <FeaturesSection />

      {/* Getting started */}
      <GettingStartedSection />

      {/* Pricing */}
      <PricingSection />

      {/* TODO: Add 'Trusted by' section */}

      {/* Contact */}

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 pb-6">
        © {new Date().getFullYear()} Clubbix. Tous droits réservés.
      </footer>
    </div>
  );
};

export default HomePage;
