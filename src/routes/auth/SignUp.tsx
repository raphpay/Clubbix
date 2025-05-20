import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useClubStore } from "../../stores/useClubStore";

import FirestoreService from "../../lib/FirestoreService";

import type { User } from "../../types/User";

import ButtonPrimary from "../../components/ButtonPrimary";
import ButtonSecondary from "../../components/ButtonSecondary";
import Header from "../../components/Header";
import ClubSignUpForm from "./ClubSignUpForm";
import PersonalSignUpForm from "./PersonalSignUpForm";

const SignUp = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [mode, setMode] = useState<"create" | "join">("create");

  const userService = new FirestoreService<User>("users");
  const { setCurrentClubId } = useClubStore();

  async function handleUserSetup(uid: string) {
    const fetchedUser = await userService.read(uid);
    if (fetchedUser) {
      setCurrentClubId(fetchedUser?.clubId);
      navigate("/admin/dashboard");
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      if (!loading && user) {
        await handleUserSetup(user.uid);
      }
    };
    fetchUser();
  }, [user, loading]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-gray-800 font-sans">
      <Header />
      <section className="flex flex-col items-center text-center px-6 pt-12 pb-20">
        <div className="flex justify-center gap-4 mb-6">
          {mode === "create" ? (
            <ButtonPrimary
              title="Créer un club"
              action={() => setMode("create")}
            />
          ) : (
            <ButtonSecondary
              title="Créer un club"
              action={() => setMode("create")}
            />
          )}
          {mode === "join" ? (
            <ButtonPrimary
              title="Rejoindre un club"
              action={() => setMode("join")}
            />
          ) : (
            <ButtonSecondary
              title="Rejoindre un club"
              action={() => setMode("join")}
            />
          )}
        </div>
        <div className="bg-white/80 backdrop-blur-md shadow-md rounded-xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-blue-500 mb-6">
            Créer un compte {mode === "create" ? "club" : "personnel"}
          </h1>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {mode === "create" ? (
            <ClubSignUpForm setError={setError} />
          ) : (
            <PersonalSignUpForm setError={setError} />
          )}
        </div>
      </section>
    </div>
  );
};

export default SignUp;
