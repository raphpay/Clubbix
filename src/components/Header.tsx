import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LogoutButton from "./LogoutButton";

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="flex justify-between p-4 bg-muted">
      <h1 className="text-3xl font-bold text-primary tracking-tight">
        Clubbix
      </h1>
      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm">{user.email}</span>
          <LogoutButton />
        </div>
      ) : (
        <div className="flex gap-2">
          <Link
            to="/signup"
            className="text-primary hover:underline font-medium"
          >
            Créer un compte
          </Link>
          <Link
            to="/login"
            className="text-primary hover:underline font-medium"
          >
            Connexion
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
