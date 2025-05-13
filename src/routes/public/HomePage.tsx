import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

const HomePage = () => {
  const navigate = useNavigate();

  function goToLogin() {
    navigate("/login");
  }

  function goToSignUp() {
    navigate("/signup");
  }

  return (
    <div className="p-6 text-center">
      <Header />
      <h1 className="text-3xl font-bold text-primary">Bienvenue sur Clubbix</h1>
      <button onClick={goToLogin}>Se connecter</button>
      <button onClick={goToSignUp}>Créer un compte</button>
    </div>
  );
};

export default HomePage;
