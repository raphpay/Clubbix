import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/Button";

interface RevokeDeleteModalProps {
  type: "delete" | "revoke";
  inviteCode: string;
  handleCancelModal: () => void;
  handleConfirmModal: () => void;
}

const RevokeDeleteModal: React.FC<RevokeDeleteModalProps> = ({
  type,
  inviteCode,
  handleCancelModal,
  handleConfirmModal,
}) => {
  const { t } = useTranslation("inviteMembers");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          {type === "delete" ? t("deleteModal.title") : t("revokeModal.title")}
        </h2>
        <div className="mb-4 text-gray-700 dark:text-gray-300">
          {type === "delete"
            ? t("deleteModal.message", { code: inviteCode })
            : t("revokeModal.message", { code: inviteCode })}
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={handleCancelModal}>
            {t("buttons.cancel")}
          </Button>
          <Button variant="accent" onClick={handleConfirmModal}>
            {t("buttons.confirm")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RevokeDeleteModal;
