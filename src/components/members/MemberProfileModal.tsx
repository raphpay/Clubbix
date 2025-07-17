import React from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/useAuth";
import { TreasuryEntry } from "../../services/firestore/treasuryService";
import { UserData } from "../../services/firestore/types/user";
import { Button } from "../ui/Button";

interface MemberProfileModalProps {
  viewedMember?: UserData;
  setViewedMember: (member?: UserData) => void;
  payments: TreasuryEntry[];
  isLoadingPayments: boolean;
  paymentError: string | null;
  paymentFilters: {
    type: string;
    startDate: string;
    endDate: string;
  };
  handlePaymentFilterChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const MemberProfileModal: React.FC<MemberProfileModalProps> = ({
  viewedMember,
  setViewedMember,
  payments,
  isLoadingPayments,
  paymentError,
  paymentFilters,
  handlePaymentFilterChange,
}) => {
  const { t } = useTranslation("members");
  const { user: currentUser } = useAuth();

  return (
    <>
      {viewedMember && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            aria-hidden="true"
            onClick={() => setViewedMember(undefined)}
          />

          {/* Modal container */}
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                {viewedMember.firstName} {viewedMember.lastName}
              </h3>
              <div className="mb-2 text-sm text-gray-700 dark:text-gray-300">
                <div>
                  <b>{t("page.email")}</b> {viewedMember.email}
                </div>
                <div>
                  <b>{t("page.role")}</b> {t(`list.roles.${viewedMember.role}`)}
                </div>
                <div>
                  <b>{t("page.status")}</b>{" "}
                  {t(`list.status.${viewedMember.status}`)}
                </div>
                <div>
                  <b>{t("page.joined")}</b>{" "}
                  {viewedMember.createdAt?.toDate?.().toLocaleDateString() ||
                    "-"}
                </div>
              </div>
              {currentUser?.role === "treasurer" && (
                <div className="mt-6">
                  <h4 className="text-md font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    {t("list.paymentHistory")}
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <select
                      name="type"
                      value={paymentFilters.type}
                      onChange={handlePaymentFilterChange}
                      className="block rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                    >
                      <option value="">{t("list.filters.allTypes")}</option>
                      <option value="income">{t("list.filters.income")}</option>
                      <option value="expense">
                        {t("list.filters.expense")}
                      </option>
                    </select>
                    <input
                      type="date"
                      name="startDate"
                      value={paymentFilters.startDate}
                      onChange={handlePaymentFilterChange}
                      className="block rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                      placeholder={t("list.filters.startDate")}
                    />
                    <input
                      type="date"
                      name="endDate"
                      value={paymentFilters.endDate}
                      onChange={handlePaymentFilterChange}
                      className="block rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                      placeholder={t("list.filters.endDate")}
                    />
                  </div>
                  {isLoadingPayments && (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                    </div>
                  )}
                  {paymentError && (
                    <div className="text-center text-red-600 p-2">
                      {paymentError}
                    </div>
                  )}
                  {!isLoadingPayments &&
                    !paymentError &&
                    payments.length === 0 && (
                      <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                        {t("list.noPayments")}
                      </div>
                    )}
                  {!isLoadingPayments &&
                    !paymentError &&
                    payments.length > 0 && (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                {t("list.table.date")}
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                {t("list.table.amount")}
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                {t("list.table.type")}
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                {t("list.table.category")}
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                {t("list.table.notes")}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                            {payments.map((entry) => (
                              <tr key={entry.id}>
                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                  {entry.date
                                    ? new Date(entry.date).toLocaleDateString()
                                    : "-"}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                  {entry.amount
                                    ? `€${entry.amount.toFixed(2)}`
                                    : "-"}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                  {t(`list.filters.${entry.type}`)}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                  {entry.category || "-"}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                  {entry.description || "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                </div>
              )}
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setViewedMember(undefined)}
                  className="mt-3 w-full sm:mt-0 sm:w-auto"
                >
                  {t("page.buttons.close")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MemberProfileModal;
