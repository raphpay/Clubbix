import { Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useClub } from "../../hooks/useClub";
import { listInvites } from "../../services/firestore/clubService";
import { InviteData } from "../../services/firestore/types/club";
import { Button } from "../ui/Button";

interface InviteMemberListProps {
  onAddInvite: () => void;
  onEditInvite: (invite: InviteData) => void;
  onDeleteInvite: (invite: InviteData) => void;
  onRevokeInvite: (invite: InviteData) => void;
}

const InviteMembersList: React.FC<InviteMemberListProps> = ({
  onAddInvite,
  onEditInvite,
  onDeleteInvite,
  onRevokeInvite,
}) => {
  const { t } = useTranslation("inviteMembers");
  const { club } = useClub();

  const [invites, setInvites] = useState<InviteData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  function convertToDate(value: string | Timestamp | undefined): Date | null {
    if (!value) return null;
    if (typeof value === "string") return new Date(value);
    if (value instanceof Timestamp) return value.toDate();
    return null;
  }

  function getStatus(invite: InviteData) {
    if (invite.status === "revoked") return t("status.revoked");
    const expiresDate = convertToDate(invite.expiresAt);
    if (expiresDate && expiresDate < new Date()) return t("status.expired");
    if (
      invite.type !== "unlimited" &&
      invite.maxUses &&
      invite.used >= invite.maxUses
    )
      return t("status.usedUp");
    return t("status.active");
  }

  function handleCopy(code: string) {
    navigator.clipboard.writeText(
      `${window.location.origin}/register?invite=${code}`
    );
  }

  function isExpiringSoon(invite: InviteData) {
    if (!invite.expiresAt) return false;
    const expiresDate = convertToDate(invite.expiresAt);
    if (!expiresDate) return false;
    const diff = expiresDate.getTime() - Date.now();
    return diff < 1000 * 60 * 60 * 24 * 3 && diff > 0;
  }

  useEffect(() => {
    if (!club?.id) return;

    listInvites({ clubId: club.id })
      .then((res) => {
        setInvites(res);
      })
      .catch(() => setError(t("error.load")))
      .finally(() => setLoading(false));
  }, [club?.id]);

  return (
    <>
      <div className="flex justify-start mb-4">
        <Button size="sm" onClick={onAddInvite}>
          {t("buttons.create")}
        </Button>
      </div>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {t("list.code")}
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {t("list.role")}
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {t("list.type")}
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {t("list.usage")}
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {t("list.expiration")}
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {t("list.status")}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {t("list.actions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {invites.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="text-center py-8 text-gray-500 dark:text-gray-400"
              >
                {t("list.empty")}
              </td>
            </tr>
          )}
          {invites.map((invite) => (
            <tr
              key={invite.code}
              className={
                isExpiringSoon(invite)
                  ? "bg-yellow-50 dark:bg-yellow-900/10"
                  : ""
              }
            >
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                  {invite.code}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                  {t(`role.${invite.role}`)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                  {t(`type.${invite.type}`)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                  {invite.type === "unlimited"
                    ? "∞"
                    : `${invite.used}/${invite.maxUses || 1}`}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                  {(() => {
                    const expiresDate = convertToDate(invite.expiresAt);
                    return expiresDate
                      ? expiresDate.toLocaleDateString()
                      : t("noExpiration", "-");
                  })()}
                </div>
              </td>
              <td>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                  {getStatus(invite)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <Button size="sm" onClick={() => handleCopy(invite.code)}>
                    {t("buttons.copy")}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onRevokeInvite(invite)}
                    disabled={invite.status === "revoked"}
                  >
                    {t("buttons.revoke")}
                  </Button>
                  <Button
                    size="sm"
                    variant="accent"
                    onClick={() => onDeleteInvite(invite)}
                  >
                    {t("buttons.delete")}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default InviteMembersList;
