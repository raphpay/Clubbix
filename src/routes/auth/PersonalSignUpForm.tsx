import { createUserWithEmailAndPassword } from "firebase/auth";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useState, type SetStateAction } from "react";
import Input from "../../components/Input";
import PasswordInput from "../../components/PasswordInput";
import { auth } from "../../lib/firebase";
import FirestoreService from "../../lib/FirestoreService";
import type { Club } from "../../types/Club";
import { type User } from "../../types/User";

type PersonalSignUpFormProps = {
  setError: React.Dispatch<SetStateAction<string>>;
};

const PersonalSignUpForm = ({ setError }: PersonalSignUpFormProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [inviteCode, setInviteCode] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const clubsService = new FirestoreService<Club>("clubs");
  const usersService = new FirestoreService<User>("users");

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    const clubId = await queryClubWithInviteCode();
    if (clubId) {
      await handleAccountCreation(clubId);
    }
  }

  async function queryClubWithInviteCode(): Promise<string | undefined> {
    const club = await clubsService.findByField("inviteCode", inviteCode);
    return club?.id;
  }

  async function handleAccountCreation(clubId: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const authUser = userCredential.user;

      const user: User = {
        uid: authUser.uid,
        email,
        role: "member",
        clubId,
        firstName,
        lastName,
      };
      await usersService.create(authUser.uid, user);

      const clubRef = doc(clubsService["collectionRef"], clubId);
      await updateDoc(clubRef, {
        members: arrayUnion(authUser.uid),
      });
    } catch (err) {
      setError("Erreur lors de la création du compte.");
    }
  }

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <Input
        label="Code du club ( envoyé par votre responsable )"
        type="text"
        placeholder="ex: HUH361"
        value={inviteCode}
        onChange={(e) => setInviteCode(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <Input
        label="Prénom"
        type="text"
        placeholder="John"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <Input
        label="Nom"
        type="text"
        placeholder="Payet"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <Input
        label="Email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <PasswordInput
        placeholder="Mot de passe"
        value={password}
        setValue={setPassword}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition"
      >
        Créer un compte
      </button>
    </form>
  );
};

export default PersonalSignUpForm;
