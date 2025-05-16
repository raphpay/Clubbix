import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { useAuth } from "../../hooks/useAuth";
import { auth, db } from "../../lib/firebase";

const SignUp = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) navigate("/admin/dashboard");
  }, [user, loading]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        role: "admin",
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("🔥 SignUp error:", err);
      setError("Erreur lors de la création du compte.");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-gray-800 font-sans">
      <Header />
      <section className="flex flex-col items-center text-center px-6 pt-12 pb-20">
        <div className="bg-white/80 backdrop-blur-md shadow-md rounded-xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-blue-500 mb-6">
            Créer un compte
          </h1>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <form onSubmit={handleSignUp} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition"
            >
              Créer un compte
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default SignUp;
