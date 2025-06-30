import { Pencil, Plus, Trash2 } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { TreasuryEntry } from "../../services/firestore/treasuryService";
import { Button } from "../ui/Button";

interface TreasuryListProps {
  entries: TreasuryEntry[];
  onAddEntry: () => void;
  onEditEntry: (entry: TreasuryEntry) => void;
  onDeleteEntry: (entry: TreasuryEntry) => void;
}

const TreasuryList: React.FC<TreasuryListProps> = ({
  entries,
  onAddEntry,
  onEditEntry,
  onDeleteEntry,
}) => {
  const { t } = useTranslation("treasury");
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    memberName: "",
    startDate: "",
    endDate: "",
  });

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      if (filters.type && entry.type !== filters.type) return false;
      if (filters.category && entry.category !== filters.category) return false;
      if (
        filters.memberName &&
        !entry.memberName
          .toLowerCase()
          .includes(filters.memberName.toLowerCase())
      )
        return false;
      if (
        filters.startDate &&
        new Date(entry.date) < new Date(filters.startDate)
      )
        return false;
      if (filters.endDate && new Date(entry.date) > new Date(filters.endDate))
        return false;
      return true;
    });
  }, [entries, filters]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const categories = useMemo(() => {
    return Array.from(new Set(entries.map((entry) => entry.category)));
  }, [entries]);

  const totalIncome = useMemo(() => {
    return filteredEntries
      .filter((entry) => entry.type === "income")
      .reduce((sum, entry) => sum + entry.amount, 0);
  }, [filteredEntries]);

  const totalExpenses = useMemo(() => {
    return filteredEntries
      .filter((entry) => entry.type === "expense")
      .reduce((sum, entry) => sum + entry.amount, 0);
  }, [filteredEntries]);

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl text-gray-900 dark:text-gray-200 font-semibold mb-4">
          {t("list.title")}
        </h2>
        <Button onClick={onAddEntry} variant="primary" className="mb-2">
          <Plus className="w-4 h-4" />
          {t("list.buttons.add")}
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            {t("list.filters.type")}
          </label>
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
          >
            <option value="">{t("list.filters.all")}</option>
            <option value="income">{t("form.types.income")}</option>
            <option value="expense">{t("form.types.expense")}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            {t("list.filters.category")}
          </label>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
          >
            <option value="">{t("list.filters.all")}</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            {t("list.filters.memberName")}
          </label>
          <input
            type="text"
            name="memberName"
            value={filters.memberName}
            onChange={handleFilterChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
            placeholder={t("form.placeholders.memberName")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            {t("list.filters.startDate")}
          </label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            {t("list.filters.endDate")}
          </label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg dark:bg-green-900/20">
          <h3 className="text-sm font-medium text-green-800 dark:text-green-300">
            {t("list.summary.totalIncome")}
          </h3>
          <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
            ${totalIncome.toFixed(2)}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg dark:bg-red-900/20">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
            {t("list.summary.totalExpenses")}
          </h3>
          <p className="text-2xl font-semibold text-red-600 dark:text-red-400">
            ${totalExpenses.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Entries List */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                {t("list.table.date")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                {t("list.table.type")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                {t("list.table.amount")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                {t("list.table.description")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                {t("list.table.category")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                {t("list.table.member")}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                {t("list.table.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {filteredEntries.map((entry) => (
              <tr
                key={entry.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {entry.date.toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      entry.type === "income"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                    }`}
                  >
                    {t(`form.types.${entry.type}`)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  ${entry.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {entry.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {entry.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {entry.memberName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEditEntry(entry)}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      title={t("list.actions.edit")}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteEntry(entry)}
                      className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-400"
                      title={t("list.actions.delete")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TreasuryList;
