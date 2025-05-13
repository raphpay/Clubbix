import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import type { Member } from "../../types/Member";

import ButtonPrimary from "../../components/ButtonPrimary";
import MemberModal from "../../components/MemberModal";

const MembersList = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedMember, setSelectedMember] = useState<Member | undefined>(
    undefined
  );

  const clubId = "6HRbFwNVA2INAaoxAbyu"; // TODO: To be loaded dynamically

  function displayModal(member?: Member) {
    setShowModal(true);
    setSelectedMember(member);
  }

  async function loadMembers() {
    try {
      const snapshot = await getDocs(
        collection(db, "clubs", clubId, "members")
      );
      const docs = snapshot.docs;
      let apiMembers: Member[] = [];
      for (const doc of docs) {
        let member = doc.data() as Member;
        member.id = doc.id;
        apiMembers.push(member);
      }
      setMembers(apiMembers);
    } catch (error) {
      console.log("Error loading members");
    }
  }

  useEffect(() => {
    async function init() {
      loadMembers();
    }
    init();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-secondary">Liste des membres</h1>
        <ButtonPrimary title={"+ Ajouter un membre"} action={displayModal} />
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-gray-50 text-sm text-texte-secondaire">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Téléphone</th>
              <th className="px-4 py-3">Naissance</th>
              <th className="px-4 py-3">Rôle</th>
              <th className="px-4 py-3">Paiement</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {members.map((member, idx) => (
              <tr
                key={idx}
                className="border-t border-gray-100 hover:bg-gray-50"
              >
                <td className="px-4 py-3 font-medium text-secondary">
                  {member.firstName} {member.lastName}
                </td>
                <td className="px-4 py-3">{member.email}</td>
                <td className="px-4 py-3">{member.phone}</td>
                <td className="px-4 py-3">
                  {new Date(member.birthDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 capitalize">
                  <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                    {member.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {member.paid ? (
                    <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                      Payé
                    </span>
                  ) : (
                    <span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
                      Non payé
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => displayModal(member)}
                    className="text-blue-500 font-semibold hover:underline"
                  >
                    Voir / Modifier →
                  </button>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                  Aucun membre trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <MemberModal
        show={showModal}
        member={selectedMember}
        onClose={() => setShowModal(false)}
        onSubmit={() => loadMembers()}
      />
    </div>
  );
};

export default MembersList;
