import { Timestamp } from "firebase/firestore";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { TreasuryEntry } from "../../services/firestore/treasuryService";
import { Button } from "../ui/Button";

interface ExportCSVModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (filtered: TreasuryEntry[]) => void;
  entries: TreasuryEntry[];
  loading: boolean;
}

const ExportCSVModal: React.FC<ExportCSVModalProps> = ({
  isOpen,
  onClose,
  onExport,
  entries,
  loading,
}) => {
  const { t } = useTranslation("treasury");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState<"all" | "income" | "expense">("all");
  const [error, setError] = useState("");

  function filterEntries() {
    let filtered = entries;
    if (startDate)
      filtered = filtered.filter((e) => {
        const d =
          e.date instanceof Timestamp ? e.date.toDate() : new Date(e.date);
        return d >= new Date(startDate);
      });
    if (endDate)
      filtered = filtered.filter((e) => {
        const d =
          e.date instanceof Timestamp ? e.date.toDate() : new Date(e.date);
        return d <= new Date(endDate);
      });
    if (type !== "all") filtered = filtered.filter((e) => e.type === type);
    return filtered;
  }

  function handleExport() {
    setError("");
    const filtered = filterEntries();
    if (!filtered.length) {
      setError(t("page.error.noData"));
      return;
    }
    onExport(filtered);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Modal container */}
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Modal Panel */}
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">
            {t("page.buttons.export")}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium dark:text-gray-200">
                {t("list.filters.startDate")}
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 block w-full rounded border-gray-300 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-gray-200">
                {t("list.filters.endDate")}
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 block w-full rounded border-gray-300 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-gray-200">
                {t("list.filters.type")}
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="mt-1 block w-full rounded border-gray-300 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="all">{t("list.filters.all")}</option>
                <option value="income">{t("list.filters.incomeOnly")}</option>
                <option value="expense">{t("list.filters.expenseOnly")}</option>
              </select>
            </div>
          </div>
          {error && (
            <div className="mt-4 text-red-500 text-center dark:text-red-400">
              {error}
            </div>
          )}
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              {t("page.buttons.cancel")}
            </Button>
            <Button onClick={handleExport} disabled={loading}>
              {loading ? (
                <span className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-t-transparent border-gray-600 rounded-full" />
              ) : null}
              {t("page.buttons.exportShort")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ExportCSVModal };
