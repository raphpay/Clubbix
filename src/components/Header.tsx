import { useAuth } from "../hooks/useAuth";
import LogoutButton from "./LogoutButton";

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="flex justify-between p-4 bg-muted">
      <span className="text-lg font-bold">Clubbix</span>
      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm">{user.email}</span>
          <LogoutButton />
        </div>
      ) : (
        <a href="/login" className="text-primary hover:underline">
          Connexion
        </a>
      )}
    </header>
  );
};

export default Header;
