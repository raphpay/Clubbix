import { Pencil, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useClub } from "../../hooks/useClub";
import { UserData } from "../../services/firestore/types/user";
import { getMembersWithQuery } from "../../services/firestore/userService";
import { Button } from "../ui/Button";

interface MemberListProps {
  onAddMember: () => void;
  onEditMember: (member: UserData) => void;
  onDeleteMember: (member: UserData) => void;
  reloadKey?: number;
}

const ROLES = ["admin", "treasurer", "rider", "coach", "parent"];
const STATUSES = ["active", "inactive", "pending", "banned"];
const PAGE_SIZES = [15, 30, 50];

const MemberList: React.FC<MemberListProps> = ({
  onAddMember,
  onEditMember,
  onDeleteMember,
  reloadKey = 0,
}) => {
  const { t } = useTranslation("members");
  const SORT_OPTIONS: {
    label: string;
    value: {
      field: "firstName" | "createdAt" | "status";
      direction: "asc" | "desc";
    };
  }[] = [
    {
      label: t("list.sort.nameAsc"),
      value: { field: "firstName", direction: "asc" },
    },
    {
      label: t("list.sort.joinDateDesc"),
      value: { field: "createdAt", direction: "desc" },
    },
    {
      label: t("list.sort.statusAsc"),
      value: { field: "status", direction: "asc" },
    },
  ];
  const { club } = useClub();
  const [members, setMembers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    role: "",
    status: "",
  });
  const [sort, setSort] = useState<{
    field: "firstName" | "createdAt" | "status";
    direction: "asc" | "desc";
  }>(SORT_OPTIONS[1].value);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageInfo, setPageInfo] = useState({
    hasNextPage: false,
    hasPrevPage: false,
    lastVisible: null,
  });
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    if (!club?.id) return;
    setLoading(true);
    setError(null);
    getMembersWithQuery({
      clubId: club.id,
      search: debouncedSearch,
      filters,
      sort,
      page,
      pageSize,
      lastVisible: undefined,
    })
      .then((res) => {
        setMembers(res.members);
        setTotalCount(res.totalCount);
        setPageInfo(res.pageInfo);
      })
      .catch(() => setError(t("error.load")))
      .finally(() => setLoading(false));
  }, [club?.id, debouncedSearch, filters, sort, page, pageSize, reloadKey, t]);

  function handleFilterChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setFilters((f) => ({ ...f, [e.target.name]: e.target.value }));
    setPage(1);
  }

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const idx = Number(e.target.value);
    setSort(SORT_OPTIONS[idx].value);
    setPage(1);
  }

  function handlePageSizeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setPageSize(+e.target.value);
    setPage(1);
  }

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
          {t("list.title")}
        </h2>
        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="text"
            placeholder={t("list.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          />
          <select
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
            className="mt-1 block rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
          >
            <option value="">{t("list.filterRole")}</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {t(`list.roles.${r}`)}
              </option>
            ))}
          </select>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="mt-1 block rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
          >
            <option value="">{t("list.filterStatus")}</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {t(`list.status.${s}`)}
              </option>
            ))}
          </select>
          <select
            value={SORT_OPTIONS.findIndex(
              (o) =>
                o.value.field === sort.field &&
                o.value.direction === sort.direction
            )}
            onChange={handleSortChange}
            className="mt-1 block rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
          >
            {SORT_OPTIONS.map((o, i) => (
              <option key={o.label} value={i}>
                {o.label}
              </option>
            ))}
          </select>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="mt-1 block rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
          >
            {PAGE_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}/page
              </option>
            ))}
          </select>
          <Button
            onClick={onAddMember}
            variant="primary"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {t("list.addButton")}
          </Button>
        </div>
      </div>
      <div className="bg-white dark:bg-blue-900 shadow-sm rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t("table.name")}
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t("table.email")}
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t("table.role")}
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t("table.status")}
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t("table.joinDate")}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t("table.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-blue-800">
            {members.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-8 text-gray-500 dark:text-gray-400"
                >
                  {search || filters.role || filters.status
                    ? t("list.noResults")
                    : t("list.empty")}
                </td>
              </tr>
            )}
            {members.map((member) => (
              <tr
                key={member.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                    {member.firstName} {member.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {member.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
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
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      member.status === "active"
                        ? "bg-blue-100 dark:bg-blue-500 text-blue-800 dark:text-blue-200"
                        : "bg-red-100 dark:bg-red-500 text-red-800 dark:text-red-200"
                    }`}
                  >
                    {t(`list.status.${member.status}`)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {member.createdAt?.toDate?.().toLocaleDateString() || "-"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
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
      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {t("list.total", { count: totalCount })}
        </div>
        <div className="flex gap-2 items-center">
          <Button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!pageInfo.hasPrevPage}
          >
            {t("list.previous")}
          </Button>
          <span className="text-xs">{t("list.page", { page })}</span>
          <Button
            onClick={() => setPage((p) => (pageInfo.hasNextPage ? p + 1 : p))}
            disabled={!pageInfo.hasNextPage}
          >
            {t("list.next")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MemberList;
