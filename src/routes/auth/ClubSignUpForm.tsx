import { createUserWithEmailAndPassword } from "firebase/auth";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useState, type SetStateAction } from "react";
import Input from "../../components/Input";
import { auth, db } from "../../lib/firebase";
import FirestoreService from "../../lib/FirestoreService";
import { generateInviteCode, type Club } from "../../types/Club";
import { type User } from "../../types/User";

type ClubSignUpFormProps = {
  setError: React.Dispatch<SetStateAction<string>>;
};

const ClubSignUpForm = ({ setError }: ClubSignUpFormProps) => {
  const [clubName, setClubName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [facebookUrl, setFacebookUrl] = useState<string>("");
  const [instagramUrl, setInstagramUrl] = useState<string>("");
  const [adminFirstname, setAdminFirstname] = useState<string>("");
  const [adminLastName, setAdminLastname] = useState<string>("");

  const clubService = new FirestoreService<Club>("clubs");
  const usersService = new FirestoreService<User>("users");

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const clubId = await handleClubCreation();
      await handleSignUp(clubId);
    } catch (error) {
      console.log("Error", error);
    }
  }

  async function handleClubCreation(): Promise<string> {
    try {
      const inviteCode = generateInviteCode();
      const club: Club = {
        name: clubName,
        address,
        socialAccounts: {
          facebookUrl,
          instagramUrl,
        },
        inviteCode,
      };
      const id = clubService.generateId();
      await clubService.create(id, club);
      return id;
    } catch (error) {
      throw error;
    }
  }

  async function handleSignUp(clubId: string) {
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
        role: "admin",
        clubId,
        firstName: adminFirstname,
        lastName: adminLastName,
      };

      await usersService.create(authUser.uid, user);
      // Add the new user as a member of the club
      const clubRef = doc(db, "clubs", clubId);
      await updateDoc(clubRef, {
        members: arrayUnion(authUser.uid),
      });
    } catch (err) {
      setError("Erreur lors de la création du compte.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Club information */}
      <h2 className="text-lg font-semibold">Les informations du club</h2>
      <Input
        label="Nom du club"
        type="text"
        placeholder="Cornillon BMX"
        value={clubName}
        onChange={(e) => setClubName(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <Input
        label="Addresse du club"
        type="text"
        placeholder="12 Rue de la piste"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <Input
          label="Lien facebook"
          type="text"
          placeholder="https://www.facebook.com/cornillon-bmx"
          value={facebookUrl}
          onChange={(e) => setFacebookUrl(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Input
          label="Lien Instagram"
          type="text"
          placeholder="https://www.instagram.com/cornillon-bmx"
          value={instagramUrl}
          onChange={(e) => setInstagramUrl(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Separator */}
      <div className="h-[2px] w-full bg-black/50"></div>

      {/* Admin information */}
      <h2 className="text-lg font-semibold">
        Les informations de l'administrateur principal
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <Input
          label="Prénom de l'admin"
          type="text"
          placeholder="Thomas"
          value={adminFirstname}
          onChange={(e) => setAdminFirstname(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Input
          label="Nom de l'admin"
          type="text"
          placeholder="Allier"
          value={adminLastName}
          onChange={(e) => setAdminLastname(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <Input
        label="Email"
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
  );
};

export default ClubSignUpForm;
