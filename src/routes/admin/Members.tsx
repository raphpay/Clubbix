import { useEffect, useState } from "react";
import type { Member } from "../../types/Member";
import MemberModal from "./MemberModal";

const mockMembers: Member[] = [
  {
    firstName: "Louis",
    lastName: "Dupont",
    birthDate: "2008-04-12",
    email: "louis@example.com",
    phone: "0601234567",
    paid: true,
    role: "member",
    documents: {
      certificateUrl: "https://example.com/certificate.pdf",
      photoUrl: "https://example.com/photo.jpg",
    },
    createdAt: "2024-09-01T12:34:56Z",
  },
];

const MembersList = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedMember, setSelectedMember] = useState<Member | undefined>(
    undefined
  );

  function displayModal(member?: Member) {
    setShowModal(true);
    setSelectedMember(member);
  }

  useEffect(() => {
    // Remplacer par un appel à Firebase/Firestore plus tard
    setMembers(mockMembers);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-secondary">Liste des membres</h1>
        <button
          onClick={() => displayModal()}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Ajouter un membre
        </button>
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
      />
    </div>
  );
};

export default MembersList;
