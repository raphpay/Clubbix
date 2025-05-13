// File: src/routes/auth/SignUp.tsx
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../lib/firebase";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/admin");
    } catch (error) {
      alert("Erreur lors de la création de compte");
    }
  };

  return (
    <form onSubmit={handleSignUp} className="max-w-sm mx-auto mt-10 space-y-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <button
        type="submit"
        className="w-full bg-primary text-white py-2 rounded"
      >
        Créer un compte
      </button>
    </form>
  );
};

export default SignUp;
