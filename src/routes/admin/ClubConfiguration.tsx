import { useQuery } from "@tanstack/react-query";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import ButtonPrimary from "../../components/ButtonPrimary";
import Header from "../../components/Header";
import { db } from "../../lib/firebase";
import type { Club } from "../../types/Club";

const ClubConfiguration = () => {
  const clubId = "6HRbFwNVA2INAaoxAbyu"; // TODO: Load dynamically

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [facebookLink, setFacebookLink] = useState<string>("");
  const [instagramLink, setInstagramLink] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const originalData = useRef({
    name: "",
    description: "",
    facebookLink: "",
    instagramLink: "",
    address: "",
  });

  const {
    data: club,
    isLoading,
    isError,
  } = useQuery<Club>({
    queryKey: ["club"],
    queryFn: async () => {
      const docRef = doc(db, "clubs", clubId);
      const docSnap = await getDoc(docRef);
      return { ...(docSnap.data() as Club), id: docSnap.id };
    },
  });

  async function saveChanges() {
    try {
      const updatedClub: Club = {
        name,
        description,
        socials: {
          facebook: facebookLink,
          instagram: instagramLink,
        },
        address,
      };
      console.log("club", club);
      await setDoc(doc(db, "clubs", clubId), updatedClub);
    } catch (error) {}
  }

  useEffect(() => {
    if (club) {
      const nameVal = club.name || "";
      const descVal = club.description || "";
      const fbVal = club.socials?.facebook || "";
      const instaVal = club.socials?.instagram || "";
      const addressVal = club.address || "";

      setName(nameVal);
      setDescription(descVal);
      setFacebookLink(fbVal);
      setInstagramLink(instaVal);
      setAddress(addressVal);

      originalData.current = {
        name: nameVal,
        description: descVal,
        facebookLink: fbVal,
        instagramLink: instaVal,
        address: addressVal,
      };
    }
  }, [club]);

  useEffect(() => {
    const changed =
      name !== originalData.current.name ||
      description !== originalData.current.description ||
      facebookLink !== originalData.current.facebookLink ||
      instagramLink !== originalData.current.instagramLink ||
      address !== originalData.current.address;

    setHasChanges(changed);
  }, [name, description, facebookLink, instagramLink, address]);

  if (isLoading) return <div className="p-6">Chargement...</div>;
  if (isError)
    return <div className="p-6 text-red-500">Erreur lors du chargement.</div>;

  return (
    <div className="p-6">
      <Header />
      <h2 className="text-3xl font-bold text-primary tracking-tight">
        General information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
        <div>
          <label className="block text-sm text-texte-secondaire mb-1">
            Nom du club
          </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-texte-secondaire mb-1">
            Description
          </label>
          <input
            type="text"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-texte-secondaire mb-1">
            Lien Facebook
          </label>
          <input
            type="text"
            name="facebookLink"
            value={facebookLink}
            onChange={(e) => setFacebookLink(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-texte-secondaire mb-1">
            Lien Instagram
          </label>
          <input
            type="text"
            name="instagramLink"
            value={instagramLink}
            onChange={(e) => setInstagramLink(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-texte-secondaire mb-1">
            Adresse
          </label>
          <input
            type="text"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>
      <ButtonPrimary
        title="Sauvegarder"
        action={saveChanges}
        disabled={!hasChanges}
      />
    </div>
  );
};
export default ClubConfiguration;
