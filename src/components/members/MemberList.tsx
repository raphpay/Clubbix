import { Pencil, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useClub } from "../../hooks/useClub";
import { UserData } from "../../services/firestore/types/user";
import { getMembers } from "../../services/firestore/userService";
import { Button } from "../ui/Button";

interface MemberListProps {
  onAddMember: () => void;
  onEditMember: (member: UserData) => void;
  onDeleteMember: (member: UserData) => void;
  reloadKey?: number;
}

const MemberList: React.FC<MemberListProps> = ({
  onAddMember,
  onEditMember,
  onDeleteMember,
  reloadKey = 0,
}) => {
  const { t } = useTranslation("members");
  const { club } = useClub();
  const [members, setMembers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!club?.id) return;

      try {
        setLoading(true);
        const membersData = await getMembers(club.id);
        setMembers(membersData);
        setError(null);
      } catch (err) {
        setError(t("error.load"));
        console.error("Error loading members:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [club?.id, t, reloadKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 p-4">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
          {t("list.title")}
        </h2>
        <Button
          onClick={onAddMember}
          variant="primary"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t("list.addButton")}
        </Button>
      </div>

      <div className="bg-white dark:bg-blue-900 shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t("table.name")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t("table.email")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t("table.role")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t("table.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-blue-800">
            {members.map((member) => (
              <tr
                key={member.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                    {member.firstName} {member.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {member.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      member.role === "admin"
                        ? "bg-purple-100 dark:bg-purple-500 text-purple-800 dark:text-purple-200"
                        : "bg-green-100 dark:bg-green-500 text-green-800 dark:text-green-200"
                    }`}
                  >
                    {t(`list.roles.${member.role}`)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEditMember(member)}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-200"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteMember(member)}
                      className="text-red-600 hover:text-red-900 dark:text-red-900 dark:hover:text-red-400"
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

export default MemberList;
