import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ButtonPrimary from "./ButtonPrimary";
import ButtonSecondary from "./ButtonSecondary";
import LogoutButton from "./LogoutButton";

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  function goToMainScreen() {
    if (!user) {
      navigate("/");
    }
  }

  function goToLogin() {
    navigate("/login");
  }

  function goToStartUp() {
    navigate("/signup");
  }

  return (
    <header className="w-full flex items-center justify-between px-8 py-4 mb-4 shadow-md sticky top-0 bg-white z-50">
      <div className="text-xl font-bold">
        <span className="cursor-pointer" onClick={goToMainScreen}>
          Clubbix
        </span>
      </div>

      {/* {!user && (
        <nav className="hidden md:flex gap-6 justify-center items-center w-full ml-40">
          <a href="#features" className="hover:text-blue-600 transition">
            Fonctionnalités
          </a>
          <a href="#how-it-works" className="hover:text-blue-600 transition">
            Comment ça fonctionne
          </a>
          <a href="#pricing" className="hover:text-blue-600 transition">
            Tarifs
          </a>
        </nav>
      )} */}
      {user ? (
        <LogoutButton />
      ) : (
        <div className="flex gap-4">
          <ButtonSecondary title="Se connecter" action={goToLogin} />
          <ButtonPrimary title="Commencer" action={goToStartUp} />
        </div>
      )}
    </header>
  );
};

export default Header;
