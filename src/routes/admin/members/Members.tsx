import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import type { Member } from "../../../types/Member";

import ButtonPrimary from "../../../components/ButtonPrimary";
import ButtonSecondary from "../../../components/ButtonSecondary";
import MemberModal from "../../../components/modals/MemberModal";

const MembersList = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedMember, setSelectedMember] = useState<Member | undefined>(
    undefined
  );
  const [displayErase, setDisplayErase] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [paymentFilter, setPaymentFilter] = useState<"all" | "paid" | "unpaid">(
    "all"
  );
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const clubId = "6HRbFwNVA2INAaoxAbyu"; // TODO: To be loaded dynamically

  const filteredMembers = members.filter((member) => {
    const matchesName =
      member.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPayment =
      paymentFilter === "all" ||
      (paymentFilter === "paid" && member.paid) ||
      (paymentFilter === "unpaid" && !member.paid);

    const matchesRole = roleFilter === "all" || member.role === roleFilter;

    return matchesName && matchesPayment && matchesRole;
  });

  function displayModal(member?: Member, displayErase: boolean = false) {
    setShowModal(true);
    setSelectedMember(member);
    setDisplayErase(displayErase);
  }

  function closeDialog() {
    setShowModal(false);
    setSelectedMember(undefined);
    setDisplayErase(false);
  }

  function exportToCSV() {
    // Prepare the members data to include in the CSV
    const csvHeaders = [
      "Nom",
      "Email",
      "Téléphone",
      "Naissance",
      "Rôle",
      "Paiement",
    ];

    // Map over the filtered members and generate CSV rows
    const csvRows = filteredMembers.map((member) => [
      `${member.firstName} ${member.lastName}`,
      member.email,
      member.phone,
      new Date(member.birthDate).toLocaleDateString(),
      member.role,
      member.paid ? "Payé" : "Non payé",
    ]);

    // Combine headers and rows
    const csvContent = [
      csvHeaders.join(","),
      ...csvRows.map((row) => row.join(",")),
    ].join("\n");

    // Create a downloadable Blob for the CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Create a link and trigger a download
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "members.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
        <div className="flex gap-2">
          <ButtonPrimary title={"+ Ajouter un membre"} action={displayModal} />
          <ButtonSecondary title={"Exporter en CSV"} action={exportToCSV} />
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        {/* Search by name */}
        <input
          type="text"
          placeholder="Rechercher par nom"
          className="p-3 border border-gray-300 rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Filter by payment status */}
        <select
          className="p-3 border border-gray-300 rounded-md"
          value={paymentFilter}
          onChange={(e) =>
            setPaymentFilter(e.target.value as "all" | "paid" | "unpaid")
          }
        >
          <option value="all">Tous</option>
          <option value="paid">Payé</option>
          <option value="unpaid">Non payé</option>
        </select>

        {/* Filter by role */}
        <select
          className="p-3 border border-gray-300 rounded-md"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">Tous les rôles</option>
          <option value="rider">Rider</option>
          <option value="coach">Coach</option>
          <option value="staff">Staff</option>
        </select>
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
            {filteredMembers.map((member, idx) => (
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
                    onClick={() => displayModal(member, true)}
                    className="text-blue-500 font-semibold hover:underline"
                  >
                    Voir / Modifier →
                  </button>
                </td>
              </tr>
            ))}
            {filteredMembers.length === 0 && (
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
        onClose={() => closeDialog()}
        onSubmit={() => loadMembers()}
        displayErase={displayErase}
      />
    </div>
  );
};

export default MembersList;
