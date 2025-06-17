import React from "react";
import { useTranslation } from "react-i18next";
import { UserData } from "../../services/firestore";
import { Button } from "../ui/Button";

interface DeleteMemberModalProps {
  member: UserData;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
}

const DeleteMemberModal: React.FC<DeleteMemberModalProps> = ({
  member,
  onConfirm,
  onCancel,
  isOpen,
}) => {
  const { t } = useTranslation("members");

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
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  {t("deleteModal.message", {
                    firstName: member.firstName,
                    lastName: member.lastName,
                  })}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <Button
              type="button"
              variant="primary"
              onClick={onConfirm}
              className="w-full sm:ml-3 sm:w-auto bg-red-600 hover:bg-red-700 focus:ring-red-500"
            >
              {t("deleteModal.buttons.confirm")}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              className="mt-3 w-full sm:mt-0 sm:w-auto"
            >
              {t("deleteModal.buttons.cancel")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteMemberModal;
