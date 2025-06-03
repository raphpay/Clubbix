import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ButtonPrimary from "../../../components/ButtonPrimary";
import ButtonSecondary from "../../../components/ButtonSecondary";
import Card from "../../../components/Card";
import FirestoreService from "../../../lib/FirebaseService";
import { useClubStore } from "../../../stores/useClubStore";
import {
  TreasuryStatus,
  TreasuryType,
  type Treasury,
} from "../../../types/Treasury";
import FinanceEntryModal from "./FinanceEntryModal";

const Finances = () => {
  const { currentClubId } = useClubStore();

  const treasuryEntriesCollection = new FirestoreService<Treasury>(
    `clubs/${currentClubId}/treasury`
  );

  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [monthBalance, setMonthBalance] = useState<number>(0);
  const [unpaid, setUnpaid] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "paid" | "unpaid" | "refund"
  >("all");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [displayErase, setDisplayErase] = useState<boolean>(false);
  const [selectedEntry, setSelectedEntry] = useState<Treasury | undefined>(
    undefined
  );

  function displayModal(entry?: Treasury, displayErase: boolean = false) {
    setShowModal(true);
    setSelectedEntry(entry);
    setDisplayErase(displayErase);
  }

  function closeDialog() {
    setShowModal(false);
    setSelectedEntry(undefined);
    setDisplayErase(false);
  }

  function exportToCSV() {
    // Prepare the members data to include in the CSV
    const csvHeaders = [
      "Montant",
      "Description",
      "Statut",
      "Catégorie",
      "Date",
    ];

    if (treasuries) {
      // Map over the filtered members and generate CSV rows
      const csvRows = treasuries.map((entry) => [
        entry.amount,
        entry.label,
        entry.status,
        entry.category,
        entry.date.toDate().toLocaleDateString(),
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
  }

  function calculateTotalBalance() {
    let balance = 0;
    for (const entry of treasuries ?? []) {
      if (entry.type === TreasuryType.expense) {
        balance -= entry.amount;
      } else {
        balance += entry.amount;
      }
    }
    setTotalBalance(balance);
  }

  function calculateMonthlyBalance() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let monthlyIncome = 0;
    for (const entry of treasuries ?? []) {
      const entryDate = entry.date.toDate();
      if (
        entryDate.getMonth() === currentMonth &&
        entryDate.getFullYear() === currentYear
      ) {
        monthlyIncome += entry.amount;
      }
    }

    setMonthBalance(monthlyIncome);
  }

  function calculateMissingPayments() {
    let unpaid = 0;
    for (const entry of treasuries ?? []) {
      if (entry.status === TreasuryStatus.unpaid) {
        unpaid += 1;
      }
    }
    setUnpaid(unpaid);
  }

  async function loadEntries(): Promise<Treasury[]> {
    try {
      let data = await treasuryEntriesCollection.readAll();
      return data;
    } catch (error) {
      throw error;
    }
  }

  const { data: treasuries } = useQuery<Treasury[]>({
    queryKey: ["treasuries", currentClubId],
    queryFn: async () => {
      const result = await loadEntries();
      if (!result) throw new Error("Treasuries not found");
      return result;
    },
    enabled: !!currentClubId,
  });

  useEffect(() => {
    calculateTotalBalance();
    calculateMonthlyBalance();
    calculateMissingPayments();
  }, [treasuries]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-secondary">Liste des membres</h1>
        <div className="flex gap-2">
          <ButtonPrimary
            title={"+ Ajouter une entrée"}
            action={() => displayModal()}
          />
          <ButtonSecondary title={"Exporter en CSV"} action={exportToCSV} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Solde total" value={`${Number(totalBalance)}€`} />
        <Card title="Revenus ce mois" value={`${Number(monthBalance)}€`} />
        <Card title="Paiements en attente" value={unpaid.toLocaleString()} />
      </div>

      <div className="flex gap-4 mb-6 pt-6">
        {/* Search by name */}
        <input
          type="text"
          placeholder="Rechercher par description"
          className="p-3 border border-gray-300 rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Filter by payment status */}
        <select
          className="p-3 border border-gray-300 rounded-md"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as "all" | "paid" | "unpaid")
          }
        >
          <option value="all">Tous</option>
          <option value="paid">Payé</option>
          <option value="unpaid">Non payé</option>
          <option value="unpaid">Remboursé</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-gray-50 text-sm text-texte-secondaire">
            <tr>
              <th className="px-4 py-3">Montant</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {treasuries &&
              treasuries.map((entry, idx) => (
                <tr
                  key={idx}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium text-secondary ">
                    {entry.type === TreasuryType.expense ? "-" : "+"}{" "}
                    {Number(entry.amount)}€
                  </td>
                  <td className="px-4 py-3 text-left">{entry.label}</td>
                  <td className="px-4 py-3  ">{entry.status}</td>
                  <td className="px-4 py-3  ">{entry.category}</td>
                  <td className="px-4 py-3  ">
                    {entry.date.toDate().toDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => displayModal(entry, true)}
                      className="text-blue-500 font-semibold hover:underline"
                    >
                      Voir / Modifier →
                    </button>
                  </td>
                </tr>
              ))}
            {treasuries && treasuries.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                  Aucun membre trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <FinanceEntryModal
        show={showModal}
        entry={selectedEntry}
        onClose={() => closeDialog()}
        onSubmit={() => loadEntries()}
        displayErase={displayErase}
      />
    </div>
  );
};

export default Finances;
