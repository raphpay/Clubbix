import { Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DeleteTreasuryModal from "../../../components/treasury/DeleteTreasuryModal";
import TreasuryChart from "../../../components/treasury/TreasuryChart";
import TreasuryForm from "../../../components/treasury/TreasuryForm";
import TreasuryList from "../../../components/treasury/TreasuryList";
import { useClub } from "../../../hooks/useClub";
import {
  addTreasuryEntry,
  deleteTreasuryEntry,
  getTreasuryEntries,
  TreasuryEntry,
} from "../../../services/firestore/treasuryService";

const TreasuryPage: React.FC = () => {
  const { club } = useClub();
  const { t } = useTranslation("treasury");
  const [entries, setEntries] = useState<TreasuryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<TreasuryEntry | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    const fetchEntries = async () => {
      if (!club?.id) return;

      try {
        setLoading(true);
        const fetchedEntries = await getTreasuryEntries(club.id);
        setEntries(fetchedEntries);
      } catch (err) {
        setError("Failed to fetch treasury entries");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [club?.id]);

  const handleAddEntry = async (
    newEntry: Omit<TreasuryEntry, "id" | "createdAt">
  ) => {
    if (!club?.id) return;

    try {
      const entryId = await addTreasuryEntry(club.id, newEntry);
      const timestamp = Timestamp.now();
      setEntries((prev) => [
        ...prev,
        { ...newEntry, id: entryId, createdAt: timestamp },
      ]);
    } catch (err) {
      setError("Failed to add entry");
      console.error(err);
    }
  };

  const handleDeleteEntry = async (entry: TreasuryEntry) => {
    if (!club?.id) return;
    await deleteTreasuryEntry(club.id, entry.id);
    setEntries((prev) => prev.filter((e) => e.id !== entry.id));
    setIsDeleteOpen(false);
  };

  const handleExportCSV = () => {
    try {
      // Create CSV header
      const headers = [
        "Date",
        "Type",
        "Amount",
        "Description",
        "Category",
        "Member Name",
      ].join(",");

      // Create CSV rows
      const rows = entries.map((entry) => {
        const date =
          entry.date instanceof Timestamp
            ? entry.date.toDate().toLocaleDateString()
            : new Date(entry.date).toLocaleDateString();
        const amount = entry.type === "expense" ? -entry.amount : entry.amount;
        return [
          date,
          entry.type,
          amount,
          entry.description,
          entry.category,
          entry.memberName,
        ].join(",");
      });

      // Combine header and rows
      const csvContent = [headers, ...rows].join("\n");

      // Create and trigger download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `treasury_export_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError(t("page.error.export"));
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen dark:text-gray-300">
        {t("page.loading")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center dark:text-red-400">{error}</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {t("page.title")}
        </h1>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                {error}
              </h3>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <TreasuryList
            entries={entries}
            onAddEntry={() => setIsFormOpen(true)}
            onEditEntry={(entry) => {
              setIsFormOpen(true);
              setSelectedEntry(entry);
            }}
            onDeleteEntry={(entry) => {
              setSelectedEntry(entry);
              setIsDeleteOpen(true);
            }}
          />
        </div>
        <div>
          <TreasuryChart entries={entries} exportCSV={handleExportCSV} />
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            aria-hidden="true"
            onClick={() => setIsFormOpen(false)}
          />

          {/* Modal container */}
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Modal panel */}
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 dark:bg-gray-800">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-white"
                  onClick={() => setIsFormOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                    {selectedEntry ? t("form.title.edit") : t("form.title.add")}
                  </h3>
                  <div className="mt-4">
                    <TreasuryForm
                      onAddEntry={handleAddEntry}
                      onCancel={() => setIsFormOpen(false)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isDeleteOpen && selectedEntry && (
        <DeleteTreasuryModal
          entry={selectedEntry}
          isOpen={isDeleteOpen}
          onCancel={() => setIsDeleteOpen(false)}
          onConfirm={() => handleDeleteEntry(selectedEntry)}
        />
      )}
    </div>
  );
};

export default TreasuryPage;
