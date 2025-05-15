import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Input from "../../components/Input";
import PasswordInput from "../../components/PasswordInput";
import { useAuth } from "../../hooks/useAuth";
import { auth } from "../../lib/firebase";

const LoginPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) navigate("/admin");
  }, [user, loading]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError("Email ou mot de passe incorrect.");
    }
  };

  return (
    <div className="min-h-screen w-full text-gray-800 font-sans">
      <Header />

      <section className="flex flex-col items-center text-center px-6 pt-12 pb-20">
        <div className="bg-white rounded-xl shadow-lg flex flex-col gap-2 px-6 py-8">
          <h1 className="text-2xl font-bold text-center text-blue-500 mb-6">
            Se connecter
          </h1>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput
              placeholder="Mot de passe"
              value={password}
              setValue={setPassword}
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition"
            >
              Se connecter
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
