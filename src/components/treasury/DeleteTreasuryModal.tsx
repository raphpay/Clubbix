import React from "react";
import { useTranslation } from "react-i18next";
import { TreasuryEntry } from "../../services/firestore/treasuryService";

interface DeleteTreasuryModalProps {
  entry: TreasuryEntry;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteTreasuryModal: React.FC<DeleteTreasuryModalProps> = ({
  entry,
  isOpen,
  onCancel,
  onConfirm,
}) => {
  const { t } = useTranslation("treasury");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        aria-hidden="true"
        onClick={onCancel}
      />

      {/* Modal container */}
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Modal panel */}
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {t("deleteModal.title")}
              </h3>
              <p className="text-sm text-gray-500">
                {t("deleteModal.message", {
                  firstName: entry.memberName,
                })}
              </p>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={onCancel}
                >
                  {t("deleteModal.buttons.cancel")}
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  onClick={onConfirm}
                >
                  {t("deleteModal.buttons.confirm")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteTreasuryModal;
