import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";

import type { Member } from "../types/Member";

import ButtonDanger from "./ButtonDanger";
import ButtonPrimary from "./ButtonPrimary";

type MemberModalProps = {
  member?: Member;
  show: boolean;
  displayErase: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

const MemberModal = ({
  member,
  show,
  displayErase,
  onClose,
  onSubmit,
}: MemberModalProps) => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [birthDate, setBirthDate] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [paid, setPaid] = useState<boolean>(false);

  const clubId = "6HRbFwNVA2INAaoxAbyu"; // TODO: To be loaded dynamically

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveMember();
    onClose();
  };

  async function saveMember() {
    const date = new Date().toDateString();
    try {
      const newMember: Member = {
        firstName,
        lastName,
        birthDate,
        email,
        phone,
        role,
        paid,
        documents: {
          certificateUrl: "",
          photoUrl: "",
        },
        createdAt: date,
      };
      await addDoc(collection(db, "clubs", clubId, "members"), newMember);
      onClose();
      onSubmit();
    } catch (error) {}
  }

  async function eraseMember(member?: Member) {
    try {
      if (member?.id) {
        await deleteDoc(doc(db, "clubs", clubId, "members", member.id));
        onClose();
        onSubmit();
      }
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  }

  useEffect(() => {
    if (member) {
      setFirstName(member.firstName);
      setLastName(member.lastName);
      setBirthDate(member.birthDate);
      setEmail(member.email);
      setPhone(member.phone);
      setRole(member.role);
      setPaid(member.paid);
    }
  }, [member]);

  return (
    <>
      {show ? (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500/75 transition-opacity">
          <div className="bg-white p-6 rounded shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-secondary">
              {member ? "Modifier le membre" : "Ajouter un membre"}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-texte-secondaire mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-texte-secondaire mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-texte-secondaire mb-1">
                    Date de naissance
                  </label>
                  <input
                    type="text"
                    name="birthDate"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-texte-secondaire mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-texte-secondaire mb-1">
                    Numéro de téléphone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-texte-secondaire mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  name="paid"
                  checked={paid}
                  onClick={() => setPaid(!paid)}
                  onChange={() => {}}
                  className="accent-blue-500 w-5 h-5"
                />
                <label className="text-sm text-texte-secondaire">
                  Paiement effectué
                </label>
              </div>
            </form>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded"
                onClick={onClose}
              >
                Fermer
              </button>
              {displayErase && (
                <ButtonDanger
                  title={"Effacer"}
                  action={() => eraseMember(member)}
                />
              )}
              <ButtonPrimary title={"Sauvegarder"} action={saveMember} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default MemberModal;
